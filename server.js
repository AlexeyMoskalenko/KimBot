require("./SERVERCONST.js");
var PackageInfo         = require(global.PROJECTDIR+'package.json');
const   MongoCFG        = require(global.MONGODBCFG);
let Dictionary          = require(global.PROJECTDIR+'botdictionary.json');
let BotConfig           = require(global.CONFIGFILE);

global.Additional = BotConfig;


const FS                = require("fs");
const Discord           = require('discord.js'); 
const   Mongo           = require('mongodb').MongoClient;
const CommandHandler    = require('./system/commands/entrypoint');

const MongoClient       = new Mongo(MongoCFG.url, {useUnifiedTopology: true});
const Client            = new Discord.Client();

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
    });
});

Client.on("message", msg => {
    if (!msg.guild) return;
    if (msg.mentions.everyone) return;
    if (msg.mentions.users.keyArray()[0] == Client.user.id){
        var commnadobject = CommandHandler(msg, Client);

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
});

const Info = require(global.PROJECTDIR+'/system/info.js');
Info({PackageInfo, BotConfig});

Client.login(BotConfig.bottoken);