import dayjs from "dayjs"
import axios from "axios"
import { sequelize } from "../config/tempDb.js"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"

dayjs.extend(utc)
dayjs.extend(timezone)

export const selfFulfillingProphecy = async (req, res, next) => {
  // const refCurr = await Currency.findOne({ slug: 'USD' })

  const refCurrQuery = 'select last_updated_at from currency where cur_name = "USD"'
  const [refCurr] = await sequelize.query(refCurrQuery)
  const last_updated_at = refCurr[0]?.last_updated_at

  const metalsApi = `https://www.nrb.org.np/api/forex/v1/rates?from=${dayjs('YYYY-MM-DD')}&to=${dayjs('YYYY-MM-DD')}&page=1&per_page=100`

  const nepaliDate = dayjs().tz("Asia/Kathmandu").format("HH")
  const shouldUpdate = dayjs().diff(last_updated_at, 'h')

  if (nepaliDate >= 6 && shouldUpdate > 12 && metalsApi !== "") {

    const exchangeRates = await axios.get(metalsApi).then(data => {
      const apiData = data?.data?.data?.payload[0]
      const rate = apiData?.rates

      if (dayjs(apiData?.published_on).diff(dayjs(last_updated_at)) > 0) {
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
  next()
}