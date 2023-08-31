
# Iliad Web Scraper

This script perform web scraping using Puppeteer and expose the scraped data through an HTTP endpoint using Express. It's a simple tool that allows you to retrieve specific data from a website and access it by making HTTP requests.


## Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/TambuDT/scraperiliad.git

```

2. Install the required dependencies:

```bash
npm install

```

## Usage

1. Start the server:

```bash
npm start

```

2. Open your web browser or use tools like cURL or Postman to make GET requests to:

```bash
http://localhost:3000/scrape?username=YOUR-USERNAME&password=YOUR-PASSWORD

```
## Remember

Replace YOUR-USERNAME and YOUR-PASSWORD with appropriate values. This will initiate the web scraping process and return the scraped data as a JSON response.

