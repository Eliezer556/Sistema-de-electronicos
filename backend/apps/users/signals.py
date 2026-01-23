from django.core.mail import send_mail
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    # Contenido del correo
    email_plaintext_message = f"Hola, utiliza este token para restablecer tu contraseña: {reset_password_token.key}"

    send_mail(
        # Asunto y remitente
        "Recuperación de Contraseña - UNEFA Electronics",
        # Mensaje
        email_plaintext_message,
        "soporte.unefa@gmail.com",
        # Destinatario
        [reset_password_token.user.email]
    )