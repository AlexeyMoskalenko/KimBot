const   FS          = require('fs');
const   Dictionary  = require(global.PROJECTDIR+'botdictionary.json');

module.exports = 
function(arg, _, __){
    let fchanel = arg.msg.guild.channels.cache.find(chanel =>{
        return chanel.members.find(member =>{
            if (chanel.type == "voice" && member.id == arg.msg.author.id) return true;
        })
    });
    
    if (fchanel !== undefined){ 
        let fchanelusers = [Dictionary.reply.userslist];
        fchanel.members.forEach(user =>{
            fchanelusers.push(user.nickname);
        });
        
        let replymsg = fchanelusers.join("\n");

        let dat = new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"});
        let datfname = dat; 
        let repl = [":",":",":",","," "];
        repl.forEach(value => {
            datfname = datfname.replace(value, "_");
        });

        let filename = global.USERSLISTSPATH+"userslist_"+datfname+".txt";
        let filecontent = arg.msg.member.displayName+"\n\n" + fchanelusers.slice(1).join("\n");

        FS.writeFile(filename, filecontent, err => {
            if (err){
                replymsg = "Внимание, лог не был сохранен из-за ошибки!\n" + replymsg;
                arg.msg.reply(replymsg);
            }
            else{
                let attachment = new arg.Discord.MessageAttachment(filename);
                arg.msg.reply(replymsg, attachment);
            }
        });
    }
    else arg.msg.reply(Dictionary.errors.userslistnotvoicech);
}