/**
 * Created by nokamojd on 26/08/2016.
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


// skills page list renderer function
var renderSkillsPage = function (req, res, responseBody) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    res.render('dashboard/skills-form', {
        title: 'Domaines de compétences | Emploi1pro',
        skills: responseBody
    });
};

// Get all skills controller
module.exports.allSkills = (function (req, res) {
    var requestOptions, path;
    path = '/api/skills';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderSkillsPage(req, res, body);
        }
    );

});

// add Skill renderer function
var renderSkillDetail = function (req, res, skillDetail) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    res.render('dashboard/skill-details', {
        title: 'Domaines de compétences | Emploi1pro',
        skill: skillDetail
    });
};
// Get one Skill controller
module.exports.getOneSkill = function (req, res) {
    var requestOptions, path;
    path = '/api/skills/'+ req.params.id_skill;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions,
        function(err, response, body){
            renderSkillDetail(req, res, body);
        }
    );
};

/*
// add field renderer function for test
var renderNewFieldForm = function (req, res, responseBody) {
    res.render('dashboard/test-form', {
        title: 'Domaines d\'activité | Emploi1pro'
    });
};

module.exports.newField = (function (req, res) {
    renderNewFieldForm(req, res);
});
*/

// Create a Skill Controller method
module.exports.addSkill = (function (req, res) {
    var requestOptions, path, postData;
    path='/api/skills';
    postData = {
        skill_field_lab: req.body.skillLab,
        inner_skill_lab: req.body.subSkillLab
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
                res.redirect('skills');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// Update a skill controller method
module.exports.updateSkill = (function (req, res) {
    var requestOptions, path, putData;

    path='/api/skills/'+ req.params.id_skill;
    putData = {
        skill_field_lab: req.body.skillLab
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
                res.redirect('/dashboard/skills');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// Delete a skill controller method
module.exports.deleteSkill = (function (req, res) {
    var requestOptions, path;
    path='/api/skills/'+ req.params.id_skill;
    requestOptions = {
        url: apiOptions.server + path,
        method:"DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 204) {
                res.redirect('/dashboard/skills');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// SUB SKILLS CRUD

// Create a subSkill Controller method
module.exports.addSubSkill = (function (req, res) {
    var requestOptions, path, postData;
    path='/api/skills/'+ req.params.id_skill+'/sub-skills';
    postData = {
        inner_skill_lab: req.body.subskillLab
        //inner_skill_lab: req.body.subSkillLab
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
                res.redirect(req.params.id_skill);
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// Update a skill controller method
module.exports.updateSubSkill = (function (req, res) {
    var requestOptions, path, putData;

    path='/api/skills/'+ req.params.id_skill +'/sub-skills/'+req.params.id_inner_skill;
    putData = {
        inner_skill_lab: req.body.subskillLab
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
                res.redirect('/dashboard/skills/'+req.params.id_skill);
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});



// Delete a field controller method
module.exports.deleteSubSkill = (function (req, res) {
    var requestOptions, path;
    path='/api/skills/'+ req.params.id_skill +'/sub-skills/'+req.params.id_inner_skill;
    requestOptions = {
        url: apiOptions.server + path,
        method:"DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 204) {
                res.redirect('/dashboard/skills/'+req.params.id_skill);
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});
