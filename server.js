const GLOBAL            = require("./SERVERCONST.js");
const FS                = require("fs");
const Discord           = require('discord.js');
const GM                = require('gm');
const CanvasTool        = require('canvas');
const CommandHandler    = require('./system/commands/entrypoint'); 
var PackageInfo         = require(global.PROJECTDIR+'package.json');

const Client        = new Discord.Client();

let BotConfig = require(global.CONFIGFILE);
global.Additional = BotConfig;

let Dictionary = require(global.PROJECTDIR+'botdictionary.json');

Client.on("ready", () =>{
    console.log("DiscordBot Loaded!");
    Client.user.setPresence({
       status: "online"
    });
});

Client.on("message", msg => {
    if (!msg.guild) return;
    msg.mentions.everyone
    if (msg.mentions.users.keyArray()[0] == Client.user.id){
        var commnadobject = CommandHandler(msg); 
        
        switch(commnadobject.error){
            case 0: // Отсутствие ошибок
                commnadobject.func({msg, Client, Discord});
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