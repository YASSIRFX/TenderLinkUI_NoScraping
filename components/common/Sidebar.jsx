import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { FaUser, FaUsers, FaCogs, FaThList, FaSignOutAlt } from 'react-icons/fa'; // import desired icons
import './Sidebar.css';

const Sidebar = () => {
  const { logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/profile" className="sidebar-title">
          TinderLink
        </Link>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/profile" className="sidebar-link">
            <FaUser className="sidebar-icon" /> Profile
          </Link>
        </li>
        {isAdmin && (
          <>
            <li className="sidebar-item">
              <Link to="/admin/user-management" className="sidebar-link">
                <FaUsers className="sidebar-icon" /> User Management
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/admin/services" className="sidebar-link">
                <FaCogs className="sidebar-icon" /> Services Management
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/admin/categories" className="sidebar-link">
                <FaThList className="sidebar-icon" /> Categories Management
              </Link>
            </li>
            <li className="sidebar-item">
             <Link to="/admin/tenders" className="sidebar-link">
               <FaThList className="sidebar-icon" /> Appels d’Offres
             </Link>
            </li>
            
          </>

        )}
        <li className="sidebar-item">
          <button onClick={handleLogout} className="sidebar-button">
            <FaSignOutAlt className="sidebar-icon" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;