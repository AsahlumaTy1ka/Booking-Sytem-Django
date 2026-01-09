from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('booking/', views.bookingPage, name='booking'),
    path('gallery/', views.galleryPage, name='gallery'),
    path('services/', views.servicesPage, name='services'),
    ]