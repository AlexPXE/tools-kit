"use strict"
import once from 'one-time';
import { SayWin32 } from 'say';
import { spawn } from 'child_process';

class SaySync extends SayWin32 {
    cache = [];
    isFree = true    

    /**
	 * Uses system libraries to speak text via the speakers.
	 *
	 * @param {string} text Text to be spoken
	 * @param {string|null} voice Name of voice to be spoken with
	 * @param {number|null} speed Speed of text (e.g. 1.0 for normal, 0.5 half, 2.0 double)
	 * @param {Function|null} callback A callback of type function(err) to return.
     * @returns {string} Passed string
	 */
	speak(text, voice, speed, callback) {
        
       if (this.isFree === false) {
            this.cache.push(arguments);
            return text;
        }

        this.isFree = false;

		if (typeof callback !== 'function') {
			callback = () => {};
		}

		callback = once(callback);

		if (!text) {
			return setImmediate(() => {
				callback( new TypeError('say.speak(): must provide text parameter') );
			});
		}

		let {
			command,
			args,
			pipedData,
			options
		} = this.buildSpeakCommand({
			text,
			voice,
			speed
		});

		this.child = spawn(command, args, options);
        
        this.child.once('close', () => {
            this.isFree = true;
            
            if (this.cache.length > 0) {                
               this.speak( ...this.cache.shift() );
            }
        });	


		this.child.stdin.setEncoding('ascii');
		this.child.stderr.setEncoding('ascii');

		if (pipedData) {
			this.child.stdin.end(pipedData);
		}

		this.child.stderr.once('data', (data) => {
			// we can't stop execution from this function
			callback( new Error(data) );
		});

		
		this.child.addListener('exit', (code, signal) => {
			if (code === null || signal !== null) {
				return callback(new Error(`say.speak(): could not talk, had an error [code: ${code}] [signal: ${signal}]`));
			}

			this.child = null;

			callback(null);
		});

        return text;
	}
}

const saySync = new SaySync();

export {
    SaySync,
    saySync
}

