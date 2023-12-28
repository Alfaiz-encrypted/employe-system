import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";


const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    const result = await fetch("http://localhost:4000/forgot-password", {
      method: "post",
      body: JSON.stringify({ email }),
      headers: {
        "content-type": "application/json",
      },
    });
    const results = await result.json();
    if (results.error) {
        alert("Something went wrong. Please try again later.");
    } else {
        alert("Password reset link sent to your email!");
        const link = `/Setpassword/${results._id}`;
        navigate(link);
      }
    }
  return (
    <>
      <div className="input_type">
        <h1>Reset Your Password</h1>
        <input
          className="text-style"
          type="email"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email} />
          
        <button className="text-style" onClick={handleForgotPassword} type="submit">
          Submit
        </button>
        <Link to="/Signup" style={{color: "blue", textDecoration: "underline"}}>Signup</Link>
      </div>
    </>
  );
};
export default ForgetPass;