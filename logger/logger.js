'use strict';

import chalk from 'chalk';
import {LoggerBuilder} from '../index.js';

const
    bold         =  chalk.bold,        
    time         =  bold.hex("#ff7f07"),
    getDate      = () =>  '---> ' + new Date().toISOString();


const loggerBuilder = new LoggerBuilder();

loggerBuilder
    .setStyleFn({
        name: 'info',
        msgType: 'info:',
        msgTypeStyle: chalk.hex("#09ff00").bgWhite,
        sourceStyle: chalk.hex("#09ff11").bgWhite,
        msgStyle: chalk.hex("#09ff00"),
        
    }).setStyleFn({
        name: 'success',
        message: 'SUCCESS.',
        msgTypeStyle: chalk.hex("#09ff00").bgWhite,
        sourceStyle: chalk.hex("#09ff11").bgWhite,
        msgStyle: chalk.hex("#02fafa")

    }).setStyleFn({
        name: 'err',
        msgType: 'ERROR!',
        msgTypeStyle: chalk.hex("#09ff00").bgWhite,
        sourceStyle: chalk.hex("#09ff11").bgWhite,
        msgStyle: bold.red

    }).setStyleFn({
        name: 'fail',
        msgType: 'FAIL!',
        msgTypeStyle: chalk.hex("#09ff00").bgWhite,
        sourceStyle: chalk.hex("#09ff11").bgWhite,
        msgStyle: bold.hex("#ff078f")

    }).setStyleFn({
        name: 'warn',
        msgType: 'WARNING!',
        msgTypeStyle: chalk.red.bgYellow,
        sourceStyle: chalk.hex("#09ff11").bgWhite,
        msgStyle: bold.yellow        

    }).build()
;

const logger = loggerBuilder.create();
export { loggerBuilder }