const UTILS = require(global.INCLUDEDIR+'/utils');

let Associations = require(global.COMMANDPATH+'associations.json');

function fetchcommand(msg, client){
    let retobject = {
        func : null,
        error : false,
    }

    let succ = Associations.some(commandobj => {
        commandobj.aliases.some(commandalias => {
            let regexfoundcommandwithout_args = new RegExp("^<@!{0,1}"+ client.user.id + ">\\s{0,}" + global.Additional.commandsign+commandalias + "\\s{0,}$", "i");
            let regexfoundcommandwith_args = new RegExp("^<@!{0,1}"+ client.user.id + ">\\s{0,}" + global.Additional.commandsign+commandalias + "\\s{1,}(.{0,})$", "i");
            let commwithout_args = msg.content.match(regexfoundcommandwithout_args);
            let commwith_args = msg.content.match(regexfoundcommandwith_args);

            if (commwithout_args || commwith_args){
                if (UTILS.msghasleastperms(msg, commandobj.permissions)){
                    let completeargs = [];
                    if (commwith_args){
                        let onlyargsstr = commwith_args.slice(1)[0];
                        completeargs = onlyargsstr.split(" ");
                        completeargs = completeargs.filter((value)=>{
                            return value;
                        });
                    }
                    retobject.func = function(args){
                        let assoccommand = commandobj;
                        assoccommand.commandargs = completeargs;
                        getfunc = require(global.COMMANDPACKPATH + commandobj.cmdfolder + "/main.js");
                        getfunc(args, commandalias, assoccommand);
                        //аргументы из вызова | название ком-ды | команда из ассоциаций
                    }
                    retobject.error = 0;
                    return;
                }
                else{
                    // У отправителя нет прав на комманду.
                    retobject.error = 2;
                    return;
                }
            }
            if (retobject.error !== false)  return true; // Прерывание на основе some
        })
        if (retobject.error !== false)  return true; // Прерывание на основе some
    });
    
    // Если за все итерации error стейт не изменился - команда была не найдена
    if (retobject.error === false) retobject.error = 1;

    // Таким образом, false никогда не будет возвращён
    return retobject;
}

module.exports = fetchcommand;