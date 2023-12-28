import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from './axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const EmployeeInOut = () => {
  const navigate = useNavigate();
  const [inOutData, setInOutData] = useState([]);
  const [clockInClicked, setClockInClicked] = useState(false);
  const [lunchStartClicked, setLunchStartClicked] = useState(false);
  const [lunchCompleteClicked, setLunchCompleteClicked] = useState(false);
  const [clockOutClicked, setClockOutClicked] = useState(false);
  const emp_id = Cookies.get('emp_id');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance.get(`/inout-list/${emp_id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        });

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const filteredData = response.data.filter((data) => {
          const entryDate = new Date(data.date);
          const entryYear = entryDate.getFullYear();
          const entryMonth = entryDate.getMonth();
          return entryYear === currentYear && entryMonth === currentMonth;
        });

        // Sort the filteredData array based on the date
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

        const existingRecord = filteredData.find((data) => data.emp_id === emp_id && data.date === currentDate.toISOString().slice(0, 10));

        if (existingRecord) {
          if (existingRecord.clockIn !== '') {
            setClockInClicked(true);
          }
          if (existingRecord.lunchStart !== '') {
            setLunchStartClicked(true);
          }
          if (existingRecord.lunchComplete !== '') {
            setLunchCompleteClicked(true);
          }
          if (existingRecord.clockOut !== '') {
            setClockOutClicked(true);
          }
        }
        setInOutData(filteredData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployeeData();
  }, [emp_id]);

  const updateInOutData = async (updatedData) => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);

      // Check if there is existing data for the current date
      const existingDataIndex = inOutData.findIndex((data) => data.date === currentDate);

      if (existingDataIndex !== -1) {
        // If existing data found, update it with the new data
        const newData = [...inOutData];
        newData[existingDataIndex] = { ...newData[existingDataIndex], ...updatedData };
        setInOutData(newData);

        await axiosInstance.put(`/inout/${emp_id}/${currentDate}`, updatedData, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        });
      } else {
        // If no existing data found, create a new row with the new data
        setInOutData((prevData) => [...prevData, updatedData]);

        await axiosInstance.post('/inout', updatedData, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        });
      }
    } catch (error) {
      console.log('Error:', error); // Log the error to the console for debugging purposes

      if (error.response && error.response.status === 401) {
        // Unauthorized token error
        toast.error('Something went wrong. Please log in again.');
        // Navigate to login page
        navigate('/login');
      } else {
        toast.error('Something went wrong.');
      }
    }
  };

  const makeApiCall = async (emp_id, dataToUpdate) => {
    const currentDate = new Date().toISOString().slice(0, 10);

    try {
      await axiosInstance.put(`/inout/${emp_id}/${currentDate}`, dataToUpdate, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized token error
        toast.error('Something went wrong. Please log in again.');
        // Navigate to login page
        navigate('/login');
      } else {
        toast.error('Something went wrong.');
      }
    }
  };

  const handleClockIn = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedData = {
      emp_id,
      date: currentDate,
      clockIn: currentTime,
      lunchStart: '',
      lunchComplete: '',
      clockOut: '',
      status: ''
    };

    setClockInClicked(true);
    updateInOutData(updatedData); // Update the local state immediately
  };

  const handleLunchStart = async () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toISOString().slice(0, 10);

    const updatedData = {
      emp_id,
      date: currentDate,
      lunchStart: currentTime,
    };

    setLunchStartClicked(true);
    updateInOutData(updatedData); // Update the local state immediately

    await makeApiCall(emp_id, updatedData); // Make the API call
  };


  const handleLunchComplete = async () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toISOString().slice(0, 10);

    const updatedData = {
      emp_id,
      date: currentDate,
      lunchComplete: currentTime,
    };

    setLunchCompleteClicked(true);
    updateInOutData(updatedData); // Update the local state immediately

    await makeApiCall(emp_id, updatedData); // Make the API call
  };

  const handleClockOut = async () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toISOString().slice(0, 10);

    const updatedData = {
      emp_id,
      date: currentDate,
      clockOut: currentTime,
    };

    setClockOutClicked(true);
    updateInOutData(updatedData); // Update the local state immediately
    await makeApiCall(emp_id, updatedData);
  };


  const calculateTotalTime = (clockIn, clockOut, lunchStart, lunchComplete) => {
    if (clockIn && clockOut) {
      const startTime = new Date(`2000/01/01 ${clockIn}`);
      const endTime = new Date(`2000/01/01 ${clockOut}`);
      const diffMilliseconds = endTime - startTime;

      let lunchDurationMilliseconds = 0;
      if (lunchStart && lunchComplete) {
        const lunchStartTime = new Date(`2000/01/01 ${lunchStart}`);
        const lunchEndTime = new Date(`2000/01/01 ${lunchComplete}`);
        lunchDurationMilliseconds = lunchEndTime - lunchStartTime;
      }

      const totalTimeMilliseconds = diffMilliseconds - lunchDurationMilliseconds;
      const totalHours = Math.floor(totalTimeMilliseconds / 1000 / 60 / 60);
      const totalMinutes = Math.floor((totalTimeMilliseconds / 1000 / 60) % 60);
      const formattedHours = String(totalHours).padStart(2, '0');
      const formattedMinutes = String(totalMinutes).padStart(2, '0');
      return `${formattedHours}:${formattedMinutes}`;
    }
    return '';
  };

  const getStatus = (entry) => {
    const time = calculateTotalTime(entry.clockIn, entry.clockOut, entry.lunchStart, entry.lunchComplete);

    if (time === '') {
      return ''; // Empty status if time is not available
    }

    const [hours, minutes] = time.split(':').map(Number);
    const totalTimeInMinutes = hours * 60 + minutes;

    if (totalTimeInMinutes >= 470) {
      return 'P'; // Set status as "P" for total time greater than or equal to 8 hours (480 minutes)
    } else if (totalTimeInMinutes >= 240 && totalTimeInMinutes < 470) {
      return 'H/P';
    } else if (totalTimeInMinutes < 240) {
      return 'A';
    }

    return ''; // Return empty status if none of the conditions match
  };

  const handleDoneClick = async (entry) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const status = getStatus(entry);

    if (status !== '') {
      try {
        const updatedData = {
          emp_id,
          date: currentDate,
          status,
        };

        updateInOutData(updatedData); // Update the local state immediately
        await makeApiCall(emp_id, updatedData); // Include the status in the API call
        toast.success('Status updated successfully');
      } catch (error) {
        toast.error(error);
      }
    } else {
      toast.error('Status is not available');
    }
  };

  const currentDate = new Date().toISOString().slice(0, 10);
  const currentYear = parseInt(currentDate.slice(0, 4));
  const currentMonth = parseInt(currentDate.slice(5, 7));
  const currentDay = parseInt(currentDate.slice(8, 10));

  const totalWorkingDays = inOutData.reduce((count, data) => {
    const entryDate = new Date(data.date);
    const entryYear = entryDate.getFullYear();
    const entryMonth = entryDate.getMonth() + 1;
    const entryDay = entryDate.getDate();

    if (
      (entryYear < currentYear) ||
      (entryYear === currentYear && entryMonth < currentMonth) ||
      (entryYear === currentYear && entryMonth === currentMonth && entryDay < currentDay && entryDate.getDay() !== 0)
    ) {
      return count + 1;
    }
    return count;
  }, 0);


  const totalPresentDays = inOutData.reduce((count, data) => {
    const entryYear = parseInt(data.date.slice(0, 4));
    const entryMonth = parseInt(data.date.slice(5, 7));

    if (
      entryYear === currentYear &&
      entryMonth === currentMonth &&
      data.status !== 'H'
    ) {
      if (data.status === 'P') {
        return count + 1;
      } else if (data.status === 'H/P') {
        return count + 0.5;
      }
      else if (data.status === 'H/L') {
        return count + 0.5;
      }
    }

    return count; // Add this line to handle cases where the conditions are not met
  }, 0);

  const totalLeaves = inOutData.reduce((count, data) => {
    if (data.status === 'L') {
      return count + 1; // Increment count by 1 for "L"
    } else if (data.status === 'H/L') {
      return count + 0.5; // Increment count by 0.5 for "H/L"
    }
    return count; // Return the current count if the status is not "L" or "H/L"
  }, 0);

  const totalAbsent = inOutData.reduce((count, data) => {
    if (data.status === 'A') {
      return count + 1;
    } else if (data.status === 'H/P') {
      return count + 0.5;
    }
    
    return count;
  }, 0);

  const paybleDays = totalPresentDays + totalLeaves;

  return (
    <>
      <div className="employee-id-section bg-light p-3">
        <span className="employee-id-label">Employee ID:</span>
        <span className="employee-id">{emp_id}</span>
      </div>

      <div className="container">
      <div className="d-flex flex-column align-items-center">
        <h1 className="h3 mt-3 mb-4 text-center">Employee Attendance Log</h1>
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary me-2" onClick={handleClockIn} disabled={clockInClicked}>
            Clock In
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={handleLunchStart}
            disabled={!clockInClicked || lunchStartClicked}
          >
            Lunch Start
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={handleLunchComplete}
            disabled={!lunchStartClicked || lunchCompleteClicked}
          >
            Lunch Complete
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={handleClockOut}
            disabled={!lunchCompleteClicked || clockOutClicked}
          >
            Clock Out
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-10">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No.</th>
                <th>Date</th>
                <th>Clock In</th>
                <th>Lunch Start</th>
                <th>Lunch Complete</th>
                <th>Clock Out</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inOutData.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.date}</td>
                  <td>{data.clockIn}</td>
                  <td>{data.lunchStart}</td>
                  <td>{data.lunchComplete}</td>
                  <td>{data.clockOut}</td>
                  <td>{calculateTotalTime(data.clockIn, data.clockOut, data.lunchStart, data.lunchComplete)}</td>
                  <td>
                    {data.date === currentDate && (
                      data.status ? (
                        data.status
                      ) : (
                        calculateTotalTime(data.clockIn, data.clockOut, data.lunchStart, data.lunchComplete) ? (
                          <button className="btn btn-primary me-2" onClick={() => handleDoneClick(data)}>
                            Done
                          </button>
                        ) : (<span>C</span>)
                      )
                    )}
                    {data.date !== currentDate && (
                    data.status ? (
                    <span className={`badge bg-${data.status === 'P' ? 'success' : (data.status === 'H/P' ? 'success' : (data.status === 'A' ? 'danger': (data.status === 'H/L' || data.status === 'L' ? 'warning' : 'info')))}`}>{data.status}</span>
                    ) : (<span className={`badge bg-${data.status === 'A' ? 'danger' : 'info'}`}>A</span>)
                  )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-2">
          <h2 className="text-center">Summary</h2>
          <div className="row">
            <div className="col-md-10">
              <div className="summary-item text-center">
                <p className="summary-heading bg-primary text-white">Working Days</p>
              </div>
            </div>
            <div className="col-md-2">
              <div className="summary-item text-center">
                <p className="text-center text-dark">{totalWorkingDays}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-10">
              <div className="summary-item text-center">
                <p className="summary-heading bg-success text-white">Present</p>
              </div>
            </div>
            <div className="col-md-2">
              <div className="summary-item text-center">
                <p className="text-center text-dark">{totalPresentDays}</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-10">
              <div className="summary-item text-center">
                <p className="summary-heading bg-warning text-white">Leaves</p>
              </div>
            </div>
            <div className="col-md-2">
              <div className="summary-item text-center">
                <p className="text-center text-dark">{totalLeaves}</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-10">
              <div className="summary-item text-center">
                <p className="summary-heading bg-danger text-white">Absent</p>
              </div>
            </div>
            <div className="col-md-2">
              <div className="summary-item text-center">
                <p className="text-center text-dark">{totalAbsent}</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-10">
              <div className="summary-item text-center">
                <p className="summary-heading bg-info text-white">PaybleDays</p>
              </div>
            </div>
            <div className="col-md-2">
              <div className="summary-item text-center">
                <p className="text-center text-dark">{paybleDays}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default EmployeeInOut;