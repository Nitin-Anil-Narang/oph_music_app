const user_details = require("../model/signup.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {setCurrentStep} = require("../model/common/set_step.js")

const ophidGenerator = (artistT, len, cnt) => {
  let id = '';

  if (artistT === 'Independent artist') {
    if (len === 0) {
      id = 'OPH-CAN-IA-01';
    } else {
      id = `OPH-CAN-IA-0${cnt + 1}`;
    }
  } else if (artistT === 'Special artist') {
    if (len === 0) {
      id = 'OPH-CAN-SA-01';
    } else {
      id = `OPH-CAN-SA-0${cnt + 1}`;
    }
  }

  return id;
};


const signup = async (req, res) => {
  let count = 0
  try {
    const { name, stageName, email, contactNumber, confirmPassword, artistType, step } =
      req.body;

    // Check if user already exists
    const userExists = await user_details.getEmailAndNumber(
      email,
      contactNumber
    );
    if (userExists.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email or phone already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(confirmPassword, 10);

    const artist = await user_details.storeArtistType(artistType)

    if(artist.length > 0)
    {
      count = artist[0].cnt
    }
    const ophId = ophidGenerator(artistType, artist.length, count)
    // Insert user
    const dbResponse = await user_details.createUser(
      ophId,
      name,
      stageName,
      email,
      contactNumber,
      hashedPassword,
      artistType
    );

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });

    if (dbResponse) {

      await setCurrentStep(step,ophId)
      return res.status(201).json({ ophid : ophId,success: true, message: "Signup success", token: token});
    }

    return res.status(500).json({ success: false, message: "Server error" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { signup };
