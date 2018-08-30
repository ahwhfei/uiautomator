#!/usr/bin/env node

const fs = require('fs');
const commandLineArgs = require('command-line-args');

const ActionExecution = require('./action-execution');
const options = require('./options');
const package = require('./package.json');

const optionDefinitions = [
    { name: 'file', alias: 'f', type: String, defaultOption: true },
    { name: 'parallel', alias: 'p', type: Number, defaultValue: 1 },
    { name: 'serial', alias: 's', type: Number },
    { name: 'headless', alias: 'l', type: Boolean },
    { name: 'timeout', alias: 't', type: Number },
    { name: 'noquit', alias: 'n', type: Boolean},
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'help', alias: 'h', type: Boolean }
];

let context;
const args = process.argv.slice(2);
const optionArgs = commandLineArgs(optionDefinitions);

options.options = optionArgs;

const help = () => {
    // If they didn't ask for help, then this is not a "success"
    var log = optionArgs.help ? console.log : console.error
    log('Usage: uiauto <InputFile> [ <ParallelCount> ]')
    log('')
    log('  UI automation tool.')
    log('')
    log('Options:')
    log('')
    log('  -f, --file         Test sequence json file (defalut option)')
    log('  -p, --parallel     Parallel execution count')
    log('  -s, --serial       Serial execution count')
    log('  -l, --headless     Head less chrome')
    log('  -t, --timeout      Navigation timout')
    log('  -n, --noquit       Do not close browser once done')
    log('  -v, --version      Version')
    process.exit(optionArgs.help ? 0 : 1)
};

if (optionArgs.help || !args.length) {
    help();
} else if (optionArgs.version) {
    console.log(package.version);
} else if (optionArgs.file) {
    try {
        const rawContent = fs.readFileSync(optionArgs.file, 'utf8');
        context = JSON.parse(rawContent);
    } catch (err) {
        console.error(err.message);
    }

    if (optionArgs.serial) {
        (async () => {
            for (let i = 0; i < optionArgs.serial; i++) {
                const execution = new ActionExecution(context);
                await execution.run();
            }
        })();
    } else {
        for (let i = 0; i < optionArgs.parallel; i++) {
            const execution = new ActionExecution(context);
            // without await means in parallel call
            execution.run();
        }
    }
} else {
    help();
}
