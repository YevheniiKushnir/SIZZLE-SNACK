from django.db import models


class Category(models.Model):
    title = models.CharField(
        max_length=64, unique=True,
        verbose_name="Category",
        help_text="Category name"
    )
    title_ukr = models.CharField(
        max_length=64, unique=True,
        verbose_name="Category (UKR)",
        help_text="Category name in Ukrainian"
    )

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class Product(models.Model):
    title = models.CharField(
        max_length=128, unique=True,
        verbose_name="Product name",
        help_text="Product name")
    title_ukr = models.CharField(
        max_length=128, unique=True,
        verbose_name="Product name (UKR)",
        help_text="Product name in Ukrainian")
    description = models.TextField(
        verbose_name="Product description")
    description_ukr = models.TextField(
        verbose_name="Product description (UKR)",
        help_text="Product description in Ukrainian")
    price = models.IntegerField(
        help_text="Product price per 1 unit"
    )
    image_url = models.URLField(
        verbose_name="Image URL",
        help_text="Link to an image of a product")
    slug = models.SlugField(
        verbose_name="Slug",
        help_text="A short label of a product to use in URL")
    rating = models.SmallIntegerField(
        help_text="Helps track how popular is a product")
    stock = models.IntegerField(
        default=1,
        help_text="Amount of product in stock"
    )
    category = models.ForeignKey(
        Category, help_text="Category of a product",
        on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.title

    def increase_rating(self, value) -> None:
        self.rating += value
        self.save()

    def decrease_stock(self, value) -> None:
        self.stock -= value
        if self.stock < 0:
            self.stock = 0
        self.save()

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"


class Attribute(models.Model):
    title = models.CharField(max_length=64, verbose_name="Attribute name",
                             help_text="Attribute name")
    title_ukr = models.CharField(max_length=64, verbose_name="Attribute name (UKR)",
                                 help_text="Attribute name in Ukrainian")
    categories = models.ManyToManyField(Category, through="AttributeValue",
                                        related_name="attributes")

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = "Attribute"
        verbose_name_plural = "Attributes"


class AttributeValue(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="attribute_values")
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE)
    value = models.CharField(max_length=128, null=False, blank=False)
    value_ukr = models.CharField(max_length=128, blank=True,
                                 verbose_name="Value (UKR)",
                                 help_text="Value of an attribute for a product")
    price_addition = models.SmallIntegerField(default=0,
                                              verbose_name="Price addition",
                                              help_text="Amount of addition to a end price")

    def __str__(self) -> str:
        return f'{self.attribute } with value of "{self.value}" (additional price {self.price_addition})'

    class Meta:
        verbose_name = "Attribute Value"
        verbose_name_plural = "Attribute Values"
