const   FS          = require('fs');
const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const   MongoCFG    = require(global.MONGODBCFG);
const   Dictionary  = require(global.PROJECTDIR+'botdictionary.json');

const DELIMITER = "--------------------------------------------------------";

module.exports =
function(arg, _, _){
    let database = arg.MongoClient.db(MongoCFG.dbreg);
    let collectionlist = database.collection(MongoCFG.collregmemberreq);

    collectionlist.find().toArray((err,res) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#12"); 
            return arg.msg.reply(errmsg);
        }

        let replyphrase = Dictionary.reply.memberreqlist;

        let replylist = [];

        res.forEach(requestelement => {
            let foundmember     = arg.msg.guild.members.cache.find(user => user.id == requestelement.userid);

            if (foundmember === undefined)
                requestelement.servername = "!Участник не найден на сервере, удалите его заявку!";
            else
                requestelement.servername = "Имя на сервере: " + foundmember.displayName;

            let newrecord = requestelement.servername                           + "\n"  +
                            "Запрашиваемое имя: "+ requestelement.requestname    + "\n"  +
                            "Название профиля: "+ requestelement.profilename    + "\n"  +
                            "Хэш заявки: "      + requestelement.hash           + "\n\n"+
                            "ID профиля: "        + requestelement.id           + "\n"  + 
                            "Выдаваемя роль: "  + requestelement.role           + "\n"  +
                            "Тэг пользователя: "+ requestelement.username       + "\n"  +
                            "ID пользователяя: "  + requestelement.userid       + "\n"  +
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

        let filename = global.REQUESTSLISTPATH+"requestlist_"+datfname+".txt";
        let filecontent = arg.msg.member.displayName+"\n\n" + requestliststr;

        FS.writeFile(filename, filecontent, err => {
            if (err){
                replymsg = "Внимание, лог не был сохранен из-за ошибки!\n";
                arg.msg.reply(replymsg);
            }
            else{
                let attachment = new arg.Discord.MessageAttachment(filename);
                arg.msg.reply(attachment);
            }
        });

    });
}