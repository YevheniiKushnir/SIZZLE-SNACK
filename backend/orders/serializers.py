from products.serializers import ProductSerializer
from rest_framework.serializers import (ModelSerializer, ReadOnlyField,
                                        SerializerMethodField)
from users.serializers import UserSerializer, AddressSerializer

from .models import Order, OrderItem, SelectedAttribute


class SelectedAttributeSerializer(ModelSerializer):
    title = ReadOnlyField(source='attribute_value.attribute.title')
    title_ukr = ReadOnlyField(source='attribute_value.attribute.title_ukr')
    value = ReadOnlyField(source='attribute_value.value')
    value_ukr = ReadOnlyField(source='attribute_value.value_ukr')
    price_addition = ReadOnlyField(source='attribute_value.price_addition')

    class Meta:
        model = SelectedAttribute
        fields = ("title", "title_ukr", "value",
                  "value_ukr", "price_addition", )


class OrderItemSerializer(ModelSerializer):
    product = ProductSerializer()
    attribute_values = SelectedAttributeSerializer(
        many=True, source="selected_attributes")
    price_per_unit = SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ("product", "attribute_values", "amount", "price_per_unit", )

    def get_price_per_unit(self, obj):
        return obj.price_per_unit


class OrderSerializer(ModelSerializer):
    products = OrderItemSerializer(many=True, source="order_items")
    user = UserSerializer()
    address = AddressSerializer()
    full_price = SerializerMethodField()
    amount = SerializerMethodField()

    def get_full_price(self, obj):
        return obj.full_price

    def get_amount(self, obj):
        return obj.amount

    class Meta:
        model = Order
        fields = "__all__"
