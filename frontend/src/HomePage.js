import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import cafeImage from './images/cafe_homepage.jpg';
import pizzaImage from './images/pizza.jpg';
import pastaImage from './images/pasta.jpg';
import tacoImage from './images/tacos.jpg';
import burritoImage from './images/burrito.jpg';
import coffeeImage from './images/coffee.jpg';
import milkshakeImage from './images/milkshake.jpg';
import pastryImage from './images/pastry.jpg';
import macronsImage from './images/macrons.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  const handleStaffLogin = () => {
    navigate('/staff-login');
  };

  const handleCustomerLogin = () => {
    navigate('/customer-login');
  };

  return (
    <div className="homepage">
      {/* Top Dashboard with login options */}
      <div className="top-dashboard">
        <h2 className="cafename">CAFE UNITED</h2>
        <div className="dashboard-buttons">
          <button onClick={handleAdminLogin} className="dashboard-button">Admin Login</button>
          <button onClick={handleStaffLogin} className="dashboard-button">Staff Login</button>
          <button onClick={handleCustomerLogin} className="dashboard-button">Customer Login</button>
        </div>
      </div>

      {/* Main content with cafe image and about section */}
      <div className="main-content">
        <div className="cafe-image">
          <img src={cafeImage} alt="Cafe" className="cafe-photo"/>
        </div>
        <div className="about-cafe">
          <h2>About Our Cafe</h2>
          <p>
            Welcome to our amazing little cafe, <b>Cafe Gryffindor</b>, where we serve delicious meals and drinks in a relaxing environment.
            We pride ourselves on our service and the quality of our menu. Come visit us and enjoy a wonderful experience!
          </p>
        </div>
      </div>

      {/* Sliding menu items */}
      <div className="sliding-menu">
        <div className="sliding-menu-inner">
          {/* Duplicate the images to create a seamless scroll */}
          <img src={pizzaImage} alt="Menu Item 1" className="menu-item"/>
          <img src={pastaImage} alt="Menu Item 2" className="menu-item"/>
          <img src={tacoImage} alt="Menu Item 3" className="menu-item"/>
          <img src={burritoImage} alt="Menu Item 4" className="menu-item"/>
          <img src={coffeeImage} alt="Menu Item 5" className="menu-item"/>
          <img src={milkshakeImage} alt="Menu Item 6" className="menu-item"/>
          <img src={pastryImage} alt="Menu Item 7" className="menu-item"/>
          <img src={macronsImage} alt="Menu Item 8" className="menu-item"/>
          {/* Duplicate images for seamless animation */}
          <img src={pizzaImage} alt="Menu Item 1" className="menu-item"/>
          <img src={pastaImage} alt="Menu Item 2" className="menu-item"/>
          <img src={tacoImage} alt="Menu Item 3" className="menu-item"/>
          <img src={burritoImage} alt="Menu Item 4" className="menu-item"/>
          <img src={coffeeImage} alt="Menu Item 5" className="menu-item"/>
          <img src={milkshakeImage} alt="Menu Item 6" className="menu-item"/>
          <img src={pastryImage} alt="Menu Item 7" className="menu-item"/>
          <img src={macronsImage} alt="Menu Item 8" className="menu-item"/>
        </div>
      </div>

      {/* Bottom dashboard with address and contact info */}
      <div className="bottom-dashboard">
        <div className="address">Address: 123 Cafe Street</div>
        <div className="owners">SAMARTH M AND ROHIT S </div>
        <div className="contact-us">Contact Us: info@cafe.com</div>
      </div>
    </div>
  );
};

export default HomePage;