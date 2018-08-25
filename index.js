#!/usr/bin/env node

const fs = require('fs');
const ActionExecution = require('./action-execution');

let help = false;
let testSequenceFile;
let parallelCount = 1;
let rawContent;
let actions;
let creds;
let siteUrl;
let headless = false;
const args = process.argv.slice(2);

args.forEach((arg) => {
    if (arg.match(/^(-+|\/)(h(elp)?|\?)$/)) {
        help = true;
    } else if (arg.indexOf('--file') === 0 || arg.indexOf('-f') === 0) {
        testSequenceFile = arg.split('=')[1];
        if (typeof testSequenceFile === 'undefined') {
            console.error('Invalid file name');
            console.error('');
        }
    } else if (arg.indexOf('--parallel') === 0 || arg.indexOf('-p') === 0) {
        parallelCount = +arg.split('=')[1];
        if (!parallelCount) {
            console.error('Invalid input');
            console.error('');
        }
    } else if (arg.indexOf('--headless') === 0 || arg.indexOf('-l') === 0) {
        headless = true;
    }
});

if (help || !args.length) {
    // If they didn't ask for help, then this is not a "success"
    var log = help ? console.log : console.error
    log('Usage: uiautomator -f=<InputFile> [ <ParallelCount>]')
    log('')
    log('  UI automation tool.')
    log('')
    log('Options:')
    log('')
    log('  -f, --file         Test sequence json file')
    log('  -p, --parallel     Parallel count')
    log('  -l, --headless     Head less chrome')
    process.exit(help ? 0 : 1)
} else if (testSequenceFile) {
    try {
        rawContent = fs.readFileSync(testSequenceFile, 'utf8');
        const content = JSON.parse(rawContent);
        actions = content.data;
        creds = content.creds;
        siteUrl = content.siteUrl;
    } catch (err) {
        console.error(err.message);
    }

    for (let i = 0; i < parallelCount; i++) {
        const execution = new ActionExecution(siteUrl, actions, creds, headless);
        // without await means inparallel call
        execution.run();
    }
}
