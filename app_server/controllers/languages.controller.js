/**
 * Created by nokamojd on 26/08/2016.
 */
/**
 * Created by nokamojd on 26/07/2016.
 */
var request = require('request');
var methodOverride = require('method-override');


var apiOptions = {
    server: "http://localhost:5000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://thawing-fjord-87586.herokuapp.com";
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
        errTitle : errTitle,
        content : content
    });
};


// fields page list renderer function
var renderLanguagesPage = function (req, res, responseBody) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    res.render('dashboard/languages-form', {
        title: 'Langues | Emploi1pro',
        languages: responseBody
    });
};

// Get all languages controller
module.exports.allLanguages = (function (req, res) {
    var requestOptions, path;
    path = '/api/languages';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderLanguagesPage(req, res, body);
        }
    );

});

/*
// add field renderer function for test
var renderFieldDetail = function (req, res, responseBody) {
    res.render('dashboard/test-details', {
        title: 'Domaines d\'activité | Emploi1pro',
        field: responseBody
    });
};
// Get one field controller
module.exports.getOneField = function (req, res) {
    var requestOptions, path;
    path = '/api/fields/'+ req.params.idfield;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions,
        function(err, response, body){
            renderFieldDetail(req, res, body);
        }
    );
};


// add language renderer function for test
var renderNewLanguageForm = function (req, res, responseBody) {
    res.render('dashboard/test-form', {
        title: 'Domaines d\'activité | Emploi1pro'
    });
};

module.exports.newLanguage = (function (req, res) {
    renderNewLanguageForm(req, res);
});
*/

// Create a Language Controller method
module.exports.addLanguage = (function (req, res) {
    var requestOptions, path, postData;
    path='/api/languages';
    postData = {
        language_lab: req.body.language
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"POST",
        json: postData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 201) {
                res.redirect('languages');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// Update a field controller method
module.exports.updateLanguage = (function (req, res) {
    var requestOptions, path, putData;

    path='/api/languages/'+ req.params.id_language;
    putData = {
        language_lab: req.body.language
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"PUT",
        json: putData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 200) {
                res.redirect('/dashboard/languages');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// Delete a field controller method
module.exports.deleteLanguage = (function (req, res) {
    var requestOptions, path;
    path='/api/languages/'+ req.params.id_language;
    requestOptions = {
        url: apiOptions.server + path,
        method:"DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 204) {
                res.redirect('/dashboard/languages');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});