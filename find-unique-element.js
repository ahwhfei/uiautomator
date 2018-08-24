const locateUniqueElement = require('./locate-unique-element');

const evaluate = async (xpath, page) => {
    const elements = await page.$x(xpath);
    return elements;
};

async function findUniqueElement(xpath, page) {
    return await locateUniqueElement(xpath, page, evaluate);
}

module.exports = findUniqueElement;
