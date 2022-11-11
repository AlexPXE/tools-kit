import * as readline from 'node:readline/promises';
import { 
    Runner,
    VoiceRunner,
    RunnerFactory
} from "../index.js";

class Cli {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });    
    prompt;
    runner;

    /**
     * 
     * @param {object} runner
     * @param {function} runner.run
     * @param {string} prompt 
     */
    constructor(runner, prompt = 'PROMPT>') {        
        this.prompt = prompt + ' ';
        this.runner = runner;
    }

    /**
     * Start cli.
     * 
     * @returns {Prmise<this>}
     */
    async start() {
        const {rl, prompt, runner} = this;

        while(true) {
            const string = await rl.question(prompt);
            if (string === 'exit') {
                break;
            }

            const [command, ...opt] = string.split(' ');
            await runner.run(command, opt);
        }

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
     * 
     * @returns {Promise<this>}
     */
    async start() {
        const { cli } = this;
        await cli.start();
        return this;
    }
}

class CliRunnerFactory extends RunnerFactory { 
    Cli = Cli;
    
    /**
     * 
     * @param {string} sorceName 
     * @param {string} prompt 
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