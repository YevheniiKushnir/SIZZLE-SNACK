from products.models import Product, AttributeValue
from users.models import User, Address

from .models import Order, OrderItem, SelectedAttribute


def is_order_data_valid(request):
    user = request.user
    data = request.data
    try:
        if not "products" in data:
            raise KeyError("products")
        products_data = data["products"]
        if len(products_data) > 0 and isinstance(products_data, list):
            for product in products_data:
                if not "slug" in product:
                    raise KeyError("slug")
                if not "amount" in product:
                    raise KeyError("amount")
        if not user.is_authenticated:
            if not "user" in data:
                raise KeyError("user")
            else:
                if not ("phone_number" in data["user"]
                        or "email" in data["user"]):
                    raise KeyError("phone_number | email")
            if not "address" in data:
                raise KeyError("address")
    except KeyError as e:
        return str(e)
    return True


def create_order_items_for_order(order: Order, products_data):
    for product_data in products_data:
        attributes = []
        product = Product.objects.get(slug=product_data["slug"])
        order_item = OrderItem.objects.create(order=order, product=product,
                                              amount=product_data["amount"])
        for selected_attribute, attribute_data in product_data.get("attribute_values", {}).items():
            attribute = product.category.attributes.distinct().get(
                title__iexact=selected_attribute[1:])
            attributes.append(attribute)
            attribute_value = AttributeValue.objects.get(
                attribute=attribute,
                value=attribute_data["value"]
            )
            SelectedAttribute.objects.create(order_item=order_item,
                                             attribute_value=attribute_value)
        for attribute_type in product.category.attributes.all().distinct():
            if not attribute_type in attributes:
                default_attribute_value = AttributeValue.objects.get(
                    attribute=attribute_type,
                    price_addition=0
                )
                SelectedAttribute.objects.create(order_item=order_item,
                                                 attribute_value=default_attribute_value)


def create_order(request):
    validated_data = request.data

    user_data = validated_data.pop("user", None)

    user = request.user if request.user.is_authenticated else User.objects.get_or_create(
        email=user_data.get("email", None),
        phone_number=user_data.get("phone_number", None))[0]

    products_data = validated_data.pop("products")
    address = validated_data.pop("address")

    address_id = address.get("id", None)

    if address_id:
        address = Address.objects.get(pk=address_id,
                                      user=user)
    else:
        address = Address.objects.create(**address, user=user)

    order = Order.objects.create(**validated_data, user=user,
                                 address=address)
    create_order_items_for_order(order, products_data)

    return order
