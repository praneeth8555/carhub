const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
// Create product (POST /api/products)

/**
 * @swagger
 * /api/createproduct:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with the given title, description, tags, and images. The product must have at least one image and no more than 10 images.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - tags
 *               - imageUrls
 *               - email
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the product.
 *                 example: "Tesla Model S"
 *               description:
 *                 type: string
 *                 description: A brief description of the product.
 *                 example: "A fully electric luxury sedan."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of tags for categorizing the product (e.g., car_type, brand).
 *                 example: ["electric", "luxury", "sedan"]
 *               email:
 *                 type: string
 *                 description: The email address of the user who is adding the product.
 *                 example: "user@example.com"
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs for the product. Minimum of 1 image and maximum of 10 images.
 *                 example: ["https://imageurl1.com", "https://imageurl2.com"]
 *     responses:
 *       200:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data (e.g., missing or invalid fields).
 *       500:
 *         description: Server error or failure during product creation.
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Tesla Model S"
 *         description:
 *           type: string
 *           example: "A fully electric luxury sedan."
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["electric", "luxury", "sedan"]
 *         userEmail:
 *           type: string
 *           example: "user@example.com"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://imageurl1.com", "https://imageurl2.com"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-14T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-14T12:00:00Z"
 */
router.post('/createproduct', [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('tags').not().isEmpty().withMessage('Tags are required'),
    body('imageUrls').isArray({ min: 1, max: 10 }).withMessage('At least one image URL is required, maximum of 10')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tags, imageUrls, email } = req.body;
    const tagsArray = Array.isArray(tags) ? tags : String(tags).split(',');
    try {
        const newProduct = new Product({
            title,
            description,
            tags: tagsArray,
            userEmail: email,
            images: imageUrls,
        });

        await newProduct.save();

        res.json({ success: true, message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get cars by user email (GET /api/mycars?email=user@example.com)
/**
 * @swagger
 * /api/mycars:
 *   get:
 *     summary: Get all products for a specific user
 *     description: Fetches all products associated with the user's email address.
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email address of the user whose products are being fetched.
 *         example: "user@example.com"
 *     responses:
 *       200:
 *         description: Successfully fetched the list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cars:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing or invalid email parameter.
 *       500:
 *         description: Server error or failure to fetch products.
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Tesla Model S"
 *         description:
 *           type: string
 *           example: "A fully electric luxury sedan."
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["electric", "luxury", "sedan"]
 *         userEmail:
 *           type: string
 *           example: "user@example.com"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://imageurl1.com", "https://imageurl2.com"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-14T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-14T12:00:00Z"
 */
router.get('/mycars', async (req, res) => {
    const { email } = req.query;

    try {
        const cars = await Product.find({ userEmail: email });
        res.json({ success: true, cars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get car details by ID
 *     description: Fetches details of a car based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the car whose details are to be fetched.
 *         example: "673599a11738db71cdd6ad89"
 *     responses:
 *       200:
 *         description: Successfully fetched the car details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 car:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Car not found.
 *       500:
 *         description: Server error while fetching car details.
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Tesla Model S"
 *         description:
 *           type: string
 *           example: "A fully electric luxury sedan."
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["electric", "luxury", "sedan"]
 *         userEmail:
 *           type: string
 *           example: "user@example.com"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://imageurl1.com", "https://imageurl2.com"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-14T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-14T12:00:00Z"
 */
router.get('/cars/:id', async (req, res) => {
    try {
        const car = await Product.findById(req.params.id);
      
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        res.json({ success: true, car });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update car details by ID
 *     description: Updates the details of a car by its ID. Allows updating title, description, tags, and images.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the car to be updated.
 *         example: "673599a11738db71cdd6ad89"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the car (optional)
 *                 example: "Tesla Model S updated"
 *               description:
 *                 type: string
 *                 description: A brief description of the car (optional)
 *                 example: "A fully electric luxury sedan with enhanced features."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of tags for categorizing the car (optional)
 *                 example: ["electric", "luxury", "sedan"]
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of image URLs for the car (optional, max 10 images)
 *                 example: ["https://imageurl1.com", "https://imageurl2.com"]
 *             required: []  # All fields are optional, no required fields in the body
 *     responses:
 *       200:
 *         description: Successfully updated the car details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Car updated successfully"
 *                 car:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation errors or missing fields.
 *       404:
 *         description: Car not found.
 *       500:
 *         description: Server error while updating the car details.
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "673599a11738db71cdd6ad89"
 *         title:
 *           type: string
 *           example: "Tesla Model S"
 *         description:
 *           type: string
 *           example: "A fully electric luxury sedan."
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["electric", "luxury", "sedan"]
 *         userEmail:
 *           type: string
 *           example: "user@example.com"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://imageurl1.com", "https://imageurl2.com"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-14T06:33:05.290Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-14T06:33:05.296Z"
 *         __v:
 *           type: integer
 *           example: 0
 */
router.put('/cars/:id', [
    body('title').optional().not().isEmpty().withMessage('Title cannot be empty'),
    body('description').optional().not().isEmpty().withMessage('Description cannot be empty'),
    body('tags').optional().not().isEmpty().withMessage('Tags cannot be empty'),
    body('imageUrls').optional().isArray({ max: 10 }).withMessage('Maximum of 10 images allowed')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tags, imageUrls } = req.body;
    const updateFields = {};

    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (tags) {
        // Check if tags are a string or already an array
        if (typeof tags === 'string') {
            updateFields.tags = tags.split(',').map(tag => tag.trim()); // Split string into an array and remove extra spaces
        } else if (Array.isArray(tags)) {
            updateFields.tags = tags; // Use tags as array if already an array
        }
    }
    if (imageUrls) updateFields.images = imageUrls;

    try {
        const updatedCar = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!updatedCar) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        res.json({ success: true, message: 'Car updated successfully', car: updatedCar });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     description: Deletes the details of a car by its unique ID. If the car is not found, a 404 error is returned.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the car to be deleted.
 *         example: "673599a11738db71cdd6ad89"
 *     responses:
 *       200:
 *         description: Successfully deleted the car.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Car deleted successfully"
 *       404:
 *         description: Car not found. The car with the given ID does not exist.
 *       500:
 *         description: Server error while deleting the car.
 */
router.delete('/cars/:id', async (req, res) => {
    const { id } = req.params; // Get car ID from URL

    try {
        // Find the car by ID and delete it
        const deletedCar = await Product.findByIdAndDelete(id);

        if (!deletedCar) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        res.json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


const searchProducts = async (searchQuery, lim = null) => {
    const agg = [
        {
            $search: {
                index: 'default', // Ensure this matches your Atlas index
                text: {
                    query: searchQuery,
                    path: ["title", "description", "tags"]
                },
            }
        },

    ];
    if (typeof lim === 'number' && lim > 0) {
        agg.push({
            $limit: lim // Limit the number of results
        });
    }

    const client = await MongoClient.connect(process.env.mongouri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        const coll = client.db("test").collection("products");
        const cursor = coll.aggregate(agg);
        const results = await cursor.toArray();

        if (results.length > 0) {
            return results;
        } else {
            throw new Error("No products found.");
        }
    } catch (error) {
        console.error("Error during search:", error);
        throw error; // Propagate the error for handling in the route
    } finally {
        client.close();
    }
};

/**
 * @swagger
 * /api/search:
 *   post:
 *     summary: Search products by query and filter by user email
 *     description: Searches for products based on a given query, and filters the results to return only those associated with the specified user email.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query for products (e.g., "electric").
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: List of products matching the search query and associated with the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   userEmail:
 *                     type: string
 *       400:
 *         description: Missing query or user email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Query parameter is required"
 *       404:
 *         description: No products found for this user or query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No products found for this user"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Server error"
 */

router.post('/search', async (req, res) => {
    const searchQuery = req.query.q;
    const userEmail = req.body.userEmail;  // Assuming userEmail is passed in the body

    console.log(seearchQuery)
    console.log(userEmail)

    // Check if the query parameter exists
    if (!searchQuery) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    if (!userEmail) {
        return res.status(400).json({ message: "User email is required" });
    }

    try {
        // Modify search to only return products belonging to the user
        const results = await searchProducts(searchQuery);  // Pass userEmail to searchProducts

        // Filter results to match userEmail
        const filteredResults = results.filter(product => product.userEmail === userEmail);

        if (filteredResults.length === 0) {
            return res.status(404).json({ message: "No products found for this user" });
        }

        res.json(filteredResults);
    } catch (error) {
        if (error.message === "No products found.") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).send("Server error");
        }
    }
});



module.exports = router;
