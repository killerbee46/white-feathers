import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Fetch gold & silver price per tola from arthakendra.com
 */
export async function fetchTodaysGoldSilverRates() {
  const url = "https://arthakendra.com/gold-silver-price-in-nepal";

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US,en;q=0.9"
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    let goldHallmark = null;
    let goldTejabi = null;
    let silver = null;

    // Find price block containing numeric values in the first section
    $("body")
      .find("h2, p, div, span, td, li")
      .each((_, el) => {
        const text = $(el).text().trim();

        // Hallmark gold per tola
        if (text.match(/1 TOLA\s+Rs\s*[0-9,]+/i) &&
            text.toLowerCase().includes("hallmark")) {
          const match = text.match(/Rs\s*([0-9,]+)/i);
          if (match) {
            goldHallmark = parseFloat(match[1].replace(/,/g, ""));
          }
        }

        // Tejabi gold per tola
        if (text.match(/1 TOLA\s+Rs\s*[0-9,]+/i) &&
            text.toLowerCase().includes("tejabi")) {
          const match = text.match(/Rs\s*([0-9,]+)/i);
          if (match) {
            goldTejabi = parseFloat(match[1].replace(/,/g, ""));
          }
        }

        // Silver per tola
        if (text.match(/1 TOLA\s+Rs\s*[0-9,]+/i) &&
            text.toLowerCase().includes("silver")) {
          const match = text.match(/Rs\s*([0-9,]+)/i);
          if (match) {
            silver = parseFloat(match[1].replace(/,/g, ""));
          }
        }
      });

    if (goldHallmark === null && goldTejabi === null && silver === null) {
      return { error: "Failed to find gold or silver rates on ArthaKendra" };
    }

    return {
      dateFetched: new Date().toISOString(),
      source: url,
      rates: {
        goldHallmark,
        goldTejabi,
        silver
      }
    };

  } catch (err) {
    return {
      error: "Failed to fetch or parse ArthaKendra page",
      details: err.message
    };
  }
}

export default fetchTodaysGoldSilverRates;