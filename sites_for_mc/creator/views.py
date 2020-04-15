from django.shortcuts import render, get_object_or_404
from creator.models import site, block_type, block
import ast 
# Create your views here.

def creator_view(request, *args, **kwargs):
	my_context ={
	}
	if request.user.is_authenticated:

		if request.method == "POST":	
			current_user = request.user
			elem_arr = request.POST.getlist('innerlist[]')
			content_arr = "[test value]"
			name = elem_arr.pop(0).strip().replace(" ","-")

			elem_string = " "
			for x in elem_arr:
				x = str(x).strip().replace(" ","-").lower()
				elem_string += x
				elem_string += " " 
				content_dict = {}
				fields = block_type.objects.get(type_name=x).fields.split()
				for field in fields:
					content_dict[field] = content_arr
				content_dict=str(content_dict)
				block(content=content_dict, owner_site= name, block_type=x).save()

			newsite = site(name=name,elements=elem_string, owner = current_user, active=True)
			newsite.save()
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