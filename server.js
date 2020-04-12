require("./SERVERCONST.js");
var PackageInfo         = require(global.PROJECTDIR+'package.json');
const   MongoCFG        = require(global.MONGODBCFG);
let Dictionary          = require(global.PROJECTDIR+'botdictionary.json');
let BotConfig           = require(global.CONFIGFILE);
let RuntimeCFG          = require(global.PROJECTDIR+'runtimechangingsettings.json');

global.Additional = BotConfig;

const FS                = require("fs");
const Discord           = require('discord.js'); 
const Mongo             = require('mongodb').MongoClient;
const CommandHandler    = require('./system/commands/entrypoint');

const MongoClient       = new Mongo(MongoCFG.url, {useUnifiedTopology: true});
const Client            = new Discord.Client();

let sysfuncdatabase = undefined;
let collection_regwaitinput = undefined;

Client.on("ready", () =>{
    console.log("DiscordBot Loaded!");
    Client.user.setPresence({
       status: "online"
    });
    MongoClient.connect((err, res) => {
        if (err){ 
            console.log("MongoDB can't connect to server!");
            process.exit(1);
        }
        sysfuncdatabase         = MongoClient.db(MongoCFG.dbsystemfunctions);
        collection_regwaitinput = sysfuncdatabase.collection(MongoCFG.collwaitinput);
    });
});

Client.on("guildMemberAdd", member => {
    member.roles.add(
        member.guild.roles.cache.find(value => {
            return value.name == "NotRegistered";
        })
    ).then(value =>{
        let BotAsMember = member.guild.members.cache.find( mem => mem.id == Client.user.id);
        let BotName = BotAsMember.displayName;
        let WelcomeMessage = Dictionary.events.onjoin.replace("#SIGN", BotConfig.commandsign).replace("#MENTION", BotName).replace("#SIGN",BotConfig.commandsign);
        let chanel = member.guild.channels.cache.get(RuntimeCFG.GuestChannelID).send(`<@!${member.id}> `+ WelcomeMessage);
    });
});


Client.on("message", msg => {
    if (!msg.guild) return;
    if (msg.mentions.everyone) return;
    if (msg.author.bot) return;


    // Проверка на реджект от многоуровневой комманды.
    collection_regwaitinput.findOne({userid: msg.author.id}, (err, res) =>{
        if (!res){
            if (msg.mentions.users.keyArray()[0] == Client.user.id){
                var commnadobject = CommandHandler(msg, Client, null);
                switch(commnadobject.error){
                    case 0: // Отсутствие ошибок
                        commnadobject.func({msg, Client, Discord, MongoClient});
                        break;
                    case 1: // Команда не найдена
                        msg.reply(Dictionary.errors.unknowncommand);
                        break;
                    case 2: // У отправителя нет прав. 
                        msg.reply(Dictionary.errors.notenoughperms);
                        break;
                }
            }
        }
    });
});

const Info = require(global.PROJECTDIR+'/system/info.js');
Info({PackageInfo, BotConfig});

Client.login(BotConfig.bottoken);