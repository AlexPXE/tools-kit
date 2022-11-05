'use strict';

import chalk from 'chalk';
import {LoggerBuilder} from './loggerbuilder.js';

const
    bold         =  chalk.bold,        
    time         =  bold.hex("#ff7f07"),
    getDate      = () =>  '---> ' + new Date().toISOString();


const loggerBuilder = new LoggerBuilder();

loggerBuilder
    .setStyleFn({
        name: 'info',
        styles: {
            sourceSt: chalk.hex("#09ff00").bgWhite,
            msgSt: chalk.hex("#09ff00")
        }
    }).setStyleFn({
        name: 'success',
        styles: {
            sourceSt: bold.bgHex("#15ff00").hex("#000d33"),
            msgSt: chalk.hex("#02fafa")
        },
        strings: {
            endStr: 'successfully'
        }
    }).setStyleFn({
        name: 'err',
        styles: {
            sourceSt: bold.bgRed.blueBright,
            msgSt: bold.red
        },
        strings: {
            startStr: 'ERROR!'
        }
    }).setStyleFn({
        name: 'fail',
        styles: {
            sourceSt: bold.hex("#ff66cc"),
            msgSt: bold.hex("#ff078f")
        },
        strings: {
            startStr: 'FAIL!'
        }
    }).setStyleFn({
        name: 'warn',
        styles: {
            sourceSt: bold.bgYellowBright.redBright,
            msgSt: bold.yellow
        },
        strings: {
            startStr: 'WARNING!'
        }
    }).setStyleFn({
        name: 'help',
        styles: {
            sourceSt: bold.bgGray.white,
            msgSt: chalk.white
        },
        strings: {
            startStr: 'help!'
        }
    }).build()
;


const logger = loggerBuilder.create();
export { loggerBuilder }