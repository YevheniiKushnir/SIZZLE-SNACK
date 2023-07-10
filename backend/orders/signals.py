from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist

from .models import Order


@receiver(pre_save, sender=Order)
def on_change(sender, instance: Order, **kwargs):
    try:
        previous = Order.objects.get(id=instance.id)
        if previous.is_processing != instance.is_processing and instance.is_processing == True:
            for order_item in instance.order_items.all():
                order_item.product\
                    .increase_rating(order_item.amount)
                order_item.product\
                    .decrease_stock(order_item.amount)
    except ObjectDoesNotExist:
        pass
