import dayjs from "dayjs";
import { sequelize } from "../config/tempDb.js";
import axios from "axios";

export const apiPriceUpdate = async() => {

    const url = "https://gold-silver.sabinmagar.com.np/wp-json/v1/metal-prices"

    const {data} = await axios.get(url)

    const rates = data?.data[0]

    rates?.map(async(r) => {
        let updateRateQuery = ""
        switch (r?.metal?.id) {
          case 1:
            updateRateQuery = `update package_material set price = ${r?.price_per_tola}, last_updated_at = '${dayjs()}' where pm_id = 2`
            sequelize.query(updateRateQuery)
            break
          case 3:
            updateRateQuery = `update package_material set price = ${r?.price_per_tola}, last_updated_at = '${dayjs()}' where pm_id = 3`
            sequelize.query(updateRateQuery)
            updateRateQuery = `update package set fixed_price = ${parseInt(r?.price_per_tola) + 175} where id_pack = 2292`
            sequelize.query(updateRateQuery)
            break
          default:
            break;
        }
      });
}