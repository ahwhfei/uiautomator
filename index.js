#!/usr/bin/env node

const fs = require('fs');
const commandLineArgs = require('command-line-args');

const ActionExecution = require('./action-execution');

const optionDefinitions = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'file', alias: 'f', type: String, defaultOption: true },
    { name: 'headless', alias: 'l', type: Boolean },
    { name: 'parallel', alias: 'p', type: Number, defaultValue: 1 },
    { name: 'timeout', alias: 't', type: Number },
    { name: 'serial', alias: 's', type: Number }
];

let rawContent;
let actions;
let creds;
let siteUrl;
const args = process.argv.slice(2);
const options = commandLineArgs(optionDefinitions);

if (options.help || !args.length) {
    // If they didn't ask for help, then this is not a "success"
    var log = options.help ? console.log : console.error
    log('Usage: uiauto <InputFile> [ <ParallelCount> ]')
    log('')
    log('  UI automation tool.')
    log('')
    log('Options:')
    log('')
    log('  -f, --file         Test sequence json file')
    log('  -p, --parallel     Parallel count')
    log('  -l, --headless     Head less chrome')
    process.exit(options.help ? 0 : 1)
} else if (options.file) {
    try {
        rawContent = fs.readFileSync(options.file, 'utf8');
        const content = JSON.parse(rawContent);
        actions = content.data;
        creds = content.creds;
        siteUrl = content.siteUrl;
    } catch (err) {
        console.error(err.message);
    }

    for (let i = 0; i < options.parallel; i++) {
        const execution = new ActionExecution(siteUrl, actions, creds, options.headless);
        // without await means inparallel call
        execution.run();
    }
}
