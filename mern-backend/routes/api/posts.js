const { route } = require('./users');
const { json } = require('body-parser');

const express = require('express'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    router = express.Router(),
    postsValidator = require('../../validation/posts'),
    Profile = require('../../models/Profile'),
    Post = require('../../models/Posts');


// @route   GET api/posts/
// @desc    Gets all posts sorted by date
// @access  public

router.get('/', (req, res) => {
    const errors = {};
    Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch((err) => {
        console.log(`Error querying posts: ${err}`);
        errors.noPosts = 'No posts found';
        res.status(404).json(errors);
    });
});

// @route   GET api/posts/my-posts
// @desc    Gets all posts for logged in user
// @access  Private

router.get('/my-posts/', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
    .then((profile) => {
        if (profile) {
            Post.find({ user: req.user.id })
            .then((posts) => {
                return res.json(posts);
            })
            .catch((err) => {
                console.log(`Error querying posts: ${err}`);
                return res.status(404).json({ noPosts: 'No posts found' });
            });
        } else {
            return res.status(404).json({ noProfile: 'No profile found' });
        }
    })
    .catch((err) => {
        console.log(`Error querying profile ${req.user}: ${err}`);
        return res.status(404).json({ noProfile: 'No profile found' });
    });
});

// @route   GET api/posts/:id
// @desc    Gets post by ID
// @access  public

router.get('/:id', (req, res) => {

    const { errors, isValid } = postsValidator.validateGetPostInput(req.params);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch((err) => {
        console.log(`Error querying posts: ${err}`);
        errors.noPosts = 'No posts found';
        return res.status(404).json(errors);
    });
});


// @route   DELETE api/posts/:id
// @desc    Delete post by ID
// @access  private

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    const { errors, isValid } = postsValidator.validateDeletePostInput(req.params);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Checking if the user has a profile
    Profile.findOne({ user: req.user.id })
    .then((profile) => {
        // If profile found
        if (profile) {
            // Querying owner of post
            Post.findById(req.params.id)
            .then((post) => {
                // If owner of post is not the user who is logged in
                if (post.user.toString() !== req.user.id) {
                    errors.notAuthorized = 'You are not authorized';
                    return res.status(401).json(errors);
                }
                else {
                    // Otherwise
                    post.remove()
                    .then((deleted) => res.json({ success: true, deleted }))
                    .catch((err) => {
                        console.log(`Error deleting post ${post}: ${err}`);
                        errors.couldNotDelete = 'Could not delete post';
                        return res.status(404).json(errors);
                    });
                }
            })
            .catch((err) => {
                console.log(`Error querying posts: ${err}`);
                errors.noPost = 'No post found';
                return res.status(404).json(errors);
            });
        } else {
            console.log(`Profile not found ${profile}`);
            errors.noProfile = 'No profile found';
            return res.status(404).json(errors);
        }
    })
    .catch((err) => {
        console.log(`Error querying posts: ${err}`);
        errors.noProfile = 'No profile found';
        return res.status(404).json(errors);
    });
    
});

// @route   POST api/posts/like/:id
// @desc    Like post by ID (or remove like if it has already been liked by the user)
// @access  Private

router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    const { errors, isValid } = postsValidator.validateGetPostInput(req.params);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Checking if the user has a profile
    Profile.findOne({ user: req.user.id })
    .then((profile) => {
        // If profile found
        if (profile) {
            // Querying owner of post
            Post.findById(req.params.id)
            .then((post) => {
                // If user's like is already in there
               if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                // Getting the index of the like
                const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
                post.likes.splice(removeIndex);
               } else {
                // Otherwise like it
                post.likes.unshift({ user: req.user.id });
               }
               post.save()
               .then(post => res.json({ success: true, post }))
               .catch((err)=> {
                   console.log(`Error updating post: ${post}: ${err}`);
                   errors.couldNoUpdate = 'Could not update likes on post';
                   return res.status(400).json(errors);
               });
            })
            .catch((err) => {
                console.log(`Error querying posts: ${err}`);
                errors.noPost = 'No post found';
                return res.status(404).json(errors);
            });
        } else {
            console.log(`Profile not found ${profile}`);
            errors.noProfile = 'No profile found';
            return res.status(404).json(errors);
        }
    })
    .catch((err) => {
        console.log(`Error querying profile: ${err}`);
        errors.noProfile = 'No profile found';
        return res.status(404).json(errors);
    });
    
});

// @route   POST api/posts/comment/:id
// @desc    Logged in user comments on a post
// @acccess Private

router.post('/comment/:id',passport.authenticate('jwt', { session: false }), (req, res) => {
       
    req.body.id = req.params.id;
    const { errors, isValid } = postsValidator.validateAddCommentInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
    .then((post) => {
        if (post) {
            post.comments.unshift({
                text: req.body.text,
                name: req.user.name, 
                avatar: req.user.avatar,
                user: req.user.id,
            });
            post.save()
            .then((post) => {
                return res.json(post);
            })
            .catch((err) => {
                console.log(`Error adding comment to post ${post}: ${err}`);
                return res.status(400).json({...errors, couldNotComment: 'Error adding comment to post' });
            });
        }
        else{
            return res.status(404).json({...errors, noPost: 'Post not found' });
        }
    })
    .catch((err) => {
        console.log(`Error querying post ${post}: ${err}`);
        return res.status(404).json({...errors, noPost: 'No post found' });
    });
});

// @route   DELETE api/posts/comment/:id
// @desc    Logged in user (or owner of post) deletes a comment made by himself
// @access  Private
router.delete('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    // Id refers to id of the post, commentId is the id of the comment inside the body
    req.body.id = req.params.id;
    const { errors, isValid } = postsValidator.validateDeleteCommentInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
    .then((profile) => {
        if(profile) {
            Post.findOne({ id: req.body.id })
            .then((post) => {
                if(post) {
                    // Find comment:
                    const commentIndex = post.comments.map(item => item.user.toString()).indexOf(req.body.commentId);
                    if(commentIndex) {
                        // Check if user owns the comment/post
                        return res.json({ comment: post.comments[commentIndex], post: post });
                    } else {
                        return res.status(404).json({ ...errors, noComment: 'Comment not found' });
                    }
                } else {
                    return res.status(404).json({ ...errors, noPost: 'No post found' });
                }
            })
            .catch((err) => {
                console.log(`Error querying posts: ${err}`);
                errors.noPost = 'No post found';
                return res.status(404).json(errors);
            });
        } else {
            console.log(`Profile not found ${profile}`);
            errors.noProfile = 'No profile found';
            return res.status(404).json(errors);
        }
    })
    .catch((err) => {
        console.log(`Error querying profile: ${err}`);
        errors.noProfile = 'No profile found';
        return res.status(404).json(errors);
    });
});

// @route   POST api/posts
// @desc    Logged in user creates a new post
// @access  Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = postsValidator.validateCreatePostInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.user.avatar,
        user: req.user.id,
    }).save()
    .then((post) => {
        return res.json(post);
    })
    .catch((err) => {
        console.log(`Error inserting new post ${newPost}: ${err}`);
        errors.couldNotCreate = 'Could not create new post';
        return res.status(400).json(errors);
    });
});



router.all('/*', (req, res) => {
    res.json({
        'response': 'route does not exist',
    });
});

module.exports = router;
