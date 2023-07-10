from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


class CategoriesListView(APIView):
    """
    List all categories
    """

    def get(self, request, format=None):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductsListView(APIView):
    """
    List all products.
    """

    def get(self, request, format=None):
        try:
            category = request.GET.get("category", "")
            orderby = request.GET.get("orderby", "")
            products = Product.objects.all()
            if category:
                products = products.filter(category__title__iexact=category)
            if orderby:
                products = products.order_by(orderby)
        except Exception:
            pass
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductDetailsView(APIView):
    """
    Returns one product data.
    """

    def get_object(self, slug):
        try:
            return Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            raise Http404

    def get(self, request, slug, format=None):
        product = self.get_object(slug)
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
