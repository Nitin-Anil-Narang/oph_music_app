const details = require('../model/allArtist');

const getAllDetails = async (req, res) => {
  try {
    const { ophid } = req.params;

    const userDetails = await details.getUserDetailsByOphId(ophid);
    const professionalDetails = await details.getProfessionalDetailsByOphId(ophid);
    const documentationDetails = await details.getDocumentationDetailsByOphId(ophid);

    // Check if no data found for all
    if (!userDetails && !professionalDetails && !documentationDetails) {
      return res.status(404).json({ message: "No details found for given OPH ID." });
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

const getAllUserDetails = async (req, res) => {
  try {
    const userDetails = await details.getAllUserDetails();
    console.log(userDetails);
    

    // if (!userDetails || userDetails.length === 0) {
    //   return res.status(404).json({ message: "No user details found with step_status under review in any table" });
    // }

    res.status(200).json({ userDetails });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports={getAllUserDetails,getAllDetails}