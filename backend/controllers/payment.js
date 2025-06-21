// controllers/payment.js
const paymentInfo = require("../model/payment");

const payment = async (req, res) => {
  try {
    const { OPH_ID, Transaction_ID, Review, Status } = req.body;

    const dbResponse = await paymentInfo.insertPayment(
      OPH_ID,
      Transaction_ID,
      Review,
      Status
    );

    if (dbResponse) {
      return res.status(200).json({
        id: OPH_ID,
        success: true,
        message: "Payment ID sent for verification"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Payment - server Error"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Payment - server Error"
    });
  }
};

module.exports = { payment };
