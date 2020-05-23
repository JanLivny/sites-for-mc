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

class site_data_table(models.Model):
	owner_site = models.CharField(max_length=30)
	real_name = models.CharField(max_length=30)
	adress = models.URLField(max_length=200)
	date_created = models.CharField(max_length=20)
	owner = models.TextField()
	views = models.IntegerField()

class image(models.Model):
	tag = models.CharField(max_length=30)
	image = models.ImageField(max_length=30)