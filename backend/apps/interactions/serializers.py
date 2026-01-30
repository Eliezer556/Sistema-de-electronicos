from rest_framework import serializers
from .models import Review, Wishlist, WishlistItem, StockNotification
from apps.inventory.serializers import ComponentSerializer
from rest_framework.exceptions import ValidationError, PermissionDenied

class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_email', 'store', 'rating', 'comment', 'created_at']

    def perform_create(self, serializer):
        user = self.request.user
        store = serializer.validated_data.get('store')

        if user.role != 'cliente':
            raise PermissionDenied("Solo los clientes pueden calificar tiendas.")

        if hasattr(store, 'owner') and store.owner == user:
            raise ValidationError("No puedes calificar tu propia tienda.")

        if Review.objects.filter(user=user, store=store).exists():
            raise ValidationError("Ya has calificado esta tienda anteriormente.")

        serializer.save(user=user)
        
class WishlistItemSerializer(serializers.ModelSerializer):
    component = ComponentSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = WishlistItem
        fields = ['id', 'component', 'quantity', 'subtotal', 'added_at']

    def get_subtotal(self, obj):
        return obj.quantity * obj.component.price

class WishlistSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    items = WishlistItemSerializer(source='wishlistitem_set', many=True, read_only=True)
    total_budget = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'user_email', 'name', 'items', 'total_budget', 'updated_at']
        read_only_fields = ['user']

    def get_total_budget(self, obj):
        items = obj.wishlistitem_set.all()
        return sum(item.quantity * item.component.price for item in items)
    
from .models import StockNotification

class StockNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockNotification
        fields = ['id', 'user', 'component', 'is_active', 'created_at']
        read_only_fields = ['user', 'is_active']