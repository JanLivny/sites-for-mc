from django.contrib import admin
from .models import site, block_type, block

# Register your models here.

admin.site.register(site)	
admin.site.register(block_type)
admin.site.register(block)