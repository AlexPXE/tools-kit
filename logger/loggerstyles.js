import chalk from 'chalk';

export const
    BOLD         =  chalk.bold,        
    TIME         =  BOLD.hex("#ff7f07"),
    getDate      = () =>  '---> ' + new Date().toISOString(),
    STYLES = {
        INFO: {
            name: 'info',
            msgType: 'INFO -> ',
            msgTypeStyle: chalk.black.bgGreen,
            sourceStyle: chalk.hex("#09ff11").bgWhite,
            msgStyle: chalk.hex("#09ff00"),    
        },
        SUCCESS: {
            name: 'success',
            msgType: 'SUCCESS!',
            msgTypeStyle: chalk.black.bgGreen,
            sourceStyle: chalk.hex("#09ff11").bgWhite,
            msgStyle: chalk.hex("#02fafa")
        },
        ERR: {
            name: 'err',
            msgType: 'ERROR!',
            msgTypeStyle: chalk.white.bgRed,
            sourceStyle: chalk.hex("#09ff11").bgWhite,
            msgStyle: BOLD.red
        },
        FAIL: {
            name: 'fail',
            msgType: 'FAIL!',
            msgTypeStyle: chalk.white.bgRed,
            sourceStyle: chalk.hex("#09ff11").bgWhite,
            msgStyle: BOLD.hex("#ff078f")
        },
        WARN: {
            name: 'warn',
            msgType: 'WARNING!',
            msgTypeStyle: chalk.red.bgYellow,
            sourceStyle: chalk.hex("#09ff11").bgWhite,
            msgStyle: BOLD.yellow        
        }
    }
;
