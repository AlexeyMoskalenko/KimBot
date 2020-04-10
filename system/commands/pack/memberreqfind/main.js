const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const   MongoCFG    = require(global.MONGODBCFG);
const   Dictionary  = require(global.PROJECTDIR+'botdictionary.json');

module.exports =
function(arg, name, aliascommand){
    let database = arg.MongoClient.db(MongoCFG.dbreg);
    let collectionlist = database.collection(MongoCFG.collregmemberreq);

    if (!aliascommand.commandargs.length) return arg.msg.reply(Dictionary.errors.wronrarg);

    collectionlist.findOne({hash: aliascommand.commandargs[0]},(err,requestelement) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#13"); 
            return arg.msg.reply(errmsg);
        }
        let replyphrase = Dictionary.reply.reqlistsucc;

        let replymsg = undefined;

        if (requestelement){
            let foundmember     = arg.msg.guild.members.cache.find(user => user.id == requestelement.userid);

            if (foundmember === undefined)
                requestelement.servername = "!Участник не найден на сервере, удалите его заявку!";
            else
                requestelement.servername = "Имя на сервере: " + foundmember.displayName;

            let newrecord = "```\n" +
                            requestelement.servername + "\n" +
                            "Запрашиваемое имя: "+ requestelement.requestname    + "\n"  +
                            "Название профиля: "+ requestelement.profilename    + "\n" +
                            "Хэш заявки: "      + requestelement.hash           + "\n\n" +
                            "ID профиля: "        + requestelement.id           + "\n" + 
                            "Выдаваемя роль: "  + requestelement.role           + "\n" +
                            "Тэг пользователя: "+ requestelement.username       + "\n" +
                            "ID пользователяя: "  + requestelement.userid       + "\n" +
                            "```";
            replymsg =  Dictionary.reply.reqfindsucc + newrecord;
        }
        else
            replymsg = Dictionary.errors.reqfindemptylist;
        
        arg.msg.reply(replymsg);
    });
}