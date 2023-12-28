import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Setpassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
    alert("Please enter a password and confirm it");
    return;
    }  
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
   const dresult = await fetch(`http://localhost:4000/Setpassword/${id}`,{
      method:"PUT",
      body:JSON.stringify({password}),
      headers:{
        'Content-Type': 'application/json'
      }
    });
    const fdresult = await dresult.json();
    if(fdresult){
      alert("Password updated successfully");
      navigate("/Signin");
    }
  };

  return (
    <>
      <div className="input_type">
        <h1>Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="text-style"
            type="password"
            placeholder="Enter your New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> 
          <input
            className="text-style"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />         
          <button className="text-style" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Setpassword;
