from django.db import models
from django.conf import settings
from apps.inventory.models import Component
from apps.stores.models import Store

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='reviews')
    
    rating = models.PositiveSmallIntegerField(verbose_name="Puntuación") 
    comment = models.TextField(verbose_name="Comentario")
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'store')

    def __str__(self):
        return f"{self.user.email} - {self.store.name} ({self.rating}★)"

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlists')
    name = models.CharField(max_length=100, default="Mi Lista de Deseos")
    components = models.ManyToManyField('inventory.Component', through='WishlistItem', related_name='in_wishlists', blank=True)
    updated_at = models.DateTimeField(auto_now=True)

class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    component = models.ForeignKey('inventory.Component', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1) 
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('wishlist', 'component')
        
class StockNotification(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    component = models.ForeignKey('inventory.Component', on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'component')
        
class SearchHistory(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, null=True, blank=True)
    query = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Historial de Búsqueda"
        ordering = ['-created_at']