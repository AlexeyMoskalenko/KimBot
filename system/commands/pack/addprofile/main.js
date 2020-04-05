let     Dictionary  = require(global.PROJECTDIR+'botdictionary.json');
let     MongoCFG    = require(global.PROJECTDIR+'mongodbcfg.json');

const MongoC = require('mongodb').MongoClient;
const assert = require('assert');

const MongoClient = new MongoC(url,{useUnifiedTopology: true});


module.exports = 
function(arg, _, aliascommand){

    if (!aliascommand.commandargs.length) return arg.msg.reply(Dictionary.erors.wronrarg);

    let database    = MongoClient.db(MongoCFG.regdb);
    let collection  = database.collection(MongoCFG.collreglist);

    try{
        let jsonstr = aliascommand.commandargs.join(" ");
        let insertobject = JSON.parse(jsonstr);

        if (Array.isArray(insertobject)){
            let iswrongobject = insertobject.some(value => {
                if (value.name === undefined ||
                    value.id === undefined || 
                    value.role === undefined) return true;
            });
            if (iswrongobject)
                return arg.msg.reply(Dictionary.errors.addprofileobjerr);
            collection.insertMany(insertobject, (err, res) =>{
                if (err){ 
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#16");
                    return arg.msg.reply(errmsg);
                }
                arg.msg.reply(Dictionary.errors.addprofsuccarr);
            });
        }
        else{
            if (value.name === undefined ||
                value.id === undefined || 
                value.role === undefined) 
                return arg.msg.reply(Dictionary.errors.addprofileobjerr);
            collection.insertMany(insertobject, (err, res) =>{
                if (err){ 
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#16");
                    return arg.msg.reply(errmsg);
                }
                arg.msg.reply(Dictionary.errors.addprofsuccone);
            });
        }
    }catch(e){
        arg.msg.reply(Dictionary.errors.addprofileparserr);
    }
};