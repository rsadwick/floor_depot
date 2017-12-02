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
    initCalculator(container);
    initVariant(container);
});

function initCalculator(container){

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

        coverage.on('input blur keyup', function(){
            price = HWFD.getCurrentVariantPrice(variationPrices);
            quantity.val(HWFD.getBundleFromSqft(quantity.val(), price.data('sqft'), coverage.val()));
            totalPrice.text(HWFD.getTotalPrice(quantity.val(), price.data('price'), price.data('sqft')));
        });

        quantity.on('input blur keyup', function(){
            price = HWFD.getCurrentVariantPrice(variationPrices);
            coverage.val(HWFD.getSqftFromBundle(quantity.val(), price.data('sqft')));
            totalPrice.text(HWFD.getTotalPrice(quantity.val(), price.data('price'), price.data('sqft')));
        });

        widthOption.on('blur change input', function(){
            price = HWFD.getCurrentVariantPrice(variationPrices);
            totalPrice.text(HWFD.getTotalPrice(quantity.val(), price.data('price'), price.data('sqft')));
        });
    }
}

function initVariant(container){
    var variant = decodeURIComponent(getQueryVariable('width'));
    if(!variant){
        return false;
    }

    var option = container.find('#id_option1');
    option.val(variant).change();


    function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }

}
