#!/usr/bin/env node

const fs = require('fs');
const TMActionExecution = require('./tm-action-execution');

const tmActionList = require('./data/tm-actions.json');

let help = false;
let testSequenceFile;
let parallelCount = 1;
let rawContent;
let actions;
let creds;
const args = process.argv.slice(2).filter((arg) => {
    if (arg.match(/^(-+|\/)(h(elp)?|\?)$/)) {
        help = true;
    } else if (arg.indexOf('--file') === 0 || arg.indexOf('-f') === 0) {
        testSequenceFile = arg.split('=')[1];
    } else if (arg.indexOf('--parallel') === 0 || arg.indexOf('-p') === 0) {
        parallelCount = +arg.split('=')[1];
    }
});

if (help) {
    // If they didn't ask for help, then this is not a "success"
    var log = help ? console.log : console.error
    log('Usage: uiautomator [<InputFile> <ParallelCount>]')
    log('')
    log('  UI automation tool.')
    log('')
    log('Options:')
    log('')
    log('  -f, --file         Test sequence json file')
    log('  -p, --parallel     Parallel count')
    process.exit(help ? 0 : 1)
} else if (testSequenceFile) {
    try {
        rawContent = fs.readFileSync(testSequenceFile, 'utf8');
        const content = JSON.parse(rawContent);
        actions = content.data;
        creds = content.creds;
    } catch (err) {
        console.log(err.message);
    }
}

if (!actions) {
    actions = tmActionList.data;
}

if (!creds) {
    creds = tmActionList.creds;
}

for (let i = 0; i < parallelCount; i++) {
    const tmExecution = new TMActionExecution(actions, creds);
    tmExecution.run();
}
