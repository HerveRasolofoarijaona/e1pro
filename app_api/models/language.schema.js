/**
 * Created by nokamojd on 08/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var languageSchema = new Schema(
    {
        _id_language: Schema.ObjectId,
        language: {
            type:String,
            required:true,
            trim:true
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);


module.exports = mongoose.model('Language', languageSchema);