from django.urls import path
from .views import chatbot_response

urlpatterns = [
    path('ask/', chatbot_response, name='chatbot_ask'),
]
