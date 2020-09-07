const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    PostSchema = new Schema ({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        name: {
            type: String,
        },
        avatar: {
            type: String,
            required: true,
        },
        text : {
            type: String,
            required: true,
        },

        likes: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'users',
                },
                likedAt: {
                    type: Date,
                    default: Date.now(),
                }
            }
        ],

        comments: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'users',
                },
                name: {
                    type: String,
                },
                avatar: {
                    type: String,
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                commentedAt: {
                    type: Date,
                    default: Date.now(),
                }
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    });

module.exports = Posts = mongoose.model('posts', PostSchema);