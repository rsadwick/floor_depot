from django.db import models


class Log(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    email = models.CharField(max_length=300, blank=True, default='', null=True)
    name = models.CharField(max_length=100, blank=True, default='', null=True)
    phone = models.CharField(max_length=32, blank=True, default='', null=True)
    stacktrace = models.CharField(max_length=5000, blank=True, default='', null=True)
    SHIPPING_WEIGHT = 1
    ORDER = 2
    ABANDON = 3
    SHIPPING_ERROR = 4
    ERROR_CHOICES = (
        (SHIPPING_WEIGHT, 'Shipping Weight'),
        (ORDER, 'Order'),
        (ABANDON, 'Abadon'),
        (SHIPPING_ERROR, 'Shipping Error'),
    )
    error_type = models.IntegerField(choices=ERROR_CHOICES, default=SHIPPING_WEIGHT)

    def __unicode__(self):
        return self.name