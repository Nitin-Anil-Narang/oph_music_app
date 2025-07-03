const db = require("../DB/connect");

const setPersonalDetails = async (
  ophid,
  legal_name,
  stage_name,
  contact_num,
  storageLocation,
  location,
  email
) => {
  const [rows] = await db.execute(
    "UPDATE user_details SET full_name= ?,stage_name = ?, email = ?, contact_num=?, personal_photo = ?, location = ?, step_status = ?, reject_reason = ? WHERE ophid = ?",
    [legal_name,stage_name,email,contact_num,storageLocation, location, 'under review', null ,ophid]
  );
  return rows;
};

const getPersonalDetails = async (ophid) => {
  const [rows] = await db.execute(
    "SELECT * FROM user_details WHERE ophid = ?",
    [ophid]
  );

  return rows;
};

const getFullPersonalDetails = async (ophid) => {
  const [rows] = await db.execute(
    "SELECT * FROM user_details WHERE ophid = ?;",
    [ophid]
  );

  return rows;
};

const getFullPersonal = async () => {
  const [rows] = await db.execute("SELECT * FROM user_details;");
  console.log(rows);
  
  // If you want to return as JSON explicitly (usually it already is an array of objects)
  return rows;
};


module.exports = { setPersonalDetails, getPersonalDetails ,getFullPersonalDetails,getFullPersonal};
