const WithdrawModel = require("../model/withdraw");
const { Resend } = require("resend");
const { paymentApprovedEmail, paymentRejectedEmail } = require("../../utils/emailTemplates");
const db = require("../../DB/connect");

const resend = new Resend(process.env.RESEND_API_KEY);

const updateWithdrawStatus = async (req, res) => {
  const { withdrawal_id, action, reason } = req.body;

  if (!withdrawal_id || !action) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (action === "reject" && !reason) {
    return res.status(400).json({ message: "Rejection reason is required" });
  }

  try {
    const result = await WithdrawModel.updateWithdrawStatus(
      withdrawal_id,
      action,
      reason
    );

    // Fetch ophID from the withdraw record
    const [withdrawRows] = await db.execute(
      "SELECT OPH_ID FROM withdraw WHERE withdrawal_id = ?",
      [withdrawal_id]
    );
    const ophID = withdrawRows[0]?.OPH_ID;
    console.log("Withdrawal ophID:", ophID);

    if (ophID) {
      const [userRows] = await db.execute(
        "SELECT email, full_name FROM user_details WHERE oph_id = ?",
        [ophID]
      );
      const userEmail = userRows[0]?.email;
      const userName = userRows[0]?.full_name;
      console.log("Withdrawal email target:", userEmail);

      if (userEmail) {
        if (action === "approve") {
          console.log(userEmail , " userEmail");
          
          await resend.emails.send({
            from: "OPH Community <creators@ophcommunity.org>",
            to: userEmail,
            subject: "Withdrawal Request Approved!",
            html: paymentApprovedEmail(userName, withdrawal_id),
          });
          console.log("Withdrawal approval email sent to:", userEmail);
        } else if (action === "reject") {
          await resend.emails.send({
            from: "OPH Community <creators@ophcommunity.org>",
            to: userEmail,
            subject: "Withdrawal Request Rejected",
            html: paymentRejectedEmail(userName, withdrawal_id, reason),
          });
          console.log("Withdrawal rejection email sent to:", userEmail);
        }
      }
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating withdraw status:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};


const getWithdrawSummaries = async (req, res) => {
  try {
    const withdraw = await WithdrawModel.getAllWithdraw();
    res.status(200).json({ success: true, data: withdraw });
  } catch (error) {
    console.error("Error fetching withdraw:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getWithdraw = async (req, res) => {
  const { withdrawal_id } = req.query;
  if (!withdrawal_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing withdrawal_id in query" });
  } else {
    try {
      const tv = await WithdrawModel.getWithdraw(withdrawal_id);
      res.status(200).json({ success: true, data: tv });
    } catch (error) {
      console.error("Error fetching tv based on withdrawal_id:", error);
      // console.log("Controller - withdrawal_id:", withdrawal_id);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};

module.exports = {
  getWithdrawSummaries,
  updateWithdrawStatus,
  getWithdraw,
};