from django.db import models
from django.db.models import Sum
from products.models import AttributeValue, Product
from users.models import Address, User


class Order(models.Model):
    created_at = models.DateTimeField(auto_now=True,
                                      help_text="Date and time of Order creation")
    is_processing = models.BooleanField(default=False,
                                        verbose_name="Is processing",
                                        help_text="Is Order being processed")
    is_accepted = models.BooleanField(default=False,
                                      verbose_name="Is accepted",
                                      help_text="Is Order has been accepted")
    is_delivering = models.BooleanField(default=False,
                                        verbose_name="Is delivering",
                                        help_text="Is Order delivering")
    is_delivered = models.BooleanField(default=False,
                                       verbose_name="Is delivered",
                                       help_text="Is Order has been delivered")

    products = models.ManyToManyField(Product, through="OrderItem")
    user = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.CASCADE)
    address = models.ForeignKey(
        Address, null=True, blank=True, on_delete=models.SET_NULL
    )

    def __str__(self) -> str:
        return f"{self.created_at} {self.user or ''}"

    @property
    def full_price(self) -> int:
        full_price = 0
        for order_item in self.order_items.all():
            full_price += order_item.amount * order_item.price_per_unit
        return full_price

    @property
    def amount(self) -> int:
        full_amount = 0
        for order_item in self.order_items.all():
            full_amount += order_item.amount
        return full_amount


class OrderItem(models.Model):
    product = models.ForeignKey(Product,
                                on_delete=models.CASCADE)
    order = models.ForeignKey(Order,
                              on_delete=models.CASCADE, related_name="order_items")

    amount = models.SmallIntegerField(
        help_text="Amount of product ordered")

    attribute_values = models.ManyToManyField(AttributeValue,
                                              through="SelectedAttribute")

    @property
    def price_per_unit(self):
        return self.product.price + (self.attribute_values
                                     .aggregate(Sum("price_addition"))["price_addition__sum"]
                                     if self.attribute_values.all().exists() else 0)


class SelectedAttribute(models.Model):
    order_item = models.ForeignKey(OrderItem,
                                   on_delete=models.CASCADE,
                                   related_name="selected_attributes")
    attribute_value = models.ForeignKey(
        AttributeValue, on_delete=models.CASCADE)
