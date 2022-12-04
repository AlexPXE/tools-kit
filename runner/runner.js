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
            this.logger({
                typeMsg: "info",
                msg: 'Availible commands:\n' + h
            });            
        };

        this.set(
            "help",
            "help [commandName]",
            ([commandName]) => {
                if ( !this.has(commandName) ) {
                    if (commandName !== undefined) {
                        this.logger({
                            typeMsg: "warn",
                            msg: `Command not found.`
                        });
                        
                    }               
                    return showHelpList();
                }

                this.logger({
                    typeMsg: "info",
                    msg: `${commandName}\n${this.get(commandName).help}`
                });                
            }
        );
    }

    /**
     * 
     * @param {Object} params
     * @param {Object} params.typeMsg
     * @param {Object} params.msg
     * @returns {this}
     */
    logger({typeMsg, msg}) {
        if ( Object.hasOwn(this.msg, typeMsg) ) {
            this.msg[typeMsg](msg);
        } else {
            this.msg.warn(`Type of msg '${typeMsg}' does not exist.`);
            this.msg.info(msg);
        }
        return this;
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
        return await ( this.get(command) ).command(options);
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

//TEST IT
class VoiceRunner extends Runner {
    /**
     * 
     * @param {Object} voiceLogger
     * @param {Object} logger.say
     * @param {function} logger.say.warn
     * @param {function} logger.say.info
     */
    constructor(voiceLogger) {
        super(voiceLogger);
    }

    /**
     * 
     * @param {Object} params
     * @param {Object} params.typeMsg
     * @param {Object} params.msg
     * @returns {this}
     */
    voiceLogger({typeMsg, msg}) {
        if ( Object.hasOwn(this.msg, typeMsg) ) {
            this.msg.say[typeMsg](msg);
        } else {
            this.msg.say.warn(`Type of msg '${typeMsg}' does not exist.`);
            this.msg.say.info(msg);
        }
        return this;
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