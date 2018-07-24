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
var renderFieldsPage = function (req, res, responseBody) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    res.render('dashboard/fields-form', {
        title: 'Domaines d\'activité | Emploi1pro',
        fields: responseBody
    });
};

// Get all fields controller
module.exports.allfields = (function (req, res) {
    var requestOptions, path;
    path = '/api/fields';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderFieldsPage(req, res, body);
        }
    );

});

// add field renderer function for test
var renderFieldDetail = function (req, res, responseBody) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
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


// add field renderer function for test
var renderNewFieldForm = function (req, res, responseBody) {
    res.render('dashboard/test-form', {
        title: 'Domaines d\'activité | Emploi1pro'
    });
};

module.exports.newField = (function (req, res) {
    renderNewFieldForm(req, res);
});

// Create a field Controller method
module.exports.addField = (function (req, res) {
    var requestOptions, path, postData;
    path='/api/fields';
    postData = {
        fieldname: req.body.fieldname,
        fieldslug: req.body.fieldslug
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
                res.redirect('fields');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// Update a field controller method
module.exports.updateField = (function (req, res) {
    var requestOptions, path, putData;

    path='/api/fields/'+ req.params.idfield;
    putData = {
        fieldname: req.body.fieldname,
        fieldslug: req.body.fieldslug
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
                res.redirect('/dashboard/fields');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// Delete a field controller method
module.exports.deleteField = (function (req, res) {
    var requestOptions, path;
    path='/api/fields/'+ req.params.idfield;
    requestOptions = {
        url: apiOptions.server + path,
        method:"DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 204) {
                res.redirect('/dashboard/fields');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});