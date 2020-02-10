from django.shortcuts import render
from django.http import HttpResponse
from signin.forms import RawUserform

# Create your views here.
def home_view(request, *args, **kwargs):

	form = RawUserForm()
	if request.method == "POST":
		form = RawUserForm(request.POST)
		if form.is_valid():
			Product.objects.create( **form.cleaned_data)

	my_context ={
		"form":form
	}

	return render(request,'home.html',my_context)