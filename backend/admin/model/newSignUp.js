const db = require('../../DB/connect');



const getUniqueOphIdsWithRegistration = async () => {
  const [rows] = await db.execute(
        `SELECT t.OPH_ID
     FROM sign_up_payment t
     INNER JOIN (
       SELECT OPH_ID, MAX(CreatedAt) as max_created
       FROM sign_up_payment
       WHERE \`From\` = ? AND OPH_ID IS NOT NULL AND OPH_ID != ''
       GROUP BY OPH_ID
     ) latest 
     ON t.OPH_ID = latest.OPH_ID AND t.CreatedAt = latest.max_created
     WHERE t.\`From\` = ? AND t.OPH_ID IS NOT NULL AND t.OPH_ID != ''`,
    ["Registeration", "Registeration"]

  );
  return rows;
};

 const getUserDetailsByOphIds = async (ophIds) => {
  if (ophIds.length === 0) return [];

  // Create placeholders (?, ?, ...) dynamically
  const placeholders = ophIds.map(() => "?").join(",");

  const [rows] = await db.execute(
    `SELECT *
     FROM user_details
     WHERE ophid IN (${placeholders})`,
    ophIds
  );

  return rows;
};
const getUserDetailsByOphId = async (ophId) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM user_details
     WHERE ophid = ?`,
    [ophId]
  );
  return rows[0] || null;
};


module.exports = {getUniqueOphIdsWithRegistration,getUserDetailsByOphIds,getUserDetailsByOphId};