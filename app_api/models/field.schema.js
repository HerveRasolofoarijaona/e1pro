/**
 * Created by nokamojd on 02/08/2016.
 */
var mongoose = require('mongoose');
require('./dbconfig');
var Schema = mongoose.Schema;

var innerFieldSchema = new Schema({
    inner_field_name: {type:String}
});

var fieldSchema = new Schema({
    field_name:{type:String, required:true, unique:true, trim:true},
    field_slug:{type:String, unique:true, lowercase:true, trim:true}
    //inner_fields:[innerFieldSchema]
},
    {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
}
);

module.exports = mongoose.model('Field', fieldSchema);
