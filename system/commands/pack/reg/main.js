const   Mongo       = require('mongodb').MongoClient;
const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const   MongoCFG    = require(global.MONGODBCFG);
const   Dictionary  = require(global.PROJECTDIR+'botdictionary.json');
const   CRYPTO      = require('crypto');

module.exports =
function(arg, _, aliascommand){
    let database = arg.MongoClient.db(MongoCFG.regdb);
    let collectionlist = database.collection(MongoCFG.collreglist);
    collectionlist.find().toArray((_err, _res)=>{
        if (_err){ 
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#04"); 
            return arg.msg.reply(errmsg);
        }
       
        if (!aliascommand.commandargs.length){
            return arg.msg.reply(Dictionary.errors.wronrarg);
        }
        
        let profilename = _res.find((value, index) => {
            if (value.id == aliascommand.commandargs[0]) return true; 
        });

        if (profilename === undefined){
            return arg.msg.reply(Dictionary.errors.regwrongprofile);
        }
        if (UTILS.msghascertperm(arg.msg, profilename.role)){
            return arg.msg.reply(Dictionary.errors.regalreadyreged);
        }
        let collectionreq = database.collection(MongoCFG.collregreq);

        let document = {
            id: profilename.id,
            profilename: profilename.name,
            role: profilename.role,
            username: arg.msg.author.tag,
            userid: arg.msg.author.id
        }
        
        // Проверка присутствия такой заявки в БД
        collectionreq.find(document).toArray((__err, __res) => {
            if (__err){
                let errmsg = Dictionary.errors.mongodberror.replace("#00", "#05");
                return arg.msg.reply(errmsg);
            }
            // Если вернулось больше записей, чем [] - пустой массив, то ошибка = уже отправлен запрос
            if (__res.length){
                return arg.msg.reply(Dictionary.errors.regalreadyreqd);
            }
            // В ином случае дополняем документ и вставляем запись в бд

            
            let buf = new Buffer.from(JSON.stringify(document)).toString('base64');

            document.hash = CRYPTO.createHash("md5").update(buf).digest('hex').slice(0,6);

            collectionreq.insertOne(document, (___err, ___res) =>{
                if (___err){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#06");
                    return arg.msg.reply(errmsg);
                }
                arg.msg.reply(Dictionary.reply.regsucc);
            })
        });

    });
}
