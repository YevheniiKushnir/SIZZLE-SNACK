from rest_framework import status
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Order
from .serializers import OrderSerializer
from .utils import create_order, is_order_data_valid


class IsAuthenticated(BasePermission):
    """
    The request is authenticated as a user, or is a read-only request.
    """

    def has_permission(self, request, view):
        if (request.method in ["POST"] or request.user and request.user.is_authenticated):
            return True
        return False


class OrdersListView(APIView):
    """
    List all orders, create order.
    """

    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        orders = Order.objects.filter(user=user.id).order_by("-id")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        validation_result = is_order_data_valid(request)
        if not isinstance(validation_result, str):
            order = create_order(request)
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response({"error": validation_result}, status=status.HTTP_400_BAD_REQUEST)
