from django.contrib import admin
from .models import Review, Wishlist, WishlistItem

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'store', 'rating', 'created_at')
    list_filter = ('rating', 'store')
    search_fields = ('user__email', 'comment')

class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 1

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'updated_at')
    inlines = [WishlistItemInline]