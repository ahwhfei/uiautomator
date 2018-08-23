const puppeteer = require('puppeteer');
const config = require('./config.json');
const ActionType = require('./action-type');
const PageOps = require('./page-ops');

const timeout = config.timeout * 1000;

class ActionExecution {

    async run (actionList) {
        const width = config.windowWidth;
        const height = config.windowHeight;
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                `--window-size=${width},${height}`
            ]
        });
        const page = await browser.newPage();
        
        await page.setViewport({ width, height });
        await page.setDefaultNavigationTimeout(timeout);
        await page.goto(config.siteUrl);

        const pageOps = new PageOps(page);
        
        let canExecuteNextAction = undefined;
        for (const action of actionList) {
            if ((action.checkLatestActionResult && canExecuteNextAction)
                || !action.checkLatestActionResult) {
                canExecuteNextAction = await this._execute(pageOps, action);
            }
        }
    
        await page.waitFor(5000);
        await browser.close();
    }

    async _execute (pageOps, action) {
        let options = {timeout};
        action.visible && (options.visible = action.visible);
        let hasElement = false;
        
        switch(action.type) {
            case ActionType.click:
                await pageOps.clickSelector(action.selector, options, action.delay, action.navigation);
                hasElement = true;
                break;
            case ActionType.type:
                await pageOps.typeSelector(action.selector, action.data, options);
                hasElement = true;
                break;
            case ActionType.evaluate:
                hasElement = await pageOps.clickEvaluate(action.selector, action.delay, action.hidden, action.navigation);
                break;
        }
    
        return hasElement;
    }
}

module.exports = ActionExecution;
