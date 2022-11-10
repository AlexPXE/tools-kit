import * as readline from 'node:readline/promises';
import { Peformer } from "../index.js";

class Cli {

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    peformer;
    prompt;

    constructor(peformerLike, prompt = 'PROMPT>') {
        this.peformer = peformerLike;
        this.prompt = prompt + ' ';
    }

    async start() {
        const {rl, prompt, peformer} = this;

        while(true) {
            const string = await rl.question(prompt);
            if (string === 'exit') {
                break;
            }

            const [command, ...opt] = string.split(' ');
            await peformer.execute(command, opt);
        }

        return this;
    }    
}

async function foo() {
    const pef = new Peformer().set(
        'hello',
        'Just hello',
        (command) => console.log("Oooooh good command")
    )

    const cli = new Cli(pef);
    await cli.start();
}

foo();

export {Cli}