const puppeteer = require('puppeteer');
const config = require('./config.json');
const ActionType = require('./action-type');
const PageOps = require('./page-ops');
const logger = require('./logger');
const XPathUtilities = require('./xpath-utilities');

const timeout = config.timeout * 1000;

let instanceCount = 0;
process.setMaxListeners(0);

class ActionExecution {
    constructor(siteUrl, actions, creds, headless) {
        this.siteUrl = siteUrl;
        this.actionList = actions;
        this.headless = !!headless;
        this.instanceID = instanceCount++;
        if (Array.isArray(creds)) {
            this.hasCreds = true;
            this.cred = creds[this.instanceID % creds.length];
        }
    }

    // call run function with await means serial calling
    // without await means inparallel callding
    async run () {
        const width = config.windowWidth;
        const height = config.windowHeight;
        const browser = await puppeteer.launch({
            headless: this.headless,
            timeout: timeout,
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
        let {textbox, delay, interval, ignore, value, data, cred, navigation, description} = action;
        // Default to add 1s delay avoid click failure
        delay = (delay || 1) * 1000;
        interval = interval * 1000;

        if (this.hasCreds && textbox && cred) {
            value = this.cred[cred];
        }

        if (this.hasCreds && !textbox && cred) {
            data = XPathUtilities.changeXPathText(data, this.cred[cred]);
        }

        try {
            if (textbox) {
                await pageOps.typeXPath('/' + data, value, undefined, delay, interval);
            } else {
                await pageOps.clickXPath('/' + data, undefined, delay, navigation, interval);
            }
        } catch (err) {
            if (!ignore) {
                logger.error(this.instanceID, `InstanceID-${this.instanceID} Action Exception: ${description}`);
                logger.error(this.instanceID, err.message);
                throw err;
            } else {
                logger.log(this.instanceID, `InstanceID-${this.instanceID} Ignore Action Exception: ${description}`);
            }
        }

        logger.log(this.instanceID, `InstanceID-${this.instanceID} End: ${description}`);
    }
}

module.exports = ActionExecution;
