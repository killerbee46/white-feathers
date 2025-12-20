import dayjs from "dayjs";
import { sequelize } from "../config/tempDb.js";

export const updateMaterialPrice = (rates) => {
    const materialRates = rates?.rates
      Object?.keys(materialRates)?.map(async(key) => {
        let updateRateQuery = ""
        switch (key) {
          case "gold":
            updateRateQuery = `update package_material set price = ${materialRates[key]}, last_updated_at = '${dayjs()}' where pm_id = 2`
            sequelize.query(updateRateQuery)
            break
          case "silver":
            updateRateQuery = `update package_material set price = ${materialRates[key]}, last_updated_at = '${dayjs()}' where pm_id = 3`
            sequelize.query(updateRateQuery)
            break
          default:
            break;
        }
      });
}