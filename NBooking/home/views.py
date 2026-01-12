from django.forms import ValidationError
from django.shortcuts import render
from .models import gallery, Appointment, Service
from django.contrib import messages

def home(request):
    gallery_items = gallery.objects.order_by('-date_pub')[:5]
    services = Service.objects.all()
    return render(request, 'home.html', context={'gallery_items': gallery_items, 'services': services})

def galleryPage(request):
    gallery_items = gallery.objects.order_by('-date_pub')
    return render(request, 'gallery.html', context={'gallery_items': gallery_items})

def bookingPage(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        date = request.POST.get('date')
        service = request.POST.get('service')
        time = request.POST.get('time')
        notes = request.POST.get('notes')
        
      
        appointment = Appointment.objects.create(
            price=Service.objects.get(service_name=service).price,
            name=name,
            phone=phone,
            date=date,
            service=service,
            time=time,
            notes=notes
        )
        try:
            appointment.clean_fields()
            appointment.save()
            messages.success(request, f'Appointment booked successfully! Your appointment code is {appointment.appointmentCode}, save it for future reference.')
        except ValidationError as e:
            messages.error(request, f"Error creating appointment: {e}")
            return render(request, 'booking.html')
        
    services = Service.objects.all()
    return render(request, 'booking.html', context={'services': services})

def servicesPage(request):
    services = Service.objects.all()
    return render(request, 'services.html', context={'services': services})