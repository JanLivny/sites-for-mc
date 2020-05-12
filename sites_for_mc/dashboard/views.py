from django.shortcuts import render,get_object_or_404, HttpResponse
from creator.models import site, block_type, block
# Create your views here.

def dash_view(request, *args, **kwargs):
	if request.user.is_authenticated:
		current_user = request.user
		user_sites={
			"site_0":"Empty drawer",
			"site_1":"Empty drawer",
			"site_2":"Empty drawer",
			"site_3":"Empty drawer",
			"site_4":"Empty drawer"
		}

		counter = 0

		for user_site in site.objects.filter(owner = current_user):
			user_sites["site_"+str(counter)]=user_site.name
			counter+=1

		my_context = {
			"user_sites":user_sites
		}
		if request.method == "POST":
			post_data = request.POST
			if 'targetText' in post_data:
				site_name = post_data.getlist('targetText')[0]
				target_elements = site.objects.get(name=site_name).elements
				return HttpResponse(target_elements)
			elif 'updatedElems[]' in post_data:
				elem_arr = post_data.getlist('updatedElems[]')
				name= elem_arr.pop()
				elem_string=''
				for elem in elem_arr:
						#create elem string
						elem_string += elem
						elem_string += " " 
				user_site = site.objects.get(name=name)
				user_site.elements = elem_string
				user_site.save()
			elif 'delName' in post_data:
				del_site_name = post_data.getlist('delName')[0]
				site.objects.get(name=del_site_name).delete()
				block.objects.filter(owner_site=del_site_name).delete()
			

		return render(request,'dashboard.html',my_context)
	else:
		return redirect('http://127.0.0.1:8000/')