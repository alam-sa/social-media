const router = require('express').Router();
const userRouter = require('./users');
const authRouter = require('./auth');
const postRouter = require("./posts")

router.use('/api/users', userRouter);
router.use('/api/auth', authRouter);
router.use('/api/posts', postRouter);

module.exports = router 