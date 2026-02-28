from django.shortcuts import render

def index(request):
    return render(request, 'game/index.html')

def tug_v2(request):
    return render(request, 'game/index_v2.html')
