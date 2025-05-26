const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const WIKI_URL = "https://stardewvalleywiki.com/Crops";

(async () => {
  try {
    const { data } = await axios.get(WIKI_URL);
    const $ = cheerio.load(data);
    const crops = [];

    $("table.wikitable").each((i, table) => {
      const caption = $(table).find("caption").text().trim();
      if (
        caption.includes("Spring") ||
        caption.includes("Summer") ||
        caption.includes("Fall")
      ) {
        $(table)
          .find("tbody tr")
          .each((j, row) => {
            const tds = $(row).find("td");
            if (tds.length >= 2) {
              const name = $(tds[1]).find("a").first().text().trim();
              const imgSrc = $(tds[0]).find("img").attr("src");

              if (name && imgSrc) {
                crops.push({
                  name,
                  image: `https://stardewvalleywiki.com${imgSrc}`,
                });

                // Optional: Debug log
                // console.log(`✅ Found: ${name} → ${imgSrc}`);
              }
            }
          });
      }
    });

    fs.writeFileSync("src/data/crops.json", JSON.stringify(crops, null, 2));
    console.log(`✅ Scraped and saved ${crops.length} crops to src/data/crops.json`);
  } catch (err) {
    console.error("❌ Error scraping crops:", err.message);
  }
})();
