from rest_framework.serializers import ModelSerializer, CharField
from .models import Product, Category, AttributeValue


class AttributeValueSerializer(ModelSerializer):
    title = CharField(source='attribute.title', read_only=True)
    title_ukr = CharField(source='attribute.title_ukr', read_only=True)

    class Meta:
        model = AttributeValue
        fields = ("title", "title_ukr", "value", "value_ukr", "price_addition")


class CategorySerializer(ModelSerializer):
    attributes = AttributeValueSerializer(
        many=True, source="attribute_values")

    class Meta:
        model = Category
        fields = ("title", "title_ukr", "attributes")


class ProductSerializer(ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Product
        fields = ("id", "title", "title_ukr", "description",
                  "description_ukr", "price", "stock",
                  "rating", "image_url",
                  "slug", "category")
