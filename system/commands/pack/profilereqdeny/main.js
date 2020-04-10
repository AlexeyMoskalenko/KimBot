const   MongoCFG    = require(global.MONGODBCFG);
const   Dictionary  = require(global.PROJECTDIR+'botdictionary.json');

// const   Mongo       = require('mongodb').MongoClient; // Удалить на релизе
// const MongoClient   = new Mongo(MongoCFG.url, {useUnifiedTopology: true}); // Удалить на релизе

module.exports =
function(arg, _, aliascommand){
    let database = arg.MongoClient.db(MongoCFG.dbreg); // добавить arg. к MongoClient на релизе
    let collectionlist = database.collection(MongoCFG.collregprofilereq);
    
    // Если аргумент hash отсутствует
    if (!aliascommand.commandargs.length) return arg.msg.reply(Dictionary.errors.wronrarg);

    collectionlist.findOne({hash: aliascommand.commandargs[0]}, (err, document) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#24"); 
            return arg.msg.reply(errmsg);
        }
        // Если null - неправильный hash 
        if (document != null){
            collectionlist.deleteOne(document, (_err, _res) => {
                
                if (err){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#25"); 
                    return arg.msg.reply(errmsg);
                }
                
                if (_res.result.ok != 1){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#26"); 
                    return arg.msg.reply(errmsg);
                }

                let user = arg.msg.guild.members.cache.find((value) => {
                    return value.id == document.userid;
                });
                
                // Если найден - находится в канале
                if (user){
                    let replyDMmsg = Dictionary.DM.regdenymsg.replace("#profile", document.profilename);
                    if (aliascommand.commandargs[1] !== undefined) {
                        let reason = aliascommand.commandargs.slice(1); 
                        reason = reason.join(" ");
                        replyDMmsg += "\nПричина: " + reason;
                    }
                    // Может быть ошибка, по причине закрытых сообщений
                    try{
                        user.send(replyDMmsg);
                        let replymsg = Dictionary.reply.reqdeny.replace("#hash", aliascommand.commandargs[0]);
                        replymsg += "\n" + Dictionary.additional.reqnotified;
                        arg.msg.reply(replymsg);
                    }catch(e){
                        let replymsg = Dictionary.reply.reqdeny.replace("#hash", aliascommand.commandargs[0]);
                        replymsg += "\n" + Dictionary.additional.reqcloseddm;
                        arg.msg.reply(replymsg);
                    }
                }
                else{
                    let replymsg = Dictionary.reply.reqdeny.replace("#hash", aliascommand.commandargs[0]);
                    replymsg += "\n" + Dictionary.additional.reqnotmember;
                    arg.msg.reply(replymsg);
                }
            });
        }
        else return arg.msg.reply(Dictionary.errors.reqhashnotfound);
    });
    
}