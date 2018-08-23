const ActionExecution = require('./action-execution');
const TMActionExecution = require('./tm-action-execution');

const actionList2 = require('./data/actions-2');
const actionList8_qiandev32 = require('./data/actions-8-qiandev32');
const actionList8_qiandev33 = require('./data/actions-8-qiandev33');

const actionList_xpath = require('./data/actions-xpath.json').data;
const tmActionList = require('./data/tm-actions.json').data;

const execution = new ActionExecution();
// execution.run(actionList2);
// execution.run(actionList8_qiandev32);
// execution.run(actionList8_qiandev33);
// execution.run(actionList_xpath);

const tmExecution = new TMActionExecution();
tmExecution.run(tmActionList);
tmExecution.run(tmActionList);
tmExecution.run(tmActionList);
tmExecution.run(tmActionList);
tmExecution.run(tmActionList);
tmExecution.run(tmActionList);