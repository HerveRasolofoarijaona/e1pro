/**
 * Created by nokamojd on 12/07/2016.
 */

var request = require('request');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
require('../../app_api/models/user.schema');
var User = mongoose.model('User');


var apiOptions = {
    server : "http://localhost:3000"
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
        errTitle : errTitle,
        content : content
    });
};



// User profile request
module.exports.userProfil = (function (req, res) {
    res.render('user-profile', {title: 'Username | Emploi1pro'});
});

// Users list page renderer
var renderUsersPage = function (req, res, usersAll) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    return res.render('dashboard/users-form', {
        title: 'Users | Emploi1pro',
        usersAll: usersAll
    })
};

// All users request
module.exports.allUsers = (function (req, res) {
    var requestOptions, path;
    path = '/api/users';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderUsersPage(req, res, body);
        }
    );
});

module.exports.addUser = (function (req, res) {
    /*var requestOptions, path, postData;
    path='/api/users';
    postData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
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
                res.redirect('users');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )*/
    var user = new User();
    user.first_name = req.body.firstName;
    user.last_name = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.user_role = req.body.role;
    user.company_name = req.body.businessName;
    user.qualification = req.body.position;
    user.profile_pic_path = user.gravatar(64);
    User.findOne({email: req.body.email}, function (err, existingUser) {
        if(existingUser){
            req.flash('errors', 'Cet email existe déjà.');
            return res.redirect('users');
        } else{
            user.save(function (err, user) {
                if(err) return next(err);

                return res.redirect('users');
            })
        }
    })
});


// User details renderer function
var renderUserDetail = function (req, res, userDetail) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    res.render('dashboard/user-details', {
        title: 'Emploi1pro',
        userSingle: userDetail
    });
};

module.exports.getOneUser = (function (req, res) {
    var requestOptions, path;
    path = '/api/users/'+ req.params.id_user;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions,
        function(err, response, body){
            renderUserDetail(req, res, body);
        }
    );
});


module.exports.updateUser = (function (req, res) {
    var requestOptions, path, putData;
    path='/api/users/'+ req.params.id_user;
    putData = {
       // firstName: req.body.first_name
        //lastName:
        //email:
        //role:
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
                res.redirect('/dashboard/users');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});

module.exports.deleteUser = (function (req, res) {
    var requestOptions, path;
    path='/api/users/'+ req.params.id_user;
    requestOptions = {
        url: apiOptions.server + path,
        method:"DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 204) {
                res.redirect('/dashboard/users');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// Get my profile
module.exports.getUserProfile = (function (req, res) {
    if(!req.user) return res.redirect('/login');
    ///else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64' && req.user.user_role!='57b2e3f36a0c14cc080d2f62') return res.redirect('/denied');
    res.render('dashboard/dashboard-profile', {
        title: 'Dashboard - Profil | Emploi1pro'
    });
});


// Get my profile
module.exports.getUserSettings = (function (req, res) {
    if(!req.user) return res.redirect('/login');
    ///else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64' && req.user.user_role!='57b2e3f36a0c14cc080d2f62') return res.redirect('/denied');
    res.render('dashboard/settings', {
        title: 'Dashboard - Settings | Emploi1pro'
    });
});

// user complete profile
module.exports.editPersonalDetails = (function (req, res) {
    var requestOptions, path, putData;
    path='/api/users/details/'+ req.params.id_user;
    putData = {
        birthDate: req.body.bday,
        gender: req.body.gender,
        addressLine1: req.body.address1,
        addressLine2: req.body.address2,
        userLocation: req.body.u_loc,
        mPhoneNumber: req.body.m_phone,
        hPhoneNumber: req.body.h_phone
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
                res.redirect('/dashboard/u/settings');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// user complete profile
module.exports.editUserBio = (function (req, res) {
    var requestOptions, path, putData;
    path='/api/users/bio/'+ req.params.id_user;
    putData = {
        companyName: req.body.business_name,
        bio: req.body.biography,
        uPosition: req.body.qualification
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
                res.redirect('/dashboard/u/settings');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// user complete profile
module.exports.editUserSkills = (function (req, res) {
    var requestOptions, path, putData;
    path='/api/users/skill/'+ req.params.id_user;
    putData = {
        userSkill: req.body.u_skill
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"POST",
        json: putData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 200) {
                res.redirect('/dashboard/u/settings');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


module.exports.deleteUserSkill = (function (req, res) {
    var requestOptions, path;
    path='/api/users/skills/'+ req.params.id_user+'/skill/'+ req.params.id_user_skill;
    requestOptions = {
        url: apiOptions.server + path,
        method:"DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 204) {
                res.redirect('/dashboard/u/settings');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});

// Edit profile request
module.exports.editProfilePage = (function (req, res) {
    res.render('edit-profile', {title: 'Emploi1Pro'});
});