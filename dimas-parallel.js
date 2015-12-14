var child = require('child_process');
var Promise = require('promise');
var os = require('os');

module.exports = {
    execute : execute,
    setMaxNumberOfProcesses : setMaxNumberOfProcesses
}

var maxNumberOfProcesses = os.cpus().length - 1;

var numberOfRunningProcesses = 0;
var requestsQueue = [];


function setMaxNumberOfProcesses(numOfProcesses) {
    maxNumberOfProcesses = numOfProcesses;
}

function execute(func, args) {
    return new Promise(function(resolve, reject) {

        var request = { func: func, args: args, resolve: resolve, reject: reject };
        requestsQueue.push(request);

        if (numberOfRunningProcesses < maxNumberOfProcesses) {

            executeFromQueue();
        }
    });
}

function executeFromQueue() {
    var toExecute = requestsQueue.shift();

    executeRequest(toExecute).then(function (result) {
        toExecute.resolve(result);
        executeFromQueue();
    }).catch(function (error) {
        toExecute.reject(error);
        executeFromQueue();
    });
}

function executeRequest(request) {

    return new Promise(function(resolve, reject) {
        var func = request.func;
        var args = request.args;
        
        var arguments = getArguments(args);
        var newConsoleCommand = 'WriteToConsole_' + Math.random().toString().replace('.', '');
        var replaceConsoleCommand = 'var ' + newConsoleCommand + ' = console.log; console.log = function () {};';
        var funcCommand = func.toString().replace(/(\r\n|\n|\r)/gm, "");
        var outputCommand = newConsoleCommand + '(' + func.name + '(' + arguments + '));';
        outputCommand = outputCommand.replace(/"/g, '\\\"');
        var command = 'node -e "' + replaceConsoleCommand + ' ' + funcCommand + ' ' + outputCommand;
        
        numberOfRunningProcesses++;
        child.exec(command, function (error, stdout, stderr) {
            
            numberOfRunningProcesses--;
            
            if (error) {
                reject(error);
            } else {
                try {
                    resolve(JSON.parse(stdout.replace(/(\r\n|\n|\r)/gm, "")));
                } catch (e) {
                    resolve(stdout.replace(/(\r\n|\n|\r)/gm, ""));
                } 
            }
        });
    });
}

function getArguments(args) {
    if (args == undefined) return '';

    if (!(args instanceof Array)) args = [args];

    var result = [];

    args.forEach(function (arg) {
        var str = "'" + arg + "'";

        console.log();
        if (typeof (arg) != 'string') {

            str = JSON.stringify(arg);
        } 
        result.push(str);
    });

    return result.join();
}