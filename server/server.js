import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/apiRoutes.js";
import authRoutes from "./routes/authRoute.js";
import futsalRoutes from "./routes/futsalRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cors from "cors";
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use('/uploads', express.static('uploads'))


//rest api
app.get("/", (req, res) => {
  res.send(`<h3>Api server is running</h3> <a href="/api"><button>Go to Api</button></a>`)
});

app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", futsalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/upload", uploadRoutes)

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
  );
});
