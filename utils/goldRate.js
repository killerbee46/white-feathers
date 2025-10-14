import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Fetch today's gold & silver rates per tola from FENEGOSIDA
 */
export async function fetchTodaysGoldSilverRates() {
  const url = "https://www.fenegosida.org/rate-history.php";

  try {
    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    const text = $.text();

    // Match fine gold per 1 tola
    const fineGoldMatch = text.match(/FINE GOLD.*?per 1\s*tola.*?([0-9,]+)/i);
    const silverMatch = text.match(/SILVER.*?per 1\s*tola.*?([0-9,]+)/i);

    if (!fineGoldMatch || !silverMatch) {
      return { error: "Failed to find gold/silver rates on the page" };
    }

    return {
      date_fetched: new Date().toISOString(),
      source: url,
      rates: {
        gold: parseFloat(fineGoldMatch[1].replace(/,/g, "")),
        silver: parseFloat(silverMatch[1].replace(/,/g, "")),
      },
    };
  } catch (err) {
    console.error("Error fetching rates:", err.message);
    return { error: "Failed to fetch data" };
  }
}
export default fetchTodaysGoldSilverRates