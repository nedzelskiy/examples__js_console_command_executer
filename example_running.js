'use strict';

const terminate = require('terminate');

const availableCommands = {
    'k': {
        run: function(pid) {
            if (!pid || !/^\d+$/.test(pid)) {
                console.error(`Wrong argument pid for command k - kill`);
                return false;
            }
            let signal = 'SIGKILL';
            if (arguments[1] &&  /^[a-zA-Z]+$/.test(pid)) {
                signal = arguments[1];
            }
            terminate(pid, signal, err => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Command KILL ${ pid } executed with signal [${signal}]!`);
                }
            });
        }
    },
    'exit': {
        run: function() {
            const signal = 'SIGINT';
            console.log(`Command exit for process "${ process.pid }" will be executed with signal [${signal}]!`);
            terminate(process.pid, 'SIGINT', err => {
                if (err) {
                    console.error(err);
                } 
            });
        }
    }
};

// adding help for each commands, symbol "<>" needed as separator between command and text explanation (for pretty input)
availableCommands.k.usage =     'k [PID, [SIGNAL]] <> kill process by its PID';
availableCommands.exit.usage =  'exit <> stop watching for commands and exit script';

const execConsole = require('./index')(availableCommands);

// adding new key "Cntr + q"
execConsole.keys['\u0011'] = (controls, commands) => {
    console.log('This is handler for Cntrl + q! Another exit action!');
};
// adding move cursor left for two position key "{"
execConsole.keys['\u007B'] = (controls, commands) => {
    if (controls.cursorPosition > 1) {
        controls.cursorPosition = controls.cursorPosition - 2;
        process.stdout.cursorTo(controls.cursorPosition);
    }
};

// rebind standard handler "combineActionsForEnterHandle"
execConsole.actions.combineActionsForEnterHandle = function() {
    console.log("\r\n\r\nThis is a logger! From rebind standard handler \"combineActionsForEnterHandle\"!");
    this.enterActionHandle(execConsole.controls);
    this.executeCommand(execConsole.controls, execConsole.commands);
};

// run script
execConsole();

// and even add a new command after script run!
execConsole.commands['n'] = {
    run: function() {
        console.log('I\'m a new command added after running script!');
    },
    usage: 'n <> just a new added command!'
};

