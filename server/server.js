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
import profileRoutes from "./routes/profileRoutes.js";
import sqlRoutes from "./routes/sqlRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import testProductRoutes from "./routes/testProductRoutes.js";
import cors from "cors";
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import path from "path";
import swaggerJSDoc from 'swagger-jsdoc';
import { tempDbConnect } from "./config/tempDb.js";
import mongoose from "mongoose";
import { calculatePrice } from "./controllers/priceCalculatorController.js";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: "Express API for White Feather's Jewellery",
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  apis: ['routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);  

//configure env
dotenv.config();

//databse config
connectDB();
tempDbConnect();
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


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", futsalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/sql", sqlRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/upload", uploadRoutes)
app.post("/api/price-calculator", calculatePrice)

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
  );
});
