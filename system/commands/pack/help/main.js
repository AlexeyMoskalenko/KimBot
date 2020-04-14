let Dictionary = require(global.PROJECTDIR+'botdictionary.json');
let CommandsInfo = require('./comlist.json');

module.exports = 
function(arg, _, _){
    let message = Dictionary.reply.helpinfo;
    for(groupname in CommandsInfo){
        let group = CommandsInfo[groupname];
        
        let findsucc = group.roles.some( role => {
            if (
                arg.msg.member.roles.cache.find( findrole => findrole.name == role)
            ) return true;
        });
        
        if (findsucc){
            for (commandname in group.commandslist){
                let commanddescription = group.commandslist[commandname];
                message += "\n" + "`" + global.Additional.commandsign + commandname + "`" +  "   —   " + commanddescription;
            }
        }
    }

    arg.msg.reply(message);
}