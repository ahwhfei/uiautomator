class PageOps {
    constructor(page) {
        this.page = page;
    }

    async clickSelector (action, options, delay, hasNavigation) {
        let waitForNavigationPromise;
    
        try {
            if (typeof options === 'object') {
                await this.page.waitFor(action.selector, options);
            } else {
                await this.page.waitFor(action.selector);
            }
    
            if (delay && typeof delay === 'number') {
                await this.page.waitFor(delay);
            }
    
            if (hasNavigation) {
                waitForNavigationPromise = this.page.waitForNavigation();
            }
    
            await this.page.click(action.selector);
    
            if (hasNavigation) {
                await waitForNavigationPromise;
            }
        } catch(err) {
            console.error(`Click Action Exception: ${action.description}`);
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
                await this.page.waitForXPath(action.xpath);
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
            console.error(`Click Action Exception: ${action.description}`);
            console.error(err);
            throw new Error('Exist Exception! STOPPED!!!');
        }
    }
    
    async clickEvaluate (action, delay, hidden, hasNavigation) {
        let waitForNavigationPromise;
        let hasElement = false;
    
        try {
            if (delay && typeof delay === 'number') {
                await this.page.waitFor(delay);
            }
    
            // hasElement = await this.page.evaluate((s) => !!document.querySelector(s), action.selector);
            // if (!hasElement) {
            //     return hasElement;
            // }
    
            try {
                await this.page.waitForSelector(action.selector, {visible: true, timeout: 1000})
                hasElement = true;
            } catch(err) {
                return false;
            }
    
            if (hasNavigation) {
                waitForNavigationPromise = this.page.waitForNavigation();
            }
    
            let waitForSelectorHiddenPromise;
            if (hidden) {
                waitForSelectorHiddenPromise = this.page.waitForSelector(action.selector, {hidden: true, timeout: 180000});
            }
            await this.page.click(action.selector);
            if (hidden) {
                await waitForSelectorHiddenPromise;
            }
    
            if (hasNavigation) {
                await waitForNavigationPromise;
            }
    
            return hasElement;
        } catch(err) {
            console.error(`ClickEvaluate Action Exception: ${action.description}`);
            console.error(err);
            throw new Error('Exist Exception! STOPPED!!!');
        }
    }
    
    async typeSelector (action, data, options) {
        try {
            if (typeof options === 'object') {
                await this.page.waitFor(action.selector, options);
            } else {
                await this.page.waitFor(action.selector);
            }
            await this.page.click(action.selector);
            await this.page.keyboard.type(data);
        } catch (err) {
            console.error(`Type Action Exception: ${action.description}`);
            console.error(err);
            throw new Error('Exist Exception! STOPPED!!!');
        }
    }
}

module.exports = PageOps;
