import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "./axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Row, Col, TimePicker, Input } from 'antd';

const Editinout = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    emp_id: "",
    date: "",
    clockIn: "",
    lunchStart: "",
    lunchComplete: "",
    clockOut: "",
    Time: "",
    status: "",
    remark: "",
  });
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [timeData, setTimeData] = useState({ Time: "", status: "" });

  const fetchData = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/Allemp", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      const json = response.data;
      setEmployeeOptions(json);
    } catch (error) {
      toast.error("Something went wrong.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    // setTimeData((prevTimeData) => ({ ...prevTimeData, status: newStatus }));
    setEmployee((prevEmployee) => ({ ...prevEmployee, status: newStatus }));
  };

  const calculateDuration = (employee, manualStatus = null) => {
    const { clockIn, lunchStart, lunchComplete, clockOut } = employee || {};
    if (clockIn && clockOut) {
      // If manualStatus is provided, use that status
      if (manualStatus) {
        return {
          timeString: "", // Adjust as needed
          status: manualStatus,
        };
      }

      const startDate = new Date(`2000-01-01 ${clockIn}`);
      const lunchStartDate = new Date(`2000-01-01 ${lunchStart}`);
      const lunchCompleteDate = new Date(`2000-01-01 ${lunchComplete}`);
      const endDate = new Date(`2000-01-01 ${clockOut}`);

      const lunchDuration = lunchCompleteDate - lunchStartDate;
      let totalDuration = endDate - startDate - lunchDuration;

      if (totalDuration < 0) {
        const midnight = new Date(`2000-01-02 00:00:00`);
        totalDuration =
          midnight - startDate + endDate - midnight - lunchDuration;
      }

      const hours = Math.floor(totalDuration / 3600000);
      const minutes = Math.floor((totalDuration % 3600000) / 60000);

      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");

      const timeString = `${formattedHours}:${formattedMinutes}`;
      const status = hours >= 8 ? "P" : hours >= 4 ? "H/P" : "A";

      return { timeString, status };
    }

    return { timeString: "", status: "" };
  };

  const updateEmployeeState = (employee, setTimeData) => {
    const { timeString, status, remark } = calculateDuration(employee);
    setTimeData((prevTimeData) => ({
      ...prevTimeData,
      Time: timeString,
      status,
      remark,
    }));
  };

  useEffect(() => {
    updateEmployeeState(employee, setTimeData);
  }, [
    employee.clockIn,
    employee.lunchStart,
    employee.lunchComplete,
    employee.clockOut,
    employee.status,
  ]);

  const handelfind = async () => {
    try {
      const response = await axiosInstance.get(
        `/employee/entry/${employee.emp_id}/${employee.date}`
      );
      const entryData = response.data; // Assuming the API response returns the entry data
      if (entryData) {
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          status: entryData.status,
          clockIn: entryData.clockIn,
          lunchStart: entryData.lunchStart,
          lunchComplete: entryData.lunchComplete,
          clockOut: entryData.clockOut,
          remark: entryData.remark,
        }));
      } else {
        // If data is not available, reset the state for the fields
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          clockIn: "",
          lunchStart: "",
          lunchComplete: "",
          clockOut: "",
        }));
      }
    } catch (error) {
      alert("Please Select First Emp id and Date.");
      navigate("/Admin/entry");
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      const updatedEmployee = {
        ...employee,
        status: employee.status, // Use status from timeData
        remark: employee.remark, // Include remark from employee state
      };

      await axiosInstance.post("/employee/entry", updatedEmployee, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      toast.success("Employee entry Updated successfully.");
      navigate("/Admin/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Please Select First Emp id and Date.");
      } else {
        toast.error("Failed to update entry.");
        navigate("/Admin/dashboard");
      }
    }
  };

  const handleCancel = () => {
    navigate("/Admin/dashboard");
  };

  return (
    <div className="container py-3">
      <h2>Entry For Employee</h2>
      <form>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Employee ID<span className="text-danger">*</span>
            </label>
            <select
              className="form-control"
              name="emp_id"
              value={employee.emp_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select an employee ID</option>
              {employeeOptions.length > 0 &&
                employeeOptions.map((option) => (
                  <option key={option.id} value={option.emp_id}>
                    {option.emp_id}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Date<span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={employee.date}
              onChange={handleInputChange}
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="col-md-2 mb-6 d-flex align-items-center">
            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={handelfind}
            >
              Search
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Clock In</label>
            <input
              type="text"
              className="form-control"
              name="clockIn"
              value={employee.clockIn}
              onChange={(e) => {
                handleInputChange(e);
                calculateDuration();
              }}
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Lunch start</label>
            <input
              type="text"
              className="form-control"
              name="lunchStart"
              value={employee.lunchStart}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Lunch complete</label>
            <input
              type="text"
              className="form-control"
              name="lunchComplete"
              value={employee.lunchComplete}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Clock Out</label>
            <input
              type="text"
              className="form-control"
              name="clockOut"
              value={employee.clockOut}
              onChange={(e) => {
                handleInputChange(e);
                calculateDuration();
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Time</label>
            <input
              type="text"
              className="form-control"
              name="Time"
              value={timeData.Time}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={employee.status}
              onChange={handleStatusChange}
            >
              <option value="P">Present (P)</option>
              <option value="A">Absent (A)</option>
              <option value="H/P">Half-Day/Partial (H/P)</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Remark</label>
            <input
              type="text"
              className="form-control"
              name="remark"
              value={employee.remark}
              onChange={handleInputChange}
            />
          </div>
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

export default Editinout;

// import React, { useState, useEffect, useCallback } from 'react';
// import axiosInstance from './axiosInstance';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// const Editinout = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState({
//     emp_id: '',
//     date: '',
//     clockIn: '',
//     lunchStart: '',
//     lunchComplete: '',
//     clockOut: '',
//     Time: '',
//     status: '',
//   });
//   const [employeeOptions, setEmployeeOptions] = useState([]);
//   const [timeData, setTimeData] = useState({ Time: '', status: '' });

//   const fetchData = useCallback(async () => {
//     try {
//       const response = await axiosInstance.get('/Allemp', {
//         headers: {
//           Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
//         },
//       });
//       const json = response.data;
//       setEmployeeOptions(json);
//     } catch (error) {
//       toast.error('Something went wrong.');
//       navigate('/login');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEmployee((prevEmployee) => ({
//       ...prevEmployee,
//       [name]: value,
//     }));
//   };

//   const calculateDuration = (employee) => {
//     const { clockIn, lunchStart, lunchComplete, clockOut } = employee || {};
//     if (clockIn && clockOut) {
//       const startDate = new Date(`2000-01-01 ${clockIn}`);
//       const lunchStartDate = new Date(`2000-01-01 ${lunchStart}`);
//       const lunchCompleteDate = new Date(`2000-01-01 ${lunchComplete}`);
//       const endDate = new Date(`2000-01-01 ${clockOut}`);

//       const lunchDuration = lunchCompleteDate - lunchStartDate;
//       let totalDuration = endDate - startDate - lunchDuration;

//       if (totalDuration < 0) {
//         const midnight = new Date(`2000-01-02 00:00:00`);
//         totalDuration = midnight - startDate + endDate - midnight - lunchDuration;
//       }

//       const hours = Math.floor(totalDuration / 3600000);
//       const minutes = Math.floor((totalDuration % 3600000) / 60000);

//       const formattedHours = hours.toString().padStart(2, '0');
//       const formattedMinutes = minutes.toString().padStart(2, '0');

//       const timeString = `${formattedHours}:${formattedMinutes}`;
//       const status = hours >= 8 ? 'P' : hours >= 4 ? 'H/P' : 'A';

//       return { timeString, status };
//     }

//     return { timeString: '', status: '' };
//   };

//   const updateEmployeeState = (employee, setTimeData) => {
//     const { timeString, status } = calculateDuration(employee);
//     setTimeData((prevTimeData) => ({ ...prevTimeData, Time: timeString, status }));
//   };

//   useEffect(() => {
//     updateEmployeeState(employee, setTimeData);
//   }, [employee.clockIn, employee.lunchStart, employee.lunchComplete, employee.clockOut]);

//   const handelfind = async () => {
//     try {
//       const response = await axiosInstance.get(`/employee/entry/${employee.emp_id}/${employee.date}`);
//       const entryData = response.data; // Assuming the API response returns the entry data
//       if (entryData) {
//         setEmployee((prevEmployee) => ({
//           ...prevEmployee,
//           clockIn: entryData.clockIn,
//           lunchStart: entryData.lunchStart,
//           lunchComplete: entryData.lunchComplete,
//           clockOut: entryData.clockOut,
//         }));
//       } else {
//         // If data is not available, reset the state for the fields
//         setEmployee((prevEmployee) => ({
//           ...prevEmployee,
//           clockIn: '',
//           lunchStart: '',
//           lunchComplete: '',
//           clockOut: '',
//         }));
//       }
//     } catch (error) {
//       alert('Please Select First Emp id and Date.');
//       navigate('/Admin/entry');
//     }
//   };

//   const handleUpdateEmployee = async () => {
//     try {
//       const updatedEmployee = {
//         ...employee,
//         status: timeData.status // Assign the correct status value
//       };

//       await axiosInstance.post('/employee/entry', updatedEmployee, {
//         headers: {
//           Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
//         },
//       });

//       toast.success('Employee entry added successfully.');
//       navigate('/Admin/dashboard');
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         toast.error('Please Select First Emp id and Date.');
//       } else {
//         toast.error('Failed to update entry.');
//         navigate('/Admin/dashboard');
//       }
//     }
//   };

//   const handleCancel = () => {
//     navigate('/Admin/dashboard');
//   };

//   return (
//     <div className="container py-3">
//       <h2>Entry For Employee</h2>
//       <form>
//         <div className="row">
//           <div className="col-md-3 mb-3">
//             <label className="form-label">Employee ID<span className="text-danger">*</span></label>
//             <select
//               className="form-control"
//               name="emp_id"
//               value={employee.emp_id}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select an employee ID</option>
//               {employeeOptions.length > 0 &&
//                 employeeOptions.map((option) => (
//                   <option key={option.id} value={option.emp_id}>
//                     {option.emp_id}
//                   </option>
//                 ))}
//             </select>
//           </div>
//           <div className="col-md-3 mb-3">
//             <label className="form-label">Date<span className="text-danger">*</span></label>
//             <input
//               type="date"
//               className="form-control"
//               name="date"
//               value={employee.date}
//               onChange={handleInputChange}
//               required
//               max={new Date().toISOString().split('T')[0]}
//             />
//           </div>
//           <div className="col-md-2 mb-6 d-flex align-items-center">
//             <button
//               type="button"
//               className="btn btn-primary btn-md"
//               onClick={handelfind}
//             >
//               Search
//             </button>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-3 mb-3">
//             <label className="form-label">Clock In</label>
//             <input
//               type="text"
//               className="form-control"
//               name="clockIn"
//               value={employee.clockIn}
//               onChange={(e) => {
//                 handleInputChange(e);
//                 calculateDuration();
//               }}
//             />
//           </div>
//           <div className="col-md-3 mb-3">
//             <label className="form-label">Lunch start</label>
//             <input
//               type="text"
//               className="form-control"
//               name="lunchStart"
//               value={employee.lunchStart}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="col-md-3 mb-3">
//             <label className="form-label">Lunch complete</label>
//             <input
//               type="text"
//               className="form-control"
//               name="lunchComplete"
//               value={employee.lunchComplete}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="col-md-3 mb-3">
//             <label className="form-label">Clock Out</label>
//             <input
//               type="text"
//               className="form-control"
//               name="clockOut"
//               value={employee.clockOut}
//               onChange={(e) => {
//                 handleInputChange(e);
//                 calculateDuration();
//               }}
//             />
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-3 mb-3">
//             <label className="form-label">Time</label>
//             <input
//               type="text"
//               className="form-control"
//               name="Time"
//               value={timeData.Time}
//               onChange={handleInputChange}
//               readOnly
//             />
//           </div>
//           <div className="col-md-3 mb-3">
//             <label className="form-label">Status</label>
//             <input
//               type="text"
//               className="form-control"
//               name="status"
//               value={timeData.status}
//               onChange={handleInputChange}
//               readOnly
//             />
//           </div>
//         </div>
//         <div className="d-flex gap-2">
//           <button
//             type="button"
//             className="btn btn-primary btn-md"
//             onClick={handleUpdateEmployee}
//           >
//             Update
//           </button>
//           <button
//             type="button"
//             className="btn btn-danger btn-md"
//             onClick={handleCancel}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Editinout;
