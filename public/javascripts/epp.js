/**
 * Created by nokamojd on 21/07/2016.
 */
$(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 500);
                return false;
            }
        }
    });
});

/*
var appended = $('<div />').text("You're appendin'!");
appended.id = 'appended';
$('input:radio[name="priceHidden"]').change(
    function(){
        if ($(this).val() == '#{offer.bundle_price}') {
            $(appended).appendTo('');
        }
        else {
            $(appended).remove();
        }
    });*/
$(document).ready(function() {
        $('.modal-dialog').show();
    });




// ACCORDION
/* Toggle between adding and removing the "active" and "show" classes when the user clicks on one of the "Section" buttons. The "active" class is used to add a background color to the current button when its belonging panel is open. The "show" class is used to open the specific accordion panel */
var accordion = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < accordion.length; i++) {
    accordion[i].onclick = function(){
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
    }
}

/********* MENU SLIDES ********************************/

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mb-sidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mb-sidenav").style.width = "0";
}

/* Set the width of the side navigation to 250px */
function openSearch() {
    document.getElementById("mb-sideform").style.width = "100%";
}

/* Set the width of the side navigation to 0 */
function closeSearch() {
    document.getElementById("mb-sideform").style.width = "0";
}
// supression du devis
$('.test').on('click', function (event) {
    event.preventDefault(); // prevent form submit
    var form = event.target.form; // storing the form
    swal({
        title: "Etes-vous sûr?",
        text: "Cette action est irréversible!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        html: true
    }, function (getAction) {
        if (getAction.value === 'true') {
            form.submit();
            swal("Suppression du devis", {
                icon: "success",
                html: true
            });
        } else {
            swal("Annulation");
        }
    });
})
            /*.then((willDelete) => {
                if (willDelete) {
                    form.submit();
                    swal("Suppression du devis", {
                        icon: "success",
                        html: true
                    });
                } else {
                    swal("Annulation");
                }
            });*/
    //});
//})

/*
(function() {
    var nav = document.getElementById('nav'),
        anchor = nav.getElementsByTagName('a'),
        current = window.location.pathname.split('/')[1];
    for (var i = 0; i < anchor.length; i++) {
        if(anchor[i].href == current) {
            anchor[i].className = "active";
        }
    }
})();*/

/******** SCROLL TO TOP **************/
/**************************************/

$(document).ready(function(){

    //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > 200) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').click(function(){
        $('html, body').animate({scrollTop : 0},500);
        return false;
    });
    $('.scrollToTop').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
        return false;
    });


    /************** STICKY MENU ***************************/

    //var offset = $(".main-header").offset().top;
    $(document).scroll(function(){
        var scrollTop = $(document).scrollTop();
        if(scrollTop > 250){
            $(".sticky").fadeIn(500);
        }
        else {
            $(".sticky").fadeOut();
        }
    });

    /************ STICKY SIDEBAR **************************/
    $(document).scroll(function(){
        var scrollTop = $(document).scrollTop();
        if(scrollTop > 250){
            $(".sidebar-sticky").fadeIn(500);
        }
    });
    /************** CALCUL POUR LE DEVIS ******************/


    /************* MENU ACTIVE LINKS **********************/

    /************* SIDE BAR ACCORDION MENU *****************/

    var accordionsMenu = $('.side-menu-accordion');

    if( accordionsMenu.length > 0 ) {
        accordionsMenu.each(function(){
            var accordion = $(this);
            //detect change in the input[type="checkbox"] value
            accordion.on('change', 'input[type="checkbox"]', function(){
                var checkbox = $(this);
                console.log(checkbox.prop('checked'));
                ( checkbox.prop('checked') ) ? checkbox.siblings('ul').attr('style', 'display:none;').slideDown(300) : checkbox.siblings('ul').attr('style', 'display:block;').slideUp(300);
            });
        });
    }

    /*************** DATA TABLES ****************************/
    $('#field-dt').DataTable({
        responsive: true
    });

    /*************** Phone inputs ***************************/
    $(".phone").intlTelInput();$(".phone").intlTelInput({
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        utilsScript: "javascripts/utils.js" // just for formatting/placeholders etc
    });


    /**************** Multiple Select *******************/
    $(".multiple-sel").select2();

    /*************** LOCATIONS ***************************/

    //$('.location').geocomplete();  // Option 1: Call on element.
    //$.fn.geocomplete('.location'); // Option 2: Pass element as argument.


    /*********** Cart Quantity Increment *****************/
    /*$(document).on('click', '#plus', function (e) {
        e.preventDefault();
        var price = parseFloat($('#price').val());
        var quantity = parseInt($('#quantity').val());

        price += parseFloat($('#priceHidden').val());
        quantity += 1;

        $('#quantity').val(quantity);
        $('#price').val(price.toFixed(2));
        $('#total_quantity').html(quantity);
    });*/
});

