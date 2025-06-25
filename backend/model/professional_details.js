const db = require("../DB/connect");

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
      SongsPlanningType,
    ]
  );

  return result;
};

const updateProfessionalDetails = async (
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
  SongsPlanningType,

) => {
  const [result] = await db.execute(
    "UPDATE professional_details SET Profession = ?,Bio = ?,VideoURL= ?,PhotoURLs= ?,SpotifyLink= ?,InstagramLink= ?,FacebookLink= ?,AppleMusicLink= ?,ExperienceYearly= ?,ExperienceMonthly= ?,SongsPlanningCount= ?,SongsPlanningType= ?,step_status= ?, reject_reason = ? WHERE OPH_ID = ?",
      
      [
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
      SongsPlanningType,
      'under review',
      null,
      OPH_ID,
    ]
  );

  return result;
};

const getProfessionalByOphId = async (OPH_ID) => {
    const [rows] = await db.execute(
      "SELECT ud.ophid, pd.Profession, pd.Bio, pd.VideoURL, pd.PhotoURLs, pd.SpotifyLink, pd.InstagramLink, pd.FacebookLink, pd.AppleMusicLink, pd.ExperienceYearly,pd.ExperienceMonthly, pd.SongsPlanningCount, pd.SongsPlanningType FROM user_details ud LEFT JOIN professional_details pd ON ud.ophid = pd.OPH_ID WHERE ud.ophid = ?",
      [OPH_ID]
    );

    return rows;
};

const getProfessionalDetails = async (OPH_ID) => {
  const [rows] = await db.execute(
    "SELECT * FROM user_details WHERE ophid = ?",
    [OPH_ID]
  );

  return rows;
};

module.exports = {
  insertProfessionalDetails,
  getProfessionalDetails,
  getProfessionalByOphId,
  updateProfessionalDetails
};
