"use strict";

import {loggerBuilder} from '../index.js';

const msg = loggerBuilder.create('Performer');

function entryFactory(commandFn, helpStr) {
    return {
        command: commandFn,
        help: helpStr
    }
}

class Peformer {
    commands = new Map();

    constructor() {

        const showHelpList = () => {
            let h = '';

            for ( let [cName, { help }] of this.commands.entries() ) {
                h += `\n\t\t${cName}\n\t\t\t${help}`;
            }

            msg.help('Availible commands:\n' + h);
        };

        this.set(
            "help",
            "help [commandName]",
            ([commandName]) => {
                if ( !this.has(commandName) ) {
                    if (commandName !== undefined) {
                        msg.warn(`Command not found.`);
                    }
                    
                    return showHelpList();
                }

                return msg.help( `${commandName}\n${this.get(commandName).help}` );
            }
        );
    }
    
    /**
     * 
     * @param {string} command command name
     * @param {Array} [options] command options
     * @returns {*} command result
     */
    async execute(command, options = []) {
        if ( !this.has(command) ) {
           return this.execute('help', [command]);
        }

        return await this.get(command).command(options);
    }

    /**
     * 
     * @param {string} commandStr command name
     * @param {function} fn command function
     * @param {string} helpStr help informaton
     * @returns {Peformer} this instance
     */
    set(commandStr, helpStr = '', fn) {
        this.commands.set(
            commandStr,
            entryFactory(fn, helpStr),
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

export {
    Peformer
}