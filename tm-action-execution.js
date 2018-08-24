const puppeteer = require('puppeteer');
const config = require('./config.json');
const ActionType = require('./action-type');
const PageOps = require('./page-ops');
const logger = require('./logger');

const timeout = config.timeout * 1000;

let instanceCount = 0;
process.setMaxListeners(0);

class TMActionExecution {
    constructor(siteUrl, actions, creds, headless) {
        this.siteUrl = siteUrl;
        this.actionList = actions;
        this.headless = !!headless;
        this.instanceID = instanceCount++;
        if (Array.isArray(creds)) {
            this.supportRandomCreds = true;
            this.cred = creds[this.instanceID % creds.length];
        }
    }

    async run () {
        const width = config.windowWidth;
        const height = config.windowHeight;
        const browser = await puppeteer.launch({
            headless: this.headless,
            args: [
                `--window-size=${width},${height}`
            ]
        });
        const page = await browser.newPage();
        
        await page.setViewport({ width, height });
        await page.setDefaultNavigationTimeout(timeout);
        await page.goto(this.siteUrl || config.siteUrl);

        const pageOps = new PageOps(page);
        
        for (const action of this.actionList) {
            logger.log(this.instanceID, `InstanceID-${this.instanceID} Start: ${action.description}`);
            await this._execute(pageOps, action);
        }
    
        await page.waitFor(5000);
        await browser.close();
        logger.log(this.instanceID, `=====InstanceID-${this.instanceID} Done!!!=====`);
    }

    async _wait (ms) {
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }

    async _execute (pageOps, action) {
        try {
            if (action.textbox) {
                if (this.supportRandomCreds && action.cred) {
                    await pageOps.typeXPath('/' + action.data, this.cred[action.cred], undefined, action.interval * 1000);
                } else {
                    await pageOps.typeXPath('/' + action.data, action.value, undefined, action.interval * 1000);
                }
    
            } else {
                await pageOps.clickXPath('/' + action.data, undefined, 0, action.navigation, action.interval * 1000);
            }
        } catch (err) {
            if (!action.ignore) {
                logger.error(this.instanceID, `InstanceID-${this.instanceID} Action Exeception: ${action.description}`);
                logger.error(this.instanceID, err);
                throw null;
            } else {
                logger.log(this.instanceID, `InstanceID-${this.instanceID} Ignore Action Exeception: ${action.description}`);
            }
        }

        logger.log(this.instanceID, `InstanceID-${this.instanceID} End: ${action.description}`);
    }
}

module.exports = TMActionExecution;
