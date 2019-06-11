/**
 * Created by nokamojd on 11/07/2016.
 */
var nodemailer = require('nodemailer');
var request = require('request');

var apiOptions = {
    server: "http://localhost:5000"
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://thawing-fjord-87586.herokuapp.com";
}

// error handling function
var _showError = function(req, res, status) {
    var errTitle, content;
    if (status === 404) {
        errTitle = "404, page not found";
        content = "Oh dear. Looks like we can't find this page. Sorry.";
    } else {
        errTitle = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong.";
    }
    res.status(status);
    res.render('index', {
        errTitle: errTitle,
        content: content
    });
};

// Accueil controller routed to the home page
module.exports.accueil = (function(req, res) {
    res.render('accueil', { title: 'Emploi1Pro | Trouvez le pro sur mesure' });
});

// help controller routed to the help page
module.exports.help = (function(req, res) {
    res.render('index', { title: 'Emploi1Pro | Aide' });
});

// mention controller routed to the mention page
module.exports.mention = (function(req, res) {
    res.render('mention', { title: 'Emploi1Pro | Mentions légales' });
});

// confidentialite controller routed to the mention page
module.exports.confidentialite = (function(req, res) {
    res.render('confidentialite', { title: 'Emploi1Pro | Confidentialité' });
});

// termes controller routed to the mention page
module.exports.termes = (function(req, res) {
    res.render('termes', { title: 'Emploi1Pro | Termes et conditions' });
});

// cookies controller routed to the mention page
module.exports.cookies = (function(req, res) {
    res.render('cookies', { title: 'Emploi1Pro | Cookies' });
});

// contacter controller routed to the mention page
module.exports.contacter = (function(req, res) {
    res.render('contacter', { title: 'Emploi1Pro | Nous contacter' });
});

module.exports.envoiMail = (function(req, res) {
    var mailOpts, smtpTrans;
    //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
    smtpTrans = nodemailer.createTransport('SMTP', {
        service: 'mail.gandi.net',
        auth: {
            user: "news@aprentiv.com",
            pass: "Asus75002"
        }
    });
    //Mail options
    mailOpts = {
        from: req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
        to: 'winny.dev@gmail.com',
        subject: 'Test contact form',
        text: req.body.message
    };
    smtpTrans.sendMail(mailOpts, function(error, response) {
        //Email not sent
        if (error) {
            res.render('envoiMail', { title: 'Nous contacter', msg: 'Erreur envoie.', err: true });
        }
        //Yay!! Email sent
        else {
            res.render('envoiMail', { title: 'Nous contacter', msg: 'Message envoyé! Merci.', err: false });
        }
    });
});


// A propos controller routed to the mention page
module.exports.propos = (function(req, res) {
    res.render('propos', { title: 'Emploi1Pro | A propos' });
});

// Presse controller routed to the mention page
module.exports.presse = (function(req, res) {
    res.render('presse', { title: 'Emploi1Pro | Presse' });
});

// Accueil controller routed to the home page
module.exports.denied = (function(req, res) {
    res.render('denied-access', {
        title: 'Emploi1Pro | Denied Access',
        content: 'Oups! Vous n\'avez pas le droit d\'accéder à cette page. Veuillez retourner sur '
    });
});

module.exports.dashHomePage = (function(req, res) {
    if (!req.user) return res.redirect('/login');
    var requestOptions, path;
    path = '/api/data';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 200) {
                res.render('dashboard/dashboard-home', {
                    title: 'Emploi1Pro | Dashboard',
                    Data: body
                });
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
});