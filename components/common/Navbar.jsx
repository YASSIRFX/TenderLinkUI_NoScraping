// src/components/common/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import './Navbar.css'; // If you’re using a separate CSS file

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);

  const handleLogout = () => {
    const confirmDelete = window.confirm('Are you sure you want to logout?');
    if (confirmDelete) {
      logout();
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* If not authenticated, show TinderLink as brand/home link */}
        {!isAuthenticated && (
          <Link to="/" className="navbar-title">
            TinderLink
          </Link>
        )}
        {/* If authenticated, you can still show the brand or logo if desired */}
        {isAuthenticated && (
          <Link to="/profile" className="navbar-title">
            TinderLink
          </Link>
        )}
      </div>

      <ul className="navbar-menu">
        {isAuthenticated ? (
          <>
            <li className="navbar-item">
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
            </li>
            {isAdmin && (
              <li className="navbar-item">
                <Link to="/admin/user-management" className="navbar-link">
                  User Management
                </Link>
              </li>
            )}
            <li className="navbar-item">
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}

export default Navbar;