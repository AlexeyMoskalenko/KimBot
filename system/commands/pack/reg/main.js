const   Mongo       = require('mongodb').MongoClient;
const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const   MongoCFG    = require(global.MONGODBCFG);
const   Dictionary  = require(global.PROJECTDIR+'botdictionary.json');

const   MongoClient = new Mongo(MongoCFG.url, {useUnifiedTopology: true});

module.exports =
function(arg, name, aliascommand){
    MongoClient.connect((err, res) => {
        if (err){ 
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#03"); 
            return arg.msg.reply(errmsg);
        }
        let database = MongoClient.db(MongoCFG.regdb);
        let collectionlist = database.collection(MongoCFG.collreglist);
        collectionlist.find().toArray((_err, _res)=>{
            if (_err){ 
                let errmsg = Dictionary.errors.mongodberror.replace("#00", "#04"); 
                return arg.msg.reply(errmsg);
            }
            let msgsrc = arg.msg.content.slice(arg.msg.content.search(name)+name.length, arg.msg.content.length);
            let commandargs = msgsrc.split(" ");
            if (commandargs.length < 1) return arg.msg.reply(Dictionary.errors.wronrarg);
            
            let profilename = _res.find((value, index) => {
                if (value.id == commandargs[0]) return true; 
            });

            if (profilename === undefined) return arg.msg.reply(Dictionary.errors.regwrongprofile);

            if (UTILS.msghascertperm(arg.msg, profilename.role)) return arg.msg.reply(Dictionary.errors.regalreadyreged);

            let collectionreq = database.collection(MongoCFG.collregreq);

            let document = {
                id: profilename.id,
                profilename: profilename.name,
                role: role,
                username: arg.msg.author.tag,
                userid: msg.author.id
            }
            
            // Проверка присутствия такой заявки в БД
            collectionreq.find(document).toArray((__err, __res) => {
                if (__err){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#05");
                    return arg.msg.reply(errmsg);
                }
                // Если вернулось больше записей, чем [] - пустой массив, то ошибка = уже отправлен запрос
                if (__res.length) return arg.msg.reply(Dictionary.errors.regalreadyreqd);
                
                // В ином случае вставляем запись в бд
                collectionreq.insertOne(document, (___err, ___res) =>{
                    if (___err){
                        let errmsg = Dictionary.errors.mongodberror.replace("#00", "#05");
                        return arg.msg.reply(errmsg);
                    }
                    arg.reply.msg(Dictionary.reply.regsucc);
                })
            });

        });
    });
}
