const puppeteer = require('puppeteer');
const config = require('./config.json');
const ActionType = require('./action-type');

const timeout = config.timeout * 1000;
let page;

const clickSelector = async (selector, options, delay, hasNavigation) => {
    let waitForNavigationPromise;

    try {
        if (typeof options === 'object') {
            await page.waitFor(selector, options);
        } else {
            await page.waitFor(selector);
        }

        if (delay && typeof delay === 'number') {
            await page.waitFor(delay);
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

const clickXPath = async (xpath, options, delay, hasNavigation) => {
    let waitForNavigationPromise;

    try {
        if (typeof options === 'object') {
            await page.waitForXPath(xpath, options);
        } else {
            await page.waitForXPath(selector);
        }

        if (delay && typeof delay === 'number') {
            await page.waitFor(delay);
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

const clickEvaluate = async (selector, delay, hidden, hasNavigation) => {
    let waitForNavigationPromise;
    let hasElement = false;

    try {
        if (delay && typeof delay === 'number') {
            await page.waitFor(delay);
        }

        // hasElement = await page.evaluate((s) => !!document.querySelector(s), selector);
        // if (!hasElement) {
        //     return hasElement;
        // }

        try {
            await page.waitForSelector(selector, {visible: true, timeout: 1000})
            hasElement = true;
        } catch(err) {
            return false;
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

const typeSelector = async (selector, data, options) => {
    try {
        if (typeof options === 'object') {
            await page.waitFor(selector, options);
        } else {
            await page.waitFor(selector);
        }
        await page.click(selector);
        await page.keyboard.type(data);
    } catch (err) {
        console.error(`ClickEvaluate Selector: "${selector}" Exception!`);
        console.error(err);
        throw new Error('Exist Exception! STOPPED!!!');
    }
};

const execute = async (action) => {
    let options = {timeout};
    action.visible && (options.visible = action.visible);
    let hasElement = false;
    
    switch(action.type) {
        case ActionType.click:
            await clickSelector(action.selector, options, action.delay, action.navigation);
            hasElement = true;
            break;
        case ActionType.type:
            await typeSelector(action.selector, action.data, options);
            hasElement = true;
            break;
        case ActionType.evaluate:
            hasElement = await clickEvaluate(action.selector, action.delay, action.hidden, action.navigation);
            break;
    }

    return hasElement;
}

const run = async (actionList) => {
    const width = config.windowWidth;
    const height = config.windowHeight;
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--window-size=${width},${height}`
        ]
    });
    page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setDefaultNavigationTimeout(timeout);
    await page.goto(config.siteUrl);

    let canExecuteNextAction = undefined;
    for (const action of actionList) {
        if ((action.checkLatestActionResult && canExecuteNextAction)
            || !action.checkLatestActionResult) {
            canExecuteNextAction = await execute(action);
        }
    }

    await page.waitFor(5000);
    await browser.close();
};

module.exports = run;
