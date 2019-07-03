//CLICK SUR LA CLOCHE NOTIF
/*$(document).on('click',function () {
    $('[data-toggle="popoverNotif"]').popover('show');
});*/
function menu() {
    var id_user = $("input[name=id_user]").val();
    ajaxGet(id_user);
    /*$(document).ready(function () {
        $('[data-toggle="popover"]').popover();
    });*/
    //document.getElementById("myDropdown").classList.toggle("show");
}

//AFFICHAGE DES NOTIFICATIONS
function ajaxGet(id_user) {
    $.ajax({
        type: "GET",
        url: "/api/notif/show/" + id_user,
        success: function(result) {
            $('#myDropdown ul').empty();
            $.each(result, function(i, notification) {
                //console.log(notification.devis._id);
                if (!notification.lu) {
                    if (notification.modif.devis_nego) {
                        $('#myDropdown .menu').append('<li class="a"><div><a class="dropdown-item" href="/dashboard/conversations/' + notification.devis._id + '">Négociation de devis</a></div></li>');
                    }
                    if (notification.modif.new_devis) {
                        $('#myDropdown .menu').append('<li class="a"><div><a class="dropdown-item" href="/dashboard/devis/' + notification.devis._id + '">Nouveau devis</a></div></li>');
                    }
                    /*if (notification.) {
                        if (notification.modif.avis) {
                            $('#myDropdown .menu').append('<li class="a"><div><a href="/dashboard/">Vous avez reéu un avis sur une offre</a></div></li>') // attendre l'approbation du moderateur pour l'avis                        }
                    }*/
                }
            });
            //console.log("Success: ", result);
        },
        error: function(e) {
            $("#myDropdown").html("<strong>Auncune notification</strong>");
            console.log("ERROR: ", e);
        }
    });
}




//NOTIFICATION NOUVEAU AVIS
$(".new_avis").submit(function(event) { //quand on clique sur accepter dans la discussion (chat)
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    new_avis();
    this.submit();
});

function new_avis() {
    // PREPARE FORM DATA
    var formData = {
        sender: $("input[name=reviewAuthor]").val(),
        offer_id: $("input[name=reviewedOffer]").val(),
        avis: 'true',
    };
    //console.log(formData);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/notif/avis",
        data: JSON.stringify(formData),
        dataType: 'json',

    });
}

//NOTIFICATION NOUVEAU DEVIS
$(".new_devis").submit(function(event) { //quand on clique sur accepter dans la discussion (chat)
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    new_devis();
    this.submit();
});

function new_devis() {
    // PREPARE FORM DATA
    var formData = {
        sender: $("input[name=devis_authr]").val(),
        demand_id: $("input[name=reference]").val(),
        new_devis: 'true',
    };
    //console.log(formData);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/notif/newDevis",
        data: JSON.stringify(formData),
        dataType: 'json',

    });
}

function luhn10Verif(num) {
    var i, k, c, d;
    var res = "";
    var e = 0;
    for (i = 0; i < num.length; i++) {
        if (i % 2 == 0) {
            res += num[i];
        } else {
            if ((0 <= 2 * parseInt(num[i])) && (2 * parseInt(num[i]) <= 9)) {
                res += (2 * parseInt(num[i])).toString();
            } else {
                c = (2 * parseInt(num[i])).toString();
                d = (parseInt(c[0]) + parseInt(c[1])).toString();
                //console.log(d);
                res += d;
            }
        }
    }
    for (k = 0; k < res.length; k++) {
        e = e + parseInt(res[k]);
    }
    if (e % 10 == 0) {
        console.log("Carte valide");
    } else {
        console.log(res);
        console.log("Carte invalide");
    }
}
//notification Carte bancaire
//Enregistrer une carte bancaire
$('.registerCard').submit(function(event) {
    event.preventDefault();
    var formData = {
        num_card: $("input[name=card_num]").val(),
        titulaire: $("input[name=card_owner]").val(),
        exp_date: $("input[name=month_exp]").val() + "/" + $("input[name=year_exp]").val(),
        cvc: $("input[name=cvc]").val(),
    };
    var card_num = $("input[name=card_num]").val();
    if (formData.num_card[0] == "4") {
        luhn10Verif(formData.card_num); //modifier le code
    }

    //console.log(formData);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/api/pay/cardRegistered/' + $("input[name=user]").val(),
        data: JSON.stringify(formData),
        dataType: 'json',
        success: function(result) {
            swal("Card Registered", "", "success");
            window.location.reload();
            //console.log("Success");

        },
        error: function(e) {
            console.log("error:" + e);
        }
    });

    //this.submit();
});
$('.pay').submit(function(event) {
    event.preventDefault();
    var formData = {
        num_card: $("input[name=card_num]").val(),
        titulaire: $("input[name=card_owner]").val(),
        exp_date: $("input[name=month_exp]").val() + "/" + $("input[name=year_exp]").val(),
        cvc: $("input[name=cvc]").val(),
    };
    var card_num = $("input[name=card_num]").val();
    if (formData.num_card[0] == "4") {
        luhn10Verif(formData.card_num); //modifier le code
    }

    //console.log(formData);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/api/pay/cardRegistered/' + $("input[name=user]").val(),
        data: JSON.stringify(formData),
        dataType: 'json',
        success: function(result) {
            swal("Card Registered", "", "success");
            window.location.reload();
            //console.log("Success");

        },
        error: function(e) {
            console.log("error:" + e);
        }
    });

    //this.submit();
});

function deleteCard(card_id) {
    var formData = {
        id_card: card_id,
    };
    //console.log(formData.id_card);
    swal({
            title: "étes-vous sér?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    type: "DELETE",
                    contentType: "application/json",
                    url: '/api/pay/cardRegistered/' + $("input[name=user]").val(),
                    data: JSON.stringify(formData),
                    dataType: 'json',
                    success: function(result) {
                        swal("Card Registered", "", "success");
                        window.location.reload();
                        //console.log("Success");

                    },
                    error: function(e) {
                        console.log("error:" + e);
                    }
                });
                swal("Card deleted", {
                    icon: "success",
                });
            } else {
                swal("Annulation ok");
            }
        });
    //alert("Are you sure?");
}
$('.validerInfo').submit(function(event) {
    event.preventDefault();
    if (!$("input[name=id_card]:checked").val()) {
        $('#error').empty();
        $('#error').css('display', 'block');
        $('#error').append('<p>Choisir une carte</p>');
    } else {
        this.submit();
    }
});