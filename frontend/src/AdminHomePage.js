import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHomePage = () => {
  const [view, setView] = useState('home');
  const navigate = useNavigate();

  // State for adding and removing staff/customers/items
  const [newStaff, setNewStaff] = useState({ name: '', password: '' ,username:'',phno:'',job:'',salary:'',shift:''});
  const [removeStaff, setRemoveStaff] = useState({ name: '', id: '' });
  const [newCustomer, setNewCustomer] = useState({ name: '', password: '' });
  const [removeCustomer, setRemoveCustomer] = useState({ name: '', id: '' });
  const [newItem, setNewItem] = useState({ name: '', category: '' });
  const [removeItem, setRemoveItem] = useState({ name: '', category: '', id: '' });
  const [lowInventoryItems, setLowInventoryItems] = useState([]);
  // State to manage the quantity for each item
  const [quantities, setQuantities] = useState({});

  const handleEditStaff = () => {
    setView('editStaff');
  };

  const handleEditCustomer = () => {
    setView('editCustomer');
  };

  const handleEditMenu = () => {
    setView('editMenu');
  };

  const handleCheckInventory = () => {
    setView('inventory');
    fetchLowInventory();
  };

  const handleLogout = () => {    
    // Redirect to login page
    navigate('/login');
  };

  const handleSubmitNewStaff = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/staff/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });

      const data = await response.json();
      if (data.success) {
        alert('Staff added successfully');
      } else {
        alert('Failed to add staff');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  
    setNewStaff({ name: '', password: '', username:'',phno:'',job:'',salary:'',shift:''}); // Clear inputs
  };
  
  const handleSubmitRemoveStaff = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/staff/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: removeStaff.id }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Staff removed successfully');
      } else {
        alert('Failed to remove staff');
      }
    } catch (error) {
      console.error('Error removing staff:', error);
    }
  
    setRemoveStaff({ name: '', id: '' }); // Clear inputs
  };



  const handleSubmitNewCustomer = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customers/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Customer added successfully');
      } else {
        alert('Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  
    setNewCustomer({ name: '',email:'',username:'',password: '',phno:'' });
  };
  
  const handleSubmitRemoveCustomer = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customers/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: removeCustomer.id }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Customer removed successfully');
      } else {
        alert('Failed to remove customer');
      }
    } catch (error) {
      console.error('Error removing customer:', error);
    }
  
    setRemoveCustomer({ name: '', id: '' });
  };


  const handleSubmitNewItem = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      const data = await response.json();
      if (data.success) {
        alert('Item added successfully');
      } else {
        alert('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }

    setNewItem({ name: '', category: '', price: '' });
  };
  
  const handleSubmitRemoveItem = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: removeItem.id }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Item removed successfully');
      } else {
        alert('Failed to remove Item');
      }
    } catch (error) {
      console.error('Error removing Item:', error);
    }
  
    setRemoveItem({ name: '', category:'' , id: '' });
  };

  //useEffect(() => {
  // if (view === 'inventory') {
  //    fetchLowInventory();
  //  }
  //}, [view]);

  const fetchLowInventory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/check-inventory');
      const data = await response.json();
      
      // If there's a message indicating that all items are in stock
      if (data.message) {
        setLowInventoryItems([]); // No items to display
        alert(data.message); // Show alert to user
      } else {
        setLowInventoryItems(data); // Set low inventory items
      }
    } catch (error) {
      console.error("Failed to fetch inventory data:", error);
    }
  };
  
  const handleInputChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, parseInt(value) || 1), // Ensure value is at least 1
    }));
  };
  
  // Handle quantity adjustment when the +/- buttons are clicked
  const handleQuantityChange = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + change), // Ensure value is at least 1
    }));
  };
  
  // Handle adding the adjusted quantity to the inventory
  const handleAddInventory = async (id) => {
    const quantityToAdd = quantities[id] || 1; // Default to 1 if no value exists
  
    try {
      const response = await fetch(`http://localhost:5000/api/inventory/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id, adjustment: quantityToAdd }),
      });
  
      const data = await response.json();
  
      if (data.message) {
        alert(data.message); // Show the message from the backend
      }
  
      fetchLowInventory(); // Refresh the inventory after update
    } catch (error) {
      console.error("Failed to update inventory:", error);
    }
  };
  


  return (
    <div style={styles.adminHomePage}>
      <div className="top-dashboard" style={styles.topDashboard}>
        <h2 style={styles.cafeName}>Cafe Name</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div className="main-content" style={styles.mainContent}>
        <div className="info-box" style={styles.infoBox}>
          <h1 style={styles.welcomeMessage}>Hey, Welcome Admin</h1>
          <img src="cafe-image.jpg" alt="Cafe" style={styles.cafeImage} />
        </div>

        <div className="admin-buttons" style={styles.adminButtons}>
          {view === 'home' && (
            <>
              <button onClick={handleEditStaff} style={styles.button}>Edit Staff Data</button>
              <button onClick={handleEditCustomer} style={styles.button}>Edit Customer Data</button>
              <button onClick={handleEditMenu} style={styles.button}>Edit Menu</button>
              <button onClick={handleCheckInventory} style={styles.button}>Check Inventory</button>

            </>
          )}

          {view === 'editStaff' && (
            <>
              <div style={styles.scrollableContainer}>
              <h3>Add Staff</h3>
              <input 
                type="text" 
                placeholder="Name" 
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                style={styles.input}
                required 
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newStaff.phno}
                onChange={(e) => setNewStaff({ ...newStaff, phno: e.target.value })}
                style={styles.input}
                required
              />
              <input 
                type="text" 
                placeholder="Username" 
                value={newStaff.username}
                onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                style={styles.input} 
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={newStaff.password}
                onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                style={styles.input} 
                required
              />
              <select 
                type="option"
                value={newStaff.job} 
                onChange={(e) => setNewStaff({ ...newStaff, job: e.target.value })} 
                style={styles.input}
              >
                <option value="">Select Job Type</option>
                <option value="Chef">Chef</option>
                <option value="Billing Desk">Billing Desk</option>
              </select>
              <input 
                type="number" 
                placeholder="Salary" 
                value={newStaff.salary}
                onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                style={styles.input} 
              />
              <select 
                type="option"
                value={newStaff.shift} 
                onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })} 
                style={styles.input}
              >
                <option value="">Select Shift</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
              <button onClick={handleSubmitNewStaff} style={styles.button}>Submit</button>

              <h3>Remove Staff</h3>
              <input 
                type="text" 
                placeholder="Staff Name" 
                value={removeStaff.name}
                onChange={(e) => setRemoveStaff({ ...removeStaff, name: e.target.value })}
                style={styles.input} 
              />
              <input 
                type="text" 
                placeholder="Staff ID" 
                value={removeStaff.id}
                onChange={(e) => setRemoveStaff({ ...removeStaff, id: e.target.value })}
                style={styles.input} 
              />
              <button onClick={handleSubmitRemoveStaff} style={styles.button}>Remove</button>

              <button onClick={() => setView('home')} style={styles.backButton}>Back</button>
              </div>
            </>
          )}

          {view === 'editCustomer' && (
            <>
              <div style={styles.scrollableContainer}>
              <h3>Add Customer</h3>
              <input 
                type="text" 
                placeholder="Name" 
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                style={styles.input} 
                required
              />

              <input 
                type="email" 
                placeholder="Email" 
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                style={styles.input} 
                required
              />
              
              <input 
                type="text" 
                placeholder="Username" 
                value={newCustomer.username}
                onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
                style={styles.input} 
                required
              />
              
              <input 
                type="password" 
                placeholder="Password" 
                value={newCustomer.password}
                onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                style={styles.input}
                required 
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newCustomer.phno}
                onChange={(e) => setNewCustomer({ ...newCustomer, phno: e.target.value })}
                style={styles.input}
                required
              />
              <button onClick={handleSubmitNewCustomer} style={styles.button}>Submit</button>

              <h3>Remove Customer</h3>
              <input 
                type="text" 
                placeholder="Customer Name" 
                value={removeCustomer.name}
                onChange={(e) => setRemoveCustomer({ ...removeCustomer, name: e.target.value })}
                style={styles.input} 
              />
              <input 
                type="text" 
                placeholder="Customer ID" 
                value={removeCustomer.id}
                onChange={(e) => setRemoveCustomer({ ...removeCustomer, id: e.target.value })}
                style={styles.input} 
              />
              <button onClick={handleSubmitRemoveCustomer} style={styles.button}>Remove</button>

              <button onClick={() => setView('home')} style={styles.backButton}>Back</button>
              </div>
            </>
          )}

          {view === 'editMenu' && (
            <>
              <h3>Add Item</h3>
              <input 
                type="text" 
                placeholder="Item Name" 
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                style={styles.input} 
              />
              <input 
                type="text" 
                placeholder="Item Category" 
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                style={styles.input} 
              />
              <input 
                type="number" 
                placeholder="Price" 
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                required
                style={styles.input}
              />
              <button onClick={handleSubmitNewItem} style={styles.button}>Submit</button>

              <h3>Remove Item</h3>
              <input 
                type="text" 
                placeholder="Item Name" 
                value={removeItem.name}
                onChange={(e) => setRemoveItem({ ...removeItem, name: e.target.value })}
                style={styles.input} 
              />
              <input 
                type="text" 
                placeholder="Item Category" 
                value={removeItem.category}
                onChange={(e) => setRemoveItem({ ...removeItem, category: e.target.value })}
                style={styles.input} 
              />
              <input 
                type="text" 
                placeholder="Item ID" 
                value={removeItem.id}
                onChange={(e) => setRemoveItem({ ...removeItem, id: e.target.value })}
                style={styles.input} 
              />
              <button onClick={handleSubmitRemoveItem} style={styles.button}>Remove</button>

              <button onClick={() => setView('home')} style={styles.backButton}>Back</button>
            </>
          )}

          {view === 'inventory' && (
            <>
            <h3>Low Inventory Items</h3>
            {lowInventoryItems.length > 0 ? (
              <ul>
                {lowInventoryItems.map((item) => (
                  <li key={item.id} style={styles.inventoryItem}>
                    {item.name} - Quantity: {item.quantity} (Threshold: {item.threshold})
                    {/* Quantity control */}
                    <div style={styles.quantityControl}>
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        style={styles.decrementButton}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantities[item.id] || 1}
                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                        style={styles.quantityInput}
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        style={styles.incrementButton}
                      >
                        +
                      </button>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={() => handleAddInventory(item.id)}
                      style={styles.addButton}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>All items are in stock.</p>
            )}
            <button onClick={() => setView('home')} style={styles.backButton}>Back</button>
          </>
        )}
        </div>
      </div>

      

      <div className="bottom-dashboard" style={styles.bottomDashboard}>
        <p style={styles.address}>Address: 123 Cafe Street</p>
        <p style={styles.contactUs}>Contact Us: info@cafe.com</p>
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
  welcomeMessage: {
    color: 'white',
  },
  cafeName: {
    color: 'white',
    margin: 0,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff8c00',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#808080', 
    color: 'white', 
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cafeImage: {
    maxWidth: '100%',
    height: 'auto',
  },
  adminButtons: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    flex: 1,
  },
  button: {
    backgroundColor: '#ff8c00',
    color: 'white',
    padding: '10px 20px',
    margin: '10px 0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '80%',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    width: '80%',
  },
  backButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px 20px',
    margin: '10px 0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '80%',
  },
  bottomDashboard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    textAlign: 'center',
  },
  address: {
    margin: 0,
  },
  contactUs: {
    margin: 0,
  },
  scrollableContainer: {
    overflowY: 'auto',   // Make the content scrollable vertically
    marginBottom: '20px' // Optional, to add space between sections
  },
  inventoryItem: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  incrementButton: {
    marginLeft: '10px',
    padding: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  decrementButton: {
    marginLeft: '5px',
    padding: '5px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};



export default AdminHomePage;