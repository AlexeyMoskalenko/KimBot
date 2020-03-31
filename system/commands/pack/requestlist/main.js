const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const   MongoCFG    = require(global.MONGODBCFG);
const   Dictionary  = require(global.PROJECTDIR+'botdictionary.json');
//const   Mongo       = require('mongodb').MongoClient; // Удалить на релизе
//const MongoClient   = new Mongo(MongoCFG.url, {useUnifiedTopology: true}); // Удалить на релизе

module.exports =
function(arg, name, aliascommand){
    let database = arg.MongoClient.db(MongoCFG.regdb); // добавить arg. к MongoClient на релизе
    let collectionlist = database.collection(MongoCFG.collregreq);
    collectionlist.find().toArray((err,res) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#07"); 
            return arg.msg.reply(errmsg);
        }
        
        let memberslist = arg.msg.guild.members.cache; 
        let replylist = ["\nДля приёма заявки: ReqAccept (Хэш) | Отказ: ReqDeny (Хэш)\nСписок заявок на регистрацию: "];
            // let document = {
            //     id: profilename.id,
            //     profilename: profilename.name,
            //     role: profilename.role,
            //     username: arg.msg.author.tag,
            //     userid: arg.msg.author.id
            // }
        res.forEach(element =>{
            let found   = memberslist.find(user => user.id == element.userid);
            //console.log(found);
            let requestelement = element;
            if (found === undefined) requestelement.servername = false
            else{
                if (found.nickname == null) requestelement.servername = found.user.username;
                else requestelement.servername = found.nickname;
            }
            let servername = requestelement.servername ? 
                                ("Имя на сервере: " + requestelement.servername) : 
                                ("!Участник не найден на сервере, удалите его заявку!");
            let newrecord = "------------------------------------------------------\n" +
                            servername + "\n" +
                            "Название профиля: "+ requestelement.profilename    + "\n" +
                            "Хэш заявки: "      + requestelement.hash           + "\n";
            if (aliascommand.commandargs.length && aliascommand.commandargs[0] == "ext"){
            newrecord +=    "\n" +
                            "ID профиля: "        + requestelement.id             + "\n" + 
                            "Выдаваемя роль: "  + requestelement.role           + "\n" +
                            "Тэг пользователя: "+ requestelement.username       + "\n" +
                            "ID пользователяя: "  + requestelement.userid + "\n";
            }
            replylist.push(newrecord);
        });
        if (replylist.length == 1) replylist = ["Список заявок пуст."];
        let replymsg = replylist.join("\n");
        arg.msg.reply(replymsg);
    });
}