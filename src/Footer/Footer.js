import React from 'react';

function Footer() {
  return (
    <footer className="bottom" style={{ backgroundColor: '#ddd', color: '#333', padding: '10px' }} role="contentinfo"> 
    
      <div className="center" aria-labelledby="copyright-label">
        {/* Copyright Information */}
        <p id="copyright-label" style={{ fontWeight: 'bold', color: '#000' }}>
          All rights reserved &copy; Sagar Nayar
        </p>
      </div>

      <div className="center h-card" aria-labelledby="user-details-label">
        {/* User Details */}
        <p id="user-details-label" className="p-name" style={{ fontWeight: 'bold', color: '#000' }}>
          Sagar Nayar
        </p>
        <a className="u-email" href="mailto:sagar@example.com" style={{ fontWeight: 'bold', color: '#000' }}>
          Email me 📧
        </a>
      </div>
    </footer>
  );
}

export default Footer;
