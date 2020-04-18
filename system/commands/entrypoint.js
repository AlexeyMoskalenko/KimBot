const UTILS = require(`${global.INCLUDEDIR}utils.js`);

let Associations = require(`${global.COMMANDPATH}associations.json`);

function FetchCommand(CommandMessage){
    let ReturnObject = {
        Error : false,
    }
    Associations.some(AssociationsCommandObject => {
        AssociationsCommandObject.aliases.some(CommandAlias => {
            let RegExpCommandWithOutArgs    = new RegExp(global.Application.Configs.Bot.commandsign + CommandAlias + "\\s{0,}$", "i");
            let RegExpCommandWithArgs       = new RegExp(global.Application.Configs.Bot.commandsign + CommandAlias + "\\s{1,}(.{0,})$", "i");
            let MatchCommandWithOutArgs = CommandMessage.content.match(RegExpCommandWithOutArgs);
            let MatchCommandWithArgs    = CommandMessage.content.match(RegExpCommandWithArgs);

            if (MatchCommandWithOutArgs || MatchCommandWithArgs){
                if (UTILS.msghasleastperms(CommandMessage, AssociationsCommandObject.permissions)){
                    let CommandArguments = [];
                    if (MatchCommandWithArgs){
                        let StrOnlyArguments = MatchCommandWithArgs.slice(1)[0];
                        CommandArguments = StrOnlyArguments.split(" ");
                        CommandArguments = CommandArguments.filter((value)=>{
                            return value;
                        });
                    }
                    ReturnObject.CallMessage        = CommandMessage;
                    ReturnObject.AssociationsObject = AssociationsCommandObject;
                    ReturnObject.Arguments          = CommandArguments;
                    ReturnObject.CurrentAlias       = CommandAlias;
                    ReturnObject.method             = require(global.COMMANDPACKPATH + AssociationsCommandObject.cmdfolder + "/main.js");
                    ReturnObject.Error = 0;
                    return;
                }
                else{
                    // У отправителя нет прав на комманду.
                    ReturnObject.Error = 2;
                    return;
                }
            }
            if (ReturnObject.Error !== false)  return true; // Прерывание на основе some
        })
        if (ReturnObject.Error !== false)  return true; // Прерывание на основе some
    });
    
    // Если за все итерации Error стейт не изменился - команда была не найдена
    if (ReturnObject.Error === false) ReturnObject.Error = 1;

    // Таким образом, false никогда не будет возвращён
    return ReturnObject;
}

module.exports = FetchCommand;