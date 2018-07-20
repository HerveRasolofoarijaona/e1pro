/**
 * Created by nokamojd on 05/08/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var messageSchema = new Schema({
    _id_message: Schema.Types.ObjectId,
    body: {
        type: String,
        required: true
    },
    joined_files_path: [String],
    archived: {type:Boolean, default:false},
    conversation: {
        type: Schema.Types.ObjectId,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

},    
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }

);

module.exports = mongoose.model('Message', messageSchema);