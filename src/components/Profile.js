import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Profile = () => {
  const emp_id = Cookies.get('emp_id');
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/Profile/${emp_id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        });
        const json = response.data;
        setData(json);
        setLoading(false);
      } catch (error) {
        toast.error('Something went wrong. Please login.');
        navigate('/login');
      }
    };
    fetchData();
  }, [emp_id, navigate]);

  const profileData = data.length > 0 ? data[0] : null;

  useEffect(() => {
    if (!loading && !profileData) {
      navigate('/login');
    }
  }, [loading, profileData, navigate]);
  const imageUrl = profileData ? `${process.env.PUBLIC_URL}/uploads/${profileData.file_upload_name}` : '';
//  const imageUrl = `https://placeimg.com/640/480/any`;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Profile</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title border-bottom pb-4">Personal Information</h5>
          <div className="card-text">
            {loading ? (
              <p>Loading...</p>
            ) : profileData ? (
              <>
                <div className="row">
                  <div className="col-md-6">
                    <p className="text-lg">
                      <strong className="fs-5">Name:</strong> {profileData.name}
                    </p>
                    <p className="text-lg">
                      <strong className="fs-5">Email:</strong> {profileData.email}
                    </p>
                    <p className="text-lg">
                      <strong className="fs-5">Employee ID:</strong> {emp_id}
                    </p>
                    <p className="text-lg">
                      <strong className="fs-5">Position:</strong> {profileData.position}
                    </p>
                    <p className="text-lg">
                      <strong className="fs-5">Joining Date:</strong> {profileData.joining}
                    </p>
                    <p className="text-lg">
                      <strong className="fs-5">Contact:</strong> {profileData.mobileNo}
                    </p>
                    <p className="text-lg">
                      <strong className="fs-5">City:</strong> {profileData.city}
                    </p>
                  </div>
                  <div className="col-md-3">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <img
                          src={imageUrl}
                          alt="Profile Image"
                          className="img-fluid"
                          style={{ width: '280px', height: '200px' }} // Adjust the width and height values as per your requirement
                        />
                        <p className="text-lg">
                          <strong className="fs-8">{profileData.file_upload_name}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>

            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
