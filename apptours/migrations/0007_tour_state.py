# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2017-06-28 06:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apptours', '0006_auto_20170606_0546'),
    ]

    operations = [
        migrations.AddField(
            model_name='tour',
            name='state',
            field=models.CharField(default='complete', max_length=10),
        ),
    ]
