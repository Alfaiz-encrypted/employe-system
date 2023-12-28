const mongoose = require('mongoose');

const InoutSchema = new mongoose.Schema({
  emp_id: {
    type: String,
    required: true
  },
  date: { 
    type: String,
    required: true
  },
  clockIn: { 
    type: String,
  },
  lunchStart: {
    type: String,
  },
  lunchComplete: {
    type: String,
  },
  clockOut: {
    type: String,
  },
  status:{
    type: String
  },
  remark:{
    type: String
  }
});

module.exports = mongoose.model("Inout", InoutSchema);
