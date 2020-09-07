const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserSchema = new Schema({
        role: {
            type: String,
            required: true,
            // Available roles: 'user', 'admin'
            default: 'user',
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        }
    });
    
module.exports = User = mongoose.model('users', UserSchema);