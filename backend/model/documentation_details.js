const db = require("../DB/connect");

const insertDocumentationDetails = async (
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
  AgreementAccepted
) => {
  const [result] = await db.execute(
    `INSERT INTO documentation_details (
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
      AgreementAccepted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
      AgreementAccepted
    ]
  );

  return result;
};

module.exports = { insertDocumentationDetails };
