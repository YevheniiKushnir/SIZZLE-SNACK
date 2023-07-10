from django.http import Http404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from products.models import Product

from .models import Preferred, User
from .serializers import UserSerializer
from .utils import get_user_data, get_filtering_query


class PreferredView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_product_object(self, slug):
        try:
            return Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            raise Http404

    def post(self, request, *args, **kwargs):
        slug = request.data["slug"]

        product = self.get_product_object(slug)
        Preferred.objects.create(
            user=request.user, product=product)
        return Response("Product added to preferred.",
                        status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        slug = request.data["slug"]

        product = self.get_product_object(slug)
        Preferred.objects.filter(
            user=request.user, product=product).delete()
        return Response("Product deleted from the preferred.",
                        status=status.HTTP_202_ACCEPTED)


class PasswordChangeView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def put(self, request, *args, **kwargs):
        user = request.user
        try:
            user.set_password(request.data.get("new_password", None))
            user.save()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response("Password changed", status=status.HTTP_202_ACCEPTED)


class UserView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        serializer = UserSerializer(
            request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data,
                            status=status.HTTP_202_ACCEPTED)
        return Response("Wrong data format.", status=status.HTTP_412_PRECONDITION_FAILED)


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            email, phone_number, password = get_user_data(request.data)
        except KeyError:
            return Response("No value for field was provided", status=status.HTTP_412_PRECONDITION_FAILED)
        user = User.objects.filter(
            get_filtering_query(email, phone_number)
        )
        if user.exists():
            user = user.first()
            if user.check_password(password):
                token = RefreshToken.for_user(user)
                return Response({"access_token": str(token.access_token)}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response("Wrong password", status=status.HTTP_403_FORBIDDEN)
        return Response("No such user exists.", status=status.HTTP_404_NOT_FOUND)


class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            email, phone_number, password = get_user_data(request.data)
        except KeyError:
            return Response("No value for field was provided", status=status.HTTP_412_PRECONDITION_FAILED)

        user = User.objects.filter(
            get_filtering_query(email, phone_number)
        ).first()

        if not user:
            user = User.objects.create(
                email=email,
                phone_number=phone_number
            )

        if not user.password:
            user.set_password(password)
            user.save()
            token = RefreshToken.for_user(user)
            return Response({"access_token": str(token.access_token)}, status=status.HTTP_201_CREATED)
        return Response("User already exists.", status=status.HTTP_412_PRECONDITION_FAILED)
