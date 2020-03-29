let Dictionary = require(global.PROJECTDIR+'botdictionary.json');

module.exports = 
function(arg, name, _){
    let msgsrc = arg.msg.content.slice(arg.msg.content.search(name)+name.length, arg.msg.content.length);
    let commandargs = msgsrc.split(" ");
    commandargs = commandargs.filter((el)=>{
        return parseInt(el);
    });
    if (commandargs.length < 1) return arg.msg.reply(Dictionary.errors.wronrarg); 
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