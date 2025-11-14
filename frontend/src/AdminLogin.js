import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    /*
     // Hardcoded credentials
     const adminUsername = 'admin';
     const adminPassword = 'admin123';

     if (username === adminUsername && password === adminPassword) {
       setMessage('Login successful! Redirecting to Admin Dashboard...');
       setTimeout(() => {
         navigate('/admin-homepage');
       }, 1000);
     } else {
       setMessage('Invalid username or password.');
     }
   };
   */


  try {
    // Send login data to the backend
    const response = await fetch('http://localhost:5000/api/adminlogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (data.success) {
      setMessage('Login successful! Redirecting to Admin Dashboard...');
      setTimeout(() => {
        navigate('/admin-homepage');
      }, 1000);
    } else {
      setMessage(data.message || 'Invalid username or password.');
    }
  } catch (error) {
    setMessage('An error occurred during login. Please try again.');
    console.error('Login error:', error);
  }
};


  return (
    <div style={styles.loginPage}>
      <div style={styles.loginContainer}>
        <h1 style={styles.logo}>Cafe Management System</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        
        {/* Display the message here */}
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  loginPage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'grey',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
  },
  loginContainer: {
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '40px',
    borderRadius: '10px',
    width: '350px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  logo: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#ff8c00',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    backgroundColor: '#ff8c00',
    color: 'white',
    padding: '15px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '20px',
  },
  message: {
    marginTop: '15px',
    color: 'white',
  },
};

export default AdminLogin;