from rest_framework import viewsets, permissions
from .models import Store
from .serializers import StoreSerializer
from geopy.distance import geodesic

class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    
    def get_queryset(self):
        queryset = Store.objects.all()
        user_lat = self.request.query_params.get('lat')
        user_lon = self.request.query_params.get('lon')

        if user_lat and user_lon:
            try:
                user_location = (float(user_lat), float(user_lon))
                # Filtramos tiendas en un radio de 5km dentro de Maracay
                valid_store_ids = []
                for store in queryset:
                    store_location = (store.latitude, store.longitude)
                    distance = geodesic(user_location, store_location).km
                    if distance <= 5.0: 
                        valid_store_ids.append(store.id)
                
                queryset = queryset.filter(id__in=valid_store_ids)
            except ValueError:
                pass 
        
        if self.action not in ['list', 'retrieve'] and not self.request.user.is_staff:
            return queryset.filter(owner=self.request.user)
        
        return queryset

    def get_permissions(self):
        # Lectura libre, escritura protegida
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # Asignamos automáticamente al usuario actual como dueño si es proveedor
        serializer.save(owner=self.request.user)