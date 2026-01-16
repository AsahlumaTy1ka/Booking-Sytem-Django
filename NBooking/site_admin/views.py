from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.contrib.auth.views import LogoutView
from django.urls import reverse_lazy
from home.models import Appointment, Service, gallery

# Custom Login View
def admin_login(request):
    if request.user.is_authenticated:
        return redirect('admin_dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('admin_dashboard')
        else:
            return render(request, 'admin/login_.html', {'error': 'Invalid credentials'})
    
    return render(request, 'admin/login_.html')

# Custom Logout View
def admin_logout(request):
    if request.method == 'POST':
        logout(request)
        return redirect('admin_login')

# Dashboard Home
@login_required(login_url='admin_login')
def admin_dashboard(request):
    appointments_count = Appointment.objects.count()
    pending_count = Appointment.objects.filter(done=False).count()
    done_count = Appointment.objects.filter(done=True).count()
    services_count = Service.objects.count()
    gallery_count = gallery.objects.count()
    recent_appointments = Appointment.objects.all().order_by('-date_booked')[:5]
    
    context = {
        'appointments_count': appointments_count,
        'pending_count': pending_count,
        'done_count': done_count,
        'services_count': services_count,
        'gallery_count': gallery_count,
        'recent_appointments': recent_appointments,
    }
    return render(request, 'admin/dashboard.html', context)

# Appointments Management
@login_required(login_url='admin_login')
def toggle_appointment_done(request, appointment_code):
    try:
        appointment = Appointment.objects.get(appointmentCode=appointment_code)
        appointment.done = not appointment.done
        appointment.save()
    except Appointment.DoesNotExist:
        pass
    return render(request, 'admin/appointments.html', context={'appointments': Appointment.objects.all().order_by('-date_booked')})

@login_required(login_url='admin_login')
@require_http_methods(["POST"])
def delete_appointment(request, appointment_code):
    try:
        appointment = Appointment.objects.get(appointmentCode=appointment_code)
        appointment.delete()
    except Appointment.DoesNotExist:
        pass
    return render(request, 'admin/appointments.html', context={'appointments': Appointment.objects.all().order_by('-date_booked')})

@login_required(login_url='admin_login')
@require_http_methods(["POST"])
def remove_all_appointments(request):
    Appointment.objects.all().delete()
    return render(request, 'admin/appointments.html', context={'appointments': Appointment.objects.all().order_by('-date_booked')})

@login_required(login_url='admin_login')
def AppointmentsAdmin(request):
    appointments = Appointment.objects.all().order_by('-date_booked')
    return render(request, 'admin/appointments.html', context={'appointments': appointments})

# Gallery Management
@login_required(login_url='admin_login')
def gallery_admin(request):
    gallery_items = gallery.objects.all().order_by('-date_pub')
    return render(request, 'admin/gallery.html', context={'gallery_items': gallery_items})

@login_required(login_url='admin_login')
def add_gallery(request):
    if request.method == 'POST':
        client_name = request.POST.get('client_name')
        service_received = request.POST.get('service_received')
        caption = request.POST.get('caption')
        image = request.FILES.get('image')
        
        gallery.objects.create(
            client_name=client_name,
            service_received=service_received,
            caption=caption,
            image=image
        )
        return redirect('gallery_admin')
    
    return render(request, 'admin/add_gallery.html')

@login_required(login_url='admin_login')
def delete_gallery(request, gallery_id):
    try:
        gallery_item = gallery.objects.get(id=gallery_id)
        gallery_item.delete()
    except gallery.DoesNotExist:
        pass
    return redirect('gallery_admin')

# Services Management
@login_required(login_url='admin_login')
def services_admin(request):
    services = Service.objects.all()
    return render(request, 'admin/services.html', context={'services': services})

@login_required(login_url='admin_login')
def add_service(request):
    if request.method == 'POST':
        service_name = request.POST.get('service_name')
        description = request.POST.get('description')
        price = request.POST.get('price')
        
        Service.objects.create(
            service_name=service_name,
            description=description,
            price=price
        )
        return redirect('services_admin')
    
    return render(request, 'admin/add_service.html')

@login_required(login_url='admin_login')
def edit_service(request, service_id):
    service = Service.objects.get(id=service_id)
    
    if request.method == 'POST':
        service.service_name = request.POST.get('service_name')
        service.description = request.POST.get('description')
        service.price = request.POST.get('price')
        service.save()
        return redirect('services_admin')
    
    return render(request, 'admin/edit_service.html', context={'service': service})

@login_required(login_url='admin_login')
def delete_service(request, service_id):
    try:
        service = Service.objects.get(id=service_id)
        service.delete()
    except Service.DoesNotExist:
        pass
    return redirect('services_admin')
