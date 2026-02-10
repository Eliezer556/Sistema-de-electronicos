from django.contrib import admin
from .models import Store
from apps.interactions.models import Review
from apps.inventory.models import Component

class ComponentInline(admin.TabularInline):
    model = Component
    extra = 1 
    fields = ('name', 'mpn', 'category', 'price', 'stock', 'is_available')

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ('created_at',)
    fields = ('user', 'rating', 'comment', 'created_at')

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'address', 'rating', 'review_count', 'created_at')
    search_fields = ('name', 'address')
    inlines = [ComponentInline, ReviewInline]