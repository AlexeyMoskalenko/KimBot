let Dictionary = require(global.PROJECTDIR+'botdictionary.json');

module.exports = 
function(arg, name, aliascommand){
    if (!(aliascommand.commandargs.length && parseInt(aliascommand.commandargs[0])))
        return arg.msg.reply(Dictionary.errors.wronrarg); 
    if (aliascommand.commandargs[0] > 0 && aliascommand.commandargs[0] <= 100){
        arg.msg.channel.bulkDelete(aliascommand.commandargs[0]).then( () => { 
            arg.msg.channel.send(Dictionary.reply.clearsucc).then( message =>{
                message.delete({ timeout: 5000});
            });
        })
    }
    else{
        arg.msg.reply(Dictionary.errors.clearwrongnum);
    }
}