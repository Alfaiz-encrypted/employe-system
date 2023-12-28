import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import axiosInstance from './axiosInstance';
import Select from 'react-select';

const Entry = () => {
  const [entries, setEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const emp_id = Cookies.get('emp_id');
  const navigate = useNavigate();



  const fetchEntries = async () => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = selectedMonth + 1;
  
      const response = await axiosInstance.get(`/inout-list/${emp_id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      });
      const apiData = response.data;
      const generatedEntries = generateEntriesForMonth(year, month);
  
      const filteredApiData = apiData.filter((apiEntry) => {
        const entryMonth = new Date(apiEntry.date).getMonth() + 1;
        return entryMonth === selectedMonth + 1;
      });
  
      const combinedEntries = [...generatedEntries];
  
      filteredApiData.forEach((apiEntry) => {
        const matchingEntryIndex = generatedEntries.findIndex((entry) => entry.date === apiEntry.date);
        if (matchingEntryIndex !== -1) {
          combinedEntries[matchingEntryIndex] = {
            ...apiEntry,
            status: apiEntry.status // Add status property to the entry
          };
        } else {
          combinedEntries.push(apiEntry);
        }
      });
  
      setEntries(combinedEntries);
    } catch (error) {
      toast.error('Something went wrong. Please login');
      navigate('/login');
    }
  };
  
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const generateEntriesForMonth = (year, month) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
  
    const daysInMonth = new Date(year, month, 0).getDate();
    const generatedEntries = [];
  
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month - 1, i);
      const entry = {
        date: formatDate(date),
        clockIn: '',
        lunchStart: '',
        lunchComplete: '',
        clockOut: '',
        status: 'A' // Set status as "A" for generated entries
      };
  
      if (date.getDay() === 0) {
        entry.status = 'S';
      } else if (year === currentYear && month === currentMonth && i > currentDay) {
        entry.status = ''; // Empty status for future dates
      }
  
      generatedEntries.push(entry);
    }
  
    return generatedEntries;
  };  

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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

  const monthOptions = Array.from({ length: new Date().getMonth() + 1 }, (_, index) => {
    const monthNumber = index;
    const monthName = new Date(0, monthNumber).toLocaleString('en-US', { month: 'long' });
    return { value: monthNumber, label: monthName };
  });

  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption.value);
  };

  return (
<div className="row">
<div className="col-2">
        <div className="col-auto">
          <label htmlFor="monthSelect" className="form-label me-2">
            Select Month:
          </label>
          <Select
            id="monthSelect"
            options={monthOptions}
            value={monthOptions.find((option) => option.value === selectedMonth)}
            onChange={handleMonthChange}
            classNamePrefix="react-select"
            className="react-select-container"
          />
        </div>
  </div>  
      <div className="col-10">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="sticky-top bg-info">
            <tr>
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
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.clockIn}</td>
                <td>{entry.lunchStart}</td>
                <td>{entry.lunchComplete}</td>
                <td>{entry.clockOut}</td>
                <td>{calculateTotalTime(entry.clockIn, entry.clockOut, entry.lunchStart, entry.lunchComplete)}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Entry;



















// import { useState, useEffect } from 'react';
// import axiosInstance from './axiosInstance';
// import Cookies from 'js-cookie';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// const Entry = () => {
//   const [entries, setEntries] = useState([]);
//   const emp_id = Cookies.get('emp_id');
//   const navigate = useNavigate();
  

//   const fetchEntries = async () => {
//     try {
//       const currentDate = new Date();
//       const year = currentDate.getFullYear();
//       const month = currentDate.getMonth() + 1; // Add 1 to the month since it is zero-based
  
//       const response = await axiosInstance.get(`/inout-list/${emp_id}`, {
//         headers: {
//           Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
//         },
//       });
//       const apiData = response.data;
//       const generatedEntries = generateEntriesForMonth();
  
//       // Filter the API data for entries in the current month
//       const filteredApiData = apiData.filter((apiEntry) => {
//         const entryMonth = new Date(apiEntry.date).getMonth() + 1; // Add 1 to the month since it is zero-based
//         return entryMonth === month;
//       });
  
//       // Combine the API data and generated entries
//       const combinedEntries = [...generatedEntries];
  
//       // Merge the API data with the generated entries based on the date
//       filteredApiData.forEach((apiEntry) => {
//         const matchingEntryIndex = generatedEntries.findIndex((entry) => entry.date === apiEntry.date);
//         if (matchingEntryIndex !== -1) {
//           combinedEntries[matchingEntryIndex] = apiEntry;
//         } else {
//           combinedEntries.push(apiEntry);
//         }
//       });
  
//       setEntries(combinedEntries);
//     } catch (error) {
//       toast.error('Something went wrong. Please login');
//       navigate('/login');
//     }
//   };

//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   const generateEntriesForMonth = () => {
//     const currentDate = new Date();
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     const generatedEntries = [];

//     for (let i = 1; i <= daysInMonth; i++) {
//       const date = new Date(year, month, i);
//       const entry = {
//         date: formatDate(date),
//         clockIn: '',
//         lunchStart: '',
//         lunchComplete: '',
//         clockOut: '',
//         status: getStatus(date), // Get the status based on the date
//       };
//       if (date.getDay() === 0) {
//         entry.status = 'S'; // Set status as "S" for Sundays
//       }
//       generatedEntries.push(entry);
//     }

//     return generatedEntries;
//   };

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');

//     return `${year}-${month}-${day}`;
//   };

//   const calculateTotalTime = (clockIn, clockOut, lunchStart, lunchComplete) => {
//     if (clockIn && clockOut) {
//       const startTime = new Date(`2000/01/01 ${clockIn}`);
//       const endTime = new Date(`2000/01/01 ${clockOut}`);
//       const diffMilliseconds = endTime - startTime;
  
//       let lunchDurationMilliseconds = 0;
//       if (lunchStart && lunchComplete) {
//         const lunchStartTime = new Date(`2000/01/01 ${lunchStart}`);
//         const lunchEndTime = new Date(`2000/01/01 ${lunchComplete}`);
//         lunchDurationMilliseconds = lunchEndTime - lunchStartTime;
//       }
  
//       const totalTimeMilliseconds = diffMilliseconds - lunchDurationMilliseconds;
//       const totalHours = Math.floor(totalTimeMilliseconds / 1000 / 60 / 60);
//       const totalMinutes = Math.floor((totalTimeMilliseconds / 1000 / 60) % 60);
//       const formattedHours = String(totalHours).padStart(2, '0');
//       const formattedMinutes = String(totalMinutes).padStart(2, '0');
//       return `${formattedHours}:${formattedMinutes}`;
//     }
//     return '';
//   };
  
//   const getStatus = (entry) => {
    
//     const time = calculateTotalTime(entry.clockIn, entry.clockOut, entry.lunchStart, entry.lunchComplete);
//     const getCurrentDate = () => {
//       const currentDate = new Date();
//       const year = currentDate.getFullYear();
//       const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//       const day = String(currentDate.getDate()).padStart(2, '0');
  
//       return `${year}-${month}-${day}`;
//     };
//     if (entry.status === 'S') {
//       return 'S'; 
//     }
//     else if (entry.date >= getCurrentDate()) {
//       return ''; // Empty status for future dates
//     } else if (entry.clockIn === '' || entry.clockOut === '') {
//       return 'A'; // Set status as "A" for empty clockIn entry
//     }
      
//     const [hours, minutes] = time.split(':').map(Number);
//     const totalTimeInMinutes = hours * 60 + minutes;
  
//     if (totalTimeInMinutes >= 480) {
//       return 'P'; // Set status as "P" for total time greater than or equal to 8 hours (480 minutes)
//     } else if (totalTimeInMinutes >=240 && totalTimeInMinutes <480){
//       return 'H/P'; 
//     } else if (totalTimeInMinutes < 240 ) {
//       return 'A'; 
//     } 
//   };
  
//   return (
//     <div className="container">
//   <div className="table-responsive">
//     <table className="table table-striped">
//       <thead className="sticky-top bg-info">
//         <tr>
//         <th className="py-3">Date</th>
//           <th className="py-3">Clock In</th>
//           <th className="py-3">Lunch Start</th>
//           <th className="py-3">Lunch Complete</th>
//           <th className="py-3">Clock Out</th>
//           <th className="py-3">Time</th>
//           <th className="py-3">Status</th>
//         </tr>
//       </thead>
//       <tbody>
//         {entries.map((entry, index) => (
//           <tr key={index}>
//             <td>{entry.date}</td>
//             <td>{entry.clockIn}</td>
//             <td>{entry.lunchStart}</td>
//             <td>{entry.lunchComplete}</td>
//             <td>{entry.clockOut}</td>
//             <td>{calculateTotalTime(entry.clockIn, entry.clockOut, entry.lunchStart, entry.lunchComplete)}</td>
//             <td>{getStatus(entry)}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// </div>
//   );
// };

// export default Entry;


























// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axiosInstance from './axiosInstance';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';


// const Entry = () => {
//   const navigate = useNavigate();
//   const [inOutData, setInOutData] = useState([]);
//   const [clockInClicked, setClockInClicked] = useState(false);
//   const [lunchStartClicked, setLunchStartClicked] = useState(false);
//   const [lunchCompleteClicked, setLunchCompleteClicked] = useState(false);
//   const [clockOutClicked, setClockOutClicked] = useState(false);
//   const emp_id = Cookies.get('emp_id');

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       try {
//         const response = await axiosInstance.get(`/inout-list/${emp_id}`, {
//           headers: {
//             Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
//           },
//         });
//         const currentDate = new Date().toISOString().slice(0, 10);
//         const existingRecord = response.data.find((data) => data.emp_id === emp_id && data.date === currentDate);

//         if (existingRecord) {
//           if (existingRecord.clockIn !== '') {
//             setClockInClicked(true);
//           }
//           if (existingRecord.lunchStart !== '') {
//             setLunchStartClicked(true);
//           }
//           if (existingRecord.lunchComplete !== '') {
//             setLunchCompleteClicked(true);
//           }
//           if (existingRecord.clockOut !== '') {
//             setClockOutClicked(true);
//           }
//         }
//         setInOutData(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchEmployeeData();
//   }, [emp_id]);

//   const updateInOutData = async (updatedData) => {
//     try {
//       const currentDate = new Date().toISOString().slice(0, 10);
  
//       // Check if there is existing data for the current date
//       const existingDataIndex = inOutData.findIndex((data) => data.date === currentDate);
  
//       if (existingDataIndex !== -1) {
//         // If existing data found, update it with the new data
//         const newData = [...inOutData];
//         newData[existingDataIndex] = { ...newData[existingDataIndex], ...updatedData };
//         setInOutData(newData);
  
//         await axiosInstance.put(`/inout/${emp_id}/${currentDate}`, updatedData, {
//           headers: {
//             Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
//           },
//         });
//       } else {
//         // If no existing data found, create a new row with the new data
//         setInOutData((prevData) => [...prevData, updatedData]);
  
//         await axiosInstance.post('/inout', updatedData, {
//           headers: {
//             Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
//           },
//         });
//       }
//     } catch (error) {
//       console.log('Error:', error); // Log the error to the console for debugging purposes
  
//       if (error.response && error.response.status === 401) {
//         // Unauthorized token error
//         toast.error('Something went wrong. Please log in again.');
//         // Navigate to login page
//         navigate('/login');
//       } else {
//         toast.error('Something went wrong.');
//       }
//     }
//   };    
  
//   const makeApiCall = async (emp_id, dataToUpdate) => {
//     const currentDate = new Date().toISOString().slice(0, 10);
  
//     try {
//       await axiosInstance.put(`/inout/${emp_id}/${currentDate}`, dataToUpdate, {
//         headers: {
//           Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
//         },
//       });
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         // Unauthorized token error
//         toast.error('Something went wrong. Please log in again.');
//         // Navigate to login page
//         navigate('/login');
//       } else {
//         toast.error('Something went wrong.');
//       }
//     }
//   };
  
//   const handleClockIn = () => {
//     const currentDate = new Date().toISOString().slice(0, 10);
//     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
//     const updatedData = {
//       emp_id,
//       date: currentDate,
//       clockIn: currentTime,
//       lunchStart: '',
//       lunchComplete: '',
//       clockOut: '',
//     };
  
//     setClockInClicked(true);
//     updateInOutData(updatedData); // Update the local state immediately
//   };
  
//   const handleLunchStart = async () => {
//     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const currentDate = new Date().toISOString().slice(0, 10);
  
//     const updatedData = {
//       emp_id,
//       date: currentDate,
//       lunchStart: currentTime,
//     };
  
//     setLunchStartClicked(true);
//     updateInOutData(updatedData); // Update the local state immediately
  
//     await makeApiCall(emp_id, updatedData); // Make the API call
//   };
  
  
//   const handleLunchComplete = async () => {
//     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const currentDate = new Date().toISOString().slice(0, 10);
  
//     const updatedData = {
//       emp_id,
//       date: currentDate,
//       lunchComplete: currentTime,
//     };
  
//     setLunchCompleteClicked(true);
//     updateInOutData(updatedData); // Update the local state immediately
  
//     await makeApiCall(emp_id, updatedData); // Make the API call
//   };
  
//   const handleClockOut = async () => {
//     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const currentDate = new Date().toISOString().slice(0, 10);
  
//     const updatedData = {
//       emp_id,
//       date: currentDate,
//       clockOut: currentTime,
//     };
  
//     setClockOutClicked(true);
//     updateInOutData(updatedData); // Update the local state immediately
  
//     await makeApiCall(emp_id, updatedData); // Make the API call
//   };  

//   const calculateTotalTime = (clockIn, clockOut, lunchStart, lunchComplete) => {
//     if (clockIn && clockOut) {
//       const startTime = new Date(`2000/01/01 ${clockIn}`);
//       const endTime = new Date(`2000/01/01 ${clockOut}`);
//       const diffMilliseconds = endTime - startTime;
  
//       let lunchDurationMilliseconds = 0;
//       if (lunchStart && lunchComplete) {
//         const lunchStartTime = new Date(`2000/01/01 ${lunchStart}`);
//         const lunchEndTime = new Date(`2000/01/01 ${lunchComplete}`);
//         lunchDurationMilliseconds = lunchEndTime - lunchStartTime;
//       }
  
//       const totalTimeMilliseconds = diffMilliseconds - lunchDurationMilliseconds;
//       const totalHours = Math.floor(totalTimeMilliseconds / 1000 / 60 / 60);
//       const totalMinutes = Math.floor((totalTimeMilliseconds / 1000 / 60) % 60);
//       const formattedHours = String(totalHours).padStart(2, '0');
//       const formattedMinutes = String(totalMinutes).padStart(2, '0');
//       return `${formattedHours}:${formattedMinutes}`;
//     }
//     return '';
//   };
  
//   const getStatus = (clockIn, clockOut, lunchStart, lunchComplete, date) => {
//     const backendDate = new Date(date);
//     console.log(backendDate);
//     const backendDay = backendDate.getDay(); // 0 for Sunday, 1 for Monday, and so on
  
//     if (backendDay === 0) {
//       return 'S'; // Sunday
//     }
  
//     const time = calculateTotalTime(clockIn, clockOut, lunchStart, lunchComplete);
  
//     if (time === '') {
//       return ''; // Return an empty string if time is empty or not available
//     }
  
//     const [hours, minutes] = time.split(':').map(Number);
//     const totalTimeInMinutes = hours * 60 + minutes;
  
//     if (totalTimeInMinutes >= 480) {
//       return 'P'; // Present
//     } else if (totalTimeInMinutes >= 240 && totalTimeInMinutes < 480) {
//       return 'H/P'; // Half-day Present
//     } else {
//       return 'A'; // Absent
//     }
//   };   
  
//   return (
//     <div className="container">
//       <div className="d-flex flex-column align-items-center">
//       <h1 className="h3 mt-3 mb-4 text-center">Employee Attendance Log</h1>
//       <div className="d-flex justify-content-center">
//         <button className="btn btn-primary me-2" onClick={handleClockIn} disabled={clockInClicked}>
//           Clock In
//         </button>
//         <button
//           className="btn btn-primary me-2"
//           onClick={handleLunchStart}
//           disabled={!clockInClicked || lunchStartClicked}
//         >
//           Lunch Start
//         </button>
//         <button
//           className="btn btn-primary me-2"
//           onClick={handleLunchComplete}
//           disabled={!lunchStartClicked || lunchCompleteClicked}
//         >
//           Lunch Complete
//         </button>
//         <button
//           className="btn btn-primary me-2"
//           onClick={handleClockOut}
//           disabled={!lunchCompleteClicked || clockOutClicked}
//         >
//           Clock Out
//         </button>
//       </div>
//     </div>
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Clock In</th>
//             <th>Lunch Start</th>
//             <th>Lunch Complete</th>
//             <th>Clock Out</th>
//             <th>Time</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inOutData.map((data, index) => (
//             <tr key={index}>
//               <td>{data.date}</td>
//               <td>{data.clockIn}</td>
//               <td>{data.lunchStart}</td>
//               <td>{data.lunchComplete}</td>
//               <td>{data.clockOut}</td>
//               <td>{calculateTotalTime(data.clockIn, data.clockOut, data.lunchStart, data.lunchComplete)}</td>
//               <td>{getStatus(data.clockIn, data.clockOut, data.lunchStart, data.lunchComplete)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Entry;