from django.contrib.auth.models import AbstractUser
from django.db import models

# Modelos del la app Users
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('proveedor', 'Proveedor de Tienda'),
        ('cliente', 'Cliente'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='cliente')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.role})"
    
class LegalDocument(models.Model):
    slug = models.SlugField(unique=True) 
    title = models.CharField(max_length=200)
    content = models.TextField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    

