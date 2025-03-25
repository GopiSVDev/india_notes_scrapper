import puppeteer from 'puppeteer';
import fs from 'fs';

const scrape = async (urls) => {
  const browser = await puppeteer.launch({ headless: true });

  // Initialize a variable to collect all scraped data
  let allData = [];

  for (let url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const textContent = [];

      // Scrape content from <h1> tags
      const headings = document.querySelectorAll('h1');
      headings.forEach((heading) => {
        if (heading.textContent.trim()) {
          textContent.push(`Heading: ${heading.textContent.trim()}`);
        }
      });

      // Scrape content from <article> tag
      const article = document.querySelector('article');
      const elements = article ? article.querySelectorAll('span, li') : []; // Get span and li tags inside the article tag

      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (
          el.textContent.trim() &&
          style.display !== 'none' &&
          style.visibility !== 'hidden'
        ) {
          textContent.push(el.textContent.trim());
        }
      });

      // Scrape links with text "VIEW"
      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        if (link.textContent.includes('VIEW')) {
          textContent.push(`Link: ${link.href}`);
        }
      });

      return textContent;
    });

    // Remove duplicates from the scraped data
    const uniqueData = [...new Set(data)];

    // Collect the scraped content into the allData array
    allData = [...allData, ...uniqueData];
    console.log(`Scraped data from ${url}`);
  }

  // Prepare the data as a plain text string, with each text on a new line
  const textToWrite = allData.join('\n'); // Join all the unique text items with a newline

  // Save the data to a .txt file
  fs.writeFileSync('all_links.txt', textToWrite, 'utf-8');
  console.log('Data saved to all_links.txt');

  await browser.close();
};

// List of URLs to scrape
const urls = [
  'https://indiafreenotes.com/digital-marketing-bangalore-university-b-com-5th-semester-nep-notes/',
];

// Call the scrape function with the array of URLs
scrape(urls);
