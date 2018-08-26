const XPathUtilites = {
    getText(xpath) {
        let matched;

        if (typeof xpath === 'string') {
            matched = xpath.split('[.="');
            return  matched[1] && matched[1].split('"]')[0];
        }
    },

    changeXPathText(xpath, text) {
        if (typeof xpath === 'string') {
            const matchs = xpath.split('[.=');
            if (matchs[0] && typeof text === 'string') {
                return `${matchs[0]}[.="${text}"]`;
            }
        }

        return xpath;
    }
}

module.exports = XPathUtilites;
