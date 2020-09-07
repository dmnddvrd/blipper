const express = require('express'),
    userRouter = require('./api/users'),
    profileRouter = require('./api/profiles'),
    postRouter = require('./api/posts'),
    router = express.Router();

    
router.use('/api/users', userRouter);
router.use('/api/profiles', profileRouter);
router.use('/api/posts', postRouter);

router.all('/*', (req, res) => {
    res.json({
        'response': 'route does not exist',
    });
});

module.exports = router;
