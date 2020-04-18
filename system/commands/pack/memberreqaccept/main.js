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
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#06"); 
            return this.CallMessage.reply(errmsg);
        }
        // Если null - неправильный hash 
        if (document != null){
            // Если пользователь вышел из сервера
            let foundmember     = this.CallMessage.guild.members.cache.find(user => user.id == document.userid);
            if (foundmember === undefined) return this.CallMessage.reply(Dictionary.errors.memberreqaccnotmember);

            let findedroles = [];
            for(let it in document.roles){
                let role = document.roles[it];
                let findrole = this.CallMessage.guild.roles.cache.find( value => {
                    return value.name == role;
                });
                if (findrole === undefined) return this.CallMessage.reply(Dictionary.errors.memberreqaccrolenotfound.replace("#ROLE", role))
                findedroles.push(findrole);
            }

            collectionlist.deleteOne(document, (_err, _res) => {
                
                if (err){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#07"); 
                    return this.CallMessage.reply(errmsg);
                }
                
                if (_res.result.ok != 1){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#08"); 
                    return this.CallMessage.reply(errmsg);
                }

                let user = this.CallMessage.guild.members.cache.find((value) => {
                    return value.id == document.userid;
                });
                
                // Если найден - находится в канале
                if (user){
                    let replyDMmsg = Dictionary.DM.regaccmsg.replace("#profile", document.profilename);
                    findedroles.forEach( role => user.roles.add(role));
                    user.roles.remove(this.CallMessage.guild.roles.cache.find(r => r.name == "NotRegistered"));
                    user.setNickname(document.requestname).catch(reason =>{
                        console.log(reason);
                    });
                    // Может быть ошибка, по причине закрытых сообщений
                    try{
                        user.send(replyDMmsg);
                        let replymsg = Dictionary.reply.memberreqacc.replace("#hash", this.Arguments[0]);
                        replymsg += "\n" + Dictionary.additional.reqnotified;
                        this.CallMessage.reply(replymsg);
                    }catch(e){
                        let replymsg = Dictionary.reply.memberreqacc.replace("#hash", this.Arguments[0]);
                        replymsg += "\n" + Dictionary.additional.reqcloseddm;
                        this.CallMessage.reply(replymsg);
                    }
                }
                else{
                    let replymsg = Dictionary.reply.memberreqacc.replace("#hash", this.Arguments[0]);
                    replymsg += "\n" + Dictionary.additional.reqnotmember;
                    this.CallMessage.reply(replymsg);
                }
            });
        }
        else return this.CallMessage.reply(Dictionary.errors.memberreqhashnotfound);
    });
}