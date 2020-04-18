const   MongoCFG    = global.Application.Configs.Mongo;
const Dictionary    = global.Application.Configs.Dictionary;

const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const   CRYPTO      = require('crypto');

// ReturnObject.CallMessage        = CommandMessage;
// ReturnObject.AssociationsObject = AssociationsCommandObject;
// ReturnObject.Arguments          = CommandArguments;
// ReturnObject.CurrentAlias       = CommandAlias;


module.exports =
function(){
    let sycfuncdatabase = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbsystemfunctions);
        let collectionwaitinput = sycfuncdatabase.collection(MongoCFG.collwaitinput);
    let regdatabase = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbreg);
        let collectionmemberlist = regdatabase.collection(MongoCFG.collregmemberlist);
        let collectionmemberreq = regdatabase.collection(MongoCFG.collregmemberreq);

        // Проверка присутствия такой заявки в БД
    collectionmemberreq.find({userid: this.CallMessage.author.id}).toArray((__err, __res) => {
        if (__err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#01");
            return this.CallMessage.reply(errmsg);
        }
        // Если вернулось больше записей, чем [] - пустой массив, то ошибка = уже отправлен запрос
        if (__res.length){
            return this.CallMessage.reply(Dictionary.errors.memberregalreadyreqd);
        }

        const User      = this.CallMessage.author;
        const UserId    = this.CallMessage.author.id;
        var LastMessage = this.CallMessage;

        let filter = (value) => { 
            if (value.author.id != UserId) return false;
            return true;
        };

        UTILS.makeinputwait(collectionwaitinput, UserId);

        // Начало ввода
        LastMessage.reply(Dictionary.nononecallcom.memberregfio); 
        const collector = LastMessage.channel.createMessageCollector(filter, {time: 30000});
        let commandarguments = [];

        collector.on("collect", value => {
            collector.resetTimer({time: 30000});
            commandarguments.push(value.content);
            LastMessage = value;
            switch(commandarguments.length){
                case 1:
                    collectionmemberlist.find().toArray((err, res)=>{
                        if (err){ 
                            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#02");
                            return LastMessage.reply(errmsg);
                        }
                        let replylist = [];
                        res.forEach((value,index)=>{
                            replylist.push("ID: " + value.id + "\t| "+ value.name);
                        });
                        if (!replylist.length){ 
                            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#03");
                            return LastMessage.reply(errmsg);
                        }
                        let replymsg = Dictionary.nononecallcom.memberregpofid+ "```\n" + replylist.join("\n") + "\n```"; 
                        LastMessage.reply(replymsg);
                    });
                break;
                default:
                    collector.stop();
            }
        });
        collector.on("end", res =>{
            
            UTILS.cancelinputwait(collectionwaitinput, UserId);

            if (commandarguments.length < 2) return LastMessage.reply(Dictionary.errors.memberregtoolong);

            collectionmemberlist.findOne({id: commandarguments[1]},(___err, memberprofile) => {
                if (___err){ 
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#04");
                    return LastMessage.reply(errmsg);
                }
                if (!memberprofile) return LastMessage.reply(Dictionary.errors.memberregwrongid);
                /////
                
                let document = {
                    id: memberprofile.id,
                    requestname: commandarguments[0],
                    profilename: memberprofile.name,
                    roles: memberprofile.roles,
                    username: User.tag,
                    userid: User.id
                }

                let buf = new Buffer.from(JSON.stringify(document)).toString('base64');

                document.hash = CRYPTO.createHash("md5").update(buf).digest('hex').slice(0,6);

                collectionmemberreq.insertOne(document, (___err, ___res) =>{
                    
                    if (___err){
                        let errmsg = Dictionary.errors.mongodberror.replace("#00", "#05");
                        return LastMessage.reply(errmsg);
                    }
                    LastMessage.reply(Dictionary.reply.memberreg);
                })
            }); 
        });            
    });
}
