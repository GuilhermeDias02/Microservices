const router = require('express').Router();
const userController = require('../controllers/user.controller');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for user service
 */

/**
 * @swagger
 * /users/api/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: John
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: P@ssw0rd!
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the registration was successful.
 *                   example: true
 *                 user:
 *                   type: object
 *                   description: The newly created user object.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the user.
 *                       example: "670507e5a85e8b4542098ab9"
 *                     firstname:
 *                       type: string
 *                       description: The first name of the user.
 *                       example: John
 *                     lastname:
 *                       type: string
 *                       description: The last name of the user.
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                       example: john.doe@example.com
 *       400:
 *         description: Bad request - Invalid input or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the validation error.
 *                   example: "Email is required"
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
 *                   example: "Some error occurred while registering user"
 */
router.post('/register', userController.register)

/**
 * @swagger
 * /users/api/login:
 *   post:
 *     summary: Authenticate user
 *     description: Logs in a user and returns a JWT token for authenticated access.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: P@ssw0rd!
 *     responses:
 *       200:
 *         description: Successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Successfully logged in"
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the user.
 *                       example: John
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                       example: john.doe@example.com
 *                     token:
 *                       type: string
 *                       description: JWT token for accessing protected routes.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Email or password incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for incorrect email or password.
 *                   example: "Email or Password wrong"
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
 *                   example: "Some error occurred while logging user"
 */
router.post('/login', userController.login)

/**
 * @swagger
 * /users/api/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Fetches the details of a user based on the provided user ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user.
 *         example: 12345
 *     responses:
 *       200:
 *         description: Successfully retrieved user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the user.
 *                   example: 12345
 *                 name:
 *                   type: string
 *                   description: The first name of the user.
 *                   example: John
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: john.doe@example.com
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user was not found.
 *                   example: "User with the given ID was not found."
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
 *                   example: "Some error occurred while fetching user details."
 */
router.get('/:id', userController.getUser)

/**
 * @swagger
 * /users/api/:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Fetches a list of all users with their details.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the user.
 *                     example: 12345
 *                   name:
 *                     type: string
 *                     description: The name of the user.
 *                     example: John
 *                   email:
 *                     type: string
 *                     description: The email address of the user.
 *                     example: john.doe@example.com
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
 *                   example: "Some error occurred while fetching users."
 */
router.get('/', userController.getUsers)

module.exports = router;
