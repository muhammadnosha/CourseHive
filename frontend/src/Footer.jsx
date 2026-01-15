import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} KidiCode. All rights reserved.</p>
        <p>Teaching the next generation of innovators in Pakistan.</p>
      </div>
    </footer>
  );
};

export default Footer;