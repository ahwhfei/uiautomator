const puppeteer = require('puppeteer');
const CREDS = require('./creds');

const run = async () => {
    const width = 1400;
    const height = 800;
    const timeout = 300 * 1000; //second
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--window-size=${width},${height}`
        ]
    });
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setDefaultNavigationTimeout(timeout);
    await page.goto('https://citrix.cloud.com');

    const USERNAME_SELECTOR = '#username';
    const PASSWORD_SELECTOR = '#password';
    const SIGNIN_SELECTOR = '#submit';

    await page.waitFor(USERNAME_SELECTOR, {visible: true, timeout: timeout});
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);
    
    let waitForNavigationPromise = page.waitForNavigation();
    await page.click(SIGNIN_SELECTOR);
    await waitForNavigationPromise;
    
    const SELECT_CUSTOMER_SELECTOR = 'body > div.ng-isolate-scope.cwc-isolate-navbar > div > div > div > div > div > div > ctx-scroll-select > div > div > ctx-scroll-select-item:nth-child(10) > div > span';
    await page.waitFor(SELECT_CUSTOMER_SELECTOR);
    waitForNavigationPromise = page.waitForNavigation();
    await page.click(SELECT_CUSTOMER_SELECTOR);
    await waitForNavigationPromise;    
    
    const MANAGE_SELECTOR = 'body > ctx-app > div > ctx-shell > div > ctx-dashboard > div > ctx-dashboard-services > div > div.ctx-dashboard-services-my-services.ng-star-inserted > ctx-dashboard-services-group > div > div.ctx-dashboard-services-group-content > ctxgrid > div > div:nth-child(12) > ctxgridtile > div > div > ctx-dashboard-services-tile > div > div.ctx-dashboard-services-tile-inner > div.ctx-dashboard-services-tile-inner-button.ng-star-inserted > ctx-spinner-2 > div > div';
    await page.waitFor(MANAGE_SELECTOR, {visible: true, timeout: timeout});
    waitForNavigationPromise = page.waitForNavigation();
    await page.click(MANAGE_SELECTOR);
    await waitForNavigationPromise;

    const XA_MANAGE_SELECTOR = 'body > app > navbar > div > div > ul.xd-navbar-left.xd-navbar-color-light > li:nth-child(2) > a.ng-tns-c1-0.has-dropdown';
    await page.waitFor(XA_MANAGE_SELECTOR, {visible: true, timeout: timeout});
    await page.click(XA_MANAGE_SELECTOR);

    await page.waitFor(20000);

    const CONTINUE_TO_FULL_CONFIGURATION = 'body > modal-container > div > div > ng-component > div.modal-footer.pull-left > button.ctx-button.ml-0';
    const hasPendoDialog = await page.evaluate((selector) => !!document.querySelector(selector), CONTINUE_TO_FULL_CONFIGURATION);
    if (hasPendoDialog) {
        await page.click(CONTINUE_TO_FULL_CONFIGURATION);
    }

    await page.waitForSelector(CONTINUE_TO_FULL_CONFIGURATION, {hidden: true});
    await page.waitFor(5000);

    const MENU_SELECTOR = '#username-admin-display-name > div.username-row.admin-name.ng-binding';
    await page.waitFor(MENU_SELECTOR, {visible: true, timeout: timeout});
    await page.click(MENU_SELECTOR);

    // const LOGOFF_SELECTOR = 'body > cwc-navbar > div > div > div.pull-right > div.username-container.vmid.XenApp.and.XenDesktop.Service > div > div > div > div.cwc-dropdown-menu.username-menu.XenApp.and.XenDesktop.Service > div:nth-child(4) > a > span';
    const LOGOFF_SELECTOR = '//body/cwc-navbar/div/div/div[4]/div[2]/div/div/div/div[2]/div[4]/a/span[.="Sign Out"]';
    await page.waitFor(LOGOFF_SELECTOR, {visible: true, timeout: timeout});

    await page.waitFor(1000);
    const logOffElement = await page.$x(LOGOFF_SELECTOR);
    if (logOffElement.length === 1) {
        await logOffElement[0].click();
    } else {
        throw new Error('element not found');
    }

    await page.waitFor(10000);
    await browser.close();
};


const COUNT = 2;
for (let i = 0; i < COUNT; i++) {
    run();
}