const router = require('express').Router()
const userRouter = require('./users')
const authRouter = require('./auth')

router.use('/api/users', userRouter)
router.use('/api/auth', authRouter)

module.exports = router 