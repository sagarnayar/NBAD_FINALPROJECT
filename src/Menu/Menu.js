import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Menu.scss'; // Import the CSS file
import axios from 'axios';
import styled from 'styled-components';

// Styled component for the custom navigation bar
const CustomNavBar = styled.nav`
  background-color: green !important;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  li {
    margin-right: 15px;
  }

  a {
    text-decoration: none;
    color: #fff;
    font-weight: bold; /* Make the text bold */
    font-size: 16px;
    transition: color 0.3s ease-in-out;
  }

  a:hover {
    color: #ffcc00;
  }

  .hello-message {
    font-size: 18px;
    color: #fff;
    font-weight: bold; /* Make the text bold */
  }

  li:last-child {
    margin-right: 0;
    margin-left: auto;
  }
`;

function Menu() {
  const [userId, setUserId] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const value = localStorage.getItem('userId');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUserId(value || '');

    if (value) {
      fetchUserDetails(value);
    }
  }, [value]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://45.77.107.121:${3002}/api/users/${userId}`);
      const userData = response.data;
      setUserFirstName(userData.firstname);
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserId('');
    setUserFirstName('');
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';

  if (!userId || isLoginPage) {
    return null;
  }

  return (
    <CustomNavBar className="menu" aria-label="Main menu" itemScope itemType="https://schema.org/SiteNavigationElement">
      <div>
        <ul>
          {!isLoginPage && (
            <li>
              <Link itemProp="url" to="/Dashboard" tabIndex="3">
                Dashboard
              </Link>
            </li>
          )}
          {!isLoginPage && (
            <li>
              <Link itemProp="url" to="/configuration" tabIndex="3">
                Configuration
              </Link>
            </li>
          )}
          {!isLoginPage && (
            <li>
              <Link itemProp="url" to="/budgetdetails" tabIndex="2">
                Budget Details
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div>
        {!isLoginPage && (
          <span className="hello-message" aria-label={`Hello, ${userFirstName}!`} tabIndex="0">
            Hello, {userFirstName}! 👋
          </span>
        )}
        <ul>
          <li>
            <Link itemProp="url" to="/login" tabIndex="11" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </CustomNavBar>
  );
}

export default Menu;
