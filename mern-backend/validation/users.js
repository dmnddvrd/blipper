const validator = require('validator'),
    isEmpty = require('./util/is-empty');

const minNameLength = 2,
    maxNameLength = 30,
    minPwdLength = 6,
    maxPwdLength = 30;
    
const validateRegisterInput = (data) => {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    console.log(JSON.stringify(data));
    if(!validator.isLength(data.name, { min: minNameLength, max: maxNameLength })) {
        errors.name = `Name field invalid (${minNameLength}, ${maxNameLength})`;
    }

    if(validator.isEmpty(data.name)) {
        errors.name = 'Name field empty';
    }

    if(!validator.isEmail(data.email)) {
        errors.email = 'Email field invalid';
    }
    
    if(validator.isEmpty(data.email)) {
        errors.email = 'Email field empty';
    }

    if(validator.isEmpty(data.password)) {
        errors.password = 'Password field empty';
    }

    if(!validator.isLength(data.password, {min: minPwdLength, max: maxPwdLength})) {
        errors.password = 'Password field invalid';
    }

    if(validator.isEmpty(data.password2)) {
        errors.password2 = 'Second password field empty';
    }

    if(!validator.equals(data.password, data.password2)) {
        errors.password = errors.password2 = 'Passwords dont match';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

const validateLoginInput = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(!validator.isEmail(data.email)) {
        errors.email = 'Email field invalid';
    }

    if(validator.isEmpty(data.email)) {
        errors.email = 'Email field empty';
    }
    
    if(validator.isEmpty(data.password)) {
        errors.password = 'Password field empty';
    }

    
    return {
        errors,
        isValid: isEmpty(errors),
    };
};

module.exports = {
    validateLoginInput,
    validateRegisterInput,
}