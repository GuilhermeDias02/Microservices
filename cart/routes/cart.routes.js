const router = require('express').Router();
const cartController = require('../controllers/cart.controller');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for cart service
 */

/**
 * @swagger
 * /carts/api/{userId}:
 *   post:
 *     summary: Add items to the cart
 *     description: Adds items to the cart for the specified user. If the cart does not exist, it will be created.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user adding items to the cart.
 *         example: 63fbc101fc13ae456700003f
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - name
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: The ID of the product to add to the cart.
 *                       example: 63fbc101fc13ae4567000041
 *                     name:
 *                       type: string
 *                       description: The name of the product.
 *                       example: "Laptop"
 *                     quantity:
 *                       type: number
 *                       description: The quantity of the product to add.
 *                       example: 2
 *     responses:
 *       201:
 *         description: Successfully added items to the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartId:
 *                   type: string
 *                   description: The unique ID of the cart.
 *                   example: 63fbc101fc13ae456700003e
 *                 userId:
 *                   type: string
 *                   description: The ID of the user.
 *                   example: 63fbc101fc13ae456700003f
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         description: The ID of the product in the cart.
 *                         example: 63fbc101fc13ae4567000041
 *                       name:
 *                         type: string
 *                         description: The name of the product in the cart.
 *                         example: "Laptop"
 *                       quantity:
 *                         type: number
 *                         description: The quantity of the product in the cart.
 *                         example: 2
 *       400:
 *         description: Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for invalid data.
 *                   example: "Items array is required."
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
 *                   example: "An error occurred while adding items to the cart."
 */
router.post('/:userId', cartController.addToCart)

/**
 * @swagger
 * /carts/api/{userId}:
 *   get:
 *     summary: Retrieve the cart for a user
 *     description: Fetches the cart and its items for the specified user.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose cart is being retrieved.
 *         example: 63fbc101fc13ae456700003f
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartId:
 *                   type: string
 *                   description: The unique ID of the cart.
 *                   example: 63fbc101fc13ae456700003e
 *                 userId:
 *                   type: string
 *                   description: The ID of the user.
 *                   example: 63fbc101fc13ae456700003f
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         description: The ID of the product in the cart.
 *                         example: 63fbc101fc13ae4567000041
 *                       name:
 *                         type: string
 *                         description: The name of the product in the cart.
 *                         example: "Laptop"
 *                       quantity:
 *                         type: number
 *                         description: The quantity of the product in the cart.
 *                         example: 2
 *       404:
 *         description: Cart not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for no cart found.
 *                   example: "Cart not found for the given user ID."
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
 *                   example: "An error occurred while fetching the cart."
 */
router.get('/:userId', cartController.getCart)

/**
 * @swagger
 * /carts/api/{userId}:
 *   delete:
 *     summary: Empty the cart for a user
 *     description: Removes all items from the cart for the specified user.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose cart is being emptied.
 *         example: 63fbc101fc13ae456700003f
 *     responses:
 *       200:
 *         description: Successfully emptied the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Cart successfully emptied."
 *       404:
 *         description: Cart not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for no cart found.
 *                   example: "Cart not found for the given user ID."
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
 *                   example: "An error occurred while emptying the cart."
 */
router.delete('/:userId', cartController.emptyCart)

module.exports = router;
