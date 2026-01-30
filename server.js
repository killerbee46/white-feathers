import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/apiRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cors from "cors";
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import path from "path";
import swaggerJSDoc from 'swagger-jsdoc';
import { sequelize, tempDbConnect } from "./config/tempDb.js";
import schedule from 'node-schedule';
import fetchTodaysGoldSilverRates from "./utils/goldRate.js";
import { updateMaterialPrice } from "./utils/updateMaterialPrice.js";
import { updateCurrency } from "./utils/updateCurrency.js";
import { startSale, stopSale } from "./utils/silverSaleTimeController.js";
const __filename = fileURLToPath(import.meta.url);
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
app.use("/api",apiRoutes);
app.use("/upload", uploadRoutes)

schedule.scheduleJob({ hour: 11, minute: 11, tz: "Asia/Kathmandu" }, async function () {
  const rates = await fetchTodaysGoldSilverRates();
  updateMaterialPrice(rates)
  updateCurrency()
});

schedule.scheduleJob({ hour: 11, minute: 30, tz: "Asia/Kathmandu" }, async function () {
  startSale()
});

schedule.scheduleJob({ hour: 6, minute: 0, tz: "Asia/Kathmandu" }, async function () {
  stopSale()
});

//PORT
const PORT = process.env.PORT || 60000;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
  );
});
