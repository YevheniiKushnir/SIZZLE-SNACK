from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import AttributeValue


@receiver(signal=pre_save, sender=AttributeValue)
def set_field_value(sender, instance, **kwargs):
    if not instance.value_ukr:
        instance.value_ukr = instance.value
