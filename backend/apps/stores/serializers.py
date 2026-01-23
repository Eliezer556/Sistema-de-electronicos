from rest_framework import serializers
from .models import Store
from django.db.models import Avg

class StoreSerializer(serializers.ModelSerializer):
    # Mostramos el email del dueño en lugar de solo su ID
    owner_email = serializers.ReadOnlyField(source='owner.email')
    
    # Campos dinamicos de estadistica sobre la tienda
    rating_average = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = [
            'id', 'owner', 'owner_email', 'name', 
            'description', 'address', 'latitude', 
            'longitude', 'image', 'created_at', 
            'rating_average', 'total_reviews'
        ]
        
    def get_rating_average(self, obj):
        # Calcula el promedio de estrellas de esta tienda
        average = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(average, 1) if average else 0.0
    
    def get_total_reviews(self, obj):
        # Cuenta cuántas personas han opinado
        return obj.reviews.count()