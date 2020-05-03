const   MongoCFG    = global.Application.Configs.Mongo;
const Dictionary    = global.Application.Configs.Dictionary;

const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const   CRYPTO      = require('crypto');

module.exports =
function(){
    let SystemFunctionsDatabase = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbsystemfunctions);
        let WaitInputCollection = SystemFunctionsDatabase.collection(MongoCFG.collwaitinput);
    let RegistrationDatabase = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbreg);
        let MemberRegistrationProfilesListCollection = RegistrationDatabase.collection(MongoCFG.collregmemberlist);
        let MemberRegistrationRequestsCollection = RegistrationDatabase.collection(MongoCFG.collregmemberreq);

        // Проверка присутствия такой заявки в БД
    MemberRegistrationRequestsCollection.find({userid: this.CallMessage.author.id}).toArray((err, RegistrationRequest) => {
        if (err)
            return this.CallMessage.reply(Dictionary.errors.mongodberror.replace("#00", "#101"));
        
            // Если вернулось больше записей, чем [] - пустой массив, то ошибка = уже отправлен запрос
        if (RegistrationRequest.length){
            return this.CallMessage.reply(Dictionary.errors.memberregalreadyreqd);
        }

        const User      = this.CallMessage.author;
        const UserId    = this.CallMessage.author.id;
        var LastMessage = this.CallMessage;

        MemberRegistrationProfilesListCollection.find().toArray()
        .then( MemberProfilesList => {
            if (!MemberProfilesList) return LastMessage.reply(Dictionary.errors.mongodberror.replace("#00", "#102"));
            
            let filter = (value) => { 
                if (value.author.id != UserId) return false;
                return true;
            };
            
            UTILS.makeinputwait(WaitInputCollection, UserId);
    
            // Начало ввода
            LastMessage.reply(Dictionary.nononecallcom.memberregfio); 
            const MessageCollector = LastMessage.channel.createMessageCollector(filter, {time: 30000});
            let CommandArguments = [];

            MessageCollector.on("collect", NewMessage => {
                MessageCollector.resetTimer({time: 30000});
                LastMessage = NewMessage;
                switch(CommandArguments.length){
                    case 0:
                        let replylist = [];
                        MemberProfilesList.forEach((NewMessage,index)=>{
                            replylist.push("ID: " + NewMessage.id + "\t| "+ NewMessage.name);
                        });
                        if (!replylist.length){ 
                            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#03");
                            return LastMessage.reply(errmsg);
                        }
                        let replymsg = Dictionary.nononecallcom.memberregpofid+ "```\n" + replylist.join("\n") + "\n```"; 
                        LastMessage.reply(replymsg);
                        CommandArguments.push(NewMessage.content);
                    break;
                    default:
                        if (MemberProfilesList.find(v => v.id === NewMessage.content)){
                            CommandArguments.push(NewMessage.content);
                            MessageCollector.stop();
                        }
                        else{
                            this.CallMessage.reply(Dictionary.errors.memberregwrongid);
                        }
                    break;
                }
            });
            MessageCollector.on("end", _ =>{
                
                UTILS.cancelinputwait(WaitInputCollection, UserId);
    
                if (CommandArguments.length < 2) return LastMessage.reply(Dictionary.errors.memberregtoolong);
    
                MemberRegistrationProfilesListCollection.findOne({id: CommandArguments[1]},(___err, memberprofile) => {
                    if (___err){ 
                        let errmsg = Dictionary.errors.mongodberror.replace("#00", "#04");
                        return LastMessage.reply(errmsg);
                    }
                    if (!memberprofile) return LastMessage.reply(Dictionary.errors.memberregwrongid);
                    /////
                    
                    let document = {
                        id: memberprofile.id,
                        requestname: CommandArguments[0],
                        profilename: memberprofile.name,
                        roles: memberprofile.roles,
                        username: User.tag,
                        userid: User.id
                    }
    
                    let buf = new Buffer.from(JSON.stringify(document)).toString('base64');
    
                    document.hash = CRYPTO.createHash("md5").update(buf).digest('hex').slice(0,6);
    
                    MemberRegistrationRequestsCollection.insertOne(document, (___err, ___res) =>{
                        
                        if (___err){
                            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#05");
                            return LastMessage.reply(errmsg);
                        }
                        LastMessage.reply(Dictionary.reply.memberreg);
                    })
                }); 
            });
        })
        .catch( error => {

        });
    });
}
