import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

async function scrapeLinks(mainUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(mainUrl, { waitUntil: "networkidle2" });

  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("article a"));
    const urls = anchors
      .map((a) => a.href)
      .filter(
        (href) =>
          href.includes("/financial-accounting") &&
          href.startsWith("https://indiafreenotes.com")
      );
    return [...new Set(urls)];
  });

  await browser.close();
  return links;
}

async function scrapeNotes(urls) {
  const browser = await puppeteer.launch({ headless: true });
  let allData = [];

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
      const textContent = [];

      const headings = document.querySelectorAll("h1");
      headings.forEach((heading) => {
        if (heading.textContent.trim()) {
          textContent.push(`Heading: ${heading.textContent.trim()}`);
        }
      });

      const article = document.querySelector("article");
      const elements = article ? article.querySelectorAll("span, li") : [];
      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (
          el.textContent.trim() &&
          style.display !== "none" &&
          style.visibility !== "hidden"
        ) {
          textContent.push(el.textContent.trim());
        }
      });

      const links = document.querySelectorAll("a");
      links.forEach((link) => {
        if (link.textContent.includes("VIEW")) {
          textContent.push(`Link: ${link.href}`);
        }
      });

      return textContent;
    });

    const uniqueData = [...new Set(data)];
    allData = [...allData, ...uniqueData];
    await page.close();
  }

  await browser.close();
  return allData;
}

app.post("/api/scrape-links", async (req, res) => {
  const { mainUrl } = req.body;
  if (!mainUrl) return res.status(400).json({ error: "mainUrl is required" });

  try {
    const links = await scrapeLinks(mainUrl);
    res.json({ links });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/scrape-notes", async (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls) || urls.length === 0)
    return res.status(400).json({ error: "urls array is required" });

  try {
    const notes = await scrapeNotes(urls);
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
