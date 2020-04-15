from django.db import models

# Create your models here.

class site(models.Model):
	name = models.CharField(max_length=30)
	elements = models.TextField()
	owner = models.TextField()
	active = models.BooleanField()

class block_type(models.Model):
	primary = models.BooleanField()
	type_name = models.CharField(max_length=30)
	template = models.TextField()
	fields = models.TextField()   
	
class block(models.Model):                                                                                                                                                                                                                                                                                                                                  
	content = models.TextField()
	owner_site = models.CharField(max_length=30)
	block_type = models.CharField(max_length=30)