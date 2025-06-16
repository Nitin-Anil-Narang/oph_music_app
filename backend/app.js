const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const connectDB = require("./DB/connect");
console.log('hello start');
const signinRoute = require("./routes/signin");
const signupRoute = require("./routes/signup");

console.log('hello end');

app.use(cors({ origin: "http://localhost:5173", credentials: true, }));
app.use(express.json());
app.use("/", signupRoute);
app.use("/", signinRoute);

app.listen(port, () => {
  console.log(`Server is listening to ${port} port...`);
});
