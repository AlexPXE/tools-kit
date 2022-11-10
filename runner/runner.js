"use strict";

import {
    voiceLoggerBuilder,
    loggerBuilder
} from '../index.js';

function entryFactoryHalper(commandFn, helpStr) {
    return {
        command: commandFn,
        help: helpStr
    }
}
class Runner {
    commands = new Map();
    msg;

    /**
     * 
     * @param {object} logger
     * @param {function} loger.warn
     * @param {function} loger.info
     */
    constructor(logger) {
        this.msg = logger;

        const showHelpList = () => {
            let h = '';

            for ( let [cName, { help }] of this.commands.entries() ) {
                h += `\n\t\t${cName}\n\t\t\t${help}`;
            }
            this.msg.info('Availible commands:\n' + h);
        };

        this.set(
            "help",
            "help [commandName]",
            ([commandName]) => {
                if ( !this.has(commandName) ) {
                    if (commandName !== undefined) {
                        this.msg.warn(`Command not found.`);
                    }                    
                    return showHelpList();
                }
                return this.msg.info( `${commandName}\n${this.get(commandName).help}` );
            }
        );
    }
    
    /**
     * 
     * @param {string} command command name
     * @param {Array} [options] command options
     * @returns {*} command result
     */
    async run(command, options = []) {
        if ( !this.has(command) ) {
           return this.run('help', [command]);
        }
        return await this.get(command).command(options);
    }

    /**
     * 
     * @param {string} commandStr command name
     * @param {function} fn command function
     * @param {string} helpStr help informaton
     * @returns {Runner} this instance
     */
    set(commandStr, helpStr = '', fn) {
        this.commands.set(
            commandStr,
            entryFactoryHalper(fn, helpStr),
        );
        return this;
    }

    get(commandStr) {
        return this.commands.get(commandStr);
    }

    has(command) {
        return this.commands.has(command);
    }    
}

class VoiceRunner extends Runner {
    /**
     * 
     * @param {Object} logger
     * @param {Object} logger.say
     * @param {function} logger.say.warn
     * @param {function} logger.say.info
     */
    constructor(logger) {
        super(logger);

        const showHelpList = () => {
            let h = '';

            for ( let [cName, { help }] of this.commands.entries() ) {
                h += `\n\t\t${cName}\n\t\t\t${help}`;
            }

            this.msg.say.info('Availible commands:\n' + h);
        };

        this.set(
            "help",
            "help [commandName]",
            ([commandName]) => {
                if ( !this.has(commandName) ) {
                    if (commandName !== undefined) {
                        this.msg.say.warn(`Command not found.`);
                    }                    
                    return showHelpList();
                }
                return this.msg.say.info( `${commandName}\n${this.get(commandName).help}` );
            }
        );
    }
}
class RunnerFactory {
    logger = loggerBuilder;
    voiceLogger = voiceLoggerBuilder;

    /**
     * 
     * @param {string} sorceName 
     * @returns {Runner}
     */
    runner(sorceName = 'Runner') {
        return new Runner( this.logger.create(sorceName) );
    }

    /**
     * 
     * @param {string} sourceName 
     * @returns {VoiceRunner}
     */
    voiceRunner(sourceName = 'Runner') {
        return new VoiceRunner( this.voiceLogger.create(sourceName) );
    }
}

const runnerFactory = new RunnerFactory();

export {
    Runner,
    VoiceRunner,
    RunnerFactory,
    runnerFactory
}