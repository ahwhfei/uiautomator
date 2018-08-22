const puppeteer = require('puppeteer');
const CREDS = require('./creds');

let page;

const clickSelector = async (selector, options, extraTimeout, hasNavigation) => {
    let waitForNavigationPromise;

    try {
        if (typeof options === 'object') {
            await page.waitFor(selector, options);
        } else {
            await page.waitFor(selector);
        }

        if (extraTimeout && typeof extraTimeout === 'number') {
            await page.waitFor(extraTimeout);
        }

        if (hasNavigation) {
            waitForNavigationPromise = page.waitForNavigation();
        }

        await page.click(selector);

        if (hasNavigation) {
            await waitForNavigationPromise;
        }
    } catch(err) {
        console.error(`Click Selector: "${selector}" Exception!`);
        console.error(err);
        throw new Error('Exist Exception! STOPPED!!!');
    }
};

const clickXPath = async (xpath, options, extraTimeout, hasNavigation) => {
    let waitForNavigationPromise;

    try {
        if (typeof options === 'object') {
            await page.waitForXPath(xpath, options);
        } else {
            await page.waitForXPath(selector);
        }

        if (extraTimeout && typeof extraTimeout === 'number') {
            await page.waitFor(extraTimeout);
        }

        if (hasNavigation) {
            waitForNavigationPromise = page.waitForNavigation();
        }

        const element = await page.$x(xpath);
        if (element && element.length === 1) {
            await element[0].click();
        } else {
            throw new Error('element not found');
        }

        if (hasNavigation) {
            await waitForNavigationPromise;
        }
    } catch(err) {
        console.error(`Click XPath: "${selector}" Exception!`);
        console.error(err);
        throw new Error('Exist Exception! STOPPED!!!');
    }
};

const clickEvaluate = async (selector, extraTimeout, hidden, hasNavigation) => {
    let waitForNavigationPromise;

    try {
        if (extraTimeout && typeof extraTimeout === 'number') {
            await page.waitFor(extraTimeout);
        }

        const hasElement = await page.evaluate((s) => !!document.querySelector(s), selector);
        if (!hasElement) {
            return hasElement;
        }

        if (hasNavigation) {
            waitForNavigationPromise = page.waitForNavigation();
        }

        await page.click(selector);

        if (hidden) {
            await page.waitForSelector(selector, {hidden: true});
        }

        if (hasNavigation) {
            await waitForNavigationPromise;
        }

        return hasElement;
    } catch(err) {
        console.error(`ClickEvaluate Selector: "${selector}" Exception!`);
        console.error(err);
        throw new Error('Exist Exception! STOPPED!!!');
    }
};

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
    page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setDefaultNavigationTimeout(timeout);
    await page.goto('https://citrix.cloud.com');

    const USERNAME_SELECTOR = '#username';
    const PASSWORD_SELECTOR = '#password';
    
    await page.waitFor(USERNAME_SELECTOR, {visible: true, timeout: timeout});
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);
    
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);
    
    const SIGNIN_SELECTOR = '#submit';
    await clickSelector(SIGNIN_SELECTOR, {visible: true, timeout: timeout}, 0, true);

    const MULTIPLE_CUSTOMERS_SELECTOR = 'body > div.ng-isolate-scope.cwc-isolate-navbar > div > div > div > div > div > div > div > div';
    const hasMultipleCustomers = await clickEvaluate(MULTIPLE_CUSTOMERS_SELECTOR, 1000);
    
    if (hasMultipleCustomers) {
        const SELECT_CUSTOMER_SELECTOR = 'body > div.ng-isolate-scope.cwc-isolate-navbar > div > div > div > div > div > div > ctx-scroll-select > div > div > ctx-scroll-select-item:nth-child(10) > div > span';
        await clickSelector(SELECT_CUSTOMER_SELECTOR, undefined, 0, true);
    }

    const PENDO_WELCOME_DIALOG_SELECTOR = '#_pendo-close-guide_';
    await clickEvaluate(PENDO_WELCOME_DIALOG_SELECTOR, 2000, true);
    
    const MANAGE_SELECTOR = 'body > ctx-app > div > ctx-shell > div > ctx-dashboard > div > ctx-dashboard-services > div > div.ctx-dashboard-services-my-services.ng-star-inserted > ctx-dashboard-services-group > div > div.ctx-dashboard-services-group-content > ctxgrid > div > div:nth-child(12) > ctxgridtile > div > div > ctx-dashboard-services-tile > div > div.ctx-dashboard-services-tile-inner > div.ctx-dashboard-services-tile-inner-button.ng-star-inserted > ctx-spinner-2 > div > div';
    await clickSelector(MANAGE_SELECTOR, {visible: true, timeout: timeout}, 1000, true);

    const XA_MANAGE_SELECTOR = 'body > app > navbar > div > div > ul.xd-navbar-left.xd-navbar-color-light > li:nth-child(2) > a.ng-tns-c1-0.has-dropdown';
    await clickSelector(XA_MANAGE_SELECTOR, {visible: true, timeout: timeout});

    // TODO: Wait 20s for HTML5 receiver session setup
    const CONTINUE_TO_FULL_CONFIGURATION = 'body > modal-container > div > div > ng-component > div.modal-footer.pull-left > button.ctx-button.ml-0';
    await clickEvaluate(CONTINUE_TO_FULL_CONFIGURATION, 20000, true);

    const MENU_SELECTOR = '#username-admin-display-name > div.username-row.admin-name.ng-binding';
    await clickSelector(MENU_SELECTOR, {visible: true, timeout: timeout}, 3000);

    const LOGOFF_SELECTOR = 'body > cwc-navbar > div > div > div.pull-right > div.username-container.vmid.XenApp.and.XenDesktop.Service > div > div > div > div.cwc-dropdown-menu.username-menu.XenApp.and.XenDesktop.Service > div:nth-child(4) > a > span';
    await clickSelector(LOGOFF_SELECTOR, {visible: true, timeout}, 1000, true);

    // const LOGOFF_SELECTOR = '//body/cwc-navbar/div/div/div[4]/div[2]/div/div/div/div[2]/div[4]/a/span[.="Sign Out"]';
    // await clickXPath(LOGOFF_SELECTOR, {visible: true, timeout}, 1000, true);

    await page.waitFor(5000);
    await browser.close();
};


const COUNT = 1;
for (let i = 0; i < COUNT; i++) {
    run();
}