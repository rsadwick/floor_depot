from django.contrib import admin
from .models import Log


class LogAdmin(admin.ModelAdmin):
    list_display = ('error_type', 'name', 'email', 'phone')
admin.site.register(Log, LogAdmin)
