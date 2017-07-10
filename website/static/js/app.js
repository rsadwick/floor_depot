var HWFD = {};
HWFD.getPrice = function(price, quantity){
    var newPrice = price * quantity;
    return newPrice.toLocaleString('en-US',{ style: "currency", currency: "USD" });
}

$(document).ready(function () {
    var container = $('.shop-template');

    var price = container.find('.price');
    var quantity = container.find('#id_quantity');
    var sqFt = ' / sq ft';

    quantity.on('input', function(){
        price.text(HWFD.getPrice(price.data('price'), quantity.val()) + sqFt);
    });


});

