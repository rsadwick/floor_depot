var variations=[{"sku":"2_25SLTRO","image_id":26,"option2":null,"square_foot_per_bundle":19.5,"option1":"2 1/4 inch"},{"sku":"3_25SLTRO","image_id":26,"option2":null,"square_foot_per_bundle":19.0,"option1":"3 1/4 inch"},{"sku":"8_SLTRO","image_id":26,"option2":null,"square_foot_per_bundle":19.5,"option1":"8 inch"},{"sku":"5_SLTRO","image_id":26,"option2":null,"square_foot_per_bundle":17.5,"option1":"5 inch"},{"sku":"6_SLTRO","image_id":26,"option2":null,"square_foot_per_bundle":21.0,"option1":"6 inch"},{"sku":"7_SLTRO","image_id":26,"option2":null,"square_foot_per_bundle":24.0,"option1":"7 inch"},{"sku":"4_SLTRO","image_id":26,"option2":null,"square_foot_per_bundle":18.5,"option1":"4 inch"}];;(function($){$(function(){var selections=$('#add-cart select');var showImage=function(id){var image=$(id);if(image.length==1){$('#product-images-large li').hide();image.show();}};selections.change(function(){var variation=$.grep(variations,function(v){var valid=true;$.each(selections,function(){valid=valid&&v[this.name]==this[this.selectedIndex].value;});return valid;});if(variation.length==1){$('#variations li').hide();$('#variation-'+variation[0].sku).show();showImage('#image-'+variation[0].image_id+'-large');}});selections.change();$('#product-images-thumb a').click(function(){showImage('#'+$(this).attr('id')+'-large');return false;});});})(jQuery);var HWFD={};HWFD.getSqftFromBundle=function(quantity,sqftPerBundle){return Number(quantity*sqftPerBundle).toFixed(2);}
HWFD.getBundleFromSqft=function(quantity,sqftPerBundle,sqftCoverage){var totalBundles=parseFloat(sqftCoverage)/parseFloat(sqftPerBundle);return Math.ceil(totalBundles).toString();}
HWFD.getTotalPrice=function(quantity,price,sqftPerBundle){var newPrice=quantity*price*sqftPerBundle
return newPrice.toLocaleString('en-US',{style:"currency",currency:"USD"});}
HWFD.getCurrentVariantPrice=function(variants){var price=null;variants.each(function(){if($(this).is(':visible')){price=$(this).find('.price');}});return price;}
$(document).ready(function(){var container=$('.shop-template');var variationPrices=container.find('#variations li');if(variationPrices){var price=null;var quantity=container.find('#id_quantity');var coverage=container.find('#id_square_foot_per_bundle');var totalPrice=container.find('.total-price');var widthOption=container.find('select');if(totalPrice){price=HWFD.getCurrentVariantPrice(variationPrices);totalPrice.text(HWFD.getTotalPrice(quantity.val(),price.data('price'),price.data('sqft')));}
quantity.on('input blur keypress',function(){price=HWFD.getCurrentVariantPrice(variationPrices);coverage.val(HWFD.getSqftFromBundle(quantity.val(),price.data('sqft')));totalPrice.text(HWFD.getTotalPrice(quantity.val(),price.data('price'),price.data('sqft')));});coverage.on('blur',function(){price=HWFD.getCurrentVariantPrice(variationPrices);quantity.val(HWFD.getBundleFromSqft(quantity.val(),price.data('sqft'),coverage.val()));coverage.val(HWFD.getSqftFromBundle(quantity.val(),price.data('sqft')));totalPrice.text(HWFD.getTotalPrice(quantity.val(),price.data('price'),price.data('sqft')));});widthOption.on('blur change input',function(){price=HWFD.getCurrentVariantPrice(variationPrices);totalPrice.text(HWFD.getTotalPrice(quantity.val(),price.data('price'),price.data('sqft')));});}});