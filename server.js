const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = 3000;

const options = {
  swaggerDefinition: {
    info: {
      title: "Swagger - REST API Documentation - ITIS-6177-Assignment08",
      description: "REST API Documentation Authored by Mohammad Arif",
      version: "3.0.0"
    },
  },
  apis: ["server.js"],
};

const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// MariaDB connection pool configuration
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sample',
  connectionLimit: 5,
});

// Sanitization
const sanitizeTodo = [
  body("task").trim().escape(),
  body("completed").toBoolean(),
];

// Customer sanitization
const sanitizeCustomer = [
  body("customerCode").trim().escape(),
  body("customerName").trim().escape(),
  body("customerCity").trim().escape(),
  body("workingArea").trim().escape(),
  body("customerCountry").trim().escape(),
  body("grade").trim().escape(),
  body("agentCode").trim().escape(),
  body("completed").toBoolean(),
];

// Customer validation
const validateCustomer = [
  body("customerCode").notEmpty().withMessage("Customer code is required."),
  body("customerName").notEmpty().withMessage("Customer name is required."),
  body("customerCity").notEmpty().withMessage("Customer city is required."),
  body("workingArea").notEmpty().withMessage("Working area is required."),
  body("customerCountry")
    .notEmpty()
    .withMessage("Customer country is required."),
  body("grade").notEmpty().withMessage("Grade is required."),
  body("agentCode").notEmpty().withMessage("Agent code is required."),
];

// Customer validation rules
const updateCustomerValidationRules = [
  body("customerName").trim().notEmpty(),
  body("customerCity").trim().notEmpty(),
  body("customerCountry").trim().notEmpty(),
  body("customerCode").trim().notEmpty(),
];


// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Define the root route
app.get('/', (req, res) => {
    res.send('Welcome to Arif homepage for Swagger API learning!');
  });

/**
 * @swagger
 * /api/agent:
 *   get:
 *     summary: Get agent data
 *     description: Get all agent data from the database.
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Agent'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   Agent:
 *     type: object
 *     properties:
 *       AGENT_CODE:
 *         type: string
 *       AGENT_NAME:
 *         type: string
 *       WORKING_AREA:
 *         type: string
 *       COMMISSION:
 *         type: string
 *       PHONE_NO:
 *         type: string
 *       COUNTRY:
 *         type: string
 */

