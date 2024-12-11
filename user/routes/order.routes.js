const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/:id', userController.getUser)
router.get('/', userController.getUsers)

module.exports = router;
