from .views import OrdersListView
from django.urls import path


urlpatterns = [
    path("orders", OrdersListView.as_view()),
]
