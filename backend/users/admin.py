from django.contrib import admin

from products.models import Product

from .models import Address, User, Preferred


class AddressTabular(admin.TabularInline):
    model = Address

    def get_extra(self, request, obj=None, **kwargs) -> int:
        return 1


class PreferredTabular(admin.TabularInline):
    model = Preferred

    def get_extra(self, request, obj=None, **kwargs) -> int:
        return 1


class UserAdmin(admin.ModelAdmin):
    inlines = [
        AddressTabular,
        PreferredTabular
    ]


admin.site.register(User, UserAdmin)
