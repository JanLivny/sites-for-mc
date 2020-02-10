class RawUserForm(forms.Form):
	email = forms.CharField()
	password = forms.CharField()
	password_repeat = forms.CharField()