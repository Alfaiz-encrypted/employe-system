// import React, { useState, useEffect } from 'react';

// const Inout = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch('http://localhost:4000/infos');
//       const json = await response.json();
//       setData(json);
//     };
//     fetchData();
//   }, []);

//   const tableData = data.map((item) => {
//     return (
//       <tr key={item._id}>
//         <td style={{ textAlign: "center" }}>{item.empcode}</td>
//         <td style={{ textAlign: "center" }}>{item.empname}</td>
//         <td style={{ textAlign: "center" }}>{item.date}</td>
//         <td style={{ textAlign: "center" }}>{item.clockIn}</td>
//         <td style={{ textAlign: "center" }}>{item.clockOut}</td>
//         <td style={{ textAlign: "center" }}>{item.LunchStart}</td>
//         <td style={{ textAlign: "center" }}>{item.LunchComplete}</td>
//       </tr>
//     );
//   });

//   return (
//     <>
//       <h1 style={{ textAlign: 'center', color: 'blue' }}>Employee Details</h1>
//       <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse', fontSize: "20px" }}>
//         <thead>
//           <tr>
//             <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Employee Code</th>
//             <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Employee Name</th>
//             <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Date</th>
//             <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Clock In Time</th>
//             <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Clock Out Time</th>
//             <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Lunch Start Time</th>
//             <th style={{ backgroundColor: 'grey', color: 'white', padding: '5px', border: '1px solid black' }}>Lunch Complete Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData}
//         </tbody>
//       </table>
//     </>
//   );
// };

// export default Inout;






































import React from "react";
import {useState} from "react";


const Inout = () =>{
    const [empcode, setEmpcode] = useState("");
    const [empname, setEmpname] = useState("");
    const [date, Setdate] = useState("");
    const [clockIn, setClockIn] = useState("");
    const [clockOut, setClockOut] = useState("");
    const [LunchStart, setLunchStart] = useState("");
    const [LunchComplete, setLunchComplete] = useState("");

    const Data = async()=>{
        const cdata = await fetch('http://localhost:4000/register', {
            method: "post",
            body: JSON.stringify({empcode, empname,date ,clockIn, clockOut, LunchStart, LunchComplete}),
            headers:{
                'Content-type':'application/json'
            },
        });
        const result = await cdata.json()
        console.log(result);
        // store data in localstorage
        localStorage.setItem("user", JSON.stringify(result));
        if(result){
            alert("you are succesfully registered")
            setEmpcode("");
            setEmpname("");
            setClockIn("");
            Setdate("");
            setClockOut("");
            setLunchStart("");
            setLunchComplete("");
        }
    }

    return (
        <>
            <div>
  <h1>Employee Details</h1>
  <table>
  <thead>
    <tr>
      <th>Employee Code</th>
      <th>Employee Name</th>
      <th>Date</th>
      <th>Clock In Time</th>
      <th>Clock Out Time</th>
      <th>Lunch Start Time</th>
      <th>Lunch Complete Time</th>
    </tr>
  </thead>
    <tr>
      <td><input id="empcode" className="text-style" type="text" value={empcode} onChange={(e)=>setEmpcode(e.target.value)} placeholder="Enter employee code" /></td>
      <td><input id="empname" className="text-style" type="text" value={empname} onChange={(e)=>setEmpname(e.target.value)} placeholder="Enter employee name" /></td>
      <td><input id="clockIn" className="text-style" type="datetime-local" value={date} onChange={(e)=>setClockIn(e.target.value)} placeholder="Date" /></td>
      <td><input id="clockIn" className="text-style" type="time" value={clockIn} onChange={(e)=>setClockIn(e.target.value)} placeholder="Clock In time" /></td>
      <td><input id="clockOut" className="text-style" type="time" value={clockOut} onChange={(e)=>setClockOut(e.target.value)} placeholder="Clock Out time" /></td>
      <td><input id="LunchStart" className="text-style" type="time" value={LunchStart} onChange={(e)=>setLunchStart(e.target.value)} placeholder="Lunch Start time" /></td>
      <td><input id="LunchComplete" className="text-style" type="time" value={LunchComplete} onChange={(e)=>setLunchComplete(e.target.value)} placeholder="Lunch Complete time" /></td>
      <td><button className="text-style" onClick={Data} type="submit">Submit</button></td>
    </tr>
  </table>  
</div> </>
    );
}
export default Inout