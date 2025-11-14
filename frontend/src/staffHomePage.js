import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StaffHomePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const staffId = params.get('id');

  const [staffInfo, setStaffInfo] = useState({ name: '', id: '', job: '', rating: '' });
  const [loading, setLoading] = useState(true);
  const [showLiveOrders, setShowLiveOrders] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleLogout = () => {
    navigate('/login');
  };

  // Fetch staff info
  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/staff/info?id=${staffId}`);
        const data = await response.json();

        if (response.ok) {
          setStaffInfo(data);
        } else {
          console.error('Error fetching staff info:', data.error);
        }
      } catch (error) {
        console.error('Network error while fetching staff info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffInfo();
  }, [staffId]);

  // Fetch live orders
  const fetchLiveOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/live');
      const data = await response.json();

      if (response.ok) {
        setLiveOrders(data);
        setShowLiveOrders(true); // Show live orders section
      } else {
        console.error('Error fetching live orders:', data.error);
      }
    } catch (error) {
      console.error('Network error while fetching live orders:', error);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  // Update order status to "completed"
  const updateOrderStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedOrders })
      });

      if (response.ok) {
        fetchLiveOrders(); // Refresh live orders after update
        setSelectedOrders([]); // Clear selected orders
      } else {
        const data = await response.json();
        console.error('Error updating order status:', data.error);
      }
    } catch (error) {
      console.error('Network error while updating order status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.staffHomePage}>
      <div className="top-dashboard">
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div className="staff-info">
        <h1>Welcome to Staff Dashboard</h1>
        <h2>Staff Name: {staffInfo.name}</h2>
        <p>Staff ID: {staffInfo.id}</p>
        <p>Staff Job: {staffInfo.job}</p>
        <h3 style={{ fontSize: '2rem' }}>Rating: {staffInfo.rating}</h3>
      </div>

      <div className="staff-buttons">
        {!showLiveOrders && (
          <button style={styles.button} onClick={fetchLiveOrders}>Check Live Orders</button>
        )}
      </div>

      {showLiveOrders && (
        <div className="live-orders">
          <h2>Live Orders</h2>
          {liveOrders.map((order) => (
            <div key={order.id}>
              <input
                type="checkbox"
                checked={selectedOrders.includes(order.id)}
                onChange={() => handleCheckboxChange(order.id)}
              />
              <label>Order ID: {order.id}, Amount: {order.total_amount}</label>
            </div>
          ))}
          {liveOrders.length > 0 && (
            <button onClick={updateOrderStatus} style={styles.updateButton}>Update Completed Orders</button>
          )}
        </div>
      )}

      <div className="bottom-dashboard">
        <p style={styles.address}>Address: 123 Cafe Street</p>
        <p style={styles.contactUs}>Contact Us: info@cafe.com</p>
      </div>
    </div>
  );
};

const styles = {
  staffHomePage: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    justifyContent: 'space-between',
    padding: '20px',
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
  button: {
    margin: '10px',
    backgroundColor: '#ff8c00',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  updateButton: {
    margin: '10px',
    backgroundColor: '#32CD32',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  address: {
    fontSize: '1.1rem',
  },
  contactUs: {
    fontSize: '1.1rem',
  },
};

export default StaffHomePage;