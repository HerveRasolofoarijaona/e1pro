/**
 * Created by nokamojd on 08/07/2016.
 */

var mongoose = require('../mongoose');
var Schema = mongoose.Schema;

var addressSchema = new Schema({
    //_idStatus: ObjectId,
    address: {
        street: String,
        city: String,
        state: String,
        department: String,
        zip_code: Number,
    },
    users: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('Address', addressSchema);