from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet, WishlistViewSet, AnalyticsViewSet

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet)
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'analytics', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('', include(router.urls)),
]
