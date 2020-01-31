const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');

const router = express.Router();

const scrapePriceChart = async (url) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  
  await page.goto('https://camelcamelcamel.com');
  await page.type('.input-group-field', url);
  await page.keyboard.press('Enter');
  
  await page.waitForXPath('//*[@id="summary_chart"]');
  
  const [el] = await page.$x('//*[@id="summary_chart"]');
  const src = await el.getProperty('src');
  const srcTxt = await src.jsonValue();

  console.log(srcTxt);

  const viewSource = await page.goto(srcTxt);
  fs.writeFile('public/images/chart.png', await viewSource.buffer(), err => {if (err) throw err});

  browser.close();

  console.log('Chart was saved!');
}

router.get('/', (req, res) => {
  (async () => {
    const url = req.query.url;
    console.log(url);

    await scrapePriceChart(url).catch(err => {
      if (err) {
        console.log(err.message);
        res.sendFile(path.join(__dirname, '..', 'public', 'error.html'));
      }
    });

    res.sendFile(path.join(__dirname, '..', 'public', 'result.html'));
  })().catch(err => console.log(err.message));
});

module.exports = router;