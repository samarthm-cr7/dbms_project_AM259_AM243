import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CustomerHomepage = () => {
  const location = useLocation();
  const customerName = location.state?.customerName || "Customer";
  const navigate = useNavigate();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isPreviousOrdersVisible, setIsPreviousOrdersVisible] = useState(false);
  const [isOrderFormVisible, setIsOrderFormVisible] = useState(false); // New state for order form
  const [menuItemsByCategory, setMenuItemsByCategory] = useState({});
  const [previousOrders, setPreviousOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({}); // State to hold selected items and quantities
  const [totalAmount, setTotalAmount] = useState(0); // State to store total amount
  const [submittedReviews, setSubmittedReviews] = useState(new Set()); 

  const handleLogout = () => {
    navigate('/login');
  };

  const handleViewMenu = () => {
    setIsMenuVisible(true);
    setIsPreviousOrdersVisible(false);
    setIsOrderFormVisible(false); // Hide order form
    fetchMenuData();
  };

  const handleViewPreviousOrders = () => {
    setIsPreviousOrdersVisible(true);
    setIsMenuVisible(false);
    setIsOrderFormVisible(false); // Hide order form
    fetchPreviousOrders();
  };

  const handlePlaceOrder = () => {
    setIsOrderFormVisible(true); // Show order form when the button is clicked
    setIsMenuVisible(false);
    setIsPreviousOrdersVisible(false);
  };

  const handleSubmitReview = async (orderId, rating) => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerRating: parseInt(rating) })
      });
  
      if (response.ok) {
        alert('Review submitted successfully!');
        setSubmittedReviews(prev => new Set(prev.add(orderId))); // Add the orderId to the Set
      } else {
        alert('Failed to submit review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const fetchMenuData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tbl_items');
      const menuItems = await response.json();

      const groupedItems = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {});
      setMenuItemsByCategory(groupedItems);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const fetchPreviousOrders = async () => {
    try {
      const customerId = location.state?.customerId; // Pass customer ID from state or props
      const response = await fetch(`http://localhost:5000/api/customers/${customerId}/previous-orders`);
      const orders = await response.json();
      setPreviousOrders(orders);
    } catch (error) {
      console.error('Failed to fetch previous orders:', error);
    }
  };

  const handleQuantityChange = (itemId, change, price) => {
    setOrderItems((prev) => {
      const newOrderItems = { ...prev };
      if (!newOrderItems[itemId]) newOrderItems[itemId] = 0;
      newOrderItems[itemId] += change;
      if (newOrderItems[itemId] <= 0) delete newOrderItems[itemId]; // Remove item if quantity is zero or less
      return newOrderItems;
    });

    //Set total amount
    setTotalAmount((prevTotal) => prevTotal + change * price);
  };

  const handleConfirmOrder = async () => {
    try {
      const customerId = location.state?.customerId;
      const orderData = {
        customerId,
        items: Object.entries(orderItems).map(([itemId, quantity]) => {
          let price = 0;
          // Get the price from the menu items
          Object.values(menuItemsByCategory).forEach(categoryItems => {
            const item = categoryItems.find(item => item.id === parseInt(itemId));
            if (item) price = item.price;
          });
  
          return {
            itemId: parseInt(itemId),
            quantity,
            price,
          };
        }),
      };
  
      console.log("Order Data: ", JSON.stringify(orderData)); // Debugging log
  
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Order placed successfully!');
        setOrderItems({});
        setIsOrderFormVisible(false);
        setIsMenuVisible(false);
      } else {
        alert('Failed to place the order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };  
  
  

  return (
    <div style={styles.adminHomePage}>
      <div className="top-dashboard" style={styles.topDashboard}>
        <h2 style={styles.cafeName}>CAFE GRYFFINDOR</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content" style={styles.mainContent}>
        <div style={styles.cafeName} className="about-cafe">
          <h2 style={styles.welcomeMessage}>Welcome to Cafe</h2>
          <h3 style={styles.customerGreeting}>Hey, {customerName}</h3>
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={handleViewMenu}>
              View Menu
            </button>
            <button style={styles.button} onClick={handleViewPreviousOrders}>
              View Previous Orders
            </button>
            <button style={styles.button} onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>

        <div className="cafe-image" style={styles.cafeImage}>
          {isMenuVisible ? (
            <div className="menu-container" style={styles.menuContainer}>
              {Object.keys(menuItemsByCategory).map(category => (
                <div key={category} style={styles.categorySection}>
                  <h3>{category}</h3>
                  <table style={styles.menuTable}>
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItemsByCategory[category].map(menuItem => (
                        <tr key={menuItem.id}>
                          <td>{menuItem.name}</td>
                          <td>${menuItem.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : isPreviousOrdersVisible ? (
            <div className="previous-orders-container" style={styles.previousOrdersContainer}>
              <h3>Previous Orders</h3>
              {previousOrders.length > 0 ? (
                previousOrders.map(order => (
                <div key={order.order_id} style={styles.orderItem}>
                  <h4>Order ID: {order.order_id}</h4>
                  {/* Other order details */}
                  <label>
                    Rating:
                    <select defaultValue="4" id={`rating-${order.order_id}`}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </label>
                  {!submittedReviews.has(order.order_id) && (
                    <button
                      style={styles.submitReviewButton}
                      onClick={() => {
                        const rating = document.getElementById(`rating-${order.order_id}`).value;
                        handleSubmitReview(order.order_id, rating);
                      }}
                    >
                      Submit Review
                    </button>
                  )}
                  <hr />
                </div>
              ))
              ) : (
                <p>No previous orders found.</p>
              )}
            </div>
          ) : isOrderFormVisible ? (
            <div className="order-form-container" style={styles.menuContainer}>
              <h3>Select Items for Your Order</h3>
              {Object.keys(menuItemsByCategory).map(category => (
                <div key={category} style={styles.categorySection}>
                  <h4>{category}</h4>
                  <div>
                    {menuItemsByCategory[category].map(menuItem => (
                      <div key={menuItem.id} style={{ marginBottom: '10px' }}>
                        <span>{menuItem.name} - ${menuItem.price}</span>
                        <button onClick={() => handleQuantityChange(menuItem.id, 1, menuItem.price)}>+</button>
                        <button onClick={() => handleQuantityChange(menuItem.id, -1, menuItem.price)}>-</button>
                        <span>{orderItems[menuItem.id] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <h4>Total Amount: ${totalAmount}</h4>
              <button onClick={handleConfirmOrder} style={styles.submitReviewButton}>Confirm Order</button>
            </div>
          ) : (
            <div style={styles.slidingImages}>
              <img src="your-image-url.jpg" alt="Cafe" style={styles.image} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Dashboard with Address and Contact Us */}
      <div className="bottom-dashboard">
        <p className="address">Address: 123 Cafe Street</p>
        <p className="contact-us">Contact Us: info@cafe.com</p>
      </div>
    </div>
  );
};

const styles = {
  topDashboard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', 
    padding: '10px 20px',
  },
  adminHomePage: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff8c00',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '13px'
  },
  mainContent: { display: 'flex', height: '50vh' },
  cafeName: { color: 'orange'},
  aboutCafe: { width: '50%', padding: '20px', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  cafeImage: { width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  slidingImages: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', overflow: 'hidden' },
  image: { maxHeight: '100%', maxWidth: '100%' },
  welcomeMessage: { fontSize: '2rem', color: 'white' },
  customerGreeting: { fontSize: '1.5rem', color: 'white' },
  buttonContainer: { marginTop: '20px' },
  button: { backgroundColor: '#ff8c00', color: 'white', padding: '10px 20px', margin: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1rem' },
  menuContainer: { width: '100%', textAlign: 'center', marginTop: '20px' },
  categorySection: { marginBottom: '20px' },
  menuTable: { width: '100%', borderCollapse: 'collapse' },
  previousOrdersContainer: { width: '100%', textAlign: 'center', padding: '20px' },
  orderItem: { padding: '10px', border: '1px solid #ddd', marginBottom: '10px' },
  submitReviewButton: { backgroundColor: '#ff8c00', color: 'white', padding: '5px 10px' }
};

export default CustomerHomepage;