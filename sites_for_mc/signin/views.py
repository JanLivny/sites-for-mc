from django.shortcuts import render,redirect
from django.http import HttpResponse
from .forms import RawUserForm, RawsSignInForm
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django import forms
from django.contrib import messages

def home_view(request, *args, **kwargs):

	my_context ={
		'message': ' ',
		'message2': ' '
	}

	if request.method == "POST":
#SIGN IN

		if '_signIn' in request.POST:
			print('sign in pressed')
			signInForm = RawsSignInForm(request.POST)
			if signInForm.is_valid():
				print('sign in data valid')
				cleanForm = signInForm.cleaned_data
				new_user = authenticate(username=cleanForm['email'],password=cleanForm['password'],)
				if new_user is not None:
					login(request, new_user)
					print('logged')
					return redirect('dashboard/')
				else:
					my_context['message2'] = 'Wrong Username or Password'				
					print('login error')
			else:
				print('invalid data')

#SIGN UP
		elif '_signUp' in request.POST:
			form = RawUserForm(request.POST)
			if form.is_valid():
				cleanForm = form.cleaned_data
				if cleanForm['password'] != cleanForm['password_repeat']:
					my_context['message'] = 'Passwords must match'
				else:
					if User.objects.filter(email=cleanForm['email']).exists():
						my_context['message'] = 'Email already in use. Try to sign in.'
					else:
						user = User.objects.create_user(cleanForm['email'],cleanForm['email'], cleanForm['password'])
						user.save()
						new_user = authenticate(username=cleanForm['email'],password=cleanForm['password'])
						login(request, new_user)
						return redirect('dashboard/')


	return render(request,'home.html',my_context)

