const   UTILS       = require(global.INCLUDEDIR+'utils.js');

const MongoCFG = global.Application.Configs.Mongo;

const Dictionary    = global.Application.Configs.Dictionary;

const PAGESIZE = 8

module.exports =
function(){
    let database = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbreg);
    let collectionlist = database.collection(MongoCFG.collregmemberreq);
    let viewconfig = {
        extended:   this.Arguments.length && this.Arguments[1] == "ext" ?
                        true : false,
        page:       this.Arguments.length && this.Arguments[0] ?
                        parseInt(this.Arguments[0]) ? 
                            parseInt(this.Arguments[0]) - 1 : 0
                        : 0
    }
    collectionlist.find().toArray((err,res) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#14"); 
            return this.CallMessage.reply(errmsg);
        }

        if (viewconfig.page * 6 > res.length || viewconfig.page < 0) 
            return this.CallMessage.reply(Dictionary.errors.memberreqlistpagenotfound);

        let replylist = [];

        for (let index = viewconfig.page * PAGESIZE; index < res.length && index < (viewconfig.page * PAGESIZE) + PAGESIZE; index++) {
            let requestelement  = res[index];

            let foundmember     = this.CallMessage.guild.members.cache.find(user => user.id == requestelement.userid);

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
                            "Выдаваемые роли: "  + requestelement.roles.join(", ") + "\n" +
                            "Тэг пользователя: "+ requestelement.username       + "\n" +
                            "ID пользователяя: "  + requestelement.userid       + "\n" +
                            "```";
            }
            else newrecord += "```"
            replylist.push(newrecord);
        }

        let replymsg = undefined;
        if (replylist.length)
            replymsg =  Dictionary.reply.memberreqlist
                        .replace("#NINP", viewconfig.page+1)
                        .replace("#NTOT", Math.ceil(res.length/6)) 
                        + replylist.join("\n");
        else
            replymsg = Dictionary.errors.memberreqlistemptylist;

        this.CallMessage.reply(replymsg);
    });
}