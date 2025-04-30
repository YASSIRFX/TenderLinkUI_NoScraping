// src/components/common/Footer.jsx
import React from 'react';
import './Footer.css'; // Uses the modified Footer.css

const FooterComponent = () => {
  return (
    <footer className="footer">
      <span className="footer-text">
        TinderLink | All Right Reserved &copy; {new Date().getFullYear()}
      </span>
    </footer>
  );
};

export default FooterComponent;
