const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to Cafe Management System API');
});


app.post('/api/adminlogin', (req, res) => {
  const { username, password } = req.body;

  // Query to check if the username and password match any record in the database
  const query = 'SELECT * FROM tbl_admin WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // If a match is found, results.length should be greater than 0
    if (results.length > 0) {
      return res.json({ success: true, message: 'Login successful!' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});

app.post('/api/stafflogin', (req, res) => {
  const { username, password } = req.body;

  // Query to check if the username and password match any record in the database
  const query = 'SELECT * FROM tbl_staff WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // If a match is found, results.length should be greater than 0
    if (results.length > 0) {
      const staffId = results[0].id; // Get the staff's id from the result
      console.log(staffId); //
      return res.json({ success: true, message: 'Login successful!', staffId });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});

app.post('/api/customerlogin', (req, res) => {
  const { username, password } = req.body;

  // Query to check if the username and password match any record in the database
  const query = 'SELECT * FROM tbl_customers WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // If a match is found, results.length should be greater than 0
    if (results.length > 0) {
      const customerId = results[0].id; // Retrieve the customer's id from the result
      const customerName = results[0].name; // Retrieve the customer's name from the result
      return res.json({ success: true, message: 'Login successful!', customerId, customerName });
      
    } else {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});



// Assuming you have a MySQL setup with 'db' as your database connection
app.get('/api/staff/info', (req, res) => {
  // Retrieve staff ID from query parameters
  const staffId = req.query.id;

  const query = 'SELECT id, name, job, rating FROM tbl_staff WHERE id = ?';
  db.query(query, [staffId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching staff info.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Staff not found.' });
    }

    // Return the staff information
    res.json({
      id: result[0].id,
      name: result[0].name,
      job: result[0].job,
      rating: result[0].rating
    });
  });
});

// Endpoint to get live (pending) orders
app.get('/api/orders/live', (req, res) => {
  const query = 'SELECT id, total_amount FROM tbl_orders WHERE order_status = "pending"';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching live orders.' });
    }
    res.json(results);
  });
});

// Endpoint to update order status to "completed"
app.post('/api/orders/complete', (req, res) => {
  const { orderIds } = req.body;

  if (!orderIds || orderIds.length === 0) {
    return res.status(400).json({ error: 'No orders selected for completion.' });
  }

  const query = 'UPDATE tbl_orders SET order_status = "Completed" WHERE id IN (?)';
  
  db.query(query, [orderIds], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating order status.' });
    }
    res.json({ success: true, message: 'Selected orders marked as completed.' });
  });
});

// Endpoint for adding staff
app.post('/api/staff/add', (req, res) => {
  const { name,username,password,job,shift,salary,phno } = req.body;
  const query = 'INSERT INTO tbl_staff (name, username,password,job,shift,salary,phno) VALUES (?,?,?,?,?,?,?)';
  
  db.query(query, [name, username, password, job, shift, salary, phno], (err, result) => {
    if (err) {
      console.error('Database Error:', err.message);
      return res.status(500).json({ error: 'Error adding staff.', details: err.message });
    }
    res.json({ success: true, message: 'Staff added successfully.' });
  });
});

// Endpoint for removing staff
app.post('/api/staff/remove', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM tbl_staff WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error removing staff.' });
    }
    res.json({ success: true, message: 'Staff removed successfully.' });
  });
});

// Endpoint for taking order
// In your Express route controller
/*
app.post('/api/orders', async (req, res) => {
  const { customer_name, items, total_amount, order_status } = req.body;

  try {
    const orderQuery = `
      INSERT INTO tbl_orders (customer_name, total_amount, order_status)
      VALUES (?, ?, ?)
    `;
    const [orderResult] = await db.execute(orderQuery, [customer_name, total_amount, order_status]);
    const orderId = orderResult.insertId;

    // Insert each item into tbl_order_items
    const orderItemsQuery = `
      INSERT INTO tbl_order_items (order_id, item_id, quantity)
      VALUES (?, ?, ?)
    `;
    const itemPromises = items.map(item => db.execute(orderItemsQuery, [orderId, item.id, item.quantity]));
    await Promise.all(itemPromises);

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error placing order' });
  }
});
*/


// Backend Route for Customer Signup
app.post('/api/customersignup', (req, res) => {
  const { name, username, email, phoneNumber, password } = req.body;

  // Query to check if the username already exists
  const checkUsernameQuery = 'SELECT * FROM tbl_customers WHERE username = ?';
  db.query(checkUsernameQuery, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error while checking username' });
    }
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Query to check if the email already exists
    const checkEmailQuery = 'SELECT * FROM tbl_customers WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error while checking email' });
      }
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }

      // Insert the new customer into the tbl_customers table
      const insertQuery = 'INSERT INTO tbl_customers (name, username, email, phno, password) VALUES (?, ?, ?, ?, ?)';
      db.query(insertQuery, [name, username, email, phoneNumber, password], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error inserting customer data' });
        }
        return res.json({ success: true, message: 'Sign-up successful' });
      });
    });
  });
});



