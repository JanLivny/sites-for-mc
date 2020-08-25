from django.shortcuts import render, get_object_or_404, HttpResponse, redirect
from creator.models import site, block_type, block, site_data_table, image
from datetime import date
import ast 
import json
from django.http import HttpResponseNotFound
from dashboard.views import *
# Create your views here.
def str_character_check(string):
	legal_name = True
	illegal_values = ["<", ">","#","%", '"',"{", "}","|","\\","^","`",";","/","?",":","@","&","=","+","$",","]
	used_values = ""
	for illegal_value in illegal_values:
		if illegal_value in string:
			legal_name = False
			used_values += illegal_value
	return legal_name, used_values

def creator_view(request, value_dict = {}, name = "", *args, **kwargs):
#set up context 
	my_context = {}
	my_context["value_dict"]=value_dict
	my_context["name"]=name
#determine if editor or creator and set edit
	edit = False
	if bool(value_dict):
		edit = True
#check user authentication
	if request.user.is_authenticated:
#determine if amount of sites is max
		if site.objects.filter(owner=request.user).count() >= 5 and not edit:
			return redirect("http://127.0.0.1:8000/dashboard")
#get primary block to display in creator
		primary_block_dict = {}
		primary_blocks = []

		#if edit get site blocks else get default primary blocks
		if edit:
			primary_blocks = site.objects.get(name = name).elements.split()
		else:
			primary_block_objects = block_type.objects.filter(primary=True)
			for blk in primary_block_objects:   
				primary_blocks.append(blk.type_name)

		counter = 0
		for blk in primary_blocks:
			primary_block_dict["block_"+ str(counter)]=blk.replace("-"," ").capitalize()
			counter+=1

		my_context["primary_block"]=primary_block_dict
#if recieved ajax POST request	
		if request.method == "POST":
			post_data = request.POST	
			print(post_data)
			name = ''
#if edit was pressed on one of the elements
			if 'parentText' in post_data:
				parent_type = post_data['parentText']
				print(parent_type)
				parent_fields = block_type.objects.get(type_name=parent_type).fields
				return HttpResponse(parent_fields)
#if toolbox elements where requested
			elif 'toolboxType' in post_data:
				toolbox_type = post_data.getlist('toolboxType')[0]
				toolbox_list = []
				toolbox_blocks = ""

				if toolbox_type == "sfm-blocks":
					toolbox_blocks = block_type.objects.filter(official=True)
				elif toolbox_type == "user-blocks":
					toolbox_blocks = block_type.objects.filter(official=False)
				for blk in toolbox_blocks:
					toolbox_list.append(blk.type_name) 

				return HttpResponse(json.dumps(toolbox_list))
#if preview was requested
			elif 'previewName' in post_data:
				preview_elem = post_data.getlist('previewName')[0]	
				preview_type = block_type.objects.get(type_name = preview_elem)
				template = ast.literal_eval(preview_type.template)
				fields = ast.literal_eval(preview_type.fields)	
				template_text = ""
				image_arr = []
				# counter = len(fields.keys())
				for key in fields:
					# counter -= 1
					if fields[key] == "text":
						template_text += template["pre_"+ key]
						template_text += "["+key+"]"
						template_text += template["post_"+ key]
						# if not counter > 0:
						# 	template_text +=template["final"] 
					else:
						image_arr.append(key)

				return HttpResponse(str(json.dumps([template_text,image_arr])))
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
					# #if name is already in use by user edit protocol
					# if site.objects.get(name=name).owner == str(current_user):
					# 	edit = True
					# else:
					create = False
					return HttpResponse('0')
				#if empty name
				elif name == "":
					create = False
					return HttpResponse('1')
				#illegal name
				else:
					create, used_values = str_character_check(name)
					if not create:
						return HttpResponse("4 "+used_values)
				#if site has to be created 
				if create:
					#add counters to duplicate elements
					elem_amount_dict = {}
					elem_string = " "
					for elem in elem_arr:
						#####################
						#create elem string
						#####################
						c_elem = elem
						elem = elem.split("|")[0]
						# elem = str(elem).strip().replace(" ","-").lower()		
						# if elem_arr.count(elem) > 1:
						# 	if not elem in elem_amount_dict:
						# 		elem_amount_dict[elem] = 0
						# 	else:
						# 		elem_amount_dict[elem] += 1
						# 	c_elem = elem + "|" + str(elem_amount_dict[elem])

						elem_string += c_elem
						elem_string += " " 
						#add content
						content_dict = {}
						fields = ast.literal_eval(block_type.objects.get(type_name=elem).fields).keys()
						for field in fields:
							try: 
								content_dict[field] = content_arr[c_elem][field]
							except:
								content_dict[field] = ""

						r_content_dict = content_dict
						content_dict=str(content_dict)
						#try to edit block if error create block
						if edit:
							edit_block=block.objects.get(owner_site = name, name=c_elem, block_type = elem)
							edit_block.content = content_dict
							#delete imagez if empty
							for field in r_content_dict:
								data_type = ast.literal_eval(block_type.objects.get(type_name = elem).fields)[field]
								# print(data_type)
								if data_type == "file" and r_content_dict[field] != "" and eval(r_content_dict[field])[2] == "":
									image_obj = image.objects.filter(owner_site = name, element = c_elem, field = field)
									if image_obj.exists():
										image_obj.delete()

							edit_block.save()
						else:
							print(content_dict)
							_block  = block(content=content_dict, owner_site=name, block_type=elem, name=c_elem)
							_block.save()
					#if edit edit site
					if edit:
						edit_site = site.objects.get(name = name)
						edit_site.elements = elem_string
						edit_site.save()
					else:
						newsite = site(name=name,elements=elem_string, owner = current_user, active=True,final=False)
						newsite.save()
						#make annex model
						today  = date.today()
						adress = "http://127.0.0.1:8000/creator/" + name
						site_data_table(owner_site=name, real_name=real_name, adress=adress,date_created=today,owner=current_user,views=0).save()
								
					if edit:
						return HttpResponse(["3 ",name])
					else:
						return HttpResponse(["2 ",name])
			#handle Imagez
			elif bool(request.FILES):
				file_dict = request.FILES
				image_keys = file_dict.keys()
				for key in image_keys:
					#temp fix look into in the future maybe?
					p_key = eval(key.replace("%22","'"))
					
					image_obj = image.objects.filter(owner_site=p_key[0],element=p_key[1],field=p_key[2])
					if image_obj.exists():
						print(file_dict)
						image_obj = image.objects.get(owner_site=p_key[0],element=p_key[1],field=p_key[2])
						image_obj.name = p_key[3]
						image_obj.image = file_dict[key]
						image_obj.save()
					else:
						image(owner_site=p_key[0],element=p_key[1],field=p_key[2],name = p_key[3], image=file_dict[key]).save()
			
		return render(request,'creator.html',my_context)
	else:
		return redirect('http://127.0.0.1:8000/')


