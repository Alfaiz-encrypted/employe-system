import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LeaveApprove = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/Leave-list', {
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
  

  const handleApprove = async (itemId) => {
    try {
      const response = await axiosInstance.put(
        `/Leave-list/${itemId}`,
        { status: 1 },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
      );
  
      if (response.status === 200) {
        const approvedItem = data.find((item) => item._id === itemId);
        if (approvedItem) {
          const emp_id = approvedItem.emp_id;
          const { fromDate, toDate, leaveType } = approvedItem;
          
          const status = leaveType === 'Half-day' ? 'H/L' : 'L';
          const updateStatusResponse = await axiosInstance.put(
            `/update-status/${emp_id}`,
            { fromDate, toDate, status }
          );
  
          if (updateStatusResponse.status === 200) {
            toast.success('Leave approved successfully.');
            fetchData(); // Assuming fetchData function exists and fetches updated data
          } else {
            toast.error('Failed to update leave status.');
          }
        } else {
          console.log('Invalid approved item');
          // Handle the scenario where the approved item is not found
        }
      } else {
        toast.error('Failed to approve leave.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong.');
    }
  };
  

  const handleCancel = async (itemId) => {
    try {
      const response = await axiosInstance.put(`/Leave-list/${itemId}`, { status: 2 }, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      });
  
      if (response.status === 200) {
        const approvedItem = data.find((item) => item._id === itemId);
        
        if (approvedItem) {
          const approvedDays = approvedItem.days;
          const emp_id = approvedItem.emp_id;
          
          const leaveBalanceResponse = await axiosInstance.get(`/leave-balance/${emp_id}`);
  
          if (leaveBalanceResponse.status === 200) {
            const leaveBalanceData = leaveBalanceResponse.data;
  
            if (Array.isArray(leaveBalanceData) && leaveBalanceData.length > 0) {
              let leaveBalance = leaveBalanceData[0].leave;
              leaveBalance += approvedDays;
              console.log(leaveBalance);
  
              const updateLeaveBalanceResponse = await axiosInstance.patch(`/leave-balances/${emp_id}`, {
                leave: leaveBalance,
              });
  
              if (updateLeaveBalanceResponse.status === 200) {
                toast.success("Leave canceled successfully.");
                fetchData();
              } else {
                toast.error("Failed to update leave balance.");
              }
            } else {
              toast.error("Invalid response data or missing leave balance.");
            }
          } else {
            toast.error("Failed to retrieve leave balance.");
          }
        } else {
          toast.error("Invalid approved item.");
        }
      } else {
        toast.error("Failed to cancel leave.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };
  

  const tableData = data
    .slice()
    .reverse()
    .map((item) => (
      <tr key={item._id}>
        <td style={{ textAlign: "center" }}>{item.emp_id}</td>
        <td style={{ textAlign: "center" }}>{item.leaveType}</td>
        <td style={{ textAlign: "center" }}>{item.fromDate}</td>
        <td style={{ textAlign: "center" }}>{item.toDate}</td>
        <td style={{ textAlign: "center" }}>{item.reason}</td>
        <td style={{ textAlign: "center" }}>{item.days}</td>
        <td style={{ textAlign: "center" }}>
          {item.status === 0 ? "Pending" : item.status === 1 ? "Approved" : "Rejected"}
        </td>
        <td style={{ textAlign: "center" }}>
          {item.status === 0 && (
            <>
            <button className="btn btn-success me-2" onClick={() => handleApprove(item._id)}>Approve</button>
            <button className="btn btn-danger" onClick={() => handleCancel(item._id)}>Cancel</button>
            </>
          )}
        </td>
      </tr>
    ));

  return (
    <div className="container py-3">
      <h2 style={{ textAlign: 'center' }}>Leave Details</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Employe Id</th>
            <th style={{ textAlign: 'center' }}>leaveType</th>
            <th style={{ textAlign: 'center' }}>From Date</th>
            <th style={{ textAlign: 'center' }}>To Date</th>
            <th style={{ textAlign: 'center' }}>Reason</th>
            <th style={{ textAlign: 'center' }}>Days</th>
            <th style={{ textAlign: 'center' }}>Status</th>
            <th style={{ textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveApprove;




// const handleApprove = async (itemId) => {
//   try {
//     const response = await axiosInstance.put(
//       `/Leave-list/${itemId}`,
//       { status: 1 },
//       {
//         headers: {
//           Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
//         },
//       }
//     );

    // if (response.status === 200) {
    //   const approvedItem = data.find((item) => item._id === itemId);
    //   if (approvedItem) {
    //     const approvedDays = approvedItem.days;
    //     const emp_id = approvedItem.emp_id;
    //     const { fromDate, toDate, leaveType } = approvedItem;
        
    //     const status = leaveType === 'Half-day' ? 'H/L' : 'L';
    //     const updateStatusResponse = await axiosInstance.put(
    //       `/update-status/${emp_id}`,
    //       { fromDate, toDate, status }
    //     );

    //     if (updateStatusResponse.status === 200) {
    //       const leaveBalanceResponse = await axiosInstance.get(`/leave-balance/${emp_id}`);

    //       if (leaveBalanceResponse.status === 200) {
    //         const leaveBalanceData = leaveBalanceResponse.data;
    //         if (Array.isArray(leaveBalanceData) && leaveBalanceData.length > 0) {
    //           let leaveBalance = leaveBalanceData[0].leave;

    //           leaveBalance -= approvedDays;

    //           const updateLeaveBalanceResponse = await axiosInstance.patch(`/leave-balances/${emp_id}`, {
    //             leave: leaveBalance,
    //           });

    //           if (updateLeaveBalanceResponse.status === 200) {
    //             toast.success('Leave approved successfully.');
    //             fetchData(); // Assuming fetchData function exists and fetches updated data
//               } else {
//                 toast.error('Failed to update leave balance.');
//               }
//             } else {
//               console.log('Invalid response data or missing leave balance');
//               // Handle the scenario where leave balance data is missing or invalid
//             }
//           } else {
//             toast.error('Failed to retrieve leave balance.');
//           }
//         } else {
//           toast.error('Failed to update leave status.');
//         }
//       } else {
//         console.log('Invalid approved item');
//         // Handle the scenario where the approved item is not found
//       }
//     } else {
//       toast.error('Failed to approve leave.');
//     }
//   } catch (error) {
//     console.error(error);
//     toast.error('Something went wrong.');
//   }
// };