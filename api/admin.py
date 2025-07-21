from django.contrib import admin
from django.contrib.auth.models import User
from .models import Profile, AudioFile

# Unregister the provided model admin
admin.site.unregister(User)

# Register out own model admin, based on the default UserAdmin
@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    pass

admin.site.register(Profile)
admin.site.register(AudioFile)
