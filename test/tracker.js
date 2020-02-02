const request = require('request');
const cheerio = require('cheerio');
const download = require('image-downloader');
const path = require('path');

// Parsing the URL in order for it to be used by cheerio
// Converts the URL into a camelcamelcamel.com link
let url = 'https://www.amazon.com/Acer-SB220Q-Ultra-Thin-Frame-Monitor/dp/B07CVL2D2S?pf_rd_p=538b030e-3f40-5f94-a1a5-376bc59a2030&pf_rd_r=NXTDHXE5Q8E20RNXNJ0E&pd_rd_wg=hEiSA&ref_=pd_gw_ri&pd_rd_w=rCNNI&pd_rd_r=462cf11c-3549-4742-94a3-141ea2d840a9';
url = url.split('/');

const name = url[3];
const id = url[5].split('?')[0];

// Final URL
url = `https://camelcamelcamel.com/${name}/product/${id}`;

console.log(`URL: ${url}\n`);
console.log(`Item name: ${name}`);
console.log(`Item ID: ${id}\n`);
console.log(`Final URL: ${url}`);

request(url, (err, res, html) => {
  if (!err && res.statusCode == 200) {
    const $ = cheerio.load(html);
    
    const itemName = $('.show-for-medium h2 a');
    const itemPrice = $('.stat > .green');
    const itemPriceChartUrl = `https://charts.camelcamelcamel.com/us/${id}/amazon.png`;

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
      }).catch(err => console.log(err));
    })();
  }
});