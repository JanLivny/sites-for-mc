from django.shortcuts import render,get_object_or_404, HttpResponse, redirect
from creator.models import site, block_type, block, site_data_table, image
import json
import ast
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
		block_name_arr = ""

		user_blocks = block_type.objects.filter(owner = current_user)
		for block in user_blocks:
			block_name_arr += block.type_name + " "


		for user_site in site.objects.filter(owner = current_user):
			user_sites["site_"+str(counter)]=user_site.name
			user_site_urls["site_"+str(counter)] = "http://127.0.0.1:8000/creator/" + user_site.name
			counter+=1
		my_context = {
			"user_sites":user_sites,
			"user_site_urls":user_site_urls,
			"block_name_arr":block_name_arr
		}

		if request.method == "POST":
			post_data = request.POST
			print(post_data)
			if 'targetText' in post_data:
				#get elems
				site_name = post_data.getlist('targetText')[0]

				#SECURITY#
				if str(request.user) != site.objects.filter(name=site_name)[0].owner:
					print("ddwddws")
					return(redirect('http://127.0.0.1:8000/dashboard'))
				#SECURITY#

				_site = site.objects.get(name=site_name)
				target_elements = _site.elements
				#get extra info 
				bonus_site_data = site_data_table.objects.get(owner_site=site_name)
				#get switch positions
				privacy_setting = str(_site.active)
				production_setting = str(_site.final)
				data_arr= [
					bonus_site_data.real_name,
					bonus_site_data.adress,
					bonus_site_data.date_created,
					bonus_site_data.owner,
					bonus_site_data.views,
					production_setting,
					privacy_setting,
					target_elements
				]
				return HttpResponse(str(data_arr))

			elif 'updatedElems[]' in post_data:
				elem_arr = post_data.getlist('updatedElems[]')
				name= elem_arr.pop()

				#SECURITY#
				if str(request.user) != site.objects.filter(name=name)[0].owner:
					return(redirect("http://127.0.0.1:8000/dashboard"))
				#SECURITY#

				elem_string=''
				for elem in elem_arr:
						#create elem string
						elem_string += elem
						elem_string += " " 
				user_site = site.objects.get(name=name)
				user_site.elements = elem_string
				user_site.save()
			#delete site
			elif 'delInfo' in post_data:
				del_info = ast.literal_eval(post_data.getlist('delInfo')[0])
				del_name = del_info[0]
				del_type = del_info[1]

				if del_type == "site":
					if str(request.user) == site.objects.filter(name=del_name)[0].owner:
						site.objects.filter(name=del_name).delete()
						block.objects.filter(owner_site=del_name).delete()
						site_data_table.objects.filter(owner_site=del_name).delete()
						image.objects.filter(owner_site=del_name).delete()
				elif str(request.user) == block_type.objects.filter(type_name=del_name)[0].owner:
					block_type.objects.filter(type_name=del_name).delete()
			#change privacy preference
			elif 'statusData' in  post_data:
				status_data = ast.literal_eval(post_data.getlist("statusData")[0])
				_site = site.objects.get(name=status_data[0])

				#SECURITY#
				if str(request.user) != site.objects.filter(name=status_data[0])[0].owner:
					return(redirect("http://127.0.0.1:8000/dashboard"))
				#SECURITY#
				
				if status_data[2] == "privacy-switch":
					if status_data[1] == "true":
						_site.active = True
					else:
						_site.active = False
					_site.save()
				elif status_data[2]	== "production-switch":
					if status_data[1] == "true":
						_site.final = True
					else:
						_site.final = False
					_site.save()

		return render(request,'dashboard.html',my_context)
	else:
		return redirect('http://127.0.0.1:8000/')