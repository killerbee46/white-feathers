import dayjs from "dayjs"
import axios from "axios"
import { sequelize } from "../config/tempDb.js"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"

dayjs.extend(utc)
dayjs.extend(timezone)

export const selfFulfillingProphecy = async (req, res, next) => {
  // const refCurr = await Currency.findOne({ slug: 'USD' })

  // const refCurrQuery = 'select last_updated_at from currency where cur_name = "USD"'
  // const [refCurr] = await sequelize.query(refCurrQuery)
  // const refMatQuery = 'select last_updated_at from package_material where pm_id = 2'
  // const [refMat] = await sequelize.query(refMatQuery)
  // const last_updated_at = refCurr[0]?.last_updated_at
  // const rate_last_updated_at = refMat[0]?.last_updated_at

  // const nepaliDate = dayjs().tz("Asia/Kathmandu").format("HH")

  if (true) {
      const options = {
    method: 'GET',
    url: 'https://nepali-gold-silver-rate-live.p.rapidapi.com/api/rates/Nepal',
    headers: {
      'x-rapidapi-key': '08e1f67a35msh92b8381f4fd5708p1547f3jsneb1f6be75935',
      'x-rapidapi-host': 'nepali-gold-silver-rate-live.p.rapidapi.com'
    }
  };
    const goldSilverRates = await axios.request(options).then((data) => {
      const rateData = data?.data
      const metals = rateData?.metals

      const resData = metals.map(async(met) => {
        let updateRateQuery = ""
        switch (met?.name) {
          case "Gold":
            updateRateQuery = `update package_material set price = ${met?.types[0]?.per1tola}, last_updated_at = '${dayjs()}' where pm_id = 2`
            sequelize.query(updateRateQuery)
            break
          case "Silver":
            updateRateQuery = `update package_material set price = ${met?.types[0]?.per1tola}, last_updated_at = '${dayjs()}' where pm_id = 3`
            sequelize.query(updateRateQuery)
            break
          default:
            break;
        }
      });
    })
  }

  if (true) {

    const metalsApi = `https://www.nrb.org.np/api/forex/v1/rates?from=${dayjs().format('YYYY-MM-DD')}&to=${dayjs().format('YYYY-MM-DD')}&page=1&per_page=100`

    const exchangeRates = await axios.get(metalsApi).then(data => {
      const apiData = data?.data?.data?.payload?.[0]
      const rate = apiData?.rates

      if (true) {
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
      }
    })
  }
}