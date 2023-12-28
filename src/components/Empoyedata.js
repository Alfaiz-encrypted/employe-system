import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Data = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/Allemp', {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      });
      const json = response.data;
      setData(json);
    } catch (error) {
      toast.error("Something went wrong.");
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this employee?');
  if (confirmed){
    axiosInstance
    .delete(`/employee/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        toast.success('Record deleted successfully.');
        fetchData();
      }
    })
    .catch((error) => {
      toast.error('Failed to delete record.');
    });
};
  }  
   
  const openPdf = (filename) => {
    if (filename) {
      const pdfUrl = `${process.env.PUBLIC_URL}/uploads/${filename}`;
      window.open(pdfUrl, '_blank');
    } else {
      toast.error("No document found");
    }
  };

  const filteredData = data
  .filter((item) =>
    Object.values(item).some((value) =>
      value && value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  )
  .map((item) => (
    <tr key={item._id}>
      <td style={{ textAlign: 'center' }}>{item.emp_id}</td>
      <td style={{ textAlign: 'center' }}>{item.name}</td>
      <td style={{ textAlign: 'center' }}>{item.email}</td>
      <td style={{ textAlign: 'center' }}>{item.position}</td>
      <td style={{ textAlign: 'center' }}>{item.joining}</td>
      <td style={{ textAlign: 'center' }}>{item.mobileNo}</td>
      <td style={{ textAlign: 'center' }}>{item.address}</td>
      <td style={{ textAlign: 'center' }}>{item.city}</td>
      <td style={{ textAlign: 'center' }}>
        <button className="btn btn-warning btn-sm" onClick={() => openPdf(item.document)}>
          View
        </button>
      </td>
      <td style={{ textAlign: 'center' }}>
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(item._id)}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  ));

  const tableContent = filteredData.length > 0 ? (
    filteredData
  ) : (
    <tr>
      <td colSpan="10" style={{ textAlign: 'center' }}>
        No data found
      </td>
    </tr>
  );

  return (
    <div className="container pxy-3">
      <div className="row">
      <div className="col-md-3">
      <h3>Employe Details</h3>
      </div>
  <div className="col-md-6">
    <div className="input-group mb-4">
      <input
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        placeholder="Search..."
        className="form-control rounded-pill border border-solid border-1"
      />
    </div>
  </div>
</div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>E. Id</th>
            <th style={{ textAlign: 'center' }}>Name</th>
            <th style={{ textAlign: 'center' }}>Email</th>
            <th style={{ textAlign: 'center' }}>Position</th>
            <th style={{ textAlign: 'center' }}>joining</th>
            <th style={{ textAlign: 'center' }}>mobileNo</th>
            <th style={{ textAlign: 'center' }}>Address</th>
            <th style={{ textAlign: 'center' }}>City</th>
            <th style={{ textAlign: 'center' }}>Document</th>
            <th style={{ textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
        {tableContent}
        </tbody>
      </table>
    </div>
  );
};

export default Data;