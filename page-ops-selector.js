class PageOpsSelector {
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
}

module.exports = PageOpsSelector;
