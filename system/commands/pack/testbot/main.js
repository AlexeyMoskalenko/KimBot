let Dictionary = require(global.PROJECTDIR+'botdictionary.json');

module.exports= 
function(arg, _, _){
    arg.msg.reply(Dictionary.reply.testbotsucc);
}