from rest_framework import serializers
from .models import Category, Component

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ComponentSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    store_name = serializers.ReadOnlyField(source='store.name')
    
    store = serializers.ReadOnlyField(source='store.id')
    
    # Popularidad del componente
    times_in_wishlist = serializers.SerializerMethodField()
    stock_status = serializers.SerializerMethodField()

    class Meta:
        model = Component
        fields = [
            'id', 'store', 'store_name', 'category', 'category_name',
            'name', 'mpn', 'description', 'price', 'stock',
            'image', 'datasheet_url', 'technical_specs', 'is_available',
            'times_in_wishlist', 'stock_status', 'offer_price', 'is_on_offer'
        ]
        
    def get_times_in_wishlist(self, obj):
        # Número de veces en listas de deseos
        return obj.in_wishlists.count()
    
    def get_stock_status(self, obj):
        # Detección de baja disponibilidad
        if obj.stock <= 0:
            return "Agotado"
        elif obj.stock <= 5:
            return "Baja Disponibilidad"
        return "Disponible"
    
    def validate(self, data):
        price = data.get('price')
        offer_price = data.get('offer_price')
        is_on_offer = data.get('is_on_offer')

        if is_on_offer and offer_price and price:
            if offer_price >= price:
                raise serializers.ValidationError(
                    {"offer_price": "El precio de oferta debe ser menor al precio original."}
                )
        return data