const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

// Connect DB (assumed it runs inside connectDB file)
const connectDB = require("./DB/connect");

// Routes
const signinRoute = require("./routes/signin");
const signupRoute = require("./routes/signup");
const paymentRoute = require("./routes/payment");
const professionalDetailsRoute = require("./routes/professional_details")
const documentationDetailsRoute = require("./routes/documentation_details")
const dateBookingRoute = require("./routes/date_booking")
const songResgisterRoute= require("./routes/songs_register")
const songDetailsRoute= require("./routes/song_details")
const personalDetails = require("./routes/personal_details")
const membership = require('./routes/membership')
const forgotPassword = require("./routes/forgot_password")
const resetPassword = require("./routes/reset_password")

// ✅ Middleware order is important
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// ✅ Mount routes
app.use("/", signupRoute);
app.use("/", signinRoute);
app.use("/", paymentRoute);
app.use("/", professionalDetailsRoute);
app.use("/", documentationDetailsRoute);

app.use("/", dateBookingRoute);
app.use("/", songResgisterRoute);
app.use("/", songDetailsRoute);
app.use("/", forgotPassword);
app.use("/", resetPassword);
app.use("/",personalDetails);
app.use("/",membership);

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
