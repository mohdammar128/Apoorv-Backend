const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDatabase = require("./src/config/databaseConnection.js");
const router = require("./src/router/router.js");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

// Database connection function is written here
connectToDatabase();
