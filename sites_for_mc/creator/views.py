from django.shortcuts import render, get_object_or_404, HttpResponse
from creator.models import site, block_type, block
import ast 
import json
# Create your views here.

def creator_view(request, *args, **kwargs):
	if request.user.is_authenticated:
		my_context ={}
#get primary block to display in creator
		primary_block_dict = {}
		primary_blocks = block_type.objects.filter(primary=True)
		counter = 0
		for x in primary_blocks:
			primary_block_dict["block_"+ str(counter)]=x.type_name.replace("-"," ").capitalize()
			counter+=1
		my_context["primary_block"]=primary_block_dict
#if recieved ajax POST request	
		if request.method == "POST":
			post_data = request.POST
#if edit was pressed on one of the elements
			if 'parentText' in post_data:
				parent_type = post_data['parentText'].replace(" ","-").lower()
				parent_fields = block_type.objects.get(type_name=parent_type).fields.split()
				field_counter=0
				field_dict={}
				for field in parent_fields:
					field_dict["field_"+str(field_counter)] = field
					field_counter +=1
				return HttpResponse(json.dumps(field_dict))
#if new site is to be created
			else:
				current_user = request.user
				elem_arr = post_data.getlist('innerlist[]')
				content_arr = ast.literal_eval(post_data.get('inputValues'))
				#get site name				
				name = elem_arr.pop(0).strip().replace(" ","-").lower()
				#make elments into elem string
				elem_string = " "
				for elem in elem_arr:
					#create elem string
					elem = str(elem).strip().replace(" ","-").lower()
					elem_string += elem
					elem_string += " " 
					#add content
					content_dict = {}
					fields = block_type.objects.get(type_name=elem).fields.split()
					for field in fields:
						content_dict[field] = content_arr[elem][field]
					content_dict=str(content_dict)
					block(content=content_dict, owner_site=name, block_type=elem).save()

				newsite = site(name=name,elements=elem_string, owner = current_user, active=True)
				newsite.save()
#set context
		return render(request,'creator.html',my_context)
	else:
		return redirect('http://127.0.0.1:8000/')


def page_view(request,site_name):
	site_object = get_object_or_404(site,name=site_name)
	elem_arr = site_object.elements.split()
	content = {}
	block_num = 1
	for element in elem_arr:
		block_content = ast.literal_eval(block.objects.get(owner_site=site_name, block_type=element).content)
		template = ast.literal_eval(block_type.objects.get(type_name=element).template)	
		elem_text = ""
		for key in block_content.keys():
			elem_text+= template["pre_"+key] + block_content[key]
		content["block"+str(block_num)]=elem_text
		block_num += 1 
	my_context ={
		"content": content
	}
	return render(request,'user_page.html',my_context)