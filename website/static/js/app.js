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


$(document).ready(function () {
    var container = $('.shop-template');

    var price = container.find('.price');
    var quantity = container.find('#id_quantity');
    var coverage = container.find('#id_square_foot_per_bundle');
    var totalPrice = container.find('.total-price');

    quantity.on('input blur keypress', function(){
        coverage.val(HWFD.getSqftFromBundle(quantity.val(), price.data('sqft')));
        quantity.val(HWFD.getBundleFromSqft(quantity.val(), price.data('sqft'), coverage.val()));
        totalPrice.text(HWFD.getTotalPrice(quantity.val(), price.data('price'), price.data('sqft')))
    });

    coverage.on('blur', function(){
        quantity.val(HWFD.getBundleFromSqft(quantity.val(), price.data('sqft'), coverage.val()));
        coverage.val(HWFD.getSqftFromBundle(quantity.val(), price.data('sqft')));
        totalPrice.text(HWFD.getTotalPrice(quantity.val(), price.data('price'), price.data('sqft')))
    });
});

