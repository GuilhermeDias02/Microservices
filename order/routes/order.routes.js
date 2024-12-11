const router = require('express').Router();
const orderController = require('../controllers/order.controller');

router.post('/:userId', orderController.createOrder)
router.get('/:userId', orderController.getOrder)
router.put('/:id/pay', orderController.payOrder)

module.exports = router;
