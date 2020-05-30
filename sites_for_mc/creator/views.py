from django.shortcuts import render, get_object_or_404, HttpResponse
from creator.models import site, block_type, block, site_data_table, image
from datetime import date
import ast 
import json
# Create your views here.
def creator_view(request, value_dict = {}, name = "", *args, **kwargs):
	my_context = {}
	my_context["value_dict"]=value_dict
	my_context["name"]=name
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
			name = ''
#if edit was pressed on one of the elements
			if 'parentText' in post_data:
				parent_type = post_data['parentText']
				parent_fields = block_type.objects.get(type_name=parent_type).fields
				return HttpResponse(parent_fields)
#if new site is to be created
			elif 'innerlist[]' in post_data:
				create = True
				edit = False
				current_user = request.user
				elem_arr = post_data.getlist('innerlist[]')
				content_arr = ast.literal_eval(post_data.get('inputValues'))
				#get site name				
				real_name = elem_arr.pop(0)
				name = real_name.strip().replace(" ","-").lower()
				#if name duped
				if site.objects.filter(name=name).exists():
					#if name is already in use by user edit protocol
					if site.objects.get(name=name).owner == str(current_user):
						edit = True
					else:
						create = False
						return HttpResponse('0')
				#if empty name
				elif name == "":
					create = False
					return HttpResponse('1')
				#if site has to be created
				if create:
					elem_string = " "
					for elem in elem_arr:
						#create elem string
						elem = str(elem).strip().replace(" ","-").lower()
						elem_string += elem
						elem_string += " " 
						#add content
						content_dict = {}
						fields = ast.literal_eval(block_type.objects.get(type_name=elem).fields).keys()
						for field in fields:
							try: 
								content_dict[field] = content_arr[elem][field]
							except:
								content_dict[field] = ""
						
						content_dict=str(content_dict)
						print(content_dict)
						#try to edit block if error create block
						if edit:
							edit_block=block.objects.get(owner_site = name, block_type=elem)
							edit_block.content = content_dict
							edit_block.save()
						else:
								block(content=content_dict, owner_site=name, block_type=elem).save()
					#if edit edit site
					if edit:
						edit_site = site.objects.get(name = name)
						edit_site.elements = elem_string
						edit_site.save()
					else:
						newsite = site(name=name,elements=elem_string, owner = current_user, active=True)
						newsite.save()
						today  = date.today()
						adress = "http://127.0.0.1:8000/creator/" + name
						site_data_table(owner_site=name, real_name=real_name, adress=adress,date_created=today,owner=current_user,views=0).save()
				#make annex model
										
					if edit:
						return HttpResponse(['3 ',name])
					else:
						return HttpResponse(["2 ",name])
			#handle Imagez
			elif bool(request.FILES):
				file_dict = request.FILES
				print(file_dict)
				image_keys = file_dict.keys()
				print(image_keys)
				print(name)
				for key in image_keys:
					#temp fix look into in the future maybe?
					p_key = eval(key.replace("%22","'"))
					print(p_key)
					image(owner_site=p_key[0],element=p_key[1],field=p_key[2],name = p_key[3], image=file_dict[key]).save()

		return render(request,'creator.html',my_context)
	else:
		return redirect('http://127.0.0.1:8000/')


def page_view(request,site_name):
	site_object = get_object_or_404(site,name=site_name)

	site_data = site_data_table.objects.get(owner_site=site_name)
	site_real_name = site_data.real_name
	site_data.views += 1
	site_data.save()
		
	elem_arr = site_object.elements.split()
	content = {"name":site_real_name}
	block_num = 0
	images = {}

	for element in elem_arr:
		block_content = ast.literal_eval(block.objects.get(owner_site=site_name, block_type=element).content)
		block_type_data =block_type.objects.get(type_name=element)
		template =  ast.literal_eval(block_type_data.template)
		fields = ast.literal_eval(block_type_data.fields)
		elem_text = ""
		elem_name = element.replace("-"," ").capitalize() 
		image_html = ""
		for field_text in block_content.keys():
			if fields[field_text] == "text":
				elem_text+= template["pre_"+field_text] + block_content[field_text]
			else:

				image_set= image.objects.filter(
					owner_site=site_name, 
					element=element, 
					field=field_text)
				if image_set.exists():
					image_url = image_set[0].image.url
					image_html += ("<img src='"+image_url+"' class='user-image'>")
				else:
					print("ddwd")
					#pass 

		images["block"+str(block_num)] = image_html
		content["block"+str(block_num)]=[elem_name,elem_text]
		block_num += 1 

	my_context ={
		"content": content,
		"images": images
	}
	return render(request,'user_page.html',my_context)


def editor_view(request, site_name):
	values=block.objects.filter(owner_site=site_name)
	value_dict={}
	for value_block in values:
		value_dict[value_block.block_type]=ast.literal_eval(value_block.content)		
	return(creator_view(request,json.dumps(value_dict),site_name))