const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const download = require('image-downloader');
const path = require('path');

const router = express.Router();

router.get('/', async (req, res) => {
  // Parsing the URL in order for it to be used by cheerio
  // Converts the URL into a camelcamelcamel.com link
  let url = req.query.url;
  url = url.split('/');

  const name = url[3];
  const id = url[5].split('?')[0];

  // Final URL
  url = `https://camelcamelcamel.com/${name}/product/${id}`;

  console.log(`URL: ${url}\n`);
  console.log(`Item name: ${name}`);
  console.log(`Item ID: ${id}\n`);
  console.log(`Final URL: ${url}`);

  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      
      const itemName = $('.show-for-medium h2 a');
      const itemPrice = $('.stat > .green');
      const itemPriceChartUrl = `https://charts.camelcamelcamel.com/us/${id}/amazon.png?force=1&zero=0&w=854&h=512&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en`;

      console.log(itemName.html());
      console.log(itemPrice.html());
      console.log(itemPriceChartUrl);

      (() => {
        const options = {
          url: itemPriceChartUrl,
          dest: path.join(__dirname, '..', 'public', 'images', 'chart.png'),
        }
        download.image(options).then(({filename, image}) => {
          console.log(`Downloaded price chart to ${filename}`);
          res.sendFile(path.join(__dirname, '..', 'public', 'result.html'));
        }).catch(err => console.log(err));
      })();
    }
  });
});

module.exports = router;