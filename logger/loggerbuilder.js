"use strict";

import { saySync } from './saySync.js';

class LoggerBuilder {
    
    stylesFns = new Map();    
    
    prototype = {
        voice: 'Microsoft Zira Desktop',
        voiceSpeed: 0.80,
        sayEnable: true,
        log: console.log,        
        say: saySync,
        mute() {            
            this.sayEnable = false;
            return this;
        },
        unmute() {
            this.sayEnable = true;
            return this;
        },
        msg(msg) {
            return this.say.speak(msg, this.voice, this.voiceSpeed);
        }
    };

    instance = {};

    /**
     * 
     * @param {Object} params 
     * @param {Object} params.styles
     * @param {function} params.styles.sourceSt
     * @param {function} params.styles.msgSt
     * @param {object} params.strings
     * @param {string} params.strings.startStr
     * @param {string} params.strings.endStr
     * @returns {this}
     */
    setStyleFn({
        name = 'log',
        styles: {
            sourceSt = (str) => str,
            msgSt = (str) => str,        
        },
        strings: {
            startStr = '',
            endStr = '',
        }
    }) {        
        if ( Object.hasOwn(this.prototype, name) ) {
            throw new Error(`Property name '${name}' reserved`);
        }

        this.stylesFns.set(
            name,
            function(...msgs) {

                const formattedMsg = msgs.map((str) => {
                    return `\t${startStr && startStr + ' '}${str}${endStr && '\t' + endStr}`
                }).join('\n');
                
                this.log( `${ sourceSt(this.source) }\n ${ msgSt(formattedMsg) }` );

                if (this.sayEnable) {
                    this.msg(`${this.source}. ${formattedMsg}`);
                }

                return this;
            }
        );

        return this;
    }

    /**
     * 
     * @param {string} voice Voice name
     * @returns {this}
     */
    setVoice(voice) {
        this.prototype.voice = voice;
        return this;
    }

    /**
     * 
     * @param {number} speed 0.1 - 10%, 1 - 100%
     * @returns {this}
     */
    setVoiceSpeed(speed) {
        this.prototype.voiceSpeed = speed; 
        return this;
    }

    /**
     * Build prototype
     * 
     * @returns {this}
     */
    build() {
        const resultObj = {};

        for ( let [propName, fn] of this.stylesFns.entries() ) {
            resultObj[propName] = fn;
        }

        this.instance = Object.assign(
            {},            
            resultObj,
            this.prototype
        );

        return this;
    }

    /**
     * Create instanse
     * 
     * @param {string} source Message source
     * @returns {object} Instance
     */
    create(source = 'log') {
        return Object.assign(
            {},
            {   
                source,
            },
            this.instance
        );
    }

    reset() {
        this.instance = {};
        return this;
    }
}

export {
    LoggerBuilder
}

