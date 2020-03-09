from django.shortcuts import render

# Create your views here.

def dash_view(request, *args, **kwargs):
	my_context ={
	}

	if request.user.is_authenticated:
		return render(request,'dashboard.html',my_context)
	else:
		return redirect('http://127.0.0.1:8000/')