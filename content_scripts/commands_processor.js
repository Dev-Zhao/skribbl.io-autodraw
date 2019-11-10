//'Making functions non-blocking' - https://medium.com/@maxdignan/making-blocking-functions-non-blocking-in-javascript-dfeb9501301c
// Javascript runtimes can only perform one task at a time, if we are running thoudsands of draw commands, it blocks
// everything else from happening. This allows Javascript to do other things while we are drawing
class CommandsProcessor {
    constructor(commands){
        this.commands = commands;
    }

    clearCommands() {
        this.commands = [];
    }

    setCommands(commands){
        this.commands = commands;
    }

    process (delay, keepGoing) {
        let runCommand = () => {
            if (!this.commands.length || !keepGoing()) { // Do nothing if there are no commands
                return;
            }

            // Get and run the next command
            let command = this.commands.shift(); 
            command();
            
            // Call runCommand() again after some delay
            setTimeout(runCommand, delay);
        }

        runCommand(); // Start running commands
    }

}

    