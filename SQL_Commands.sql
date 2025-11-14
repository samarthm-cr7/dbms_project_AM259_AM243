CREATE DATABASE cafeproject;
SHOW databases;
USE cafeproject;
SHOW tables;

CREATE database cafemanagement;

CREATE TABLE tbl_admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE tbl_staff (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phno VARCHAR(20) NOT NULL,
  job VARCHAR(50) NOT NULL,
  shift VARCHAR(255) NOT NULL,
  salary FLOAT
);

CREATE TABLE tbl_customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phno VARCHAR(20) NOT NULL
);

CREATE TABLE tbl_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL
);

CREATE TABLE tbl_inventory(
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    staff_id INT,
    threshold INT NOT NULL,
    quantity INT
);

CREATE TABLE tbl_orders(
	id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    total_amount DECIMAL(10,2),
    order_status VARCHAR(20),
    Timestamp DATETIME,
    FOREIGN KEY (customer_id) REFERENCES tbl_customers(id)
);

CREATE TABLE tbl_order_items (
    order_id INT,
    item_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES tbl_orders(id),
    FOREIGN KEY (item_id) REFERENCES tbl_items(id)
);

CREATE TABLE tbl_item_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES tbl_items(id),
    FOREIGN KEY (ingredient_id) REFERENCES tbl_inventory(id)
);

ALTER TABLE tbl_staff
  ADD COLUMN rating FLOAT DEFAULT 0,
  ADD CONSTRAINT chk_rating CHECK (rating >= 0 AND rating <= 5);

ALTER TABLE tbl_items ADD CONSTRAINT unique_item_name UNIQUE (name);
ALTER TABLE tbl_items ADD price DECIMAL(10,2);

ALTER TABLE tbl_staff
ADD COLUMN rating FLOAT DEFAULT 0,
ADD CONSTRAINT chk_rating CHECK (rating >= 0 AND rating <= 5);


-- Insert values into tbl_admin
INSERT INTO tbl_admin (id, full_name, username, password)
VALUES 
(1, 'Alice John', 'adminAlice', 'adminPass123'),
(2, 'Ben Johnson', 'adminBen', 'admin123');

-- Insert values into tbl_customers
INSERT INTO tbl_customers (id, name, email, username, password, phno)
VALUES 
(1, 'Eve Adams', 'eve.adams@example.com', 'eveA', 'customerPass345', '555-8765'),
(2, 'Frank White', 'frank.white@example.com', 'frankW', 'customerPass678', '555-3456'),
(3, 'Hem', 'hem23@gmail.com', 'hem123', 'pass123', '9876543219'),
(4, 'Rinku Singh', 'rinku@gmail.com', 'rinkuS', 'rinku123', '1234567890'),
(6, 'Ishan', 'ishan@gmai.com', 'ishan', 'ishan123', '123456789');

-- Insert values into tbl_inventory
INSERT INTO tbl_inventory (id, name, staff_id, threshold, quantity)
VALUES 
(1, 'Coffee Beans', 1, 5, 20),
(2, 'Milk', 2, 10, 12),
(3, 'Sugar', 1, 5, 7),
(4, 'Bun', 1, 5, 47),
(5, 'Vegetables', 2, 10, 13);

-- Insert values into tbl_item_ingredients
INSERT INTO tbl_item_ingredients (id, item_id, ingredient_id)
VALUES 
(1, 7, 4),
(2, 7, 5),
(3, 1, 2),
(4, 1, 1);

-- Insert values into tbl_items
INSERT INTO tbl_items (id, name, category, price)
VALUES 
(1, 'Latte', 'Beverage', 3.50),
(2, 'Croissant', 'Bakery', 2.00),
(3, 'Espresso', 'Beverage', 2.50),
(7, 'Burger', 'Fast Food', 7.00),
(8, 'Pizza', 'Fast Food', 12.00);

-- Insert values into tbl_order_items
INSERT INTO tbl_order_items (order_id, item_id, quantity)
VALUES 
(1, 1, 1), (1, 2, 1),
(2, 3, 2), (4, 2, 2),
(26, 2, 1), (26, 7, 1),
(27, 2, 1), (27, 3, 1),
(27, 8, 2), (28, 2, 1), 
(28, 7, 1), (29, 2, 1),
(29, 3, 1), (30, 7, 1);

