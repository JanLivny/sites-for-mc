from django.shortcuts import render
from creator.models import site
# Create your views here.
def creator_view(request, *args, **kwargs):
	my_context ={
	}
	if request.user.is_authenticated:

		if request.method == "POST":
			elem_arr = request.POST.getlist('innerlist[]')
			name = elem_arr.pop(0)
			elem_string = ''
			for x in elem_arr:
				elem_string += str(x)
				elem_string += " " 
			newsite = site(name=name,elements=elem_string)
			newsite.save()
		return render(request,'creator.html',my_context)
	else:
		return redirect('http://127.0.0.1:8000/')