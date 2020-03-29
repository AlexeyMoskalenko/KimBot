const   Mongo       = require('mongodb').MongoClient;
const   MongoCFG    = require(global.MONGODBCFG);
let     Dictionary  = require(global.PROJECTDIR+'botdictionary.json');

const   MongoClient = new Mongo(MongoCFG.url, {useUnifiedTopology: true});

module.exports =
function(arg, name, aliascommand){
    MongoClient.connect((err, res) => {
        if (err){ 
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#01"); 
            return arg.msg.reply(errmsg);
        }
        let database = MongoClient.db(MongoCFG.regdb);
        let collection = database.collection(MongoCFG.collreglist);
        collection.find().toArray((err, res)=>{
            if (err){ 
                let errmsg = Dictionary.errors.mongodberror.replace("#00", "#02"); 
                return arg.msg.reply(errmsg);
            }
            let replylist = ["Для регистрации введите Reg (id).\nСписок доступных профилей:"];
            res.forEach((value,index)=>{
                replylist.push("ID: " + value.id + " | "+ value.name);
            });
            if (replylist.length == 1){ 
                let errmsg = Dictionary.errors.mongodberror.replace("#00", "#02"); 
                return arg.msg.reply(errmsg);
            }
            arg.msg.reply(replylist.join("\n"));
        });
    });
}
