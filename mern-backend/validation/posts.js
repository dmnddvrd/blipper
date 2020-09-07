const validator = require('validator'),
    mongoose = require('mongoose'),
    isEmpty = require('./util/is-empty');

const validateCreatePostInput = (data) => {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if(validator.isEmpty(data.text)) {
        errors.text = 'Text field empty';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

const validateGetPostInput = (data) => {
    let errors = {}; 

    data.id = !isEmpty(data.id) ? data.id : '';

    if(validator.isEmpty(data.id)) {
        errors.id = 'Id field empty';
    }

    if (!mongoose.Types.ObjectId.isValid(data.id)) {
        errors.id = 'Id field incorrect';
    } else {
        data.id = mongoose.Types.ObjectId(data.id);
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

const validateAddCommentInput = (data) => {

    let errors = {};

    data.id = !isEmpty(data.id) ? data.id : '';
    data.text = !isEmpty(data.text) ? data.text : '';

    if(validator.isEmpty(data.id)) {
        errors.id = 'Id field empty';
    }

    if(validator.isEmpty(data.text)) {
        errors.text = 'Text field empty';
    }

    if (!mongoose.Types.ObjectId.isValid(data.id)) {
        errors.id = 'Id field incorrect';
    } else {
        data.id = mongoose.Types.ObjectId(data.id);
    }
    return {
        errors,
        isValid: isEmpty(errors),
    };
};

const validateDeleteCommentInput = (data) => {
    let errors = {};

    data.id = !isEmpty(data.id) ? data.id : '';
    data.commentId = !isEmpty(data.commentId) ? data.commentId : '';

    if(validator.isEmpty(data.id)) {
        errors.id = 'Id field empty';
    }

    if (!mongoose.Types.ObjectId.isValid(data.id)) {
        errors.id = 'Id field incorrect';
    } else {
        data.id = mongoose.Types.ObjectId(data.id);
    }

    if(validator.isEmpty(data.commentId)) {
        errors.commentId = 'commentId field empty';
    }
    
    if (!mongoose.Types.ObjectId.isValid(data.commentId)) {
        errors.id = 'commentId field incorrect';
    } else {
        data.commentId = mongoose.Types.ObjectId(data.commentId);
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};


module.exports = {
    validateDeleteCommentInput,
    validateAddCommentInput,
    validateCreatePostInput,
    validateGetPostInput,
    validateDeletePostInput: validateGetPostInput,
};