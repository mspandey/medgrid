from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('hospitals.urls')),
    # Chatbot disabled in production (requires heavy ML dependencies)
    # path('api/chat/', include('chatbot.urls')),
]
