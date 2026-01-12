from django.db import models
import random
import string

# Create your models here.
def generate_appointment_code():
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        if not Appointment.objects.filter(appointmentCode=code).exists():
            return code

class Appointment(models.Model):
    name = models.CharField(max_length=100)
    appointmentCode = models.CharField(max_length=6, unique=True,primary_key=True, default=generate_appointment_code)
    date = models.DateField()
    time = models.CharField(max_length=50)        
    price = models.DecimalField(max_digits=10, decimal_places=2)  
    phone = models.CharField(max_length=20)   
    service = models.CharField(max_length=100) 
    notes = models.TextField(blank=True)      

    def __str__(self):
        return f"Appointment for {self.name} on {self.date} at {self.time}"


class Service(models.Model):
    service_name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.service_name

class gallery(models.Model):
    client_name = models.CharField(max_length=100)
    service_received = models.CharField(max_length=100)
    caption = models.CharField(max_length=100)
    image = models.ImageField(upload_to='gallery/')
    date_pub = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.caption
    

