import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import apiRoutes from "./routes/apiRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cors from "cors";
import { tempDbConnect } from "./config/tempDb.js";
import schedule from 'node-schedule';
import { updateCurrency } from "./utils/updateCurrency.js";
import { startSale, stopSale } from "./utils/silverSaleTimeController.js";
import dayjs from "dayjs";
import { apiPriceUpdate } from "./utils/apiPriceUpdate.js";

//configure env
dotenv.config();

//databse config
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
  res.send(`<h3>Api server is running</h3> <a href="/api"><button>Go to Api</button></a>
    <div>
    <a href="/api/update-material-price"><button>Update Price</button></a>
    </div>
    `)
});

app.use("/api", apiRoutes);
app.use("/upload", uploadRoutes)

schedule.scheduleJob({ hour: 11, minute: 30, tz: "Asia/Kathmandu" }, async function () {
  // const rates = await fetchTodaysGoldSilverRates();
  // updateMaterialPrice(rates)
  apiPriceUpdate()
  updateCurrency()
});
schedule.scheduleJob({ hour: 11, minute: 30, tz: "Asia/Kathmandu" }, async function () {
  if (dayjs().day() != 6) {
    startSale()
  }
});

schedule.scheduleJob({ hour: 17, minute: 30, tz: "Asia/Kathmandu" }, async function () {
  stopSale()
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on port ${PORT}`
  );
});
