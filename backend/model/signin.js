const db = require('../DB/connect');


const findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM user_details WHERE email = ?', [email]);
  return rows;
};


const checkRejectedStep = async (ophid) =>
{
  const [rows] = await db.execute("SELECT ud.ophid, ud.reject_reason AS user_details_reason, ud.step_status AS user_details_status, prd.reject_reason AS professional_details_reason, prd.step_status AS professional_details_status, dd.reject_reason AS document_details_reason , dd.step_status AS document_details_status FROM user_details ud LEFT JOIN professional_details prd ON ud.ophid = prd.OPH_ID LEFT JOIN documentation_details dd ON ud.ophid = dd.OPH_ID  WHERE ophid = ?", [ophid])

  return rows
}

module.exports = { findUserByEmail, checkRejectedStep };
