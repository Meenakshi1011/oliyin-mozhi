# Generated by Django 5.1.1 on 2025-06-25 05:02

import ckeditor.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_userprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='description',
            field=ckeditor.fields.RichTextField(default="Hey there! I'm new here 😊"),
        ),
    ]
