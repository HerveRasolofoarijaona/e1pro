/**
 * Created by nokamojd on 08/07/2016.
 */

var mongoose = require('mongoose');
require('./dbconfig');
var Schema = mongoose.Schema;

var userRoleSchema = new Schema(
    {
        _id_role: Schema.Types.ObjectId,
        role: {type:String, required:true}
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('UserRole', userRoleSchema);