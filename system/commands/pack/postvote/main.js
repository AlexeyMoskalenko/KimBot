const   UTILS       = require(global.INCLUDEDIR+'utils.js');
const Dictionary    = global.Application.Configs.Dictionary;
const MongoCFG      = global.Application.Configs.Mongo;
const   CRYPTO      = require('crypto');

module.exports = 
function(){
    let sycfuncdatabase = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbsystemfunctions);
        let collectionwaitinput = sycfuncdatabase.collection(MongoCFG.collwaitinput);
    let commandfunctiondatabase = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbcommandfunctions);
        let collection_voteslist =  commandfunctiondatabase.collection(MongoCFG.collvoteslist);

    let CallUser = this.CallMessage.author;
    let CallUserId = CallUser.id;
    let LastMessage = this.CallMessage;
    let LastMessageGuild = LastMessage.guild; 

    LastMessage.delete();

    if (!this.Arguments.length) return this.CallMessage.reply(Dictionary.errors.wronrarg);

    collection_voteslist.findOne({hash : this.Arguments[0]}, (err,res) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#31");
            return LastMessage.reply(errmsg);
        }
        if (!res) return LastMessage.reply("Указанное голосование не найдено.");
        
        const addemoji = (argument) => {
            argument.message.react(argument.Emojies[argument.counter]).then( value => {
                if (argument.counter + 1 !== argument.Emojies.length){
                    argument.counter++;
                    addemoji(argument);
                }
            }).catch(reason => {
                LastMessage.guild.channels.cache.find( ch => ch.id = res.createchid).send("Один из Emoji в голосовании был неверно указан.");
            });
        }

        let VoteChannel = this.CallMessage.channel;
        let VoteMessage = "Голосование!\n" + res.caption;
        let Emojies = res.emoji;
        let counter = 0;

        VoteChannel.send(VoteMessage).then( message => {
            try{
                addemoji({VoteChannel, message, Emojies, counter});
                const filter = (reaction, _) =>{
                    return Emojies.includes(reaction.emoji.name);
                };

                message.awaitReactions(filter, {time: res.duration}).then(collected => {
                    let voteresult = "Результат голосования: " +res.caption + "\n";
                    let resobject = {}
                    message.reactions.cache.forEach( value => {
                        resobject[value.emoji.name] = [];
                        value.users.cache.forEach( user => {
                            if (global.Application.ModuleObjects.DiscordClient.user.id != user.id){ 
                                let member = message.guild.members.cache.find( member => member.id == user.id);
                                resobject[value.emoji.name].push(member.displayName);
                            }
                        });
                    });

                    for (const emojiname in resobject) {
                        let userslist = resobject[emojiname];
                        voteresult += emojiname + "\n```\n";
                        if (userslist.length){
                            voteresult += userslist.join("\n");
                        }
                        else{
                            voteresult += "Ни один из пользователей не проголосовал за данный вариант";
                        }
                        voteresult += "\n```\n";
                    }
                    LastMessageGuild.channels.cache.find( ch => ch.id == res.createchid).send(voteresult);
                    collection_voteslist.findOneAndDelete( {hash : this.Arguments[0]}, (err,res) => {});
                });
            }
            catch{

                // Изменить
                console.log("Error! Message for vote was deleted.");
            }
        });
    });
}