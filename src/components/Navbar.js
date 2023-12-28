import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const isAuthenticated = localStorage.getItem('token') && Cookies.get('emp_id');
  const isAdmin = Cookies.get('user_email') === 'admin@gmail.com';

  const handleLogout = () => {
    localStorage.removeItem('token');
    Cookies.remove('emp_id');
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const toggleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-info bg-primary fixed-top">
        <div className="container">
            {isAuthenticated && isAdmin &&  (
              <>
              <Link className="navbar-brand" to="/Admin/dashboard">
                Admin
              </Link>
              <Link className="navbar-brand" to="/Admin/leave">
                AdminLeave
              </Link>
              <Link className="navbar-brand" to="/Admin/entry">
                AdminEntry
              </Link>
            </>
            )}
          {!isAuthenticated && (
            <Link className="navbar-brand" to="/Register">
              Register
            </Link>
          )}

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={!isNavCollapsed ? true : false}
            aria-label="Toggle navigation"
            onClick={toggleNavCollapse}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse justify-content-end`} id="navbarNav">
            <ul className="navbar-nav navbar-text" style={{ fontSize: '20px' }}>
              <li className={`nav-item ${location.pathname === '/Entry' ? 'active' : ''}`}>
                <Link className="nav-link" to="/Entry">
                  Home
                </Link>
              </li>
              <li className={`nav-item ${location.pathname === '/Employeinout' ? 'active' : ''}`}>
                <Link className="nav-link" to="/Employeinout">
                  Attendance
                </Link>
              </li>
              <li className={`nav-item ${location.pathname === '/Leaveform' ? 'active' : ''}`}>
                <Link className="nav-link" to="/Leaveform">
                  Leave
                </Link>
              </li>
              <li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
              {isAuthenticated ? (
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogin}>
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>
        <style>
          {`
            .navbar-nav .nav-item.active .nav-link {
              color: white;
            }
          `}
        </style>
      </nav>
      <div style={{ paddingTop: '7%' }}>{/* Add padding to the top of the content */}</div>
    </>
  );
};

export default Navbar;
