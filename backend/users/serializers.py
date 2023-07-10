from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import User, Address, Preferred
from products.serializers import ProductSerializer


class PreferredSerializer(ModelSerializer):
    product = SerializerMethodField()

    class Meta:
        model = Preferred
        fields = ("product",)

    def get_product(self, instance):
        return ProductSerializer(instance.product).data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data.pop('product', None)


class AddressSerializer(ModelSerializer):
    class Meta:
        model = Address
        fields = ("id", "street_address", "city", "zip_code",)


class UserSerializer(ModelSerializer):
    addresses = AddressSerializer(many=True)
    preferred = PreferredSerializer(many=True)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email",
                  "phone_number", "addresses", "preferred", )

    def update(self, instance, validated_data):
        instance.addresses.all().delete()
        addresses_data = validated_data.pop("addresses")
        for address_data in addresses_data:
            Address.objects.create(user=instance,
                                   **address_data)
        return super().update(instance, validated_data)
