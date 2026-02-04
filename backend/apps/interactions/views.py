from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Review, Wishlist, WishlistItem, StockNotification, SearchHistory
from .serializers import ReviewSerializer, WishlistSerializer
from rest_framework.permissions import IsAdminUser
from apps.inventory.models import Component
from django.db.models import Count, Sum, Q

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Review.objects.all()
        store_id = self.request.query_params.get('store')
        if store_id:
            queryset = queryset.filter(store_id=store_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "No tienes permiso para eliminar esta reseña."}, 
                status=status.HTTP_403_FOR_PERMISSION_DENIED
            )
        return super().destroy(request, *args, **kwargs)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle_item(self, request, pk=None):
        wishlist = self.get_object()
        product_id = request.data.get('product_id')
        item_qs = WishlistItem.objects.filter(wishlist=wishlist, component_id=product_id)

        if item_qs.exists():
            item_qs.delete()
        else:
            WishlistItem.objects.create(wishlist=wishlist, component_id=product_id, quantity=1)
            
        serializer = self.get_serializer(wishlist)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def clear_all(self, request, pk=None):
        wishlist = self.get_object()
        WishlistItem.objects.filter(wishlist=wishlist).delete()
        
        serializer = self.get_serializer(wishlist)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_quantity(self, request, pk=None):
        wishlist = self.get_object()
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            item = WishlistItem.objects.get(wishlist=wishlist, component_id=product_id)
            if quantity > 0:
                item.quantity = quantity
                item.save()
            else:
                item.delete()
        except WishlistItem.DoesNotExist:
            return Response({'error': 'El item no está en la lista'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(wishlist)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def export_budget(self, request, pk=None):
        wishlist = self.get_object()
        items = wishlist.wishlistitem_set.all()
        
        data = {
            "project_name": wishlist.name,
            "user": wishlist.user.get_full_name() or wishlist.user.email,
            "date": wishlist.updated_at.strftime("%d/%m/%Y"),
            "total_budget": sum(item.quantity * item.component.price for item in items),
            "items": [
                {
                    "component": item.component.name,
                    "store": item.component.store.name,
                    "quantity": item.quantity,
                    "unit_price": item.component.price,
                    "subtotal": item.quantity * item.component.price
                } for item in items
            ]
        }
        return Response(data)

    @action(detail=True, methods=['post'], url_path='notify-me')
    def notify_me(self, request, pk=None):
        product_id = request.data.get('product_id')

        notification, created = StockNotification.objects.get_or_create(
            user=request.user,
            component_id=product_id,
            is_active=True
        )
        
        if created:
            return Response({'message': 'Alerta activada correctamente'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Ya tienes una alerta activa para este componente'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='search-suggestions')
    def search_suggestions(self, request):
        popular_queries = SearchHistory.objects.values('query').annotate(
            total=Count('query')
        ).order_by('-total')[:5]
        
        user_recent = []
        if request.user.is_authenticated:
            user_recent = SearchHistory.objects.filter(user=request.user).values('query')[:3]

        return Response({
            'popular': [item['query'] for item in popular_queries],
            'recent': [item['query'] for item in user_recent]
        })

    @action(detail=False, methods=['post'], url_path='save-search')
    def save_search(self, request):
        query = request.data.get('query', '').strip().lower()
        
        if not query or len(query) < 3:
            return Response({'status': 'query too short'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user if request.user.is_authenticated else None
        
        last_search = SearchHistory.objects.filter(user=user).first()
        if last_search and last_search.query.lower() == query:
            return Response({'status': 'already recorded'}, status=status.HTTP_200_OK)

        SearchHistory.objects.create(user=user, query=query)
        return Response({'status': 'saved'}, status=status.HTTP_201_CREATED)
    
class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    def list(self, request):
        top_searches = SearchHistory.objects.values('query').annotate(
            count=Count('query')).order_by('-count')[:5]

        stock_demands = StockNotification.objects.values('component__name').annotate(
            total=Count('id')).order_by('-total')[:5]

        inventory_stats = Component.objects.aggregate(
            total_value=Sum('price'),
            out_of_stock=Count('id', filter=Q(stock=0)),
            total_items=Count('id')
        )

        return Response({
            'top_searches': list(top_searches),
            'stock_demands': list(stock_demands),
            'inventory_summary': {
                'total_value': float(inventory_stats['total_value']) if inventory_stats['total_value'] else 0,
                'out_of_stock_count': inventory_stats['out_of_stock'],
                'total_components': inventory_stats['total_items']
            }
        })