def page_view(request,site_name):
	site_object = get_object_or_404(site,name=site_name)

	if not site_object.active and str(request.user) != str(site_object.owner):
		 return HttpResponseNotFound("Page doese not exist or Private")         

	site_data = site_data_table.objects.get(owner_site=site_name)
	site_real_name = site_data.real_name
	site_data.views += 1
	site_data.save()
		
	elem_arr = site_object.elements.split()
	content = {"name":site_real_name}
	block_num = 0
	images = {}
	print(elem_arr)
	for element in elem_arr:
		block_content = ast.literal_eval(block.objects.get(owner_site=site_name, name=element).content) 
		print(block_content)
		# if len(element) > 1:
		# 	print('#####',element,'#####')
		# 	block_content = ast.literal_eval(block_content[int(element[1])].content)	
		# else:
		# 	block_content = ast.literal_eval(block_content[0].content)	
		c_element = element
		element = element.split("|")[0]
		# print(block_content)
		block_type_data =block_type.objects.get(type_name=element)
		template =  ast.literal_eval(block_type_data.template)
		fields = ast.literal_eval(block_type_data.fields)
		elem_text = ""
		elem_name = ""
		image_html = ""
		all_images = True
		empty_field = True
		for field_text in block_content.keys():
			if fields[field_text] == "text":
				all_images = False

				if block_content[field_text] == "":
					if not site_object.final:
						elem_text+= template["pre_"+field_text] + "[placeholder text]" +  template["post_"+field_text]
						empty_field = False	
						elem_name = element.replace("-"," ").capitalize() 
				else:
					elem_name = element.replace("-"," ").capitalize() 
					elem_text+= template["pre_"+field_text] + block_content[field_text] + template["post_"+field_text]
					empty_field = False	
			else:
				addPlaceholder = False
				print(c_element)
				image_set= image.objects.filter(
					owner_site=site_name, 
					element=c_element, 
					field=field_text)
				if not site_object.final:
					elem_name = element.replace("-"," ").capitalize()
					if not image_set.exists():
						addPlaceholder = True
						image_set= image.objects.filter(
							owner_site='#')
						print(image_set)
				if image_set.exists() or addPlaceholder:
					image_url = image_set[0].image.url
					image_html += ("<img src='"+image_url+"' class='user-image'>")
					elem_name = element.replace("-"," ").capitalize()
					empty_field = False
			

		# if not all_images and not empty_field:
		# 	elem_text += template["final"]

		images["block"+str(block_num)] = image_html
		content["block"+str(block_num)]=[elem_name,elem_text]
		block_num += 1 

	my_context ={
		"content": content,
		"images": images
	}
	return render(request,'user_page.html',my_context)

def editor_view(request, site_name):
	if str(request.user) != site.objects.filter(name=site_name)[0].owner:
		return(redirect('http://127.0.0.1:8000/dashboard'))

	values=block.objects.filter(owner_site=site_name)
	block_names = site.objects.get(name=site_name).elements.strip().split(" ")
	value_dict={}
	counter = 0
	print(block_names)
	for value_block in values:
		value_dict[block_names[counter]]=ast.literal_eval(value_block.content)
		counter += 1
	print(value_dict)	
	return(creator_view(request,json.dumps(value_dict),site_name))
		