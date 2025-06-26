// controllers/payment.js
const paymentInfo = require("../model/payment");
const {setCurrentStep} = require("../model/common/set_step.js")

const payment = async (req, res) => {
  try {
    const { OPH_ID, Transaction_ID, Review, Status,step, from } = req.body;
    
    const dbResponse = await paymentInfo.insertPayment(
      OPH_ID,
      Transaction_ID,
      Review,
      Status,
      from
    );

    if (dbResponse) {

      await setCurrentStep(step, OPH_ID)

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
