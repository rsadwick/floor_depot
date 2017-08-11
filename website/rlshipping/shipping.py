from mezzanine.conf import settings
from cartridge.shop.models import Order
from cartridge.shop.utils import set_shipping, set_tax, sign
from suds.client import Client
from suds.plugin import MessagePlugin
from cartridge.shop.models import Product
from decimal import Decimal, ROUND_HALF_UP
from cartridge.shop.checkout import CheckoutError
from suds.sudsobject import asdict

from logger.logger import Logger


class LogPlugin(MessagePlugin):
    def sending(self, context):
        print(str(context.envelope))

    def received(self, context):
        print(str(context.reply))


def billship_handler(request, order_form):
    url = "http://api.rlcarriers.com/1.0.2/RateQuoteService.asmx?WSDL"
    key = settings.RL_SHIPPING_KEY
    phone_number = settings.COMPANY_PHONE

    try:
        client = Client(url, plugins=[LogPlugin()])
    except Exception as e:
        raise CheckoutError(
            'There was a problem with the shipping rate.  Please contact us to complete your order at ' + phone_number)

    shipping_request = client.factory.create('RateQuoteRequest')
    shipping_request.CustomerData = 'Ryan Tester'
    shipping_request.QuoteType = 'Domestic'
    shipping_request.CODAmount = 0.00

    service_point_origin = client.factory.create('ServicePoint')
    service_point_origin.City = 'Burns'
    service_point_origin.StateOrProvince = 'TN'
    service_point_origin.ZipOrPostalCode = '37029'
    service_point_origin.CountryCode = 'USA'

    if order_form == None:
        return False

    service_point_dest = client.factory.create('ServicePoint')
    service_point_dest.City = order_form.cleaned_data['shipping_detail_city']
    service_point_dest.StateOrProvince = order_form.cleaned_data['shipping_detail_state']
    service_point_dest.ZipOrPostalCode = order_form.cleaned_data['shipping_detail_postcode']
    service_point_dest.CountryCode = 'USA'

    shipping_request.Origin = service_point_origin
    shipping_request.Destination = service_point_dest

    #get weight of all products in cart
    weight = 0
    account_class = 55.0
    items = client.factory.create('ArrayOfItem')

    for item in request.cart:
        products = Product.objects.filter(sku=item.sku)
        for product in products:
            weight += float(product.weight)
            Logger(2, 'title: ' + product.title + '-' + ' height: ' + product.weight + ' sku: ' + item.sku, order_form.cleaned_data['billing_detail_first_name'],
                   order_form.cleaned_data['billing_detail_email'],
                   order_form.cleaned_data['billing_detail_phone'])
        weight = weight * item.quantity
        item = client.factory.create('Item')
        item.Class = account_class
        item.Weight = weight
        item.Width = 0
        item.Height = 0
        item.Length = 0

        Logger(1, weight, order_form.cleaned_data['billing_detail_first_name'],
               order_form.cleaned_data['billing_detail_email'],
               order_form.cleaned_data['billing_detail_phone'])

        items.Item.append(item)

    shipping_request.Items = items

    shipping_request.DeclaredValue = 1.0
    shipping_request.OverDimensionPcs = 0

    accessorials = client.factory.create('ArrayOfAccessorial')

    destination_option = order_form.cleaned_data['destination_options']
    accessorial = 'ResidentialDelivery'
    if destination_option == 2:
        accessorial = None

    accessorials.Accessorial = [accessorial]
    shipping_request.Accessorials = accessorials

    result = client.service.GetRateQuote(key, shipping_request)
    if not result.WasSuccess:
        errors = recursive_dict(result)
        Logger(4, shipping_request, order_form.cleaned_data['billing_detail_first_name'],
               order_form.cleaned_data['billing_detail_email'],
               order_form.cleaned_data['billing_detail_phone'])
        raise CheckoutError(errors['Messages']['string'])

    if destination_option == 2:
        address = client.factory.create('ServicePoint')
        address.Address1 = result.Result.DestinationServiceCenter.Address1
        address.City = result.Result.DestinationServiceCenter.City
        address.State = result.Result.DestinationServiceCenter.State
        address.ZipCode = result.Result.DestinationServiceCenter.ZipCode
        address.Phone = result.Result.DestinationServiceCenter.Phone

        if order_form.is_valid():
            order_form = order_form.replace_shipping_address(address)

    handling_percentage = 0.05
    price = result.Result.ServiceLevels.ServiceLevel[0].NetCharge.strip('$')
    cents = float(price) * 100
    #add 5% on top
    cents += cents * handling_percentage
    dollars = cents / 100
    decimal_in_cents = Decimal('0.01')
    total_order = Decimal(dollars)
    grand_total = total_order.quantize(decimal_in_cents, ROUND_HALF_UP)

    if not request.session.get("free_shipping"):
        set_shipping(request, 'Shipping', grand_total)
        return order_form


def recursive_dict(d):
    out = {}
    for k, v in asdict(d).iteritems():
        if hasattr(v, '__keylist__'):
            out[k] = recursive_dict(v)
        elif isinstance(v, list):
            out[k] = []
            for item in v:
                if hasattr(item, '__keylist__'):
                    out[k].append(recursive_dict(item))
                else:
                    out[k].append(item)
        else:
            out[k] = v
    return out