var request = require('request');
var async = require('async');
var methodOverride = require('method-override');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

var apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "";
}

// error handling function
var _showError = function (req, res, status) {
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


/*module.exports.chats = (function (req, res) {
    res.render('dashboard/chat', {title: 'Emploi1Pro | Chat', });
    //res.render('dashboard/chat.html', {title: 'Emploi1Pro | Chat', });
});*/
//conversation render page
var renderChatPage = function (req, res, devis) {
    if (!req.user) return res.redirect('/login');
    //else if (req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    return res.render('dashboard/chat', {
        title: 'Emploi1Pro | Chat',
        devis: devis
    });
};

module.exports.chats = (function (req, res) {
    var requestOptions, path;
    path = '/api/devis/' + req.params.id_devis;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
        //qs : {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            renderChatPage(req, res, body);
        }
    );
});

/*module.exports.negoNotif = (function (req, res) {
    var requestOptions, path, postData;
    path = '/api/notif/negoDevis/' + req.params.id_devis;
    postData = {
        sender: req.body.sender,
        //devis_id: req.body.devis_id,
        devis_nego: 'true',
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
        //qs : {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if (err) {
                console.log(err);
                console.log("chat.controller");
                console.log(postData);
                return err;
            }
            if (response.statusCode === 201) {
                console.log("ça marche");
                res.redirect(req.originalUrl);
            }
            else {
                _showError(req, res, response.statusCode);
            }
            
        }
    );
});*/


/*module.exports.saveconv = (function (req, res) {
    var requestOptions, path, postData;
    path = '/api/conversation/save';
    postData = {
        author: req.body.user_id,
        id_devis: req.body.devis_id,
        message: req.body.message
    };
    console.log(postData);
    /*requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/dashboard/demands/u/' + req.params.id_user);
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    );*/
//});