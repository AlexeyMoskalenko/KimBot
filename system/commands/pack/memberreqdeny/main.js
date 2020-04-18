const MongoCFG = global.Application.Configs.Mongo;
const Dictionary    = global.Application.Configs.Dictionary;

module.exports =
function(){
    let database = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbreg); // добавить arg. к MongoClient на релизе
    let collectionlist = database.collection(MongoCFG.collregmemberreq);
    
    // Если аргумент hash отсутствует
    if (!this.Arguments.length) return this.CallMessage.reply(Dictionary.errors.wronrarg);

    collectionlist.findOne({hash: this.Arguments[0]}, (err, document) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#09"); 
            return this.CallMessage.reply(errmsg);
        }
        // Если null - неправильный hash 
        if (document != null){
            collectionlist.deleteOne(document, (_err, _res) => {
                
                if (err){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#10"); 
                    return this.CallMessage.reply(errmsg);
                }
                
                if (_res.result.ok != 1){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#11"); 
                    return this.CallMessage.reply(errmsg);
                }

                let user = this.CallMessage.guild.members.cache.find((value) => {
                    return value.id == document.userid;
                });
                
                // Если найден - находится в канале
                if (user){
                    let replyDMmsg = Dictionary.DM.regdenymsg.replace("#profile", document.profilename);
                    if (this.Arguments[1] !== undefined) {
                        let reason = this.Arguments.slice(1); 
                        reason = reason.join(" ");
                        replyDMmsg += "\nПричина: " + reason;
                    }
                    // Может быть ошибка, по причине закрытых сообщений
                    try{
                        user.send(replyDMmsg);
                        let replymsg = Dictionary.reply.memberreqdeny.replace("#hash", this.Arguments[0]);
                        replymsg += "\n" + Dictionary.additional.reqnotified;
                        this.CallMessage.reply(replymsg);
                    }catch(e){
                        let replymsg = Dictionary.reply.memberreqdeny.replace("#hash", this.Arguments[0]);
                        replymsg += "\n" + Dictionary.additional.reqcloseddm;
                        this.CallMessage.reply(replymsg);
                    }
                }
                else{
                    let replymsg = Dictionary.reply.memberreqdeny.replace("#hash", this.Arguments[0]);
                    replymsg += "\n" + Dictionary.additional.reqnotmember;
                    this.CallMessage.reply(replymsg);
                }
            });
        }
        else return this.CallMessage.reply(Dictionary.errors.memberreqhashnotfound);
    });
    
}