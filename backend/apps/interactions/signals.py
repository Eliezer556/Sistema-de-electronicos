from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.mail import send_mail
from apps.inventory.models import Component
from .models import StockNotification, Review
from django.db.models import Avg, Count

@receiver(post_save, sender=Component)
def notify_restock(sender, instance, **kwargs):
    if instance.stock > 0:
        notifications = StockNotification.objects.filter(
            component=instance, 
            is_active=True
        )
        
        if notifications.exists():
            emails = [n.user.email for n in notifications]
            
            send_mail(
                subject=f'¡Ya hay stock!: {instance.name}',
                message=f'El componente {instance.name} ya está disponible con {instance.stock} unidades.',
                from_email=None, 
                recipient_list=emails,
                fail_silently=True,
            )

            notifications.update(is_active=False)
            
@receiver([post_save, post_delete], sender=Review)
def update_store_rating(sender, instance, **kwargs):
    """
    Recalcula el promedio de estrellas y el total de reseñas 
    cada vez que se crea, edita o borra una Review.
    """
    store = instance.store
    stats = Review.objects.filter(store=store).aggregate(
        average=Avg('rating'),
        total=Count('id')
    )
    
    # Actualizamos los nuevos campos del modelo Store
    store.rating = stats['average'] or 0
    store.review_count = stats['total'] or 0
    store.save()