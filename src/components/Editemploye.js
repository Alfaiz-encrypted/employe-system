import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState({
    emp_id: '',
    name: '',
    email: '',
    position: '',
    joining: '',
    mobileNo: '',
    address: '',
    city: '',
    document: '',
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axiosInstance.get(`/employee/${id}`);
        const fetchedEmployee = response.data[0];
        if (fetchedEmployee) {
          setEmployee(fetchedEmployee);
        } else {
          toast.error('Employee not found.');
          navigate('/Admin/dashboard');
        }
      } catch (error) {
        toast.error('Something went wrong.');
        navigate('/Admin/dashboard');
      }
    };
  
    fetchEmployee();
  }, [id]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleUpdateEmployee = async () => {
    if (employee.mobileNo.length < 10) {
        setError('Mobile number must have a minimum of 10 digits.');
        return;
      }
    try {
      await axiosInstance.put(`/employee/${id}`, employee, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      });
      toast.success('Employee updated successfully.');
      navigate('/Admin/dashboard');
    } catch (error) {
      toast.error('Failed to update employee.');
      navigate('/Admin/dashboard');
    }
  };

  const handleCancel = ()=>{
    navigate('/Admin/dashboard');
  }

  return (
    <div className="container py-3">
    <h2>Edit Employee</h2>
    <form>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Employee ID</label>
          <input
            type="text"
            className="form-control"
            name="emp_id"
            value={employee.emp_id}
            disabled
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={employee.email}
            disabled
          />
        </div>
      </div>
      <div className="row">
      <div className="col-md-6 mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={employee.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Position</label>
          <input
            type="text"
            className="form-control"
            name="position"
            value={employee.position}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Joining</label>
          <input
            type="date"
            className="form-control"
            name="joining"
            value={employee.joining}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Mobile No</label>
          <input
            type="text"
            className="form-control"
            name="mobileNo"
            value={employee.mobileNo}
            onChange={handleInputChange}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={employee.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={employee.city}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Document</label>
        <input
          type="text"
          className="form-control"
          name="document"
          value={employee.document}
          onChange={handleInputChange}
        />
      </div>
      <div className="d-flex gap-2">
  <button
    type="button"
    className="btn btn-primary btn-md"
    onClick={handleUpdateEmployee}
  >
    Update
  </button>
  <button
    type="button"
    className="btn btn-danger btn-md"
    onClick={handleCancel}
  >
    Cancel
  </button>
</div>

    </form>
  </div>

  );
};

export default EditEmployee;
