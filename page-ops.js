const { TimeoutError } = require('puppeteer/Errors');
const findUniqueElement = require('./find-unique-element');

class PageOps {
    constructor(page) {
        this.page = page;
    }

    async clickSelector(selector, options, delay, hasNavigation) {
        let waitForNavigationPromise;

        if (typeof options === 'object') {
            await this.page.waitFor(selector, options);
        } else {
            await this.page.waitFor(selector);
        }

        if (delay && typeof delay === 'number') {
            await this.page.waitFor(delay);
        }

        if (hasNavigation) {
            waitForNavigationPromise = this.page.waitForNavigation();
        }

        await this.page.click(selector);

        if (hasNavigation) {
            await waitForNavigationPromise;
        }
    }

    async clickXPath(xpath, options, delay, hasNavigation, timeout) {
        let waitForNavigationPromise;
        let waitOptions;

        if (timeout && typeof timeout === 'number') {
            waitOptions = {timeout};
        }

        if (typeof waitOptions === 'object') {
            Object.assign(waitOptions, options);
        } else {
            waitOptions = options;
        }

        try {
            if (typeof waitOptions === 'object') {
                await this.page.waitForXPath(xpath, waitOptions);
            } else {
                await this.page.waitForXPath(xpath);
            }
        } catch(err) {
            if (err instanceof TimeoutError) {
                const result = await findUniqueElement(xpath, this.page);

                if (!result) {
                    throw new Error(`Do not find xpath ${xpath}`)
                }

                const element = result.element;

                if (hasNavigation) {
                    waitForNavigationPromise = this.page.waitForNavigation();
                }
        
                await this._clickVisibleElement(element, result.xpath);
        
                if (hasNavigation) {
                    await waitForNavigationPromise;
                }

                return;
            } else {
                throw err;
            }
        }

        if (delay && typeof delay === 'number') {
            await this.page.waitFor(delay);
        }

        if (hasNavigation) {
            waitForNavigationPromise = this.page.waitForNavigation();
        }

        this._clickByXPath(xpath);

        if (hasNavigation) {
            await waitForNavigationPromise;
        }
    }

    async clickEvaluate(selector, delay, hidden, hasNavigation) {
        let waitForNavigationPromise;
        let hasElement = false;

        if (delay && typeof delay === 'number') {
            await this.page.waitFor(delay);
        }

        // hasElement = await this.page.evaluate((s) => !!document.querySelector(s), selector);
        // if (!hasElement) {
        //     return hasElement;
        // }

        try {
            await this.page.waitForSelector(selector, { visible: true, timeout: 1000 })
            hasElement = true;
        } catch (err) {
            return false;
        }

        if (hasNavigation) {
            waitForNavigationPromise = this.page.waitForNavigation();
        }

        let waitForSelectorHiddenPromise;
        if (hidden) {
            waitForSelectorHiddenPromise = this.page.waitForSelector(selector, { hidden: true, timeout: 180000 });
        }
        await this.page.click(selector);
        if (hidden) {
            await waitForSelectorHiddenPromise;
        }

        if (hasNavigation) {
            await waitForNavigationPromise;
        }

        return hasElement;
    }

    async typeSelector(selector, data, options, delay) {

        if (typeof options === 'object') {
            await this.page.waitFor(selector, options);
        } else {
            await this.page.waitFor(selector);
        }

        if (delay && typeof delay === 'number') {
            await this.page.waitFor(delay);
        }

        await this.page.click(selector);
        await this.page.keyboard.type(data);
    }

    async typeXPath(xpath, data, options, delay) {
        if (delay && typeof delay === 'number') {
            await this.page.waitFor(delay);
        }

        if (typeof options === 'object') {
            await this.page.waitForXPath(xpath, options);
        } else {
            await this.page.waitForXPath(xpath);
        }
        await this._clickByXPath(xpath);
        await this.page.keyboard.type(data);
    }

    // Private methods
    async _clickByXPath(xpath) {
        const element = await this.page.$x(xpath);
        if (element && element.length === 1) {
            await this._clickVisibleElement(element[0], xpath);
        } else if (element && element.length > 1){
            throw new Error(`element is not unique ${xpath}`);
        } else {
            throw new Error(`element not found ${xpath}`);
        }
    }

    async _clickVisibleElement(element, xpath) {
        try {
            await this.page.waitForXPath(xpath, {visible: true, timeout: 90000});
            await element.click();
        } catch(err) {
            // Ignore when not visible
            if (err.message !== 'Node is either not visible or not an HTMLElement') {
                throw err;
            } else {
                console.error('Never running here');
            }
        }
    }
}

module.exports = PageOps;
