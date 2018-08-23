/* *********************************************************************************
 * Locate unique element
 * *********************************************************************************/
var locateUniqueElement = (function() {
    'use strict';

    var getLastPath = function (xpath) {
        var paths = xpath.split('/');
        return paths[paths.length - 1];
    },

    // Return text part of an element tree or from a xpath string
    getText = function (element) {
        var matched,
            result = '';

        if (typeof element === 'string') {
            matched = getLastPath(element).match(/(\[\..*?\])/isgm);
            result = (matched && matched[0]) || '';
        } else if (typeof element === 'object') {
            result = (element.text ? ('[.="' + element.text + '"]') : '');
        }

        var text = result && result.split('"')[1];

        return (text && text.trim()) ? '[contains(., "' + text.trim() + '")]' : '';
    },

    // Return id of an element tree or from a xpath string
    getId = function (element) {
        var matched;

        if (typeof element === 'string') {
            matched = getLastPath(element).match(/\[(@id.*?\])/igm);
            return (matched && matched[0]) || '';
        }

        return (element.id ? ('[@id="' + element.id + '"]') : '');
    },

    // Return class name
    getClass = function (element) {
        var matched;

        if (typeof element === 'string') {
            matched = getLastPath(element).match(/\[(@class.*?\])/igm);
            return (matched && matched[0]) || '';
        }

        return (element.cls ? ('[@class="' + element.cls + '"]') : '');
    },

    // Return the position relative to its sibling node
    getSiblingIndex = function (element) {
        var matched;

        if (typeof element === 'string') {
            matched = getLastPath(element).match(/(\[\d+\])/igm);
            return (matched && matched[0]) || '';
        }

        return (element.siblingIndex !== undefined ? ('[' + (element.siblingIndex+1) + ']') : '');
    },

    // Return element tag name
    getTag = function (element) {
        if (typeof element === 'string') {
            return getLastPath(element).split('[')[0].toLowerCase();
        }

        return element.tag.toLowerCase();
    },

    // Construct xpath string with tag/sibling index/class name/id/text
    getStrictPathFromElement = function (element) {
        var text = '/' + getTag(element)
                + getSiblingIndex(element)
                + getClass(element)
                + getId(element)
                + getText(element);

        return text;
    },

    // Construct xpath string with tag/class name/id/text
    getLoosePathByRemoveIndex = function (element) {
        var text = '/' + getTag(element) 
                + getClass(element)
                + getId(element)
                + getText(element);

        return text;
    },

    // Construct xpath with tag/sibling index/id/text
    getLoosePathByRemoveClass = function (element) {
        var text = '/' + getTag(element) 
                + getSiblingIndex(element)
                + getId(element)
                + getText(element);

        return text;
    },

    // Construct xpath with tag/sibling index/class name/text
    getLoosePathByRemoveId = function (element) {
        var text = '/' + getTag(element)
                + getSiblingIndex(element)
                + getClass(element)
                + getText(element);

        return text;
    },

    // Construct xpath with tag/sibling index/id/text
    getLoosePathByRemoveIndexClassId = function (element) {
        var text = '/' + getTag(element) + getText(element);

        return text;
    },

    // Find elements via XPath
    evaluate = function (selector, dom) {
        return new XPathEvaluator().evaluate(
            '/' + selector, 
            dom || document.documentElement, // Use HTML BODY DOM to compare if dom parameter is null
            null, 
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
    },

    // Define Operation mode: One Strict mode and 4 Maintaince modes
    OperationType = {
        STRICT: 'STRICT',
        LOOSE_REMOVE_INDEX: 'LOOSE_REMOVE_INDEX',
        LOOSE_REMOVE_CLASS: 'LOOSE_REMOVE_CLASS',
        LOOSE_REMOVE_ID: 'LOOSE_REMOVE_ID',
        LOOSE_REMOVE_INDEX_CLASS_ID: 'LOOSE_REMOVE_INDEX_CLASS_ID'
    },

    getSelector = function (element, lastSelector, operationType) {
        var selector;

        switch (operationType) {
            case OperationType.STRICT:
                selector = getStrictPathFromElement(element);
                break;
            case OperationType.LOOSE_REMOVE_INDEX:
                selector = getLoosePathByRemoveIndex(element);
                break;
            case OperationType.LOOSE_REMOVE_CLASS:
                selector = getLoosePathByRemoveClass(element);
                break;
            case OperationType.LOOSE_REMOVE_ID:
                selector = getLoosePathByRemoveId(element);
                break;
            case OperationType.LOOSE_REMOVE_INDEX_CLASS_ID:
                selector = getLoosePathByRemoveIndexClassId(element);
                break;
            default:
                throw 'ERROR: the third parameter operationType is not allowed';
                break;
        }

        return (selector + lastSelector);
    },

    updateOperationType = function (operationType) {
        switch (operationType) {
            case OperationType.STRICT:
                return OperationType.LOOSE_REMOVE_INDEX;
                break;
            case OperationType.LOOSE_REMOVE_INDEX:
                return OperationType.LOOSE_REMOVE_CLASS;
                break;
            case OperationType.LOOSE_REMOVE_CLASS:
                return OperationType.LOOSE_REMOVE_ID;
                break;
            case OperationType.LOOSE_REMOVE_ID:
                return OperationType.LOOSE_REMOVE_INDEX_CLASS_ID;
                break;
            case OperationType.LOOSE_REMOVE_INDEX_CLASS_ID:
                return undefined;
                break;
            default:
                throw 'ERROR: the third parameter operationType is not allowed';
                break;
        }
    },

    getParentNode = function (element) {
        var matched;
        if (typeof element === 'string') {
            matched = element.match(/^.*(?=\/)|^.*/igm);
            return matched && (matched[0] === '/' ? undefined : matched[0]);
        }

        return element.parentElem;
    },

    /**
     * Locate unqiue element by element object stored before in a DOM
     * @param {Object | String} element - A element tree to record self attributes and parent relationship. Or a XPath as long as possible.
     * @param {String} lastSelector - First recurrence, the param is empty string '', for record xpath selector each recurrence
     * @param {String} Use which mode to connect Xpath selector, strict mode, or loose mode.
     * @param {Object} dom - Optional parameter, DOM will be compared
     * @returns {object} If found unique element, return the element DOM, otherwise return undefined
     */
    locateUniqueElement = function (element, lastSelector, operationType, dom) {
        var selector,
            result,
            newType;

        // Get Xpath selector
        selector = getSelector(element, lastSelector, operationType);
        // Evaluate Xpath selctor in HTML DOM
        result = evaluate(selector, dom);

        if (result.snapshotLength === 1) { // Found unique element
            // return element
            return result.snapshotItem(0);
        } else if (result.snapshotLength > 1 && getParentNode(element)) { // Found multiple elements
            // use strict mode to lengthen xpath recursively
            return locateUniqueElement(getParentNode(element), selector, OperationType.STRICT, dom);
        } else if (result.snapshotLength === 0) { // Not found element, use maintenance mode
            newType = updateOperationType(operationType);
            if (!newType) {
                // Current mode is already the most maintenace mode, locate failed
                return undefined;
            }

            return locateUniqueElement(element, lastSelector, newType, dom);
        } else if (!getParentNode(element)) {
            return undefined;
        } else {
            throw 'ERROR: Never runing here';
        }
    };

    /**
     * Locate unqiue element by finding element object stored before in a DOM
     * @param {Object | String} element - A element tree to record self attributes and parent relationship, or a XPath string as long as possible.
     * @param {Object} dom - Optional parameter, DOM will be compared
     * @returns {object} If found unique element, return the element DOM, otherwise return undefined
     */
    return function (element, dom) {
        return locateUniqueElement(element, '', OperationType.STRICT, dom);
    };
})();

module.exports = locateUniqueElement;
