import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerSignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 
 // Initialize useNavigate

 const handleSignUp = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    setMessage('Passwords do not match.');
    return;
  }

  // Call API to register customer
  const customerData = { name, username, email, phoneNumber, password };

  try {
    const response = await fetch('http://localhost:5000/api/customersignup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();
    if (data.success) {
      setMessage('Sign-up successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/customer-login');
      }, 2000);
    } else {
      setMessage(data.message || 'Sign-up failed. Please try again.');
    }
  } catch (error) {
    setMessage('An error occurred during sign-up. Please try again.');
    console.error('Error during sign-up:', error);
  }
};

  return (
    <div style={styles.signUpPage}>
      <div style={styles.signUpContainer}>
        <h2 style={styles.heading}>Customer Sign-Up</h2>
        <form onSubmit={handleSignUp} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}   
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}   

            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  signUpPage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'grey',
  },
  signUpContainer: {
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
};

export default CustomerSignUp;