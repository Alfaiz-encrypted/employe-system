const express = require("express");
const cors = require("cors");
require('./src/db/connec');
const app = express();
app.use(express.json());
app.use(cors());
const bcrypt = require('bcrypt');
const users = require('./db/User');
const Leaves = require('./db/Leaves');
const Inout = require("./db/Inout");
const jwt = require('jsonwebtoken');
const jwtkey = 'encrypted';
const cron = require('node-cron');
const path = require('path');
const fileUpload = require('express-fileupload');


function verifyToken(req, res, next){
  let token = req.headers['authorization'];
  if(token){
    token = token.split(' ')[1];
    jwt.verify(token, jwtkey, (error, valied)=>{
      if(error){
        res.status(401).send({result:"Pleasre provide valied token"})
      }else{
        next();
      }
    }) 
  }else{
    res.status(403).send({result:"Please provide Token"})
  }
}

// const uploadDir = 'F:/encrypted/E-dashbord/front-end/public/uploads';
//const uploadDir = path.join(__dirname, 'public', 'uploads');
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const uploadDir = path.join(__dirname, '..', 'front-end', 'public', 'uploads');
app.use('/uploads', express.static(uploadDir));
app.use(fileUpload());
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 1 MB

// REGISTER
app.post('/register', async (req, res) => {
  if (!req.files || !req.files.jpg_file || !req.files.document) {
    return res.status(400).json({ message: 'Invalid file type. Both JPG file and document are required.' });
  }
  
  const { emp_id, jpg_file, document } = req.files;

  const storeFiles = async (jpg_file, document) => {
    const jpgFileName = path.join(uploadDir, jpg_file.name);
    const documentFileName = path.join(uploadDir, document.name);

    // Check JPG file size
    if (jpg_file.size > MAX_FILE_SIZE) {
      return res.status(401).json({ message: 'JPG file size exceeds the limit.' });
    }

    jpg_file.mv(jpgFileName, (error) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to upload the JPG file.' });
      }

      // Check document file size
      if (document.size > MAX_FILE_SIZE) {
        return res.status(402).json({ message: 'Document file size exceeds the limit.' });
      }

      document.mv(documentFileName, async (error) => {
        if (error) {
          return res.status(500).json({ message: 'Failed to upload the document.' });
        }

        try {
          
          const hashedPassword = await bcrypt.hash(req.body.password, 10);

          // Create a new employee document with the hashed password
          const employee = new users({
            emp_id: req.body.emp_id,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,  // Store the hashed password in the database
            position: req.body.position,
            joining: req.body.joining,
            file_upload_name: jpg_file.name,
            document: document.name,
            mobileNo: req.body.mobileNo,
            address: req.body.address,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            pincode: req.body.pincode
          });

          // Save the employee to the MongoDB collection
          employee.save()
            .then(() => {
              res.status(200).json({ message: 'Registration successful.' });
            })
            .catch((error) => {
              res.status(403).json({ message: 'Failed to save employee.' });
            });
        } catch (error) {
          res.status(500).json({ message: 'Failed to hash the password.' });
        }
      });
    });
  };

  await storeFiles(jpg_file, document);  // Add await here to wait for the async function to complete
});


