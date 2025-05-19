# IndiaFreeNotes Scraper

A Node.js scraper app to extract text notes from [indiafreenotes.com](https://indiafreenotes.com), a website where copying is disabled.

---

## Overview

This app consists of two parts:

1. **links.js**  
   Given a main URL (e.g. a subject or course page), it scrapes and collects all the topic links and saves them in `all_links.txt`.

2. **app.js**  
   Takes the list of topic links from `all_links.txt`, scrapes the notes from each page, and stores all the collected notes in `all_notes.txt`.

---

## Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn for dependency management

---

## Setup

1. Clone the repository or download the project files.
2. Install dependencies:

```bash
   npm install
```

## Usage

### Step 1: Get all topic links

1. Open `links.js`.
2. Set the main URL for the course or subject you want to scrape.  
   Example:
   ```js
   const mainUrl =
     "https://indiafreenotes.com/financial-accounting-bangalore-north-university-b-com-sep-2024-25-1st-semester-notes/";
   ```
3. Run the script to extract all topic links:
   ```bash
   node links.js
   ```
4. This will create/update the file `all_links.txt` with the list of all topic URLs.

---

### Step 2: Scrape notes from links

1. Open `app.js`.
2. Copy the URLs from `all_links.txt` and paste them into the array inside `app.js` (replace the existing array).
3. Run the script to scrape notes:
   ```bash
   node app.js
   ```
4. The scraped notes from all links will be saved in `all_notes.txt`.

---

## Notes

- This scraper is intended for personal use to access notes from the website where copying is disabled.
- Be mindful of the website’s terms of service and legal restrictions.
- The scraping speed and success depend on the website’s structure and connectivity.

---

## Troubleshooting

- If the site structure changes, you may need to update selectors in the scripts.
- Check that the URLs are valid and accessible.
- If scraping fails or returns empty files, verify internet connection and dependencies.

---
