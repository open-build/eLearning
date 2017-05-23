# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2017-05-10 13:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='created_by',
            field=models.CharField(default=b'OpenBuild Team', max_length=100, verbose_name=b'author'),
        ),
        migrations.AlterField(
            model_name='blogpost',
            name='title',
            field=models.CharField(max_length=300, verbose_name=b'Title'),
        ),
    ]
