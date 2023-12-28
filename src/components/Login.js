import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';


const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { data, status } = await axiosInstance.post('/login', {
        email,
        password,
      });
  
      if (status === 200) {
        localStorage.setItem('token', JSON.stringify(data.token));
        Cookies.set('emp_id', data.user.emp_id);
        Cookies.set('user_email', data.user.email);
        toast.success('You are successfully logged in');
  
        // Redirect to Admin Dashboard only if the user is an admin
        if (data.user.email === 'admin@gmail.com') {
          navigate('/Admin/dashboard');
        } else {
          // Redirect to the regular user page
          navigate('/Employeinout');
        }
      } else if (status === 401) {
        toast.error('Invalid password');
      } else if (status === 404) {
        toast.error('User not found');
      } else {
        toast.error('Something went wrong. Please try again later');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error occurred while submitting the form. Please try again later');
    }
  };
  
  

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="fw-bold text-center my-4">Login your account</h4>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;