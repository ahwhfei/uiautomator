const EvalUtilities = {

    convert (action) {
        if (typeof action !== 'object') {
            retrurn;
        }

        for (const p in action) {
            if (action.hasOwnProperty(p)) {
                action[p] = this.execute(action[p]);
            }
        }
    },

    execute (evalString) {
        if (typeof evalString !== 'string' || !this.isEvalString(evalString)) {
            return evalString;
        }

        const evalStr = evalString.split('{')[1].split('}')[0];

        return eval(evalStr);
    },

    isEvalString (str) {
        var exp = str.trim();
        return (exp[0] === '{' && exp[exp.length - 1] === '}');
    }
};

module.exports = EvalUtilities;
