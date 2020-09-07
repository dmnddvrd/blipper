const validator = require('validator'),
    isEmpty = require('./util/is-empty');


// @route  POST api/profile/
// @desc    Create or update a profile for authenticated user

const validateProfileCreateInput = (data) => {
    let errors = {};
    
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    // TODO: MIN MAX LENGTH STORED ELSEWHERE
    if(!validator.isLength(data.handle, { min: 2, max: 40  })){
        errors.handle = 'Handle field invalid (2,40)';
    }

    if(validator.isEmpty(data.handle)) {
        errors.handle = 'Handle field empty';
    }

    if(validator.isEmpty(data.status)) {
        errors.status = 'Status field empty';
    }
    
    if(validator.isEmpty(data.skills)) {
        errors.skills = 'Skills field empty';
    }

    if(!isEmpty(data.website) && !validator.isURL(data.website)) {
        errors.website = 'Website field invalid'
    }
    if(!isEmpty(data.youtube) && !validator.isURL(data.youtube)) {
        errors.youtube = 'youtube field invalid'
    }
    if(!isEmpty(data.facebook) && !validator.isURL(data.facebook)) {
        errors.facebook = 'facebook field invalid'
    }
    if(!isEmpty(data.twitter) && !validator.isURL(data.twitter)) {
        errors.twitter = 'twitter field invalid'
    }
    if(!isEmpty(data.linkedin) && !validator.isURL(data.linkedin)) {
        errors.linkedin = 'linkedin field invalid'
    }
    if(!isEmpty(data.gitlab) && !validator.isURL(data.gitlab)) {
        errors.gitlab = 'gitlab field invalid'
    }
    if(!isEmpty(data.instagram) && !validator.isURL(data.instagram)) {
        errors.instagram = 'instagram field invalid'
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

// @route   POST api/profile/experience
// @desc    Add experience field to profile

const validateAddExperienceInput = (data) => {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : ''; 

    if (validator.isEmpty(data.school)) {
        errors.school = 'School field empty';
    }

    if (validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field empty';
    }

    if (validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'Fieldofstudy field empty';
    }

    if (validator.isEmpty(data.from)) {
        errors.from = 'From field empty';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

// @route   GET api/profile/handle/:handle
// @desc    Get Profile by Url/Handle

const validateGetProfileByHandleInput = (data) => {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';

    if (validator.isEmpty(data.handle)) {
        errors.handle = 'Handle field empty';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

// @route   GET api/profile/user/:user_id
// @desc    Get Profile by user id

const validateGetProfileByUserInput = (data) => {
    let errors = {}; 

    data.user_id = !isEmpty(data.user_id) ? data.user_id : '';

    if (validator.isEmpty(data.user_id)) {
        errors.user_id = 'User_id field empty';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};


const validateDeleteExperienceInput = (data) => {
    let errors = {};

    data.user_id = !isEmpty(data.user_id) ? data.user_id : '';

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

const validateAddEducationInput = (data) => {
    let errors = {};

    data.user_id = !isEmpty(data.user_id) ? data.user_id : '';

    return {
        errors,
        isValid: isEmpty(errors),
    };
};


module.exports = { 
    validateProfileCreateInput,
    validateGetProfileByUserInput,
    validateGetProfileByHandleInput,
    validateDeleteExperienceInput,
    validateAddExperienceInput,
    validateAddEducationInput,
};