/**
 * Created by nokamojd on 08/07/2016.
 */


var mongoose = require('mongoose');
require('./dbconfig');
var Schema = mongoose.Schema;

var legalStatusSchema = new Schema(
    {
        _id_status: Schema.Types.ObjectId,
        status: {type:String, required:true, trim:true}
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);


module.exports = mongoose.model('LegalStatus', legalStatusSchema);