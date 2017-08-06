$(document).ready(function () {
    initVariant();
});


function initVariant(){
    var container = $('.shop-template');
    var activeCategory = slugify(container.find('.breadcrumb .active').text());

    var productUrls = container.find('.product-thumb a');

    productUrls.each(function(){
        $(this).attr('href', $(this).attr('href') + '?width=' + activeCategory)
    });

    function slugify(text){
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    }
}

