"use strict";

import { saySync } from './saySync.js';
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
                log(`${msgTypeStyle(msgType + ' ')}${sourceStyle(this.source)} ${msgStyle(...arguments)}`);
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
        return Object.assign({}, this.prototype, {source: sourceName});
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

class VoiceLoggerBuilder extends LoggerBuilder {
    
    tts = {
        voice: 'Microsoft Zira Desktop',
        voiceSpeed: 0.9,
        voiceEngine: saySync        
    };

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
     * @throws {Error} If `name` param contains a reserved value (keys of this.tts object)
    */
    setStyleFn({
        name = '',
        msgType = '',
        msgTypeStyle = (msgType) => msgType,
        sourceStyle = (source) => source,
        msgStyle = (msg) => msg

    } = {}) {        
        if ( Object.hasOwn(this.tts, name) || name === 'source') {
            throw new Error(`Sorry, property name: ${name} is already reserved. List of all reserved properties:\n ${[Object.keys(this.tts)]}`);
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
                log(`${msgTypeStyle(msgType + ' ')}${sourceStyle(this.source)} ${msgStyle(...arguments)}`);
                
                if (this.ttsFlag === true) {
                    this.voiceEngine.speak(`${[...arguments].join(' ')}`, this.voice, this.voiceSpeed);
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
        return Object.assign(
            {
                ttsFlag: false,
                get say() {
                    this.ttsFlag = true;
                    return this;
                }
            }, 
            {source: sourceName},
            this.prototype, 
            this.tts
        );
    }    
}

export {
    VoiceLoggerBuilder,
    LoggerBuilder
}