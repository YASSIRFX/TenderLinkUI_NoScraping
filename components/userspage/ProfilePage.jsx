// src/components/userspage/ProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import UserService from '../service/UserService';
import { AuthContext } from '../../AuthContext';
import { Link } from 'react-router-dom';
import './ProfilePage.css'; // Import the animated CSS

function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState({});
  const { role } = useContext(AuthContext);

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.ourUsers);
    } catch (error) {
      console.error('Error fetching profile information:', error);
    }
  };

  return (
    <div className="profile-page-container">
      <h2>Profile Information</h2>
      <p>Name: {profileInfo.name}</p>
      <p>Email: {profileInfo.email}</p>
      <p>City: {profileInfo.city}</p>
      {role === 'ADMIN' && (
        <button>
          <Link to={`/update-user/${profileInfo.id}`}>Update This Profile</Link>
        </button>
      )}
    </div>
  );
}

export default ProfilePage;
