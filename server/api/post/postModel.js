var mongoose = require('mongoose');

var PostSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    text: {
        type: String, 
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }]
});

module.exports = mongoose.model('post', PostSchema);
