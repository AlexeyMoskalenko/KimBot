const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const MongoCFG      = global.Application.Configs.Mongo;
const Dictionary    = global.Application.Configs.Dictionary;
const   CRYPTO      = require('crypto');

module.exports = 
function(){
    let sycfuncdatabase = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbsystemfunctions);
        let collectionwaitinput = sycfuncdatabase.collection(MongoCFG.collwaitinput);
    let commandfunctiondatabase = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbcommandfunctions);
        let collection_voteslist =  commandfunctiondatabase.collection(MongoCFG.collvoteslist);
    

    let CallUser = this.CallMessage.author;
    let CallUserId = CallUser.id;
    let CommandMessage = this.CallMessage; 

    let filter = (value) => { 
        if (value.author.id != CallUserId) return false;
        return true;
    };

    const collector = CommandMessage.channel.createMessageCollector(filter, {time: 30000});
    let commandarguments = [];

    UTILS.makeinputwait(collectionwaitinput, CallUserId);

    CommandMessage.reply("Введите название голосования.");

    collector.on("collect", value => {
        collector.resetTimer({time: 30000});
        commandarguments.push(value);
        switch(commandarguments.length){
            case 1:
                value.reply("Введите все Emoji для голосования через пробел.");
            break;
            case 2:
                value.reply("Введите длительность голосования в секундах.");
            break;
            default:
                collector.stop();
            break;
        }
    });
    collector.on("end", result => {
        UTILS.cancelinputwait(collectionwaitinput, CallUserId);
        if (commandarguments.length < 3)
            return CommandMessage.reply(Dictionary.errors.createvotetoolong);
            
        let Votename    = commandarguments[0].content;
        let Emojies     = commandarguments[1].content
                            .split(" ")
                            .filter( value => value !== "")
                            .map( value => value.trim());
        let VoteDuration    = parseInt(commandarguments[2].content);
        if (!Emojies.length) return CommandMessage.reply("Указан неверный формат в списке Emoji.");
        if (!VoteDuration || VoteDuration < 1) return CommandMessage.reply("Указано неверное время голосования.");

        VoteDuration = VoteDuration * 1000;
        let document = {
            caption : Votename,
            emoji: Emojies,
            duration : VoteDuration,
            createchid: CommandMessage.channel.id
        }

        let buf = new Buffer.from(JSON.stringify(document)).toString('base64');
        document.hash = CRYPTO.createHash("md5").update(buf).digest('hex').slice(0,6);
        
        collection_voteslist.insertOne(document, (err,res) =>{
            if (err){
                let errmsg = Dictionary.errors.mongodberror.replace("#00", "#30");
                return CommandMessage.reply(errmsg);
            }
            CommandMessage.reply(
                "Голосование было успешно создано.\nДля его размещения в любом чате введите `!PostVote #HASH`"
                .replace("#HASH",document.hash)
            );
        });
    });
}