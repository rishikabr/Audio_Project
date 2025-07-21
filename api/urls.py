from django.urls import path
from .views import RegisterView, LoginView, UserDetailView, AudioFileUploadView, AudioFileDeleteView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('upload/', AudioFileUploadView.as_view(), name='audio-upload'),
    path('audio/<int:pk>/', AudioFileDeleteView.as_view(), name='audio-delete'),
] 