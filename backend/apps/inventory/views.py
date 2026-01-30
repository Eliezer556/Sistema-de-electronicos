from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters import rest_framework as django_filters 
from .models import Category, Component
from .serializers import CategorySerializer, ComponentSerializer
from django.http import HttpResponse
from openpyxl import Workbook

class ComponentFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    
    mpn = django_filters.CharFilter(field_name="mpn", lookup_expr='icontains')
    
    valor = django_filters.CharFilter(field_name="technical_specs__valor", lookup_expr='icontains')
    voltaje = django_filters.CharFilter(field_name="technical_specs__voltaje", lookup_expr='icontains')
    tolerancia = django_filters.CharFilter(field_name="technical_specs__tolerancia", lookup_expr='icontains')
    encapsulado = django_filters.CharFilter(field_name="technical_specs__encapsulado", lookup_expr='icontains')
    montaje = django_filters.CharFilter(field_name="technical_specs__montaje", lookup_expr='iexact')

    class Meta:
        model = Component
        fields = ['category', 'is_available']

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny] 

class ComponentViewSet(viewsets.ModelViewSet):
    serializer_class = ComponentSerializer
    filter_backends = [django_filters.DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ComponentFilter
    search_fields = ['name', 'mpn', 'description', 'technical_specs__valor', 'technical_specs__encapsulado']

    def get_queryset(self):
        queryset = Component.objects.all()
        is_management = self.request.query_params.get('manage', None)
        
        if is_management and self.request.user.is_authenticated:
            if not self.request.user.is_staff:
                return queryset.filter(store__owner=self.request.user)
        return queryset

    def perform_create(self, serializer):
        from .models import Store 
        user_store = Store.objects.get(owner=self.request.user)
        serializer.save(store=user_store)

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'recommendations']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        if request.user.is_authenticated:
            user_interests = Component.objects.filter(in_wishlists__user=request.user).values_list('category', flat=True)
            if user_interests.exists():
                recommended = Component.objects.filter(category__in=user_interests).exclude(in_wishlists__user=request.user).distinct()[:5]
            else:
                recommended = Component.objects.all().order_by('?')[:5]
        else:
            recommended = Component.objects.all().order_by('?')[:5]
            
        serializer = self.get_serializer(recommended, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def download_excel(self, request): 
        queryset = self.get_queryset()
        if not request.user.is_staff:
            queryset = queryset.filter(store__owner=request.user)
        
        wb = Workbook()
        ws = wb.active
        ws.title = "Inventario de Tienda"
        ws.append(['Componente', 'MPN', 'Precio', 'Stock', 'Estatus'])

        for item in queryset:
            status_text = "Agotado" if item.stock <= 0 else "Disponible"
            ws.append([item.name, item.mpn, item.price, item.stock, status_text])

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=reporte_inventario.xlsx'
        wb.save(response)
        return response
