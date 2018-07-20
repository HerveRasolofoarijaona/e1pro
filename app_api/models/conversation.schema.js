/**
 * Created by nokamojd on 05/08/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conversationSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    devis_id: { type: Schema.Types.ObjectId, ref: 'Devis' },
    message: { type: String, default: '' }
    },
    {
        timestamps: {
            createdAt: 'created_at'
        }
});

module.exports = mongoose.model('Conversation', conversationSchema);