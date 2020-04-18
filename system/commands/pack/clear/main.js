const Dictionary    = global.Application.Configs.Dictionary;

module.exports = 
function(){
    if (!(this.Arguments.length && parseInt(this.Arguments[0])))
        return this.CallMessage.reply(Dictionary.errors.wronrarg); 
    if (this.Arguments[0] > 0 && this.Arguments[0] <= 100){
        this.CallMessage.channel.bulkDelete(this.Arguments[0]).then( () => { 
            this.CallMessage.channel.send(Dictionary.reply.clearsucc).then( message =>{
                message.delete({ timeout: 5000});
            });
        })
    }
    else{
        this.CallMessage.reply(Dictionary.errors.clearwrongnum);
    }
}