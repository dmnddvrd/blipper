const express = require('express'),
    User = require('../../models/User'),
    passport = require('passport'),
    config = require('../../config/keys'),
    bcrpyt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    gravatar = require('gravatar'),
    userValidator = require('../../validation/users'),
    router = express.Router();

router.get('/', (req, res) => {
    User.find()
    .then((user) => {
        return res.json(user);
    })
    .catch(err => console.log(`Error Querying users ${err}`));
});

router.post('/register', (req, res) => {

    const { errors, isValid }  = userValidator.validateRegisterInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email })
    .then(user => { 
        // If email is already in use
        if(user) {
            return res.status(400).json({
                email: 'email already in use',
            });
        // If email is not in use
        } else {
            // Querying an avatar based on email
            const avatar = gravatar.url(req.body.email, {
                s: '240', // Size
                d: 'mm', // Default
            });
            // Encrypting password
            bcrpyt.genSalt(10, (err, salt) => {
                if(err) throw err;
                bcrpyt.hash(req.body.password, salt, (err, password) => {
                    if(err) throw err;
                    const createdUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        avatar,
                        password,
                    });

                    createdUser.save()
                        .then((user) => {
                            console.log(`User created ${user}`);
                            return res.json(user);
                        })
                        .catch(err => console.log(`Error creating user ${createdUser}: ${err}`));
                });
            });
        }
    })
    .catch((err) => {
        console.log(`Error registering user ${req.body.email}: ${err}`);
        errors.couldNotCreate = 'Could not create user';
        return res.status(400).json(errors);
    });
});


// Login route
router.post('/login', (req, res) => {

    console.log(JSON.stringify(req.body));
    const { errors, isValid }  = userValidator.validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            // Check if doesn't user exists
            if(!user) {
                return res.status(400).json({
                    response: 'Email and password combination incorrect',
                });
            }
            bcrpyt.compare(req.body.password, user.password)
                .then(isEqual => {
                    if(isEqual) {
                        // If password is matching we generate a token
                        jwt.sign({
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            avatar: user.avatar,
                        }, 
                        config.secret,
                        (err, token) => {
                            if (err) {
                                return res.status(400).json({
                                    response: 'Internal server error: Could not authenticate',
                                });
                            } else {
                                return res.json({
                                    success: true,
                                    token: `Bearer ${token}`,
                                })
                            }
                        });
                       

                    } else {
                        return res.status(400).json({
                            response: 'Email and password combination incorrect',
                        });
                    }
                })
        })
        .catch((err) => {
            console.log(`Could not find user ${JSON.stringify(req.body)} : ${err}`);
            return res.status(400).json({
                response: 'Email and password combination incorrect',
            });
        });
})

router.get('/who_am_i', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        user: req.user,
    });
});

router.all('/*', (req, res) => {
    return res.json({
        response: 'route does not exist',
    });
});

module.exports = router;
