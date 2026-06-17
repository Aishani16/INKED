const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});