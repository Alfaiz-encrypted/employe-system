import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from './axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const currentDate = new Date().toISOString().slice(0, 10);

const LeaveForm = () => {
  const navigate = useNavigate();
  const emp_id = Cookies.get('emp_id');
  const [toDate, setToDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [reason, setReason] = useState('');
  const [days, setDays] = useState('0');
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [data, setData] = useState([]);
  const [leaveType, setLeaveType] = useState('Full day');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if token is available in local storage
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You are not logged in. Please log in first.');
      navigate('/login');
      return;
    }
  
    const fromDateObj = new Date(fromDate);
    const isSunday = fromDateObj.getDay() === 0;
  
    if (isSunday) {
      toast.error("Sunday leave cannot be applied.");
      return;
    }
  
    try {
      const resetForm = () => {
        setFromDate('');
        setToDate('');
        setDays('');
        setReason('');
      };
  
      let exceedBalance = false; // Flag to track if leave exceeds balance
  
      if (parseInt(days) > parseInt(leaveBalance)) {
        exceedBalance = true;
        toast.error('Your applied leave exceeds the balance leave.');
        resetForm();
      } else {
        const cdata = await axiosInstance.post(
          '/leave-apply',
          {
            emp_id,
            fromDate,
            toDate,
            days,
            reason,
            leaveType,
          },
          {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}` },
          }
        );
  
        const result = cdata.data;
        if (result) {
          let leaveBalanceData = leaveBalance;
          leaveBalanceData -= days;
  
          const updateLeaveBalanceResponse = await axiosInstance.patch(`/leave-balances/${emp_id}`, { leave: leaveBalanceData });
          if (updateLeaveBalanceResponse.status !== 200) {
            toast.error('Failed to update leave balance');
          } else {
            toast.success('Applied Leave Successfully');
            setToDate('');
            setFromDate('');
            setReason('');
            setDays('');
            setLeaveBalance(leaveBalanceData);
            setData([...data, result]);
          }
        }
      }
  
      if (exceedBalance) {
        return; // Stop further execution and prevent sending data to the backend
      }
    } catch (error) {
      console.log(error);
      toast.error('Error occurred while submitting the form. Please try again later');
    }
  };
     
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/Leave-list/${emp_id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      });
      const json = response.data;
      setData(json);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized token error
        toast.error('Something went wrong. Please login .');
        navigate('/login');
      } else {
        toast.error('Something went wrong. Please login');
        navigate('/login');
      }
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const response = await axiosInstance.get(`/leave-balance/${emp_id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      });
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        let leaveBalance = data[0].leave;
        setLeaveBalance(leaveBalance);
      } else {
        toast.error('Invalid response data or missing leave balance');
      }
    } catch (error) {
      toast.error('Something went wrong. Please login.');
      navigate('/login');
    }
  };  

  const calculateDays = (fromDate, toDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(fromDate);
    const secondDate = new Date(toDate);
    const diffDays = Math.round(Math.abs((secondDate - firstDate) / oneDay) + 1);
    return diffDays;
  };

  const handleFromDateChange = (event) => {
    const selectedFromDate = new Date(event.target.value);
    const selectedToDate = new Date(toDate);
  
    // Check if any Sundays are included in the selected date range
    const isSundayIncluded = checkIfSundayIncluded(selectedFromDate, selectedToDate);
  
    if (isSundayIncluded) {
      toast.error('Sunday leave cannot be applied for the selected date range.');
      return;
    }
  
    setFromDate(event.target.value);
    if (leaveType === 'Half-day') {
      setDays(0.5 * calculateDays(event.target.value, toDate));
    } else {
      setDays(calculateDays(event.target.value, toDate));
    }
  };
  
  const handleToDateChange = (event) => {
    const selectedFromDate = new Date(fromDate);
    const selectedToDate = new Date(event.target.value);
  
    // Check if any Sundays are included in the selected date range
    const isSundayIncluded = checkIfSundayIncluded(selectedFromDate, selectedToDate);
  
    if (isSundayIncluded) {
      toast.error('Sunday leave cannot be applied for the selected date range.');
      return;
    }
  
    // Ensure toDate is greater than or equal to fromDate
    if (event.target.value < fromDate) {
      toast.error('ToDate must be greater than or equal to FromDate');
      setFromDate(event.target.value);
      setToDate(fromDate);
      setDays(0);
    } else {
      setToDate(event.target.value);
      if (leaveType === 'Half-day') {
        setDays(0.5 * calculateDays(fromDate, event.target.value));
      } else {
        setDays(calculateDays(fromDate, event.target.value));
      }
    }
  };
 
  
  const checkIfSundayIncluded = (fromDate, toDate) => {
    const startDate = new Date(fromDate.getTime());
    const endDate = new Date(toDate.getTime());
  
    while (startDate <= endDate) {
      if (startDate.getDay() === 0) {
        return true; // Sunday found in the selected date range
      }
      startDate.setDate(startDate.getDate() + 1);
    }
  
    return false; // No Sundays found in the selected date range
  };

  // Function to handle cancellation and send request to delete the entry
  const handleCancel = (id) => {
    
    axiosInstance
      .delete(`/deleteEntry/${id}`)
      .then(async (response) => {
        if (response.status === 200) {    
                
          const days = response.data.days;
          const updatedLeaveBalance = leaveBalance + days;          
          setLeaveBalance(updatedLeaveBalance);
           
          // Update leave balance in the backend
          try {
            const updateLeaveBalanceResponse = await axiosInstance.patch(`/leave-balances/${emp_id}`, {
              leave: updatedLeaveBalance,
            });
            if (updateLeaveBalanceResponse.status === 200) {
              fetchData();
            } else {
              toast.error("Failed to update leave balance");
            }
          } catch (error) {
            toast.error("Error updating leave balance. Please try again later.");
          }
  
          toast.success("Leave canceled successfully");
        } else if (response.status === 404) {
          toast.error("Entry not found");
        } else {
          toast.error("An error occurred while canceling the leave");
        }
      })
      .catch((error) => {
        toast.error("Error deleting entry. Please try again later.");
      });
  };    
  
  useEffect(() => {
    fetchData();
    fetchLeaveBalance();
  }, [emp_id, navigate]);

  const tableData =
    data.slice().reverse().map((item) => {
      return (
        <tr key={item._id}>
          <td style={{ textAlign: "center" }}>{item.fromDate}</td>
          <td style={{ textAlign: "center" }}>{item.toDate}</td>
          <td style={{ textAlign: "center" }}>{item.reason}</td>
          <td style={{ textAlign: "center" }}>{item.days}</td>
          <td style={{ textAlign: "center" }}>{item.status === 0 ? "Pending" : item.status === 1 ? "Approved" : "Rejected"}</td>
          <td style={{ textAlign: "center" }}>
            {item.status === 0 ? (
              <button className="btn btn-danger" onClick={() => handleCancel(item._id)}>Cancel</button>
            ) : null}
          </td>

        </tr>
      );
    });



  return (
    <div className="container py-3">
      <h3> Leave Balance: {leaveBalance}</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-group col-md-2">
          <label htmlFor="leaveType">Leave Type</label>
            <select
              id="leaveType"
              className="form-control"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}>
              <option value="Full-day">Full Day</option>
              <option value="Half-day">Half Day</option>
            </select>
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="fromDate">From:</label>
            <input
              id="fromDate"
              className="form-control"
              type="date"
              value={fromDate}
              max={currentDate}
              onChange={handleFromDateChange}
              required
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="toDate">TO:</label>
            <input
              id="toDate"
              className="form-control"
              type="date"
              value={toDate}
              max={currentDate}
              onChange={handleToDateChange}
              required
            />
          </div>
          
          <div className="form-group col-md-2">
            <label htmlFor="days">Day</label>
            <input
              id="days"
              className="form-control"
              type="number"
              value={days}
              readOnly
              onChange={(e) => setDays(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-2"></div>
          <div className="form-group col-md-8">
            <label htmlFor="reason">Reason:</label>
            <textarea
              id="reason"
              className="form-control"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group text-center">
          <button className="btn btn-primary mt-3" type="submit">
            Apply Leave
          </button>
        </div>
      </form>
      <div style={{ marginTop: '5%' }}>
        <h2 style={{ textAlign: 'center' }}>Leave Details</h2>
        <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse', fontSize: "20px" }}>
          <thead>
            <tr style={{ textAlign: 'center' }}>
              <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>From date</th>
              <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>To date</th>
              <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Reason</th>
              <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Days</th>
              <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Status</th>
              <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {tableData}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default LeaveForm;