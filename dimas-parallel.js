var child = require('child_process');
var Promise = require('promise');

module.exports = {
    execute : execute
}


function execute(func, args) {
    return new Promise(function(resolve, reject) {

        var arguments = getArguments(args);
        var newConsoleCommand = 'WriteToConsole_' + Math.random().toString().replace('.','');
        var replaceConsoleCommand = 'var ' + newConsoleCommand + ' = console.log; console.log = function () {};';
        var funcCommand = func.toString().replace(/(\r\n|\n|\r)/gm, "");
        var outputCommand = newConsoleCommand + '(' + func.name + '(' + arguments + '));';
        var command = 'node -e "' + replaceConsoleCommand + ' ' + funcCommand + ' ' + outputCommand;

        child.exec(command, function (error, stdout, stderr) {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(stdout.replace(/(\r\n|\n|\r)/gm, "")));
                }
            });
    });
}


function getArguments(args) {
    if (!args) return '';

    var result = [];

    args.forEach(function (arg) {
        var str = JSON.stringify(arg);
        result.push(str);
    });

    return result.join();
}