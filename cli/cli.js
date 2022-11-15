import * as readline from 'node:readline/promises';
import { 
    Runner,
    VoiceRunner,
    RunnerFactory
} from "../index.js";

class Cli {
    rl;
    prompt;
    promptLength;
    runner;

    /**
     * 
     * @param {object} runner
     * @param {function} runner.run
     * @param {string} prompt 
     */
    constructor(runner, prompt = 'PROMPT>') {        
        this.prompt = prompt + ' ';
        this.promptLength = this.prompt.length;
        this.runner = runner;

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt            
        });        
    }
    
    /**
     * Start cli.
     * 
     * @returns {Prmise<this>}
     */
    async start() {
        const {runner} = this;
        this.rl.prompt();
        
        this.rl.on('line', async (line) => {
            if (line === 'exit') {
                this.rl.close();
                process.exit(0);
            }
            
            const [command, ...opt] = line.split(' ');
            await runner.run(command, opt);

            this.rl.prompt();
        });

        return this;
    }

    /**
     * Method pauses the input stream, allowing it to be resumed later if necessary.
     * 
     * @returns {this}
     */
    pause() {
        process.stdout.clearLine(0);
        process.stdout.moveCursor(-this.promptLength, 0);
        this.rl.pause();
        return this;        
    }

    /**
     * Method resumes the input stream if it has been paused.
     * 
     * @returns {this}
     */
    resume() {        
        this.rl.prompt();
        return this;
    }
}
class CliRunner extends Runner {

    cli;
    /**
     * 
     * @param {object} logger
     * @param {function} logger.warn
     * @param {function} logger.info
     * @param {class} Cli
     * @param {Object} Cli.prototype
     * @param {function} Cli.prototype.start
     * @param {string} [prompt] Default: PROMPT>
    */
    constructor(logger, Cli, prompt) {
        super(logger);
        this.cli = new Cli(this, prompt);
    }

    /**
     * 
     * @returns {Promise<this>}
     */
    async start() {
        const { cli } = this;
        await cli.start();

        return this;
    }

    /**
     * 
     * @param {Object} params
     * @param {Object} params.typeMsg
     * @param {Object} params.msg
     * @returns {this}
     */
    logger(params) {        
        this.cli.pause();
        super.logger(params);
        this.cli.resume();

        return this;
    }
}
class VoiceCliRunner extends VoiceRunner {
    cli;

    /**
     * 
     * @param {object} voiceLogger
     * @param {object} voiceLogger.say
     * @param {function} voiceLogger.say.warn
     * @param {function} voiceLogger.say.info
     * @param {class} Cli
     * @param {Object} Cli.prototype
     * @param {function} Cli.prototype.start
     * @param {string} [prompt] Default: PROMPT>
    */
    constructor(voiceLogger, Cli, prompt) {
        super(voiceLogger);
        this.cli = new Cli(this, prompt);
    }

    /**
     * Start cli runner
     * @returns {Promise<this>}
     */
    async start() {
        const { cli } = this;
        await cli.start();
        return this;
    }

    /**
     * 
     * @param {Object} params
     * @param {Object} params.typeMsg
     * @param {Object} params.msg
     * @returns {this}
     */
    logger(params) {
        this.cli.pause();
        super.logger(params);
        this.cli.resume();

        return this;
    }

    /**
     * 
     * @param {Object} params
     * @param {Object} params.typeMsg
     * @param {Object} params.msg
     * @returns {this}
     */
    voiceLogger(params) {
        this.cli.pause();
        super.voiceLogger(params);
        this.cli.resume();

        return this;
    }
}

class CliRunnerFactory extends RunnerFactory { 
    Cli = Cli;
    
    /**
     * 
     * @param {string} [sorceName]
     * @param {string} [prompt]
     * @returns {CliRunner}
     */
    runner(sorceName = 'CLI', prompt) {        
        return new CliRunner( this.logger.create(sorceName), this.Cli, prompt );
    }

    /**
     * 
     * @param {string} sorceName
     * @param {string} prompt 
     * @returns {VoiceCliRunner}
     */
    voiceRunner(sorceName = 'CLI', prompt) {
        return new VoiceCliRunner( this.voiceLogger.create(sorceName), this.Cli, prompt )
    }
}

const cliRunnerFactory = new CliRunnerFactory();

export {
    Cli,
    CliRunner,
    VoiceCliRunner,
    CliRunnerFactory,
    cliRunnerFactory
}