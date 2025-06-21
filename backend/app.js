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
const professionalDetailsRoute = require("./routes/professional_details");
const documentationDetailsRoute = require("./routes/documentation_details");
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
app.use("/", forgotPassword)
app.use("/", resetPassword)

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
