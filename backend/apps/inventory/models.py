from django.db import models
from apps.stores.models import Store

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name
    
class Component(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='components')
    name = models.CharField(max_length=255)
    mpn = models.CharField(max_length=100, unique=True, verbose_name="Manufacturer Part Number")
    description = models.TextField()
    
    # Precios y stock
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    
    # Imagen y Ficha Técnica
    image = models.ImageField(upload_to='components/', null=True, blank=True)
    datasheet_url = models.URLField(max_length=500, blank=True, null=True)
    
    # Especificaciones dinámicas (Ej: {"Voltaje": "5V", "Corriente": "1A"})
    technical_specs = models.JSONField(default=dict, blank=True)
    
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.mpn})"
    