//Get API#1 - Get Agents Data
// Route for handling GET request
app.get('/api/agent', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Execute query
    const rows = await connection.query('select trim(AGENT_CODE) AGENT_CODE, trim(AGENT_NAME) AGENT_NAME, trim(WORKING_AREA) WORKING_AREA, trim(COMMISSION) COMMISSION, trim(PHONE_NO) PHONE_NO, trim(COUNTRY) COUNTRY from agents');

    // Release the connection back to the pool
    connection.release();

    // Send the retrieved data as JSON response
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * @swagger
 * /api/company:
 *   get:
 *     summary: Get company data
 *     description: Get company data from the database.
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Company'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   Company:
 *     type: object
 *     properties:
 *       COMPANY_ID:
 *         type: string
 *       COMPANY_NAME:
 *         type: string
 *       COMPANY_CITY:
 *         type: string
 */

//Get API#2 - Get Company Data
// Route for handling GET request
app.get('/api/company', async (req, res) => {
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Execute query
      const rows = await connection.query('select trim(COMPANY_ID) COMPANY_ID, trim(COMPANY_NAME) COMPANY_NAME, trim(COMPANY_CITY) COMPANY_CITY from company');

      // Release the connection back to the pool
      connection.release();

      // Send the retrieved data as JSON response
      res.json(rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  });

/**
 * @swagger
 * /api/customer:
 *   get:
 *     summary: Get customer data
 *     description: Get all customer from the database.
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Customer'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   Customer:
 *     type: object
 *     properties:
 *       CUSTOMER_CODE:
 *         type: string
 *       CUSTOMER_NAME:
 *         type: string
 *       CUSTOMER_CITY:
 *         type: string
 *       WORKING_AREA:
 *         type: string
 *       CUSTOMER_COUNTRY:
 *         type: string
 *       GRADE:
 *         type: string
 *       OPENING_AMT:
 *         type: string
 *       RECEIVE_AMT:
 *         type: string
 *       PAYMENT_AMT:
 *         type: string
 *       OUTSTANDING_AMT:
 *         type: string
 *       PHONE_NO:
 *         type: String
 *       AGENT_CODE:
 *         type: String
 */

//Get API#3 - Get Customer Data
// Route for handling GET request
app.get('/api/customer', async (req, res) => {
    try {
// Get a connection from the pool
      const connection = await pool.getConnection();

// Execute query
      const rows = await connection.query('select trim(CUST_CODE) CUSTOMER_CODE, trim(CUST_NAME) CUSTOMER_NAME, trim(CUST_CITY) CUSTOMER_CITY, trim(WORKING_AREA) WORKING_AREA, trim(CUST_COUNTRY) CUSTOMER_COUNTRY, trim(GRADE) GRADE, trim(OPENING_AMT) OPENING_AMT, trim(RECEIVE_AMT) RECEIVE_AMT, trim(PAYMENT_AMT) PAYMENT_AMT, trim(OUTSTANDING_AMT) OUTSTANDING_AMT, trim(PHONE_NO) PHONE_NO, trim(AGENT_CODE) AGENT_CODE from customer');

// Release the connection back to the pool
      connection.release();

// Send the retrieved data as JSON response
      res.json(rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  });

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get order data
 *     description: Get all order from the database.
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Order'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   Order:
 *     type: object
 *     properties:
 *       ORD_NUM:
 *         type: string
 *       productName:
 *         type: string
 *       ORD_AMOUNT:
 *         type: string
 *       ADVANCE_AMOUNT:
 *         type: string
 *       ORD_DATE:
 *         type: string
 *       CUST_CODE:
 *         type: string
 *       AGENT_CODE:
 *         type: string
 *       ORD_DESCRIPTION:
 *         type: string
 */

//Get API#4 - Get Order Data
// Route for handling GET request
app.get('/api/order', async (req, res) => {
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Execute query
      const rows = await connection.query('select trim(ORD_NUM) ORD_NUM, trim(ORD_AMOUNT) ORD_AMOUNT, trim(ADVANCE_AMOUNT) ADVANCE_AMOUNT, trim(ORD_DATE) ORD_DATE, trim(CUST_CODE) CUST_CODE,trim(AGENT_CODE) AGENT_CODE, trim(ORD_DESCRIPTION) ORD_DESCRIPTION from daysorder');

      // Release the connection back to the pool
      connection.release();

      // Send the retrieved data as JSON response
      res.json(rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  });

/**
 * @swagger
 * /api/food:
 *   get:
 *     summary: Get food items
 *     description: Get all food items from the database.
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Food'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   Food:
 *     type: object
 *     properties:
 *       ITEM_ID:
 *         type: string
 *       ITEM_NAME:
 *         type: string
 *       ITEM_UNIT:
 *         type: string
 *       COMPANY_ID:
 *         type: string
 */

//Get API#5 - Get Food Data
// Route for handling GET request
app.get('/api/food', async (req, res) => {
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Execute query
      const rows = await connection.query('select trim(ITEM_ID) ITEM_ID, trim(ITEM_NAME) ITEM_NAME, trim(ITEM_UNIT) ITEM_UNIT, trim(COMPANY_ID) COMPANY_ID from foods');

      // Release the connection back to the pool
      connection.release();

      // Send the retrieved data as JSON response
      res.json(rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  });

/**
 * @swagger
 * /api/student:
 *   get:
 *     summary: Get student report data
 *     description: Get all students and their reports from the database.
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Student'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   Student:
 *     type: object
 *     properties:
 *       NAME:
 *         type: string
 *       TITLE:
 *         type: string
 *       CLASS:
 *         type: string
 *       SECTION:
 *         type: string
 *       ROLL_ID:
 *         type: string
 *       GRADE:
 *         type: string
 *       SEMESTER:
 *         type: string
 *       CLASS_ATTENDED:
 *         type: string
 */

//Get API#6 - Get Students Data
// Route for handling GET request
app.get('/api/student', async (req, res) => {
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Execute query
      const rows = await connection.query('select trim(a.NAME) NAME, trim(a.TITLE) TITLE, trim(a.CLASS) CLASS, trim(a.SECTION) SECTION, trim(a.ROLLID) ROLL_ID, trim(b.GRADE) GRADE, trim(b.SEMISTER) SEMESTER, trim(b.CLASS_ATTENDED) CLASS_ATTENDED from student a, studentreport b where trim(a.ROLLID) = trim(b.ROLLID)');

      // Release the connection back to the pool
      connection.release();

      // Send the retrieved data as JSON response
      res.json(rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// POST API
/**
 * @swagger
 * /api/agent:
 *   post:
 *     summary: Add new agent
 *     description: Add new agent to the database
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Add Agent data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *               agentCode:
 *                 type: string
 *               agentName:
 *                 type: string
 *               workingArea:
 *                 type: string
 *               commission:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful operation - Agent added successfully
 *       400:
 *         description: Bad request, validation failed
 *       500:
 *         description: Internal server error
 */

// POST API - Add Agent data
// Route POST request 
app.post(
  "/api/agent",
  [
    // Sanitization and transformation
    body("agentCode").trim().escape(),
    body("agentName").trim().escape(),
    body("workingArea").trim().escape(),
    body("commission").trim().escape(),
    body("phoneNo").trim().escape(),
    body("country").trim().escape(),

    // Validation
    body("agentCode").notEmpty().isString(),
    body("agentName").notEmpty().isString(),
    body("workingArea").notEmpty().isString(),
    body("commission").notEmpty().isString(),
    body("phoneNo").notEmpty().isString(),
    body("country").notEmpty().isString(),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    pool.getConnection().then((conn) => {
      conn
        .query(
          "INSERT INTO agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) VALUES (?, ?, ?, ?, ?, ?)",
          [
            req.body.agentCode,
            req.body.agentName,
            req.body.workingArea,
            req.body.commission,
            req.body.phoneNo,
            req.body.country,
          ]
        )
        .then((rows) => {
          res.status(200).json({ message: "Agent added successfully" });
          conn.end();
        })
        .catch((err) => {
          res.status(500).json({ error: "Internal server error" });
          conn.end();
        });
    });
  }
);

// PATCH API
/**
 * @swagger
 * /api/customerByCustomerCode:
 *   patch:
 *     summary: Update customer by customer code
 *     description: Update the customer in the database based on the customer code.
 *     parameters:
 *       - in: query
 *         name: customerCode
 *         description: Customer code of the customer to update
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: Fields to update for the customer
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             customerName:
 *               type: string
 *             customerCity:
 *              type: string
 *             customerCountry:
 *               type: string
 *             customerCode:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful operation - Customer updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */

// PATCH API - Get Customers By Customer Code
// Route PATCH request 
app.patch(
  "/api/customerByCustomerCode",
  updateCustomerValidationRules,
  handleValidationErrors,
  (req, res) => {
    const customerCode = req.query.customerCode;
    if (!customerCode) {
      res.status(400).json({ error: "Customer Code is required" });
      return;
    }

    const { customerName, customerCity, customerCountry } = req.body;

    pool.getConnection().then((conn) => {
      conn
        .query(
          "UPDATE customer set CUST_NAME=?, CUST_CITY=?, CUST_COUNTRY=? where CUST_CODE=?",
          [customerName, customerCity, customerCountry, customerCode]
        )
        .then((rows) => {
          res.status(200).json({ message: "Customer updated successfully" });
          conn.end();
        })
        .catch((err) => {
          res.status(500).json({ error: "Internal server error" });
          conn.end();
        });
    });
  }
);

// PUT API
/**
 * @swagger
 * /api/agent:
 *   put:
 *     summary: Update agent data
 *     description: Update agent data into the database.
 *     parameters:
 *       - in: query
 *         name: agentCode
 *         description: Agent code of the agent to update
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: Fields to update for the agent
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             agentName:
 *               type: string
 *             workingArea:
 *              type: string
 *             commission:
 *               type: string
 *             phoneNo:
 *               type: string
 *             country:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful operation - Agent updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */

// PUT API - Update Agent data
// Route PUT request 
app.put(
      "/api/agent/",
      (req, res) => {
        const agentCode = req.query.agentCode;
        if (!agentCode) {
          res.status(400).json({ error: "Agent Code is required" });
          return;
        }
        const { agentName, workingArea, commission, phoneNo, country } = req.body;
        
        pool.getConnection().then((conn) => {
          conn
            .query(
              "UPDATE agents SET AGENT_NAME=?, WORKING_AREA=?, COMMISSION=?, PHONE_NO=?, COUNTRY=? WHERE AGENT_CODE=?",
              [agentName, workingArea, commission, phoneNo, country, agentCode]
            )
            .then((rows) => {
              if (rows.affectedRows === 0) {
                res.status(404).json({ error: "Agent not found" });
              } else {
                res.status(200).json({ message: "Agent updated successfully" });
              }
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ error: "Internal server error" });
            })
            .finally(() => {
              conn.end();
            });
        });
      }
    );

// DELETE API
/**
 * @swagger
 * /api/customerByCustomerCode:
 *   delete:
 *     summary: Delete customer by customer code
 *     description: Deletes a customer from the database based on the provided Customer code.
 *     parameters:
 *       - in: query
 *         name: customerCode
 *         description: Customer code of the customer to delete
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation - Customer deleted successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */

// DELETE API - Delete Customers By Customer Code
// Route DELETE request
app.delete("/api/customerByCustomerCode", (req, res) => {
  const customerCode = req.query.customerCode;
  if (!customerCode) {
    res.status(400).json({ error: "Customer Code is required" });
    return;
  }

  pool.getConnection().then((conn) => {
    conn
      .query("DELETE FROM customer where CUST_CODE=?", [customerCode])
      .then((rows) => {
        res.status(200).json({ message: "Customer deleted successfully" });
        conn.end();
      })
      .catch((err) => {
        res.status(500).json({ error: "Internal server error" });
        conn.end();
      });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});