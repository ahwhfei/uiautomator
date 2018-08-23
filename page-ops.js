class PageOps {
    constructor(page) {
        this.page = page;
    }

    async clickSelector (selector, options, delay, hasNavigation) {
        let waitForNavigationPromise;
    
        try {
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
        } catch(err) {
            console.error(`Click Selector: "${selector}" Exception!`);
            console.error(err);
            throw new Error('Exist Exception! STOPPED!!!');
        }
    }
    
    async clickXPath (xpath, options, delay, hasNavigation) {
        let waitForNavigationPromise;
    
        try {
            if (typeof options === 'object') {
                await this.page.waitForXPath(xpath, options);
            } else {
                await this.page.waitForXPath(selector);
            }
    
            if (delay && typeof delay === 'number') {
                await this.page.waitFor(delay);
            }
    
            if (hasNavigation) {
                waitForNavigationPromise = this.page.waitForNavigation();
            }
    
            const element = await this.page.$x(xpath);
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
    }
    
    async clickEvaluate (selector, delay, hidden, hasNavigation) {
        let waitForNavigationPromise;
        let hasElement = false;
    
        try {
            if (delay && typeof delay === 'number') {
                await this.page.waitFor(delay);
            }
    
            // hasElement = await this.page.evaluate((s) => !!document.querySelector(s), selector);
            // if (!hasElement) {
            //     return hasElement;
            // }
    
            try {
                await this.page.waitForSelector(selector, {visible: true, timeout: 1000})
                hasElement = true;
            } catch(err) {
                return false;
            }
    
            if (hasNavigation) {
                waitForNavigationPromise = this.page.waitForNavigation();
            }
    
            await this.page.click(selector);
    
            if (hidden) {
                await this.page.waitForSelector(selector, {hidden: true});
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
    }
    
    async typeSelector (selector, data, options) {
        try {
            if (typeof options === 'object') {
                await this.page.waitFor(selector, options);
            } else {
                await this.page.waitFor(selector);
            }
            await this.page.click(selector);
            await this.page.keyboard.type(data);
        } catch (err) {
            console.error(`ClickEvaluate Selector: "${selector}" Exception!`);
            console.error(err);
            throw new Error('Exist Exception! STOPPED!!!');
        }
    }
}

module.exports = PageOps;
