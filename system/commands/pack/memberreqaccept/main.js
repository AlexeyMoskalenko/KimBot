const MongoCFG = global.Application.Configs.Mongo;
const Dictionary    = global.Application.Configs.Dictionary;

module.exports =
function(){
    let RegistrationDatabase = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbreg); // добавить arg. к MongoClient на релизе
    let MemberRegistrationRequestsCollection = RegistrationDatabase.collection(MongoCFG.collregmemberreq);
    
    // Если аргумент hash отсутствует
    if (!this.Arguments.length) return this.CallMessage.reply(Dictionary.errors.wronrarg);

    MemberRegistrationRequestsCollection.findOne({hash: this.Arguments[0]}, (err, MemberRegistrationRequest) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#06"); 
            return this.CallMessage.reply(errmsg);
        }
        // Если null - неправильный hash 
        if (MemberRegistrationRequest){
            // Если пользователь вышел из сервера
            let RequestCreatorAsMember     = this.CallMessage.guild.members.cache.find(user => user.id == MemberRegistrationRequest.userid);
            if (!RequestCreatorAsMember) return this.CallMessage.reply(Dictionary.errors.memberreqaccnotmember);

            let findedroles = [];
            for(let it in MemberRegistrationRequest.roles){
                let role = MemberRegistrationRequest.roles[it];
                let findrole = this.CallMessage.guild.roles.cache.find( value => {
                    return value.name == role;
                });
                if (findrole === undefined) return this.CallMessage.reply(Dictionary.errors.memberreqaccrolenotfound.replace("#ROLE", role))
                findedroles.push(findrole);
            }

            MemberRegistrationRequestsCollection.deleteOne(MemberRegistrationRequest, (_err, _res) => {
                
                if (err){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#07"); 
                    return this.CallMessage.reply(errmsg);
                }
                
                if (_res.result.ok != 1){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#08"); 
                    return this.CallMessage.reply(errmsg);
                }
                
                // Если найден - находится в канале
                if (RequestCreatorAsMember){
                    let replyDMmsg = Dictionary.DM.regaccmsg.replace("#profile", MemberRegistrationRequest.profilename);
                    findedroles.forEach( role => RequestCreatorAsMember.roles.add(role));
                    RequestCreatorAsMember.roles.remove(this.CallMessage.guild.roles.cache.find(r => r.name == "NotRegistered"));
                    RequestCreatorAsMember.setNickname(MemberRegistrationRequest.requestname).catch(reason =>{
                        console.log(reason);
                    });
                    // Может быть ошибка, по причине закрытых сообщений
                    try{
                        RequestCreatorAsMember.send(replyDMmsg);
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