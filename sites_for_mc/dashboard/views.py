from django.shortcuts import render,get_object_or_404, HttpResponse
from creator.models import site, block_type, block, site_data_table, image
import json
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
		user_site_urls={}
		for user_site in site.objects.filter(owner = current_user):
			user_sites["site_"+str(counter)]=user_site.name
			user_site_urls["site_"+str(counter)] = "http://127.0.0.1:8000/creator/" + user_site.name
			counter+=1

		my_context = {
			"user_sites":user_sites,
			"user_site_urls":user_site_urls
		}
		if request.method == "POST":
			post_data = request.POST
			if 'targetText' in post_data:
				#get elems
				site_name = post_data.getlist('targetText')[0]
				target_elements = site.objects.get(name=site_name).elements
				#get extra info 
				bonus_site_data = site_data_table.objects.get(owner_site=site_name)
				data_arr= [
					bonus_site_data.real_name,
					bonus_site_data.adress,
					bonus_site_data.date_created,
					bonus_site_data.owner,
					bonus_site_data.views,
					target_elements
				]
				return HttpResponse(str(data_arr))

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
			#delete site
			elif 'delName' in post_data:
				del_site_name = post_data.getlist('delName')[0]
				site.objects.get(name=del_site_name).delete()
				block.objects.filter(owner_site=del_site_name).delete()
				site_data_table.objects.filter(owner_site=del_site_name).delete()
				image.objects.filter(owner_site=del_site_name).delete()

		return render(request,'dashboard.html',my_context)
	else:
		return redirect('http://127.0.0.1:8000/')