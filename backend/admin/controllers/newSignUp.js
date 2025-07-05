const newSignUp = require("../model/newSignUp");


const getAllOphIdsWithRegistration = async (req, res) => {
  try {
    const ophIdRows = await newSignUp.getUniqueOphIdsWithRegistration();
    const ophIds = ophIdRows.map(row => row.OPH_ID);

    // Fetch corresponding user details
    const userDetails = await newSignUp.getUserDetailsByOphIds(ophIds);

    res.status(200).json({
      success: true,
      userDetails,

    });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSingleUserDetails = async (req, res) => {
  try {
    const { ophid } = req.params;

    if (!ophid) {
      return res.status(400).json({ success: false, message: "ophid is required" });
    }

    const userDetails = await newSignUp.getUserDetailsByOphId(ophid);

    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      userDetails,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




module.exports = { getAllOphIdsWithRegistration ,getSingleUserDetails};