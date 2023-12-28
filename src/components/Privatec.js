import React from "react";
import { Navigate } from "react-router-dom";
import { Routes, Route } from 'react-router-dom';
import EmployeeInOut from "./Employeinout";
import Profile from './Profile';
import Entry from './Home';
import Leaveapprove from './Leavebalance';
import LeaveForm from './LeaveForm';
import Data from './Empoyedata';
import EditEmployee from './Editemploye';
import Editinout from './Editentry';
import Cookies from 'js-cookie';


const Privatec = () => {
  // Check if the user is logged in
  const isAuthenticated = localStorage.getItem('token')&& Cookies.get('emp_id');
  // Render the component if authenticated, otherwise redirect to the signup page
  return isAuthenticated ? (
    <>
    <Routes>
      <Route exact path="/Employeinout" element={<EmployeeInOut />} /> 
      <Route exact path="/Entry" element={<Entry />} />
      <Route exact path="/LeaveForm" element={<LeaveForm />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/Admin/leave" element={<Leaveapprove />} />
      <Route exact path="/Admin/dashboard" element={<Data/>} />  
      <Route exact path="/edit/:id" element={<EditEmployee />} />
      <Route exact path="/Admin/entry" element={<Editinout />} />
    </Routes>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default Privatec;
