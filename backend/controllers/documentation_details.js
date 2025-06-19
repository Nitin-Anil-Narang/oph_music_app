const { insertDocumentationDetails } = require("../model/documentation_details");
const { uploadToS3 } = require("../utils");

const insertDocumentationController = async (req, res) => {
  try {
    const {
      OPH_ID,
      BankName,
      AccountHolderName,
      AccountNumber,
      IFSCCode,
      AgreementAccepted
    } = req.body;

    const files = req.files;

    const AadharFrontURL = files?.aadharFront ? await uploadToS3(files.aadharFront[0], "kyc/aadhar") : null;
    const AadharBackURL = files?.aadharBack ? await uploadToS3(files.aadharBack[0], "kyc/aadhar") : null;
    const PanFrontURL = files?.panFront ? await uploadToS3(files.panFront[0], "kyc/pan") : null;
    const PanBackURL = files?.panBack ? await uploadToS3(files.panBack[0], "kyc/pan") : null;
    const SignatureImageURL = files?.signatureImage ? await uploadToS3(files.signatureImage[0], "kyc/signature") : null;

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
      insertId: result.insertId
    });
  } catch (err) {
    console.error("Insert documentation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  insertDocumentationController
};
