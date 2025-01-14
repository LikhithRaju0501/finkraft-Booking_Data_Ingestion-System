var express = require("express");
const bookingModel = require("./bookingModel");
var router = express.Router();

function isValidDateAndFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/; // Format: YYYY-MM-DD
  if (!regex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  console.log(date instanceof Date, !isNaN(date), dateString);
  return date instanceof Date && !isNaN(date);
}

const isPayloadValid = (payload) => {
  const { customer_name, booking_date, vendor_details, amount } = payload;
  let errors = [];
  if (!customer_name) {
    errors = [
      ...errors,
      {
        message: "Please Provide the Customer Name",
      },
    ];
  }
  if (!amount || typeof amount !== "number") {
    errors = [
      ...errors,
      {
        message: "The Amount Field is required and should be in number format",
      },
    ];
  }
  if (!booking_date || !isValidDateAndFormat(booking_date)) {
    errors = [
      ...errors,
      {
        message:
          "The booking date Field is required and should be in YYYY-MM-DD format",
      },
    ];
  }
  if (
    !vendor_details?.vendorName ||
    !vendor_details?.vendorContact ||
    typeof vendor_details?.vendorContact !== "number"
  ) {
    errors = [
      ...errors,
      {
        message:
          "The Vendor Details Field is required and Vendor Contact should be in number format",
      },
    ];
  }
  return errors;
};

router.post("/", async (req, res) => {
  const { customer_name, booking_date, vendor_details, amount } = req?.body;
  const errors = isPayloadValid(req?.body);
  if (errors?.length) {
    res
      .status(400)
      .json({ message: "Please correct the following errors", errors });
  } else {
    const data = new bookingModel({
      customer_name,
      booking_date,
      vendor_details: { ...vendor_details },
      amount,
    });

    try {
      const dataToSave = await data.save();
      res.status(200).json(dataToSave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

router.get("/", async (req, res) => {
  try {
    const { bookingId } = req.query;
    const booking = await bookingModel.findById(bookingId).lean();
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { bookingId } = req.query;
    const booking = await bookingModel.deleteOne({ _id: bookingId }).lean();
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
});

module.exports = router;
