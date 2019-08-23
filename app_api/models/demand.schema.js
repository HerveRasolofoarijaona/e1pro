var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;


var demandLocationSchema = new Schema({
    city: { type: String, required: true },
    country: { type: String, required: true },
    region: String
});

var demandSchema = new Schema({
    dmd_title: String,
    dmd_description: String,
    dmd_desired_start_date: String,
    dmd_supposed_end_date: String,
    dmd_duree: String,
    dmd_conditions: { type: String, default: "Aucune condition particulière n'est soumise à cette demande." },
    is_dmd_available: { type: Boolean, default: true },
    is_dmd_completed: { type: Boolean, default: false },
    dmd_estimated_budget: Number,
    dmd_location: [String],
    dmd_field: {
        type: Schema.ObjectId,
        ref: 'Field'
    },
    dmd_required_skills: [String],
    dmd_keywords: [String],
    dmd_author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    dmd_approved: { type: Boolean, default: false },
    dmd_quotes: [{
        type: Schema.ObjectId,
        ref: 'Quotation'
    }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

/*
var esClient = new elasticsearch.Client({ host: 'localhost:9200' });
demandSchema.plugin(mongoosastic, {
    esClient: esClient
})
*/

demandSchema.plugin(mongoosastic, {
    hosts: [
        "localhost:9200"
    ]
});



module.exports = mongoose.model('Demand', demandSchema);