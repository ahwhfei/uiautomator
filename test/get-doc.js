const puppeteer = require('puppeteer');

(async () => {
    const width = 1400;
    const height = 800;
    const timeout = 300; //second
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--window-size=${width},${height}`
        ]
    });
    const page = await browser.newPage();
    await page.setViewport({width, height});
    console.log(new Date());
    await page.goto('https://citrix.cloud.com', {
        timeout: timeout * 1000
    });
    console.log(new Date());

    // Get the "viewport" of the page, as reported by the page.
    const doc1 = await page.evaluate(() => document.documentElement.outerHTML);
    console.log(new Date());

    console.log('Document:', doc1);

    const doc2 = await page.evaluate(() => document.documentElement.outerHTML);
    console.log(new Date());

    //   await browser.close();
})();