const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const SECRET_KEY = "your_secret_key"; // Replace with a secure key
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API documentation for your application",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ["./server.js"], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Dummy data for demonstration
const users = [
  {
    id: 1,
    username: "user1",
    password: bcrypt.hashSync("password1", 8), // Pre-hash the password
  },
  {
    id: 2,
    username: "user2",
    password: bcrypt.hashSync("password2", 8), // Pre-hash the password
  },
];

const books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 3, title: "1984", author: "George Orwell" },
  { id: 4, title: "Pride and Prejudice", author: "Jane Austen" },
  { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger" },
];

const cart = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
  },
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  // const token = req.headers["authorization"];
  // console.log(token);
  // if (!token) return res.status(403).send({ message: "No token provided" });

  // jwt.verify(token, SECRET_KEY, (err, decoded) => {
  //   if (err)
  //     return res.status(500).send({ message: "Failed to authenticate token" });
  //   req.userId = decoded.id;
  //   next();
  // });
  next();
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The book ID
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *       required:
 *         - id
 *         - title
 *         - author
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - username
 *         - password
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 *
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
 *
 * /api/books:
 *   get:
 *     summary: Get list of books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *
 * /api/cart:
 *   post:
 *     summary: Add a book to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send({ token: null, message: "Invalid Password" });
  }

  // Introduce the bug: Set expiration to 1 minute instead of 24 hours
  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 60 }); // 60 seconds

  res.status(200).send({ token });
});

// Route to get list of books
app.get("/api/books", authenticateToken, (req, res) => {
  res.status(200).send(books);
});

// Route to get the cart
app.get("/api/cart", authenticateToken, (req, res) => {
  res.status(200).send(cart);
});
// Route to add books to cart
app.post("/api/cart", authenticateToken, (req, res) => {
  const { book } = req.body;

  if (!book || !book.id) {
    return res.status(400).send({ message: "Invalid book data" });
  }

  const bookExists = books.find((b) => b.id === book.id);
  if (!bookExists) {
    return res.status(404).send({ message: "Book not found" });
  }

  cart.push(book);
  res.status(201).send({ message: "Book added to cart", cart });
});

// Route to submit the cart
app.post("/api/cart/submit", authenticateToken, (req, res) => {
  if (cart.length === 0) {
    return res.status(400).send({ message: "Cart is empty" });
  }

  // Here you would typically process the cart, e.g., save it to a database, charge the user, etc.
  // For demonstration purposes, we'll just clear the cart

  cart.length = 0; // Clear the cart

  res.status(200).send({ message: "Cart submitted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
