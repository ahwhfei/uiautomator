class Options {
    set options(o) {
        this.headless = o.headless;
        this.timeout = o.timeout;
        this.noquit = o.noquit;
    }
}

module.exports = new Options();