// Endpoint for adding customers
app.post('/api/customers/add', (req, res) => {
  const { name,email,username,password,phno } = req.body;
  const query = 'INSERT INTO tbl_customers (name,email,username,password,phno) VALUES (?,?,?,?,?)';
  
  db.query(query, [name,email,username,password,phno], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding customer.' });
    }
    res.json({ success: true, message: 'Customer added successfully.' });
  });
});

// Endpoint for removing customers
app.post('/api/customers/remove', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM tbl_customers WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error removing customer.' });
    }
    res.json({ success: true, message: 'Customer removed successfully.' });
  });
});

// Endpoint for adding items
app.post('/api/items/add', (req, res) => {
  const { name, category, price } = req.body;
  const query = 'INSERT INTO tbl_items (name, category, price) VALUES (?, ?, ?)';
  
  db.query(query, [name, category, price], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding item.' });
    }
    res.json({ success: true, message: 'Item added successfully.' });
  });
});

// Endpoint for removing items
app.post('/api/items/remove', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM tbl_items WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error removing item.' });
    }
    res.json({ success: true, message: 'Item removed successfully.' });
  });
});


//To get all menu data
// Endpoint to fetch menu items ordered by category
app.get('/api/tbl_items', (req, res) => {
  const query = 'SELECT * FROM tbl_items ORDER BY category';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching menu items.' });
    }
    res.json(results);
  });
});


/*
// Endpoint to fetch menu items using stored procedure
app.get('/api/tbl_items', (req, res) => {
  const query = 'CALL GetMenuItems()'; // Adjust if your procedure name or parameters differ

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching menu items.' });
    }
    res.json(results[0]); // Stored procedures return results as an array of arrays, so access the first element
  });
});

const createStoredProcedure = () => {
    const procedure = `
    DELIMITER //
    CREATE PROCEDURE IF NOT EXISTS GetMenuItems()
    BEGIN
        SELECT item_id, name, category, price
        FROM tbl_items;
    END //
    DELIMITER ;
    `;

    db.query(procedure, (error) => {
        if (error) {
            console.error('Error creating stored procedure:', error);
        } else {
            console.log('Stored procedure "GetMenuItems" created or already exists.');
        }
    });
};

createStoredProcedure();

// Endpoint to fetch previous orders by customer using stored procedure
app.get('/api/customers/:customerId/previous-orders', (req, res) => {
  const customerId = req.params.customerId;

  // Execute the stored procedure with the customerId as input
  const query = 'CALL GetPreviousOrdersByCustomer(?)';

  db.query(query, [customerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching previous orders.' });
    }
    // Since stored procedures return results as an array of arrays, access the first element
    res.json(results[0]);
  });
});
*/


// Endpoint to get previous orders for a customer
app.get('/api/customers/:customerId/previous-orders', (req, res) => {
  const customerId = req.params.customerId;
  
  const query = `
    SELECT 
      o.id AS order_id, 
      o.total_amount, 
      o.Timestamp, 
      i.name AS item_name, 
      oi.quantity 
    FROM tbl_orders o
    JOIN tbl_order_items oi ON o.id = oi.order_id
    JOIN tbl_items i ON oi.item_id = i.id
    WHERE o.customer_id = ?
    ORDER BY o.Timestamp DESC
  `;
  
  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error('Database Error:', err.message);
      return res.status(500).json({ error: 'Error fetching previous orders.' });
    }

    // Grouping orders by order ID for a structured response
    const orders = results.reduce((acc, row) => {
      const { order_id, total_amount, Timestamp, item_name, quantity } = row;
      if (!acc[order_id]) {
        acc[order_id] = {
          order_id,
          total_amount,
          timestamp: Timestamp,
          items: []
        };
      }
      acc[order_id].items.push({ item_name, quantity });
      return acc;
    }, {});
    
    res.json(Object.values(orders)); // Convert orders object to array for frontend
  });
});


// Example backend endpoint (Express.js)
/*
app.post('/api/orders', async (req, res) => {
  console.log(req.body); // Log the received order data

  const { customerId, items } = req.body;
  const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const timestamp = new Date();
  try {
    const orderResult = db.query(
      'INSERT INTO tbl_orders (customer_id, total_amount, order_status, Timestamp) VALUES (?, ?, ?, ?)',
      [customerId, totalAmount, 'Pending', timestamp]
    );
    
    const orderId = orderResult.insertId;
    const values = items.map(item => [orderId, item.itemId, item.quantity]);

    db.query(
      'INSERT INTO tbl_order_items (order_id, item_id, quantity) VALUES ?',
      [values]
    );

    res.status(201).json({
      message: 'Order placed successfully!',
      orderId,
      customerId,
      totalAmount,
      items,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place the order' });
  }
});
*/

