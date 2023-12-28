import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { FaGoogle,FaLinkedin,FaTwitter,FaPhone,FaFacebook } from "react-icons/fa";

const Profiles = () =>{
    return(
        <div> 
            <div className="container mt-5">
    
    <div className="row d-flex justify-content-center">
        
        <div className="col-md-7">
            
            <div className="card p-3 py-4">
                
                <div className="text-center mt-3">
                    <h5 className="mt-2 mb-0">Alexender Schidmt</h5>
                    <span>UI/UX Designer</span>
                    
                    <div className="px-4 mt-1">
                        <p className="fonts">Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                    
                    </div>
                    
                     <ul className="social-list">
                        <li><FaGoogle /></li>
                        <li><FaLinkedin /></li>
                        <li><FaTwitter /></li>
                        <li><FaPhone /></li>
                        <li><FaFacebook /></li>
                    </ul>
                    
                    <div className="buttons">
                        
                        <button className="btn btn-outline-primary px-4">Message</button>
                        <button className="btn btn-primary px-4 ms-3">Contact</button>
                    </div>
                    
                    
                </div>
            </div>
            
        </div>
        
    </div>
    
</div>
        </div>

    );
}
export default Profiles;