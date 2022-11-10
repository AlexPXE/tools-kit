"use strict";

import { saySync } from './saySync.js';

class VoiceLoggerBuilder {
    
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
        } = {},
        strings: {
            startStr = '',
            endStr = '',
        } = {}
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

class LoggerBuilder {
    
    stylesFns = new Map();
    prototype = {};    

    /**
     * Set style 
     * 
     * @param {Object} options
     * @param {string} options.name Method name
     * @param {string} options.msgType Message name. Example: 'Warning'
     * @param {function} options.msgTypeStyle Styling function for 'msgType'
     * @param {function} options.sourceStyle Styling function for 'source' (message source)
     * @param {function} options.msgStyle Styling function for 'msg' (message body)
     * @returns {this}
     * @throws {Error} If `name` param === `"source"`
     */
    setStyleFn({
        name = '',
        msgType = '',
        msgTypeStyle = (msgType) => msgType,
        sourceStyle = (source) => source,
        msgStyle = (msg) => msg

    } = {}) {
        if (name === 'source') {
            throw new Error("Sorry, property named 'source' is alredy reserved.");
        }
        const log = console.log;

        this.stylesFns.set(
            name,
            /**
             * 
             * @param {string} msg
             * @returns {Object} this loger instance
             */
            function() {
                log(`${msgTypeStyle(msgType + '')}${sourceStyle(this.source)}} ${msgStyle(...arguments)}`);
                return this;
            }
        );

        return this;
    }    

    /**
     * Build prototype
     * 
     * @returns {this}
     */
    build() {
        this.prototype = Object.fromEntries(this.stylesFns.entries());
        return this;
    }

    /**
     * Create logger instance
     * 
     * @param {string} sourceName 
     * @returns {Object}
     */
    create(sourceName = 'log') {
        return Object.create({}, this.prototype, {source: sourceName});
    }

    /**
     * reset all
     * @returns {this}
     */
    reset() {
        this.prototype = {};
        this.stylesFns.clear();
        return this;
    }
}


class Foo extends LoggerBuilder {    
    
    tts = {
        voice: 'Microsoft Zira Desktop',
        voiceSpeed: 0.80,        
        ttsFlag: false,
        voiceEngine: saySync,        
        get say() {
            this.ttsFlag = true;
            return this;
        }
    };

    prototype = {
    };

    /**
     * Set style 
     * 
     * @param {Object} options
     * @param {string} options.name Method name
     * @param {string} options.msgType Message name. Example: 'Warning'
     * @param {function} options.msgTypeStyle Styling function for 'msgType'
     * @param {function} options.sourceStyle Styling function for 'source' (message source)
     * @param {function} options.msgStyle Styling function for 'msg' (message body)
     * @returns {this}
     * @throws {Error} If `name` param contains a reserved value (keys of this.tts object)
    */
    setStyleFn({
        name = '',
        msgType = '',
        msgTypeStyle = (msgType) => msgType,
        sourceStyle = (source) => source,
        msgStyle = (msg) => msg

    } = {}) {
        if ( Object.hasOwn(this.voiceEngine, name) || name === 'source') {
            throw new Error(`Sorry, property name: ${name} is already reserved. List of all reserved properties:\n ${[Object.keys(this.voiceEngine)]}`);
        }
        const log = console.log;

        this.stylesFns.set(
            name,
            /**
             * 
             * @param {string} msg
             * @returns {Object} this logger instance
             */                     
            function() {
                log(`${msgTypeStyle(msgType + '')}${sourceStyle(this.source)}} ${msgStyle(...arguments)}`);
                
                if (this.ttsFlag === true) {
                    this.voiceEngine.speak(`${msgType} ${this.source} ${[...arguments].join(' ')}`, this.voice, this.voiceSpeed);
                    this.ttsFlag = false;
                }
                return this;
            }           
        );
        return this;
    }

    /**
     * 
     * @param {string} sourceName Name of message sorce
     * @returns {Object} Logger instance with specified parameters
     */
    create(sourceName = 'log') {
        return Object.create({}, {source: sourceName}, this.prototype, this.voiceEngine);
    }    
}

export {
    VoiceLoggerBuilder,
    LoggerBuilder
}