-- Insert values into tbl_orders
INSERT INTO tbl_orders (id, customer_id, total_amount, order_status, Timestamp)
VALUES 
(1, 1, 5.50, 'Completed', '2024-11-09 10:30:00'),
(2, 2, 7.00, 'Completed', '2024-11-09 11:00:00'),
(3, 3, 8.00, 'completed', '2024-11-09 07:10:00'),
(4, 2, 7.50, 'Pending', '2024-11-09 07:15:00'),
(24, 4, 3.50, 'Completed', '2024-11-11 00:24:58'),
(25, 2, 9.00, 'Completed', '2024-11-11 08:04:17'),
(26, 4, 9.00, 'Completed', '2024-11-11 19:27:54'),
(27, 4, 28.50, 'Completed', '2024-11-13 17:37:20'),
(28, 4, 9.00, 'Completed', '2024-11-14 08:24:35'),
(29, 4, 4.50, 'Pending', '2024-11-14 10:48:43'),
(30, 6, 7.00, 'Pending', '2024-11-14 13:49:38');

-- Insert values into tbl_staff
INSERT INTO tbl_staff (id, name, username, password, phno, job, shift, salary, rating)
VALUES 
(1, 'Charlie Smith', 'charlieS', 'staffPass789', '555-1234', 'Chef', 'Morning', 2500, 3.875),
(2, 'Daisy Johnson', 'daisyJ', 'staffPass012', '555-5678', 'Billing Desk', 'Evening', 2200, 4.25),
(3, 'Dean Jones', 'deanJ', 'staff123', '555-2345', 'Chef', 'Evening', 2500, 3.46875),
(4, 'John', 'johnA', 'john123', '123456789', 'Chef', 'Day', 2500, 4.2);


-- Update Commands
UPDATE tbl_staff
SET rating = 4.5
WHERE id = 1; 

UPDATE tbl_staff
SET rating = 4.0
WHERE id = 3; 

UPDATE tbl_orders
SET order_status = 'Completed'
WHERE id = 29; 

UPDATE tbl_items
SET price = 4.00
WHERE id = 1; 


-- Admin Login
SELECT * FROM tbl_admins WHERE username = 'adminAlice' AND password = 'adminPass123';

-- Staff Login
SELECT * FROM tbl_staff WHERE username = 'deanJ' AND password = 'staff123';

-- Customer Login
SELECT * FROM tbl_customers WHERE username = 'rinkuS' AND password = 'rinku123';

-- Live Orders
SELECT id, total_amount FROM tbl_orders WHERE order_status = "pending";

-- Change pending orders to completed once completed
UPDATE tbl_orders SET order_status = "Completed" WHERE id = 5;

-- Display Menu Items
SELECT * FROM tbl_items ORDER BY category;

-- Rate an order which assigns a random staff a rating
SELECT * FROM tbl_staff ORDER BY RAND() LIMIT 1;
UPDATE tbl_staff SET rating = (rating+4)/2 WHERE id = 2;


-- Procedure to update Inventory Quantity
DELIMITER $$

CREATE PROCEDURE  updateInventoryQuantity (
    IN itemId INT,         
    IN adjustment INT      
)
BEGIN
    -- Update the quantity in tbl_inventory, ensuring it doesn’t drop below zero
    UPDATE tbl_inventory 
    SET quantity = GREATEST(quantity + adjustment, 0)
    WHERE id = itemId;

    -- Return a success message to indicate the update was successful
    SELECT 'Inventory updated successfully' AS message;
END$$

DELIMITER ;

CALL updateInventoryQuantity(1, 7);


-- Trigger which updates inventory table based on order placed from items table
DELIMITER $$

CREATE TRIGGER update_inventory_after_order
AFTER INSERT ON tbl_order_items
FOR EACH ROW
BEGIN
    UPDATE tbl_inventory i
    INNER JOIN tbl_item_ingredients ii ON i.id = ii.ingredient_id
    SET i.quantity = i.quantity - NEW.quantity
    WHERE ii.item_id = NEW.item_id;
END$$

DELIMITER ;


-- Join Query
SELECT 
      o.id AS order_id, 
      o.total_amount, 
      o.Timestamp, 
      i.name AS item_name, 
      oi.quantity 
    FROM tbl_orders o
    JOIN tbl_order_items oi ON o.id = oi.order_id
    JOIN tbl_items i ON oi.item_id = i.id
    WHERE o.customer_id = 4
    ORDER BY o.Timestamp DESC
;


-- Nested Query
SELECT 
    o.id AS order_id, 
    o.total_amount, 
    o.Timestamp, 
    oi.quantity, 
    i.name AS item_name
FROM tbl_orders o
JOIN tbl_order_items oi ON o.id = oi.order_id
JOIN tbl_items i ON oi.item_id = i.id
WHERE o.order_status = 'Pending' 
AND o.customer_id = (
    SELECT id FROM tbl_customers WHERE username = 'rinkuS'
)
ORDER BY o.Timestamp DESC;

-- Aggregate Function
SELECT 
    o.customer_id, 
    COUNT(o.id) AS total_pending_orders
FROM 
    tbl_orders o
WHERE 
    o.order_status = 'Pending'
GROUP BY 
    o.customer_id;