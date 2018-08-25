const { TimeoutError } = require('puppeteer/Errors');
const findUniqueElement = require('./find-unique-element');

class PageOps {
    constructor(page) {
        this.page = page;
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
                    throw new Error(`Do not find unique element ${xpath}`)
                }

                await this._clickWithDelayNavigation(result.xpath, delay, hasNavigation, this._clickByElement.bind(this), result.element);

                // Return directly
                return;

            } else {
                throw err;
            }
        }

        await this._clickWithDelayNavigation(xpath, delay, hasNavigation, this._clickByXPath.bind(this));
    }

    async typeXPath(xpath, data, options, delay, timeout) {
        await this.clickXPath(xpath, options, delay, false, timeout);
        await this.page.keyboard.type(data);
    }

    // Private methods
    async _clickWithDelayNavigation(xpath, delay, hasNavigation, clickFunc, element) {
        let waitForNavigationPromise;

        if (delay && typeof delay === 'number') {
            await this.page.waitFor(delay);
        }

        if (hasNavigation) {
            waitForNavigationPromise = this.page.waitForNavigation();
        }

        if (typeof clickFunc === 'function') {
            await clickFunc(xpath, element);
        } else {
            throw new Error('The 4th parameter type is not function');
        }

        if (hasNavigation) {
            await waitForNavigationPromise;
        }
    }

    async _clickByXPath(xpath) {
        const elements = await this.page.$x(xpath);
        if (elements && elements.length === 1) {
            await this._clickByElement(xpath, elements[0]);
        } else if (elements && elements.length > 1){
            throw new Error(`element is not unique ${xpath}`);
        } else {
            throw new Error(`element not found ${xpath}`);
        }
    }

    async _clickByElement(xpath, element) {
        try {
            // TODO: the timeout is not good for hidden-able element
            await this.page.waitForXPath(xpath, {visible: true, timeout: 59000});
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
