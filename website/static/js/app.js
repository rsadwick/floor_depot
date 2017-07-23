var HWFD = {};
HWFD.getSqftFromBundle = function(quantity, sqftPerBundle){
    return Number(quantity * sqftPerBundle).toFixed(2);
}

HWFD.getBundleFromSqft = function(quantity, sqftPerBundle, sqftCoverage){
    var totalBundles = parseFloat(sqftCoverage) / parseFloat(sqftPerBundle);
    return Math.ceil(totalBundles).toString();
}

HWFD.getTotalPrice = function(quantity, price, sqftPerBundle){
    var newPrice = quantity * price * sqftPerBundle
    return newPrice.toLocaleString('en-US',{ style: "currency", currency: "USD" });
}

HWFD.getCurrentVariantPrice = function(variants){
    var price = null;
    variants.each(function(){
        if($(this).is(':visible')){
            price = $(this).find('.price');
        }
    });

    return price;
}


$(document).ready(function () {
    var container = $('.shop-template');

    var variationPrices = container.find('#variations li');
    if(variationPrices){
        var price = null;

        var quantity = container.find('#id_quantity');
        var coverage = container.find('#id_square_foot_per_bundle');
        var totalPrice = container.find('.total-price');
        var widthOption = container.find('select');

        if(totalPrice){
            price = HWFD.getCurrentVariantPrice(variationPrices);
            totalPrice.text(HWFD.getTotalPrice(quantity.val(), price.data('price'), price.data('sqft')));
        }

        quantity.on('input blur keypress', function(){
            price = HWFD.getCurrentVariantPrice(variationPrices);
            coverage.val(HWFD.getSqftFromBundle(quantity.val(), price.data('sqft')));
            quantity.val(HWFD.getBundleFromSqft(quantity.val(), price.data('sqft'), coverage.val()));
            totalPrice.text(HWFD.getTotalPrice(quantity.val(), price.data('price'), price.data('sqft')));
        });

        coverage.on('blur', function(){
            price = HWFD.getCurrentVariantPrice(variationPrices);
            quantity.val(HWFD.getBundleFromSqft(quantity.val(), price.data('sqft'), coverage.val()));
            coverage.val(HWFD.getSqftFromBundle(quantity.val(), price.data('sqft')));
            totalPrice.text(HWFD.getTotalPrice(quantity.val(), price.data('price'), price.data('sqft')));
        });

        widthOption.on('blur change input', function(){
            price = HWFD.getCurrentVariantPrice(variationPrices);
            totalPrice.text(HWFD.getTotalPrice(quantity.val(), price.data('price'), price.data('sqft')));
        });
    }
});

