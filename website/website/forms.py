from ..cartridge.shop.payment.paypal import COUNTRIES

from django import forms

from ..cartridge.shop.forms import OrderForm


class MyOrderForm(OrderForm):
    def __init__(self, *args, **kwargs):
        super(OrderForm, self).__init__(*args, **kwargs)
        billing_country = forms.Select(choices=COUNTRIES)
        shipping_country = forms.Select(choices=COUNTRIES)
        self.fields['billing_detail_country'].widget = billing_country
        self.fields['shipping_detail_country'].widget = shipping_country