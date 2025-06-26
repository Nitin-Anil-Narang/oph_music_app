const {
  insertDocumentationDetails,
  getDocumentationDetails,
  getDocumentationDetailsByOphId,
} = require("../model/documentation_details");
const { uploadToS3 } = require("../utils");

const insertDocumentationController = async (req, res) => {

      
  try {
    const {
      OPH_ID,
      BankName,
      AccountHolderName,
      AccountNumber,
      IFSCCode,
      AgreementAccepted,
    } = req.body;

    // Validate user exists
    const user = await getDocumentationDetails(OPH_ID);
    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Upload files to S3
    const files = req.files;

    const AadharFrontURL = files?.AadharFrontURL
      ? await uploadToS3(files.AadharFrontURL[0], "kyc/aadhar")
      : null;

    const AadharBackURL = files?.AadharBackURL
      ? await uploadToS3(files.AadharBackURL[0], "kyc/aadhar")
      : null;

    const PanFrontURL = files?.PanFrontURL
      ? await uploadToS3(files.PanFrontURL[0], "kyc/pan")
      : null;

    const PanBackURL = files?.PanBackURL
      ? await uploadToS3(files.PanBackURL[0], "kyc/pan")
      : null;

    const SignatureImageURL = files?.SignatureImageURL
      ? await uploadToS3(files.SignatureImageURL[0], "kyc/signature")
      : null;

    // Save to DB
    const result = await insertDocumentationDetails(
      OPH_ID,
      AadharFrontURL,
      AadharBackURL,
      PanFrontURL,
      PanBackURL,
      SignatureImageURL,
      BankName,
      AccountHolderName,
      AccountNumber,
      IFSCCode,
      parseInt(AgreementAccepted)
    );

    res.status(200).json({
      success: true,
      message: "Documentation details inserted successfully",
      insertId: result.insertId,
    });
  } catch (err) {
    console.error("Insert documentation error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const getDocumentByOphIdController = async (req, res) => {
  try {
    const { ophid } = req.query;
    // console.log(ophid);

    const data = await getDocumentationDetailsByOphId(ophid);
    // console.log(ophid);
    
    // console.log(data);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found for the given OPH_ID",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  insertDocumentationController,
  getDocumentByOphIdController,
};
