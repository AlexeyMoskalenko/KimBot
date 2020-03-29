let Dictionary = require(global.PROJECTDIR+'botdictionary.json');

module.exports = 
function(arg, name, _){
    const regexargidprof = new RegExp("\\b\\d{1,3}\\b", "i");
    let commandargs = arg.msg.content.match(regexargidprof);
    // match вернёт null, если нет совпадений
    if (!commandargs) return arg.msg.reply(Dictionary.errors.wronrarg); 
    if (commandargs[0] > 0 && commandargs[0] <= 100){
        arg.msg.channel.bulkDelete(commandargs[0]).then( () => { 
            arg.msg.channel.send(Dictionary.reply.clearsucc).then( message =>{
                message.delete({ timeout: 5000});
            });
        })
    }
    else{
        arg.msg.reply(Dictionary.errors.clearwrongnum);
    }
}