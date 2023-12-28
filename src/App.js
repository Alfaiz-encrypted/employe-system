import React from 'react';
import { Toaster } from 'react-hot-toast';
import LeaveForm from './components/LeaveForm';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Privatec from './components/Privatec';
import Navbar from './components/Navbar';
import axiosInstance from './components/axiosInstance';
import EmployeeInOut from './components/Employeinout';
import Profile from './components/Profile';
import Entry from './components/Home';
import Leaveapprove from './components/Leavebalance';
import Form from './components/Register';
import Data from './components/Empoyedata';
import EditEmployee from './components/Editemploye';
import Editinout from './components/Editentry';
import Cookies from 'js-cookie';

axiosInstance.defaults.baseURL = "https://employesystem-eosin.vercel.app";
const isAdmin = () => {
  const userEmail = Cookies.get('user_email');
  return userEmail === 'admin@gmail.com';
};

function App() {
  return (
    <div className="App">
      <div>
        <Toaster position="top-center" />
      </div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/Register" element={<Form />} />
          <Route exact path="/Login" element={<Login />} />

          <Route path="/" element={<Privatec />}>
            <Route exact path="/Employeinout" element={<EmployeeInOut />} />
            <Route exact path="/Entry" element={<Entry />} />
            <Route exact path="/LeaveForm" element={<LeaveForm />} />
            <Route exact path="/profile" element={<Profile />} />

            {isAdmin() && (
              <>
                <Route path="/Admin/leave" element={<Leaveapprove />} />
                <Route path="/Admin/dashboard" element={<Data />} />
                <Route path="/edit/:id" element={<EditEmployee />} />
                <Route path="/Admin/entry" element={<Editinout />} />
              </>
            )}
            
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
