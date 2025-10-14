import dayjs from "dayjs"
import axios from "axios"
import { sequelize } from "../config/tempDb.js"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"

dayjs.extend(utc)
dayjs.extend(timezone)

export const updateCurrency = async (rates) => {

    const currApi = `https://www.nrb.org.np/api/forex/v1/rates?from=${dayjs().format('YYYY-MM-DD')}&to=${dayjs().format('YYYY-MM-DD')}&page=1&per_page=100`

    const exchangeRates = await axios.get(currApi).then(data => {
      const apiData = data?.data?.data?.payload?.[0]
      const rate = apiData?.rates

        rate?.map((rt) => {
          let updateQuery = ""
          switch (rt?.currency?.iso3) {
            case "USD":
              updateQuery = `update currency set cur_rate = ${rt?.sell}, last_updated_at = '${apiData?.published_on}' where cur_name = '${rt?.currency?.iso3}'`
              sequelize.query(updateQuery)
              break
            case "AUD":
              updateQuery = `update currency set cur_rate = ${rt?.sell}, last_updated_at = '${apiData?.published_on}'  where cur_name = '${rt?.currency?.iso3}'`
              sequelize.query(updateQuery)
              break
            case "EUR":
              updateQuery = `update currency set cur_rate = ${rt?.sell}, last_updated_at = '${apiData?.published_on}'  where cur_name = '${rt?.currency?.iso3}'`
              sequelize.query(updateQuery)
              break
            case "CAD":
              updateQuery = `update currency set cur_rate = ${rt?.sell}, last_updated_at = '${apiData?.published_on}'  where cur_name = '${rt?.currency?.iso3}'`
              sequelize.query(updateQuery)
              break
            default:
              break
          }
        })
    })
}