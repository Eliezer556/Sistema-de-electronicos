from django.contrib import admin
from .models import Category, Component

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Component)
class ComponentAdmin(admin.ModelAdmin):
    list_display = ('name', 'mpn', 'price', 'stock', 'is_available')
    list_filter = ('category', 'is_available')
    search_fields = ('name', 'mpn')