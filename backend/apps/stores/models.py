from django.db import models
from django.conf import settings

# Create your models here.
class Store(models.Model):
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='store'
    )
    name = models.CharField(max_length=255, verbose_name="Nombre de la Tienda")
    description = models.TextField(blank=True, verbose_name="Descripción")
    address = models.CharField(max_length=500, verbose_name="Dirección Física")
    
    # Datos para google map
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    review_count = models.PositiveIntegerField(default=0)
    
    # Imagen de la fachada de la tienda
    image = models.ImageField(upload_to='stores/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name