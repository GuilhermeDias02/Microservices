const router = require('express').Router();
const cartController = require('../controllers/cart.controller');

router.post('/:userId', cartController.addToCart)
router.get('/:userId', cartController.getCart)
router.delete('/:userId', cartController.emptyCart)

module.exports = router;
