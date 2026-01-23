from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from apps.inventory.models import Component
from .models import StockNotification

@receiver(post_save, sender=Component) #escucha
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