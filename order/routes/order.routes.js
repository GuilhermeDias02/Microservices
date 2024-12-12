const router = require('express').Router();
const orderController = require('../controllers/order.controller');

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: API for order service
 */

/**
 * @swagger
 * /orders/api/{userId}:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order for the specified user using their cart.
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user creating the order.
 *         example: 63fbc101fc13ae456700003f
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cart
 *               - totalAmount
 *             properties:
 *               cart:
 *                 type: string
 *                 description: The ID of the cart associated with the order.
 *                 example: 63fbc101fc13ae456700003e
 *               totalAmount:
 *                 type: number
 *                 description: The total amount for the order.
 *                 example: 149.99
 *     responses:
 *       201:
 *         description: Successfully created the order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the created order.
 *                   example: 63fbc101fc13ae4567000040
 *                 userId:
 *                   type: string
 *                   description: The ID of the user who placed the order.
 *                   example: 63fbc101fc13ae456700003f
 *                 cart:
 *                   type: string
 *                   description: The ID of the cart associated with the order.
 *                   example: 63fbc101fc13ae456700003e
 *                 totalAmount:
 *                   type: number
 *                   description: The total amount of the order.
 *                   example: 149.99
 *                 status:
 *                   type: string
 *                   description: The status of the order.
 *                   example: "pending"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the order was created.
 *                   example: "2023-03-10T14:30:00Z"
 *       400:
 *         description: Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for invalid request data.
 *                   example: "Cart ID and total amount are required."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message returned by the server.
 *                   example: "An error occurred while creating the order."
 */
router.post('/:userId', orderController.createOrder)

/**
 * @swagger
 * /orders/api/{userId}:
 *   get:
 *     summary: Retrieve orders for a user
 *     description: Fetches all orders placed by the specified user.
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose orders are being fetched.
 *         example: 63fbc101fc13ae456700003f
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique ID of the order.
 *                     example: 63fbc101fc13ae4567000040
 *                   cart:
 *                     type: string
 *                     description: The ID of the cart associated with the order.
 *                     example: 63fbc101fc13ae456700003e
 *                   totalAmount:
 *                     type: number
 *                     description: The total amount of the order.
 *                     example: 149.99
 *                   status:
 *                     type: string
 *                     description: The status of the order.
 *                     example: "pending"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the order was created.
 *                     example: "2023-03-10T14:30:00Z"
 *       404:
 *         description: No orders found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message when no orders are found.
 *                   example: "No orders found for the given user ID."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message returned by the server.
 *                   example: "An error occurred while fetching the orders."
 */
router.get('/:userId', orderController.getOrder)

/**
 * @swagger
 * /orders/api/{id}/pay:
 *   put:
 *     summary: Mark an order as paid
 *     description: Updates the status of an order to "paid".
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to be marked as paid.
 *         example: 63fbc101fc13ae4567000040
 *     responses:
 *       200:
 *         description: Successfully updated the order status to "paid".
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the order.
 *                   example: 63fbc101fc13ae4567000040
 *                 status:
 *                   type: string
 *                   description: The updated status of the order.
 *                   example: "paid"
 *       404:
 *         description: Order not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the order was not found.
 *                   example: "Order not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message returned by the server.
 *                   example: "An error occurred while updating the order status."
 */
router.put('/:id/pay', orderController.payOrder)

module.exports = router;
