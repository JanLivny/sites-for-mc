from django.shortcuts import render, HttpResponse, redirect
import json
import ast
from creator.views import str_character_check
from creator.models import block_type, block

# Create your views here.

def block_creator_view(request, edit_dict = "", *args, **kwargs):
	current_user = request.user

	my_context = {"edit_dict" : edit_dict}

	edit = False
	if edit_dict != "":
		edit = True

	if request.method == "POST":
		post_data = request.POST

		if 'blockData' in post_data:
			block_data = ast.literal_eval(post_data.getlist('blockData')[0])

			block_name = block_data.pop().strip().replace(" ","-").lower()

			if block_name == "":
				return HttpResponse('0')

			if block_type.objects.filter(type_name=block_name).exists():
				if block_type.objects.filter(type_name=block_name)[0].owner == str(current_user):
					edit = True
				else:
					return HttpResponse('1')


			safe_name,illegal_values = str_character_check(block_name)

			if not safe_name:
				return HttpResponse('2 '+ illegal_values)

			block_owner = request.user
			template_dict = {}
			field_dict = {}

			"""
			-illegal char
			-duped name #
			-empty name #
			-empty input type/name ##
			"""
			line_counter = 0
			for line in block_data:
				line_counter += 1 

				field_name = line["Field_data"][0]

				# safe_name,illegal_values = str_character_check(field_name)
				# if not safe_name:
				# 	return HttpResponse('2 '+ str(illegal_values))

				if field_name == "":
					return HttpResponse('3 '+str(line_counter))

				field_type = line["Field_data"][1]

				if  not(field_type == "text" or field_type == "file"):
					return HttpResponse('3 ' +  str(line_counter))

				field_dict[field_name] = field_type

				field_pre_text = line["txt_1"]
				field_post_text = line["txt_2"]

				template_dict["pre_"+field_name] = field_pre_text
				template_dict["post_"+field_name] = field_post_text

			if not edit:
				block_type(
					primary=False,
					type_name = block_name ,
					template = json.dumps(template_dict),
					owner = block_owner,
					fields = json.dumps(field_dict),
					modifier_type = "user").save()
			else:
				if not block.objects.filter(block_type = block_name).exists():
					edit_block = block_type.objects.get(type_name = block_name)
					print(json.dumps(field_dict))
					if edit_block.owner == str(current_user):
						edit_block.template = json.dumps(template_dict)
						edit_block.fields = json.dumps(field_dict)
						edit_block.save()
					else:
						return HttpResponse('4')
				else:
					return HttpResponse('5')

	return render(request,'block_creator.html',my_context)


def block_editor_view(request, block_name):
	block = block_type.objects.filter(type_name = block_name)[0]
	template =  json.dumps(json.loads((block.template)))
	fields =  block.fields
	data_list = str(json.dumps([template,fields,block_name]))
	# if str(request.user) != str(block.owner):
	# 	return(redirect('http://127.0.0.1:8000/dashboard'))
		
	return(block_creator_view(request,edit_dict = data_list))
