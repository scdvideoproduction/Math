from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('v2/', views.tug_v2, name='tug_v2'),
]
