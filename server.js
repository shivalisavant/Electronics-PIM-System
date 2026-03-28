const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", require("./routes/productRoutes"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
