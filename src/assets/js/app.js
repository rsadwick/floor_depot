$(document).foundation();
var url = "https://script.google.com/macros/s/AKfycbyd5AcbAnWi2Yn0xhFRbyzS4qMq1VucMVgVvhul5XqS9HkAyJY/exec?tz=America/New_York";

$(document).ready(function () {
    var map = $('#map');
    var overlay = $('#overlay');
    map.addClass('scrolloff');                // set the mouse events to none when doc is ready

    overlay.on("mouseup", function () {          // lock it when mouse up
        map.addClass('scrolloff');
        //somehow the mouseup event doesn't get call...
    });
    overlay.on("mousedown", function () {        // when mouse down, set the mouse events free
        map.removeClass('scrolloff');
    });

    map.mouseleave(function () {              // becuase the mouse up doesn't work...
        map.addClass('scrolloff');            // set the pointer events to none when mouse leaves the map area
        // or you can do it on some other event
    });

    $('.gallery').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
    getDateTime();

});

function setCountdown(data) {
    var countdown = new Countdown({
        selector: '.timer-for-registration',
        msgBefore: "Registration ends soon",
        msgAfter: "Registration is closed!",
        msgPattern: "{days} days : {hours} hours : {minutes} minutes : {seconds} seconds",
        dateStart: new Date(data.fulldate),
        dateEnd: new Date('5/01/2017 23:00:00')
    });
}

function getDateTime() {
    $.ajax
    (
        url,
        {
            cache: false,
            type: 'GET',
            context: this,
            dataType: 'json',
            success: function (data, status, xhr) {
                setCountdown(data);
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        }
    );
}



