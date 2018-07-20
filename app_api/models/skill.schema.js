/**
 * Created by nokamojd on 08/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var innerSkillSchema = new Schema({
    inner_skill:{type:String, required:true, trim:true, unique:true}
});

var skillSchema = new Schema(
    {
        _id_skill: Schema.ObjectId,
        skill_field: {type:String, required:true, trim:true, unique:true},
        inner_skills:[innerSkillSchema]
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);


module.exports = mongoose.model('Skill', skillSchema);