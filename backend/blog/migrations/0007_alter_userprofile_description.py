# Generated by Django 5.1.1 on 2025-06-25 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0006_alter_userprofile_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='description',
            field=models.TextField(default="Hey there! I'm new here"),
        ),
    ]
