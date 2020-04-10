const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const   MongoCFG    = require(global.MONGODBCFG);
const   Dictionary  = require(global.PROJECTDIR+'botdictionary.json');

const PAGESIZE = 8

module.exports =
function(arg, name, aliascommand){
    let database = arg.MongoClient.db(MongoCFG.dbreg);
    let collectionlist = database.collection(MongoCFG.collregmemberreq);
    let viewconfig = {
        extended:   aliascommand.commandargs.length && aliascommand.commandargs[1] == "ext" ?
                        true : false,
        page:       aliascommand.commandargs.length && aliascommand.commandargs[0] ?
                        parseInt(aliascommand.commandargs[0]) ? 
                            parseInt(aliascommand.commandargs[0]) - 1 : 0
                        : 0
    }
    collectionlist.find().toArray((err,res) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#14"); 
            return arg.msg.reply(errmsg);
        }

        if (viewconfig.page * 6 > res.length || viewconfig.page < 0) 
            return arg.msg.reply(Dictionary.errors.reqlistpagenotfound);
        
        let replyphrase = Dictionary.reply.reqlistsucc;

        let replylist = [];

        for (let index = viewconfig.page * PAGESIZE; index < res.length && index < (viewconfig.page * PAGESIZE) + PAGESIZE; index++) {
            let requestelement  = res[index];

            let foundmember     = arg.msg.guild.members.cache.find(user => user.id == requestelement.userid);

            if (foundmember === undefined)
                requestelement.servername = "!Участник не найден на сервере, удалите его заявку!";
            else
                requestelement.servername = "Имя на сервере: " + foundmember.displayName;

            let newrecord = "```\n" +
                            requestelement.servername + "\n" +
                            "Запрашиваемое имя: "+ requestelement.requestname    + "\n"  +
                            "Название профиля: "+ requestelement.profilename    + "\n" +
                            "Хэш заявки: "      + requestelement.hash           + "\n";
            if (viewconfig.extended){
            newrecord +=    "\n" +
                            "ID профиля: "        + requestelement.id           + "\n" + 
                            "Выдаваемя роль: "  + requestelement.role           + "\n" +
                            "Тэг пользователя: "+ requestelement.username       + "\n" +
                            "ID пользователяя: "  + requestelement.userid       + "\n" +
                            "```";
            }
            else newrecord += "```"
            replylist.push(newrecord);
        }

        let replymsg = undefined;
        if (replylist.length)
            replymsg =  Dictionary.reply.reqlistsucc
                        .replace("#NINP", viewconfig.page+1)
                        .replace("#NTOT", Math.ceil(res.length/6)) 
                        + replylist.join("\n");
        else
            replymsg = Dictionary.errors.reqlistemptylist;
        arg.msg.reply(replymsg);
    });
}