from django.shortcuts import render
import json
import ast

# Create your views here.

def block_creator_view(request, *args, **kwargs):
	my_context = {}

	if request.method == "POST":
		post_data = request.POST
		print(post_data)
		if 'blockData' in post_data:
			block_data = ast.literal_eval(post_data.getlist('blockData')[0])
			print(block_data)

	return render(request,'block_creator.html',my_context)