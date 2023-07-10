from nested_inline.admin import NestedModelAdmin, NestedStackedInline
from django.contrib import admin
from .models import Order, OrderItem


class SelectedAttributeInline(NestedStackedInline):
    model = OrderItem.attribute_values.through
    extra = 1


class OrderItemInline(NestedStackedInline):
    model = OrderItem
    extra = 1
    inlines = [SelectedAttributeInline]


class OrderAdmin(NestedModelAdmin):
    inlines = [
        OrderItemInline,
    ]

    list_display = ("created_at", "is_processing", "is_accepted",
                    "is_delivering", "is_delivered", "full_price", )
    readonly_fields = ("full_price",)
    actions = ("mark_as_accepted", "mark_as_processing",
               "mark_as_delivering", "mark_as_delivered",)

    def full_price(self, obj):
        return obj.full_price

    def mark_as_accepted(self, request, queryset):
        queryset.update(is_accepted=True)

    def mark_as_processing(self, request, queryset):
        self.mark_as_accepted(request, queryset)
        queryset.update(is_processing=True)

    def mark_as_delivering(self, request, queryset):
        self.mark_as_processing(request, queryset)
        queryset.update(is_delivering=True)

    def mark_as_delivered(self, request, queryset):
        self.mark_as_delivering(request, queryset)
        queryset.update(is_delivered=True)

    mark_as_accepted.short_description = "Mark selected orders as accepted"
    mark_as_processing.short_description = "Mark selected orders as processing"
    mark_as_delivering.short_description = "Mark selected orders as delivering"
    mark_as_delivered.short_description = "Mark selected orders as delivered"


admin.site.register(OrderItem)
admin.site.register(Order, OrderAdmin)
