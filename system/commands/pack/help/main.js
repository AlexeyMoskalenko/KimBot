let Dictionary = require(global.PROJECTDIR+'botdictionary.json');
let CommandsInfo = require('./comlist.json');

module.exports = 
function(arg, _, _){
    let message = Dictionary.reply.helpinfo;
    
    for (command in CommandsInfo){
        message += "\n" + "`" + global.Additional.commandsign + command + "`" +  "   —   " + CommandsInfo[command];
    }
    arg.msg.reply(message);
}