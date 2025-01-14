const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  customer_name: {
    required: true,
    type: String,
  },
  booking_date: {
    type: Date,
    required: true,
  },
  vendor_details: {
    vendorName: {
      type: String,
      required: true,
    },
    vendorContact: {
      type: Number,
      required: true,
    },
  },
  amount: {
    required: true,
    type: Number,
  },
});

module.exports = mongoose.model("bookings", dataSchema);
