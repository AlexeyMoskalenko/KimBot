const   Mongo       = require('mongodb').MongoClient;
const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const   MongoCFG    = require(global.MONGODBCFG);
const   Dictionary  = require(global.PROJECTDIR+'botdictionary.json');
const   CRYPTO      = require('crypto');


module.exports =
function(arg, comname, aliascommand, continuecom){
    let sycfuncdatabase = arg.MongoClient.db(MongoCFG.dbsystemfunctions);
        let collectionwaitinput = sycfuncdatabase.collection(MongoCFG.collwaitinput);
    let regdatabase = arg.MongoClient.db(MongoCFG.dbreg);
        let collectionmemberlist = regdatabase.collection(MongoCFG.collregmemberlist);
        let collectionmemberreq = regdatabase.collection(MongoCFG.collregmemberreq);

        // Проверка присутствия такой заявки в БД
    collectionmemberreq.find({userid: arg.msg.author.id}).toArray((__err, __res) => {
        if (__err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#01");
            return arg.msg.reply(errmsg);
        }
        // Если вернулось больше записей, чем [] - пустой массив, то ошибка = уже отправлен запрос
        if (__res.length){
            return arg.msg.reply(Dictionary.errors.memberregalreadyreqd);
        }

        const User = arg.msg.author;
        const UserId = arg.msg.author.id;
        var LastMessage = arg.msg;

        let filter = (value) => { 
            if (value.author.id != UserId) return false;
            return true;
        };

        // Добавление в пул для реджекта на этапе входа в ивент message.
        collectionwaitinput.insertOne({userid: arg.msg.author.id}, (err,res) => {
            console.log(err);
        });
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
            
            collectionwaitinput.findOneAndDelete({userid: LastMessage.author.id});

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
                    role: memberprofile.role,
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
