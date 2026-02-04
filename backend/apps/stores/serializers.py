from rest_framework import serializers
from .models import Store
from django.db.models import Avg
from apps.interactions.serializers import ReviewSerializer

class StoreSerializer(serializers.ModelSerializer):

    owner_email = serializers.ReadOnlyField(source='owner.email')    
    rating_average = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Store
        fields = [
            'id', 'owner', 'owner_email', 'name', 
            'description', 'address', 'latitude', 
            'longitude', 'image', 'created_at', 
            'rating_average', 'total_reviews',
            'reviews',
        ]
        
    def get_rating_average(self, obj):
        # Calcula el promedio de estrellas de esta tienda
        average = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(average, 1) if average else 0.0
    
    def get_total_reviews(self, obj):
        # Cuenta cuántas personas han opinado
        return obj.reviews.count()
    
    def get_rating(self, obj):
        # Calculamos el promedio de reviews para esta tienda
        average = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(average, 1) if average else 0.0