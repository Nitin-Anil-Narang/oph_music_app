const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

const connectDB = require("./DB/connect");
const signinRoute = require("./routes/signin");
const signupRoute = require("./routes/signup");
const profileRoute = require("./routes/profile"); 

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
const paymentRoute = require("./routes/payment");
const professionalDetailsRoute = require("./routes/professional_details")
const documentationDetailsRoute = require("./routes/documentation_details")
console.log('hello end');

app.use(cors({ origin: "http://localhost:5173", credentials: true, }));
app.use(express.json());

app.use("/", signupRoute);
app.use("/", signinRoute);
app.use("/", profileRoute); 
app.use("/", paymentRoute);
app.use("/", professionalDetailsRoute);
app.use("/", documentationDetailsRoute);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
