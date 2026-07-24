from . import views
from django.urls import path
urlpatterns = [
    path("post_data", views.post_data)
]