app.post('/api/orders', (req, res) => {
  console.log(req.body); // Log the received order data

  const { customerId, items } = req.body;
  const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const timestamp = new Date();

  // First, check if the trigger exists and create it if not
  const createTriggerQuery = `
    CREATE TRIGGER IF NOT EXISTS update_inventory_after_order
    AFTER INSERT ON tbl_order_items
    FOR EACH ROW
    BEGIN
      UPDATE tbl_inventory i
      INNER JOIN tbl_item_ingredients ii ON i.id = ii.ingredient_id
      SET i.quantity = i.quantity - NEW.quantity
      WHERE ii.item_id = NEW.item_id;
    END;
  `;

  db.query(createTriggerQuery, (err) => {
    if (err) {
      console.error('Error creating trigger:', err);
      return res.status(500).json({ error: 'Failed to create trigger for inventory update' });
    }

    // Proceed with placing the order
    db.query(
      'INSERT INTO tbl_orders (customer_id, total_amount, order_status, Timestamp) VALUES (?, ?, ?, ?)',
      [customerId, totalAmount, 'Pending', timestamp],
      (error, orderResult) => {
        if (error) {
          console.error('Error inserting order:', error);
          return res.status(500).json({ error: 'Failed to place the order' });
        }

        const orderId = orderResult.insertId;
        const values = items.map(item => [orderId, item.itemId, item.quantity]);

        db.query(
          'INSERT INTO tbl_order_items (order_id, item_id, quantity) VALUES ?',
          [values],
          (err) => {
            if (err) {
              console.error('Error inserting order items:', err);
              return res.status(500).json({ error: 'Failed to add order items' });
            }

            res.status(201).json({
              message: 'Order placed successfully!',
              orderId,
              customerId,
              totalAmount,
              items,
            });
          }
        );
      }
    );
  });
});




// Endpoint to update the rating of a random staff member
app.post('/api/reviews/submit-review', (req, res) => {
  const { customerRating } = req.body;  // Assuming customerRating is passed in the request body
  
  // Query to get a random staff member
  const randomStaffQuery = 'SELECT * FROM tbl_staff ORDER BY RAND() LIMIT 1';
  
  db.query(randomStaffQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error selecting random staff member.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No staff found.' });
    }

    const staffId = results[0].id;
    const currentRating = results[0].rating;

    // Calculate new rating: (current rating + customer rating) / 2
    const newRating = (currentRating + customerRating) / 2;

    // Query to update the rating of the selected staff
    const updateRatingQuery = 'UPDATE tbl_staff SET rating = ? WHERE id = ?';
    
    db.query(updateRatingQuery, [newRating, staffId], (err, updateResult) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating staff rating.' });
      }

      res.json({ success: true, message: 'Staff rating updated successfully!', newRating });
    });
  });
});

app.get('/api/check-inventory', (req, res) => {
  const query = `SELECT id, name, quantity, threshold FROM tbl_inventory WHERE quantity < threshold`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching inventory:', err);
      return res.status(500).json({ error: 'Failed to fetch inventory' });
    }

    if (results.length === 0) {
      return res.json({ message: 'All items are in stock' });
    }

    res.json(results);
  });
});


const createProcedureQuery = `
  CREATE PROCEDURE IF NOT EXISTS updateInventoryQuantity(IN itemId INT, IN adjustment INT)
  BEGIN
      UPDATE tbl_inventory 
      SET quantity = GREATEST(quantity + adjustment, 0) -- Ensures quantity doesn’t go below zero
      WHERE id = itemId;
      
      SELECT 'Inventory updated successfully' AS message;
  END;
`;

// API to update inventory and call the stored procedure
app.post('/api/inventory/update', (req, res) => {
  const { itemId, adjustment } = req.body;

  // First, check if the procedure exists and create it if not
  db.query('SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = "updateInventoryQuantity"', (err, result) => {
    if (err) {
      console.error('Error checking procedure existence:', err);
      return res.status(500).json({ error: 'Failed to check procedure existence' });
    }

    // If the procedure does not exist, create it
    if (result.length === 0) {
      db.query(createProcedureQuery, (err, result) => {
        if (err) {
          console.error('Error creating procedure:', err);
          return res.status(500).json({ error: 'Failed to create procedure' });
        }

        // Once created, call the procedure
        callUpdateInventoryProcedure(itemId, adjustment, res);
      });
    } else {
      // If the procedure exists, just call it
      callUpdateInventoryProcedure(itemId, adjustment, res);
    }
  });
});

// Function to call the stored procedure
const callUpdateInventoryProcedure = (itemId, adjustment, res) => {
  const query = `CALL updateInventoryQuantity(?, ?)`;
  
  db.query(query, [itemId, adjustment], (err, result) => {
    if (err) {
      console.error('Error calling procedure:', err);
      return res.status(500).json({ error: 'Failed to call procedure' });
    }

    // Return a success message upon successful procedure call
    const message = result[0][0]?.message || 'Inventory updated successfully';
    res.json({ message });
  });
};


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//CONNECTING TO MySQL DATABASE
const db = require('./models/db');