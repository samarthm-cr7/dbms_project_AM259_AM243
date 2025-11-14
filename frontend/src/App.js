import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import AdminLogin from './AdminLogin';
import StaffLogin from './StaffLogin';
import CustomerLogin from './CustomerLogin';
import CustomerSignUp from './CustomerSignUp';
import CustomerHomePage from './CustomerHomePage';
import StaffHomePage from './staffHomePage';
import AdminHomePage from './AdminHomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-signup" element={<CustomerSignUp />} />
        <Route path="/customer-homepage" element={<CustomerHomePage />} />
        <Route path="/staff-homepage" element={<StaffHomePage />} />
        <Route path="/admin-homepage" element={<AdminHomePage />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to HomePage for any undefined route */}
      </Routes>
    </Router>
  );
};

export default App;
