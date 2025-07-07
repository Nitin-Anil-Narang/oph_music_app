const userDetailsModel = require("../model/newArtist");

const getAllDetailsUnderReview = async (req, res) => {
  try {
    const { ophid } = req.params;

    const userDetails = await userDetailsModel.getUserDetailsByOphId(ophid);
    const professionalDetails = await userDetailsModel.getProfessionalDetailsByOphId(ophid);
    const documentationDetails = await userDetailsModel.getDocumentationDetailsByOphId(ophid);

    // Check if no data found for all
    if (!userDetails && !professionalDetails && !documentationDetails) {
      return res.status(404).json({ message: "No details found with step_status 'under review' for given OPH ID." });
    }

    res.status(200).json({
      userDetails,
      professionalDetails,
      documentationDetails,
    });
    console.log(res.data);
    
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUserDetailsIfAnyStepUnderReview = async (req, res) => {
  try {
    const userDetails = await userDetailsModel.getAllUserDetailsWithAnyStepUnderReview();

    if (!userDetails || userDetails.length === 0) {
      return res.status(404).json({ message: "No user details found with step_status under review in any table" });
    }

    res.status(200).json({ userDetails });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllDetailsUnderReview,
  getAllUserDetailsIfAnyStepUnderReview
};
