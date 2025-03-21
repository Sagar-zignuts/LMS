const router = require('express').Router()
const {register , login} = require('../controllers/AuthController');
const {AuthMiddleware} = require('../middleware/AuthMiddleware');

router.post('/register'  ,register)
router.post('/login' ,login)

module.exports = router;