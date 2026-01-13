from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LoginView
from .admin_views import PlatformStatsView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('users/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('platform-stats/', PlatformStatsView.as_view(), name='platform-stats'), 
    
    path('', include(router.urls)),
]