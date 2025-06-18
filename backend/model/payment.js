const db = require('../DB/connect'); // MySQL connectionAdd commentMore actions


const insertPayment = async (OPH_ID, Transaction_ID,Review, Status) => {
  const [result] = await db.execute(
    'INSERT INTO sign_up_payment (OPH_ID, Transaction_ID,Review, Status) VALUES (?, ?, ?, ?)',
    [OPH_ID, Transaction_ID,Review, Status]
  );
  return result;
};



module.exports = {
  insertPayment
};