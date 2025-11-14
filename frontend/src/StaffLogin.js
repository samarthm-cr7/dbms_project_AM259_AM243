import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    
  //   // Hardcoded credentials
  //   const staffUsername = 'staff';
  //   const staffPassword = 'staff123';

  //   if (username === staffUsername && password === staffPassword) {
  //     setMessage('Login successful! Redirecting to Staff Dashboard...');
  //     setTimeout(() => {
  //       // Redirect to StaffHomePage and pass staff job as a query parameter
  //       navigate(`/staff-homepage?job=Billing Desk`); // or `Cook` based on your logic
  //     }, 2000); // Redirect after 2 seconds
  //   } else {
  //     setMessage('Invalid username or password.');
  //   }
  // };


  try {
    // Send login data to the backend
    const response = await fetch('http://localhost:5000/api/stafflogin', {
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
        navigate(`/staff-homepage?id=${encodeURIComponent(data.staffId)}`);
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
        <h2 style={styles.heading}>Staff Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
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
  },
  loginContainer: {
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '40px',
    borderRadius: '10px',
    width: '350px',
    textAlign: 'center',
  },
  heading: {
    color: '#ff8c00',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
  },
  button: {
    padding: '15px',
    backgroundColor: '#ff8c00',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  message: {
    marginTop: '15px',
    color: 'lightgreen',
  },
  signUpText: {
    marginTop: '20px',
    color: 'white',
  },
  signUpLink: {
    color: '#ff8c00',
  },
};

export default StaffLogin;