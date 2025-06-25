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
    "UPDATE user_details SET full_name= ?,stage_name = ?, email = ?, contact_num=?, personal_photo = ?, location = ? WHERE ophid = ?",
    [legal_name,stage_name,email,contact_num,storageLocation, location, ophid]
  );
  return rows;
};

const getPersonalDetails = async (ophid) => {
  const [rows] = await db.execute(
    "SELECT full_name,stage_name,contact_num, email FROM user_details WHERE ophid = ?",
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

module.exports = { setPersonalDetails, getPersonalDetails ,getFullPersonalDetails};
