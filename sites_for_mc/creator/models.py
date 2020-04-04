from django.db import models

# Create your models here.

class site(models.Model):
	name = models.CharField(max_length=30)
	elements = models.CharField(max_length=150)

# class block_type(models.Model)
# 	block_type_Id = models.IntegerField()
# 	block_name = Name = models.CharField(max_length=120)

# class block()