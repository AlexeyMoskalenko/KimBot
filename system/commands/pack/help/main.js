let CommandsInfo = require('./comlist.json');
const Dictionary    = global.Application.Configs.Dictionary;

module.exports = 
function(){
    let message = Dictionary.reply.helpinfo;
    for(groupname in CommandsInfo){
        let group = CommandsInfo[groupname];
        
        let findsucc = group.roles.some( role => {
            if (
                this.CallMessage.member.roles.cache.find( findrole => findrole.name == role)
            ) return true;
        });
        
        if (findsucc){
            for (commandname in group.commandslist){
                let commanddescription = group.commandslist[commandname];
                message += "\n" + "`" + global.Application.Configs.Bot.commandsign + commandname + "`" +  "   —   " + commanddescription;
            }
        }
    }

    this.CallMessage.reply(message);
}