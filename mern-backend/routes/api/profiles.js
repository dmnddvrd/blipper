const { route } = require('./users'),
    express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('../../config/keys'),
    Profile = require('../../models/Profile'),
    User = require('../../models/User'),
    profileValidator = require('../../validation/profiles'),
    router = express.Router();

// @route   GET api/profile/me
// @desc    Get my own profile
// @access  Private
    
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    let errors = {};
    
    Profile.findOne({ user: req.user.id })
    .then((profile) => {
        if(!profile) {
            errors.noProfile = 'Profile not found';
            return res.status(404).json(errors);
        }
        return res.json(profile);
    })
    .catch((error) => {
        console.log(`Error querying Profile ${req.user.id} -> ${profile} : ${error}`);
        return res.status(404).json(error);
    });
});

// @route   GET api/profile/handle/:handle
// @desc    Get Profile by Url/Handle
// @access  Public   

router.get('/handle/:handle',  (req, res) => {
    
    const { errors, isValid } = profileValidator.validateGetProfileByHandleInput(req.params);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
        if(!profile) {
            errors.noProfile = `Profile not found for handle ${req.body.handle}`;
            return res.status(404).json(errors);
        }
        return res.json(profile);
    })
    .catch((err) => {
        console.log(`Error querying Profile by handle ${req.body.handle} ${err}`);
        errors.noProfile = `Profile not found for handle ${req.body.handle}`;
        return res.status(404).json(errors);
    });


});


// @route   GET api/profile/user/:user_id
// @desc    Get Profile by user id
// @access  Public   

router.get('/user/:user_id',  (req, res) => {
    
    const { errors, isValid } = profileValidator.validateGetProfileByUserInput(req.params);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({ handle: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
        if(!profile) {
            errors.noProfile = `Profile not found for handle ${req.body.handle}`;
            return res.status(400).json(errors);
        }
        return res.json(profile);
    })
    .catch((err) => {
        console.log(`Error querying Profile by handle ${req.body.handle} ${err}`);
        errors.noProfile = `Profile not found for handle ${req.body.handle}`;
        return res.status(404).json(errors);
    });


});

// @route   POST api/profile/
// @desc    Create or update a profile for authenticated user
// @access  Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    const { errors, isValid } = profileValidator.validateProfileCreateInput(req.body);
    console.log(JSON.stringify(errors));

    if(!isValid) {
        return res.status(400).json(errors);
    }
    
    const profileFields = {};
    
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    
    // TODO: testing for skills param

    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
   
    Profile.findOne({ user: req.user.id })
        .then((profile) => {
            if(profile) {
                
                // If a profile already exists: 
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true})
                .then(profile => res.json(profile))
                .catch((error) => {
                    console.log(`Could not update profile ${profileFields},  ${error}`);
                });
            } else {

                // Checking if handle exists already: 
                Profile.findOne({ handle: profileFields.handle })
                .then((profile) => {
                    if(profile) {
                        errors.handle = 'Handle field invalid, already existing';
                        return res.status(400).json(errors);
                    }
                });

                // Saving profile into db
                new Profile(profileFields).save()
                .then((profile) => {
                    return res.json(profile);
                })
                .catch((error) => {
                    console.log(`Could not create profile ${profileFields},  ${error}`);
                });
            }
        })
        .catch((err) => {
            console.log(`Error querying Profile ${req.user.id} -> ${profile} : ${err}`);
        });

});

// @route   GET api/profile/all
// @desc    Returns all profiles along with the user's name and avatar
// @access  Public    

router.get('/', (req, res) => {

    const errors = {};

    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
        if(!profiles) {
            errors.noProfiles = 'Could not find any profiles';
            return res.status(404).json(errors);
        }
        return res.json(profiles);
    })
    .catch((err) => {
        console.log(`Error querying profiles ${err}`);
        errors.noProfiles = 'Could not find any profiles';
        return res.status(404).json(errors);
    });

});

// @route   POST api/profile/experience
// @desc    Add experience field to profile
// @access  Private

router.post('/experience', passport.authenticate('jwt', { session: false }),
(req, res) => {
    // TODO: validate experience input
    const { errors, isValid } = profileValidator.validateAddExperienceInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
    .then((profile) => {

        if(!profile) { 
            errors.noProfile = 'Profile not found';
            return res.status(400).json(errors);
        }

        const newExperience = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        };

        profile.experience.unshift(newExperience);
        
        profile.save()
        .then(profile => res.json(profile))
        .catch((err) => {
            errors.updateError = 'Profile could not be updated';
            console.log(`Error updating user profile ${req.user} : ${err}`);
            return res.status(400).json(errors);
        });
    })
    .catch((err) => {
        errors.noProfile = 'Profile not found';
        console.log(`Error querying user profile ${req.user} : ${err}`);
        return res.status(404).json(errors);
    });

});

// @route   POST api/profile/education
// @desc    Add education field to profile
// @access  Private

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    // TODO: VALIDATION
    const {errors, isValid } = profileValidator.validateEducationInput(req.body);

    if(!isValid) { 
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
    .then((profile) => {
        if(!profile) { 
            errors.noProfile = 'Profile not found';
            return res.status(404).json(errors);
        }

        
    })
    .catch((err) => {
        console.log(`Error querying user ${req.user} : ${err}`);
        errors.noProfile = 'Profile not found';
        return res.status(404).json(errors);
    });
});

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education field from profile
// @access  Private

router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    // TODO: Validation
    const {errors, isValid } = profileValidator.validateEducationDeleteInput(req.body);

    if(!isValid) { 
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
    .then((profile) => {
        if(!profile){
            errors.noProfile = 'Profile not found';
            return res.status(404).json(errors);
        }

        // Deleting the requested section from experience field
        const toBeRemovedIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);

        profile.save()
        .then((profile) => {
            return res.json(profile)
        })
        .catch((err) => {
            errors.couldNotUpdate = 'Could not update profile';
            console.log(`Error updating user profile ${req.user}: ${err}`);
            return res.status(400).json(errors);
        });

    })
    .catch((err) => {
        errors.noProfile = 'Profile not found';
        console.log(`Error querying profile for user ${req.user}: ${err}`);
        return res.status(404).json(errors);
    });

});

router.all('/*', (req, res) => {
    res.json({
        response: 'route does not exist',
    });
});

module.exports = router;