// login form data chek in database
// app.post("/login", async (req, res) => {
//   if (req.body.email && req.body.password) {
//     const login = await users.findOne(req.body, { password: 0 });
//     if (login) {
//       jwt.sign({ login }, jwtkey, { expiresIn: "1h" }, (error, token) => {
//         if (error) {
//           res.send("Something went wrong. Please try again later.");
//         }
//         res.send({ login, token });
//       });
//     } else {
//       res.send("User not valid");
//     }
//   } else {
//     res.send("Please enter email and password");
//   }
// });

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    try {
      // Find the user by email (assuming email is unique)
      const user = await users.findOne({ email: req.body.email });

      if (user) {
        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (passwordMatch) {
          // If the password matches, generate a token and send it in the response
          jwt.sign({ user }, jwtkey, { expiresIn: "1h" }, (error, token) => {
            if (error) {
              res.status(500).json({ message: "Something went wrong. Please try again later." });
            }
            res.status(200).json({ user, token });
          });
        } else {
          res.status(401).json({ message: "Invalid password" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
  } else {
    res.status(400).json({ message: "Please enter email and password" });
  }
});


// update details employe
app.put("/inout/:emp_id/:currentDate", verifyToken, async (req, res) => {
  const { emp_id, currentDate } = req.params;
  const { clockIn, clockOut, lunchStart, lunchComplete, status} = req.body;

  try {
    const updatedInout = await Inout.findOneAndUpdate(
      { emp_id, date: currentDate }, // Use currentDate instead of date
      { clockIn, clockOut, lunchStart, lunchComplete, status },
      { new: true }
    );

    if (!updatedInout) {
      return res.status(404).send("Record not found");
    }
    res.send(updatedInout);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the inout data in the database.");
  }
});

// apply for leave
app.post("/leave-apply", verifyToken, async (req, res) => {
  const { toDate, fromDate, days, reason, emp_id, leaveType } = req.body;

  // Create a new leaves object with the converted date fields
  const leaves = new Leaves({
    toDate,
    fromDate,
    days,
    reason,
    emp_id,
    leaveType
  });

  // Save the leaves object to the database
  try {
    const result = await leaves.save();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while saving the leaves to the database.");
  }
});


// get leave details from backend
app.get('/Leave-list/:emp_id', verifyToken, async (req, res) => {
  try {
    const emp_id = req.params.emp_id;
    const data = await Leaves.find({ emp_id: emp_id });
    res.send(data);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// add new entry for today
app.post("/inout", verifyToken, async (req, res) => {
  const { emp_id, date, clockIn, clockOut, lunchStart, lunchComplete, status } = req.body;

  try {
    // Check if an employee with the same emp_id and date already exists in the database
    const existingInOut = await Inout.findOne({ emp_id, date });
    // Create a new instance of the Inout model
    const inout = new Inout({
      emp_id,
      date,
      clockIn,
      clockOut,
      lunchStart,
      lunchComplete,
      status
    });

    // Save the inout object to the database
    const result = await inout.save();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while saving the inout data to the database.");
  }
});


// get data from database
app.get('/inout-list/:emp_id', verifyToken, async (req, res) => {
  const emp_id = req.params.emp_id;
  const data = await Inout.find({ emp_id: emp_id });
  res.send(data);
});

// get data for profile page
app.get('/Profile/:emp_id', verifyToken, async (req, res) => {
  try {
    const emp_id = req.params.emp_id;
    const data = await users.find({ emp_id: emp_id }, { password: 0 })
    res.send(data);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/leave-balance/:emp_id',  async (req, res) => {
  try {
    const emp_id = req.params.emp_id;
    const data = await users.find({ emp_id: emp_id }, { password: 0 })
    res.send(data);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// get leave details from All Employe
app.get('/Leave-list', verifyToken, async (req, res) => {
  try {
    const data = await Leaves.find();
    res.send(data);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// update leave status from Admin
app.put('/Leave-list/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    await Leaves.findByIdAndUpdate(id, { status });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// upded the backend user balance leave
app.patch('/leave-balances/:emp_id', async (req, res) => {
  try {
    const emp_id = req.params.emp_id;
    const newLeaveBalance = req.body.leave;
    // Update the leave balance for the employee in the users collection
    const updatedUser = await users.findOneAndUpdate(
      { emp_id: emp_id },
      { $set: { leave: newLeaveBalance } },
      { new: true }
    );
    
    if (updatedUser) {
      res.sendStatus(200); // Send a success status code if the update is successful
    } else {
      res.status(404).send('User not found'); // Send a 404 status code if the user is not found
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Update the Leave status
app.put('/update-status/:emp_id', async (req, res) => {
  try {
    const emp_id = req.params.emp_id;
    const { fromDate, toDate, status } = req.body;

    // Update the status and toDate of the leave record in the database
    await Inout.updateMany(
      { emp_id, date: { $gte: fromDate, $lte: toDate } }, // Update records within the range of fromDate and toDate
      { status },
      { new: true }
    );

    res.sendStatus(200); // Send a success status code if the update is successful
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Cancel Leave
app.delete('/deleteEntry/:id', async (req, res) => {
  const entryId = req.params.id;

  try {
    const entry = await Leaves.findById(entryId);
    const days = entry.days;     
    const deletedEntry = await Leaves.findByIdAndDelete(entryId);

    if (!deletedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted successfully', days: days });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Details from All Employe
app.get('/Allemp', verifyToken, async (req, res) => {
  try {
    const data = await users.find().select('-password');
    res.send(data);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// get data for EditEploye page
app.get('/employee/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await users.find({ _id: id });
    res.send(data);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Update Employe details
app.put('/employee/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, position, joining, mobileNo, address, city } = req.body;

    // Update the employee record in the database
    await users.findByIdAndUpdate(id, {
      name,
      position,
      joining,
      mobileNo,
      address,
      city
    });
    res.sendStatus(200); // Send a success status code if the update is successful
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// delete the Empolye
app.delete('/employee/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    await users.findByIdAndRemove(id);
    res.sendStatus(200); // Send a success status code if the deletion is successful
  } catch (error) {
    res.sendStatus(500);
  }  
});

// Update Employee Entry
app.post('/employee/entry', async (req, res) => {
  try {
    const { emp_id, date, clockIn, lunchStart, lunchComplete, clockOut, status, remark } = req.body;
    

    if (!emp_id || !date) {
      return res.status(400).send('emp_id and date are required');
    }

    // Check if an entry with the same emp_id and date already exists
    const existingEntry = await Inout.findOne({ emp_id, date });

    if (existingEntry) {
      // Entry already exists, update the fields
      existingEntry.clockIn = clockIn;
      existingEntry.lunchStart = lunchStart;
      existingEntry.lunchComplete = lunchComplete;
      existingEntry.clockOut = clockOut;
      existingEntry.status = status;
      existingEntry.remark = remark;
      await existingEntry.save();
    } else {
      // Create a new employee entry in the database
      await Inout.create({
        emp_id,
        date,
        clockIn,
        lunchStart,
        lunchComplete,
        clockOut,
        status,
        remark
      });
    }

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});



// GET employee entry data by emp_id and date
app.get('/employee/entry/:emp_id/:date', async (req, res) => {
  try {
    const { emp_id, date } = req.params;
    const entry = await Inout.findOne({ emp_id, date });
    if (entry) {
      res.json(entry);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee data' });
  }
});


// This Is cron part 
cron.schedule('59 11 * * 1-6', async () => {
  await generateDailyEntries();
});

async function generateDailyEntries() {
  try {
    // Get all employees from the database
    const employees = await users.find();
    

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const currentDay = currentDate.getDate();

    // Get the first day of the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1); // Months are zero-based, so subtract 1

    // Generate entries for each day from the first day of the month up to the current date
    for (let date = firstDayOfMonth; date <= currentDate; date.setDate(date.getDate() + 1)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
      const day = String(date.getDate()).padStart(2, '0');
    
      const currentDateStr = `${year}-${month}-${day}`;

      // Check if an entry already exists for the current date for each employee
      for (const employee of employees) {
        const existingEntry = await Inout.findOne({ emp_id: employee.emp_id, date: currentDateStr });

        // If an entry already exists for the current date and employee, skip generating a new entry
        if (existingEntry) {
          continue;
        }

        // Get the day of the week for the current date
        const currentDayOfWeek = new Date(currentDateStr).getDay();

        // Check if the current day is Sunday (0 represents Sunday)
        const isSunday = currentDayOfWeek === 0;

        // Create a new entry for the current date and employee
        const newEntry = new Inout({
          emp_id: employee.emp_id,
          date: currentDateStr,
          status: isSunday ? 'S' : 'A',
        });

        // Save the new entry to the database
        await newEntry.save();
        console.log(`Generated entry: emp_id - ${employee.emp_id}, date - ${currentDateStr}, status - ${isSunday ? 'S' : 'A'}`);
      }
    }

    console.log('Daily entries generated successfully');
  } catch (error) {
    console.error('Error generating daily entries:', error);
    res.status(500).send('Internal Server Error');
  }
}

app.listen(4000)
