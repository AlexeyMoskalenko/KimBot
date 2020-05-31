const Dictionary    = global.Application.Configs.Dictionary;
const MongoCFG      = global.Application.Configs.Mongo;

module.exports = 
function(){
    let fchanel = this.CallMessage.guild.channels.cache.find(chanel =>
        chanel.members.find(member => chanel.type == "voice" && member.id == this.CallMessage.author.id)
    );
    
    if (fchanel !== undefined){ 
        let fchanelusers = [Dictionary.reply.userslist, "```"];
        fchanel.members.forEach(user =>{
            fchanelusers.push(user.displayName);
        });
        fchanelusers.push("```");
        let replymsg = fchanelusers.join("\n");

        let dat = new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"});
        let datfname = dat; 
        let repl = [":",":",":",","," "];
        repl.forEach(value => {
            datfname = datfname.replace(value, "_");
        });

        let filename = global.USERSLISTSPATH+"userslist_"+datfname+".txt";
        let filecontent = this.CallMessage.member.displayName+"\n\n" + fchanelusers.slice(1).join("\n");

        global.Application.Modules.FS.writeFile(filename, filecontent, err => {
            if (err){
                replymsg = "Внимание, лог не был сохранен из-за ошибки!\n" + replymsg;
                this.CallMessage.reply(replymsg);
            }
            else{
                let attachment = new global.Application.Modules.Discord.MessageAttachment(filename);
                this.CallMessage.reply(replymsg, attachment);
            }
        });
    }
    else this.CallMessage.reply(Dictionary.errors.userslistnotvoicech);
}