from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('login/', views.admin_login, name='admin_login'),
    path('logout/', views.admin_logout, name='admin_logout'),

    # Dashboard
    path('', views.admin_dashboard, name='admin_dashboard'),
    
    # Appointments
    path('appointments/<str:appointment_code>/toggle/', views.toggle_appointment_done, name='toggle_appointment_status'),
    path('appointments/<str:appointment_code>/delete/', views.delete_appointment, name='delete_appointment'),
    path('appointments/remove-all/', views.remove_all_appointments, name='remove_all_appointments'),
    path('appointments/', views.AppointmentsAdmin, name='appointments_admin'),
    
    # Gallery
    path('gallery/', views.gallery_admin, name='gallery_admin'),
    path('gallery/add/', views.add_gallery, name='add_gallery'),
    path('gallery/<int:gallery_id>/delete/', views.delete_gallery, name='delete_gallery'),
    
    # Services
    path('services/', views.services_admin, name='services_admin'),
    path('services/add/', views.add_service, name='add_service'),
    path('services/<int:service_id>/edit/', views.edit_service, name='edit_service'),
    path('services/<int:service_id>/delete/', views.delete_service, name='delete_service'),
]

