from django.shortcuts import render, get_object_or_404, HttpResponse
from creator.models import site, block_type, block, site_data_table
from datetime import date
import ast 
import json
# Create your views here.
def creator_view(request, my_context = {}, *args, **kwargs):
	print(my_context)
	if request.user.is_authenticated:
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
			# print(post_data)
#if edit was pressed on one of the elements
			if 'parentText' in post_data:
				parent_type = post_data['parentText']
				parent_fields = block_type.objects.get(type_name=parent_type).fields
				return HttpResponse(parent_fields)
#if new site is to be created
			elif 'innerlist[]' in post_data:
				current_user = request.user
				elem_arr = post_data.getlist('innerlist[]')
				content_arr = ast.literal_eval(post_data.get('inputValues'))
				#get site name				
				real_name = elem_arr.pop(0)
				name = real_name.strip().replace(" ","-").lower()
				if site.objects.filter(name=name).exists():
					return HttpResponse('0')
				elif name == "":
					return HttpResponse("1")
				#make elments into elem string
				else:
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
							try: 
								content_dict[field] = content_arr[elem][field]
							except:
								content_dict[field] = ""
								
						content_dict=str(content_dict)
						block(content=content_dict, owner_site=name, block_type=elem).save()

					newsite = site(name=name,elements=elem_string, owner = current_user, active=True)
					newsite.save()
				#make annex model
					today  = date.today()
					adress = "http://127.0.0.1:8000/creator/" + name
					site_data_table(owner_site=name, real_name=real_name, adress=adress,date_created=today,owner=current_user,views=0).save()
					return HttpResponse(["2 ",name])

#set context
		print(my_context)
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


def editor_view(request, site_name):
	values=block.objects.filter(owner_site=site_name)
	value_dict={}
	for value_block in values:
		value_dict[value_block.block_type]=ast.literal_eval(value_block.content)
	return(creator_view(request,{"value_dict":json.dumps(value_dict)}))