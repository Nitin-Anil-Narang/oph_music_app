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
      SignatureImageURL: signatureFromBody,
      AadharFrontURL: aadharFrontFromBody,
      AadharBackURL: aadharBackFromBody,
      PanFrontURL: panFrontFromBody,
      PanBackURL: panBackFromBody,
    } = req.body;

    // Validate user exists
    const userRows = await getDocumentationDetailsByOphId(OPH_ID);
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    const user = userRows[0];
    console.log(user,"usersRows");
    const files = req.files;

    const AadharFrontURL = files?.AadharFrontURL
      ? await uploadToS3(files.AadharFrontURL[0], "kyc/aadhar")
      : aadharFrontFromBody || null;

    const AadharBackURL = files?.AadharBackURL
      ? await uploadToS3(files.AadharBackURL[0], "kyc/aadhar")
      : aadharBackFromBody || null;

    const PanFrontURL = files?.PanFrontURL
      ? await uploadToS3(files.PanFrontURL[0], "kyc/pan")
      : panFrontFromBody || null;

    const PanBackURL = files?.PanBackURL
      ? await uploadToS3(files.PanBackURL[0], "kyc/pan")
      : panBackFromBody || null;

    let SignatureImageURL;
    if (files?.SignatureImageURL) {
      SignatureImageURL = await uploadToS3(files.SignatureImageURL[0], "kyc/signature");
    } else if (signatureFromBody) {
      SignatureImageURL = signatureFromBody;
    } else {
      SignatureImageURL = null;
    }

    console.log(SignatureImageURL, "Final Signature URL");

    const normalize = (value) =>
      value === null || value === undefined
        ? null
        : typeof value === "string"
        ? value.trim()
        : value;

    const dbAgreement = parseInt(user.AgreementAccepted) || 0;
    const inputAgreement = parseInt(AgreementAccepted) || 0;

    // Build change details
    const changedDetails = [];

    const checkAndAdd = (field, oldValRaw, newValRaw) => {
      const oldVal = normalize(oldValRaw);
      const newVal = normalize(newValRaw);
      if (oldVal !== newVal) {
        changedDetails.push({ field, oldValue: oldVal, newValue: newVal });
      }
    };

    checkAndAdd("AadharFrontURL", user.AadharFrontURL, AadharFrontURL);
    checkAndAdd("AadharBackURL", user.AadharBackURL, AadharBackURL);
    checkAndAdd("PanFrontURL", user.PanFrontURL, PanFrontURL);
    checkAndAdd("PanBackURL", user.PanBackURL, PanBackURL);
    checkAndAdd("SignatureImageURL", user.SignatureImageURL, SignatureImageURL);
    checkAndAdd("BankName", user.BankName, BankName);
    checkAndAdd("AccountHolderName", user.AccountHolderName, AccountHolderName);
    checkAndAdd("AccountNumber", user.AccountNumber, AccountNumber);
    checkAndAdd("IFSCCode", user.IFSCCode, IFSCCode);

    if (dbAgreement !== inputAgreement) {
      changedDetails.push({
        field: "AgreementAccepted",
        oldValue: dbAgreement,
        newValue: inputAgreement,
      });
    }

    if (changedDetails.length === 0) {
      console.log("No changes detected, skipping update");
      return res.status(200).json({
        success: true,
        message: "No changes detected, skipped update",
      });
    }

    console.log("Changed details:", changedDetails);

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
      inputAgreement
    );

    res.status(200).json({
      success: true,
      message: "Documentation details inserted/updated successfully",
      insertId: result.insertId,
      changedDetails,
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
    

    const data = await getDocumentationDetailsByOphId(ophid);
    

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
