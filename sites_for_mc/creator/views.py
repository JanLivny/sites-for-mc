from django.shortcuts import render

# Create your views here.
def creator_view(request, *args, **kwargs):
	my_context ={
	}
	if request.user.is_authenticated:

		if request.method == "POST":
			print(request.POST)
			elem_arr = request.POST.getlist('innerlist[]')
			for x in elem_arr:
				print(x)
		return render(request,'creator.html',my_context)
	else:
		return redirect('http://127.0.0.1:8000/')