const FS = require('fs');
const Dictionary    = global.Application.Configs.Dictionary;
let RuntimeCFG = require(RUNTIMECFG);

module.exports = 
function(){
    if (!this.Arguments.length)
        return this.CallMessage.reply(Dictionary.errors.wronrarg);
    
    let groupkey = null;

    for (let key in RuntimeCFG) {
        let group = RuntimeCFG[key];
        if (group.hasOwnProperty(this.Arguments[0])){
            groupkey = key;
            break;
        }
    }
    if (!groupkey) return this.CallMessage.reply(Dictionary.errors.configureruntimenotfound);     

    switch(groupkey){
        case "noargs":
            switch (this.Arguments[0]){
                case "GuestChannelID":
                    RuntimeCFG[groupkey][this.Arguments[0]] = this.CallMessage.channel.id;
                break;
                case "AlertMemberRegChannelID":
                    RuntimeCFG[groupkey][this.Arguments[0]] = this.CallMessage.channel.id;
                break;
            }
        break;
        case "onearg":
            if (this.Arguments.length < 2)
                return this.CallMessage.reply(Dictionary.errors.wronrarg);
            switch(this.Arguments[0]){
                case "AlertMemberRegTimeout":
                    let time = parseInt(this.Arguments[1]);
                    if (!time) return this.CallMessage.reply(Dictionary.errors.wronrarg);
                    RuntimeCFG[groupkey][this.Arguments[0]] = this.Arguments[1];
                break;

            }
        break;
    }

    FS.writeFile(global.PROJECTDIR+'runtimechangingsettings.json', JSON.stringify(RuntimeCFG), function(err) {
        if(err) {
            return this.CallMessage.reply(Dictionary.errors.configureruntimesaveerr);
        }
        this.CallMessage.reply(Dictionary.reply.configureruntime);
    });
}