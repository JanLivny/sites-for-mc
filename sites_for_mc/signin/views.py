from django.shortcuts import render,redirect
from django.http import HttpResponse
from .forms import RawUserForm
from django.contrib.auth.models import User
from django import forms
from django.contrib import messages

def home_view(request, *args, **kwargs):

	form = RawUserForm()
	my_context ={
		"form":form,
		'message': ' '
	}
	if request.method == "POST":
		form = RawUserForm(request.POST)

		if form.is_valid():
			cleanForm = form.cleaned_data
			if cleanForm['password'] != cleanForm['password_repeat']:
				my_context['message'] = 'Passwords must match'
			else:
				user = User.objects.create_user(cleanForm['email'],cleanForm['email'], cleanForm['password'])
				user.save()
				return redirect('authed/')
	

	return render(request,'home.html',my_context)

def authed_view(request, *args, **kwargs):
	my_context ={
	}
	return render(request,'authed.html',my_context)