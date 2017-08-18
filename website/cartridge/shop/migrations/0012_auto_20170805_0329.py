# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-08-05 03:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0011_auto_20170722_1557'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='destination_options',
            field=models.IntegerField(choices=[(1, 'Residential Address'), (2, 'Local Terminal Pickup')], default=1, verbose_name='Destination Options'),
        ),
        migrations.AlterField(
            model_name='order',
            name='billing_detail_city',
            field=models.CharField(max_length=100, verbose_name='City'),
        ),
        migrations.AlterField(
            model_name='order',
            name='billing_detail_postcode',
            field=models.CharField(max_length=10, verbose_name='Zipcode'),
        ),
        migrations.AlterField(
            model_name='order',
            name='billing_detail_state',
            field=models.CharField(max_length=100, verbose_name='State'),
        ),
        migrations.AlterField(
            model_name='order',
            name='shipping_detail_city',
            field=models.CharField(max_length=100, verbose_name='City'),
        ),
        migrations.AlterField(
            model_name='order',
            name='shipping_detail_postcode',
            field=models.CharField(max_length=10, verbose_name='Zipcode'),
        ),
        migrations.AlterField(
            model_name='order',
            name='shipping_detail_state',
            field=models.CharField(max_length=100, verbose_name='State'),
        ),
    ]