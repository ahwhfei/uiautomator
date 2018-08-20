const puppeteer = require('puppeteer');
const CREDS = require('./creds');

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
    await page.setViewport({ width, height });
    await page.goto('https://citrix.cloud.com', {
        timeout: timeout * 1000
    });

    const USERNAME_SELECTOR = '#username';
    const PASSWORD_SELECTOR = '#password';
    const SIGNIN_SELECTOR = '#submit';

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);

    await page.click(SIGNIN_SELECTOR);

    await page.waitForNavigation();

    const SELECT_CUSTOMER_SELECTOR = 'body > div.ng-isolate-scope.cwc-isolate-navbar > div > div > div > div > div > div > ctx-scroll-select > div > div > ctx-scroll-select-item:nth-child(10) > div > span';
    await page.click(SELECT_CUSTOMER_SELECTOR);
    await page.waitForNavigation();
    //   await browser.close();
})();