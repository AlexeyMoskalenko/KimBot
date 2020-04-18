const   UTILS       = require(global.INCLUDEDIR+'utils.js');

const DELIMITER = "--------------------------------------------------------";

const MongoCFG      = global.Application.Configs.Mongo;
const Dictionary    = global.Application.Configs.Dictionary;

module.exports =
function(){
    let database = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbreg);
    let collectionlist = database.collection(MongoCFG.collregmemberreq);

    collectionlist.find().toArray((err,res) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#12"); 
            return this.CallMessage.reply(errmsg);
        }

        let replyphrase = Dictionary.reply.memberreqlist;

        let replylist = [];

        res.forEach(requestelement => {
            let foundmember     = this.CallMessage.guild.members.cache.find(user => user.id == requestelement.userid);

            if (foundmember === undefined)
                requestelement.servername = "!Участник не найден на сервере, удалите его заявку!";
            else
                requestelement.servername = "Имя на сервере: " + foundmember.displayName;

            let newrecord = requestelement.servername                                   + "\n"  +
                            "Запрашиваемое имя: "   + requestelement.requestname        + "\n"  +
                            "Название профиля: "    + requestelement.profilename        + "\n"  +
                            "Хэш заявки: "          + requestelement.hash               + "\n\n"+
                            "ID профиля: "          + requestelement.id                 + "\n"  + 
                            "Выдаваемые роли: "     + requestelement.roles.join(", ")    + "\n"  +
                            "Тэг пользователя: "    + requestelement.username           + "\n"  +
                            "ID пользователяя: "    + requestelement.userid             + "\n"  +
                            DELIMITER;
            replylist.push(newrecord); 
        });

        let requestliststr = undefined;

        if (replylist.length)
            requestliststr =  Dictionary.reply.memberreqfile + "\n" + DELIMITER + "\n" + replylist.join("\n");
        else
            requestliststr = Dictionary.errors.memberreqlistemptylist;
        
        let dat = new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"});
        let datfname = dat; 
        let repl = [":",":",":",","," "];
        repl.forEach(value => {
            datfname = datfname.replace(value, "_");
        });

        let filename = global.MEMBREQUESTSLISTPATH+"requestlist_"+datfname+".txt";
        let filecontent = this.CallMessage.member.displayName+"\n\n" + requestliststr;

        global.Application.Modules.FS.writeFile(filename, filecontent, err => {
            if (err){
                replymsg = "Внимание, лог не был сохранен из-за ошибки!\n";
                this.CallMessage.reply(replymsg);
            }
            else{
                let attachment = new global.Application.Modules.Discord.MessageAttachment(filename);
                this.CallMessage.reply(attachment);
            }
        });

    });
}