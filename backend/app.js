const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const connectDB = require("./DB/connect");
console.log('hello start');
const signinRoute = require("./routes/signin");
const signupRoute = require("./routes/signup");
const paymentRoute = require("./routes/payment");
const professionalDetailsRoute = require("./routes/professional_details")
const documentationDetailsRoute = require("./routes/documentation_details")
const dateBookingRoute = require("./routes/date_booking")
const songResgisterRoute= require("./routes/songs_register")
const songDetailsRoute= require("./routes/song_details")
console.log('hello end');

app.use(cors({ origin: "http://localhost:5173", credentials: true, }));
app.use(express.json());
app.use("/", signupRoute);
app.use("/", signinRoute);
app.use("/", paymentRoute);
app.use("/", professionalDetailsRoute);
app.use("/", documentationDetailsRoute);
app.use("/", dateBookingRoute);
app.use("/", songResgisterRoute);
app.use("/", songDetailsRoute);

app.listen(port, () => {
  console.log(`Server is listening to ${port} port...`);
});
