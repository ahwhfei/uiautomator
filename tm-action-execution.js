const puppeteer = require('puppeteer');
const config = require('./config.json');
const ActionType = require('./action-type');
const PageOps = require('./page-ops');

const timeout = config.timeout * 1000;

let instanceCount = 0;

class TMActionExecution {
    constructor(actions) {
        this.actionList = actions;
        this.instanceID = instanceCount++;
    }

    async run () {
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
        
        for (const action of this.actionList) {
            console.log(`InstanceID-${this.instanceID} Start: ${action.description}`);
            await this._execute(pageOps, action);
        }
    
        await page.waitFor(5000);
        await browser.close();
    }

    async _execute (pageOps, action) {
        if (action.textbox) {
            await pageOps.typeXPath('/' + action.data, action.value, undefined, action.interval * 1000);
        } else {
            await pageOps.clickXPath('/' + action.data, undefined, action.interval * 1000, action.navigation);
        }

        console.log(`InstanceID-${this.instanceID} End: ${action.description}`);
    }
}

module.exports = TMActionExecution;
