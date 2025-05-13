// src/components/common/Footer.jsx
import React from 'react';

const FooterComponent = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-700 dark:to-accent-700 text-white text-center py-4 shadow mt-auto">
      <span className="text-sm">
        TinderLink | All Right Reserved &copy; {new Date().getFullYear()}
      </span>
    </footer>
  );
};

export default FooterComponent;
