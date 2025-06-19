const db = require('../DB/connect');

const insertProfessionalDetails = async (
  OPH_ID,
  Profession,
  Bio,
  VideoURL,
  PhotoURLs,
  SpotifyLink,
  InstagramLink,
  FacebookLink,
  AppleMusicLink,
  ExperienceYearly,
  ExperienceMonthly,
  SongsPlanningCount,
  SongsPlanningType
) => {
  const [result] = await db.execute(
    `INSERT INTO professional_details (
      OPH_ID,
      Profession,
      Bio,
      VideoURL,
      PhotoURLs,
      SpotifyLink,
      InstagramLink,
      FacebookLink,
      AppleMusicLink,
      ExperienceYearly,
      ExperienceMonthly,
      SongsPlanningCount,
      SongsPlanningType
      
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      OPH_ID,
      Profession,
      Bio,
      VideoURL,
      PhotoURLs,
      SpotifyLink,
      InstagramLink,
      FacebookLink,
      AppleMusicLink,
      ExperienceYearly,
      ExperienceMonthly,
      SongsPlanningCount,
      SongsPlanningType
    ]
  );

  return result;
};

const getProfessionalByOphId = async (OPH_ID) => {
  const [result] = await db.execute(
    `SELECT * FROM professional_details WHERE OPH_ID = ?`,
    [OPH_ID]
  );
  return result;
};

module.exports = {
  insertProfessionalDetails,
  getProfessionalByOphId
};