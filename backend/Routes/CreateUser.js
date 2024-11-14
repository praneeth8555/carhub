const express = require('express');
const router = express.Router();
const user = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /api/CreateUser:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided email, name, contact number, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               contactNumber:
 *                 type: string
 *                 description: The contact number of the user.
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *     responses:
 *       200:
 *         description: User successfully created.
 *       400:
 *         description: Invalid input (e.g., missing or incorrect fields).
 *       409:
 *         description: User with given email already exists.
 */
router.post(
  '/CreateUser',
  [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'didnt match minimum length').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body)
    const User = await user.findOne({ email: req.body.email });
    if (User) {
      return res.status(409).send({ message: 'User with given email already exists!' });
    }

    try {
      const saltRounds = 10; // Number of salt rounds for bcrypt
      const salt = await bcrypt.genSalt(saltRounds);
      const secpassword = await bcrypt.hash(req.body.password, salt);

      await user.create({
        name: req.body.name,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        password: secpassword,
      });

      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);


/**
 * @swagger
 * /api/LoginUser:
 *   post:
 *     summary: User login
 *     description: Logs in a user with the provided email and password, and returns an authentication token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 default: "temp@gmail.com"  # Default email
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *                 default: "Temp@123"  # Default password
 *     responses:
 *       200:
 *         description: User logged in successfully. Returns authentication token.
 *       400:
 *         description: Invalid email or password.
 *       500:
 *         description: Server error or failure in authentication.
 */
router.post("/LoginUser", [
    body('email').isEmail(),
    body('password', 'Password should be at least 5 characters long').isLength({ min: 5 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      const foundUser = await user.findOne({ email });
  
      if (!foundUser) {
        return res.status(400).json({ error: "Invalid email. Please try again." });
      }
      const pwdcompare=await bcrypt.compare(password,foundUser.password)
      if (!pwdcompare) {
        return res.status(400).json({ error: "Password mismatch. Please try again." });
      }
      
      const data={
        user:{
           id:foundUser.id
        }
      }
      const authToken=jwt.sign(data,process.env.jwtsecret)
      res.json({ success: true ,authToken:authToken});
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  });




  
module.exports = router;