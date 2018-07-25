/**
 * Created by nokamojd on 08/07/2016.
 */

/**
 * Created by nokamojd on 08/07/2016.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');

/*var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Doit au moins avoir 2 charactères, max 30, pas de charactères spéciaux ni de nombres'
    }),
    validate({
        validator: 'isLength',
        arguments: [2, 20],
        message: 'Le nom doit avoir entre {ARGS[0]} et {ARGS[1]} charactères'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'e-mail invalide'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'L\'Email doit contenir entre {ARGS[0]} et {ARGS[1]} charactères'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d]).{8,35}$/, //(?=.*?[\W]) pour les tem spéciaux
        message: 'Le mot de passe doit au moins contenir une minuscule, une majuscule, un chiffre, et doit comporter entre 8 et 35 charactères.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Mot de passe doit avoir entre {ARGS[0]} et {ARGS[1]} charactères'
    })
];*/

var uSkillSchema = new Schema({
    user_skill:{type:String}
});


var userSchema = new Schema({
        //_id_user: Schema.ObjectId,
        first_name: { type: String/*, lowercase: true, validate: nameValidator*/ },
        last_name: { type: String/*, lowercase: true, validate: nameValidator*/ },
        password: { type: String/*, validate: passwordValidator, select: false*/ },
        profile_pic_path: { type: String, default: '' },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        email: { type: String, required: true, lowercase: true, unique: true/*, validate: emailValidator*/ },
        is_active: { type: Boolean, /*required: true,*/ default: false },
        temporarytoken: String,
        user_role:{
            type: Schema.ObjectId,
            ref:'UserRole'
        },
        is_certified: { type: Boolean, default: false },
        //confirmed: { type: Boolean, default: false }, //pour valider que l'email a été validé'
        qualification: {type:String, default:''},
        about:  {type:String, default:'Parlez-nous de vous. Enregistrez une Bio.'},
        personal_details: {
            birth_date: {type:String, default:''},
            gender: {type:String, default:''},
            address: {
                line1: {type:String, default:''},
                line2: {type:String, default:''},
                location: {type:String, default:''}
            },
            mobile_phone_number: {type:String, default:""},
            home_phone_number: {type:String, default:""}
        },
        user_skills: [uSkillSchema],
        payment: [{
            card: String ,
            titulaire : String,
        }],
        rib: [{
            id_iban: String,
        }],
        company_name: { type: String, default: '' },
    },
    //{ usePushEach: true },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    },
    {
        collection: 'users'
    }    
);

/* Hash the password before even save it to the database */
userSchema.pre('save', function (next) {
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        })
    });
});

/* compare password in the database and the one typed in by the user */
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.gravatar = function (size) {
    if(!this.size) size = 200;
    if(!this.email) return 'https://www.gravatar.com/avatar/?s' + size + '&d=retro';
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://www.gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};
userSchema
    .virtual('name')
    .get(function () {
        return this.last_name + ' ' + this.first_name;
    });

// Export model...
module.exports = mongoose.model('User', userSchema);