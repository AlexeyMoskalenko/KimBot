require("./APPCONSTS.js");

global.Application = {};
global.Application.Configs = {};
global.Application.Modules = {};
global.Application.ModuleObjects = {};

const PackageInfo   = require(global.PROJECTDIR+'package.json');
    global.Application.Configs.PackageInfo = PackageInfo;
const BotCFG        = require(global.BOTCFG);
    global.Application.Configs.Bot = BotCFG;
const Dictionary    = require(global.BOTDICTIONARYCFG);
    global.Application.Configs.Dictionary = Dictionary;
const MongoCFG      = require(global.MONGODBCFG);
    global.Application.Configs.Mongo = MongoCFG;
const VKAPICFG      = require(global.VKAPICFG);



const DiscordModule = require('discord.js');
    global.Application.Modules.Discord = DiscordModule;
const FSModule      = require("fs");
    global.Application.Modules.FS = FSModule;
const CyrilicTransformator =  require('cyrillic-to-translit-js');
    global.Application.Modules.CyrilicTransformator = CyrilicTransformator;

const MongoModule = require('mongodb');
    global.Application.Modules.Mongo = MongoModule;

const VKApiModule = new require("./system/vkapiwebserver/webserver");

const DevClient = new DiscordModule.Client();

global.Application.ModuleObjects.DiscordClient  = new DiscordModule.Client();
global.Application.ModuleObjects.MongoClient    = new MongoModule.MongoClient(MongoCFG.url, {useUnifiedTopology: true});

const CommandHandler    = require('./system/commands/entrypoint');

let SystemFunctionsDatabase = undefined;
let RegistrationDatabase    = undefined;

let RegWaitInputCollection  = undefined;

global.Application.ModuleObjects.DiscordClient.on("ready", () =>{
    // const VKApiWebServer = new VKApiModule(80, VKAPICFG);
    // VKApiWebServer.StartServer();

    console.log("DiscordBot Loaded!");
    global.Application.ModuleObjects.DiscordClient.user.setPresence({
       status: "online"
    });
    global.Application.ModuleObjects.MongoClient.connect((err, res) => {
        if (err){ 
            console.log("MongoDB can't connect to server!");
            process.exit(1);
        }
        SystemFunctionsDatabase = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbsystemfunctions);
            RegWaitInputCollection  = SystemFunctionsDatabase.collection(MongoCFG.collwaitinput);
        RegistrationDatabase    = global.Application.ModuleObjects.MongoClient.db(MongoCFG.dbreg);
            MemberRequestsListCollection = RegistrationDatabase.collection(MongoCFG.collregmemberreq);

        
        function AlertMemberRegistration(){
            let RuntimeCFG = require(global.RUNTIMECFG);
            
            let HomeGuild = global.Application.ModuleObjects.DiscordClient.guilds.cache.find( value => value.id == BotCFG.homeguildid);
                if (!HomeGuild) return clearInterval(TimerMemberRegistration);
            let AlertChannel = HomeGuild.channels.cache.find( value => value.id == RuntimeCFG.noargs.AlertMemberRegChannelID);
                if (!AlertChannel) return clearInterval(TimerMemberRegistration);
        
            MemberRequestsListCollection.find().toArray( (err, Document) => {
                if (err) return clearInterval(TimerMemberRegistration);
                AlertChannel.send(
                    Document.length ?  Dictionary.events.alertmemberregexist.replace("#COUNT", Document.length) : Dictionary.events.alertmemberregnoone  
                );
            });
        }
        //let TimerMemberRegistration = setInterval(AlertMemberRegistration, 3000);
        //RuntimeCFG.onearg.AlertMemberRegTimeout
    });
});

let guild = DevClient.guilds.cache.find( guild => guild.id = "702564873149612052");


// global.Application.ModuleObjects.DiscordClient.on("guildMemberAdd", NewMember => {
//     RuntimeCFG = require(global.RUNTIMECFG);
//     NewMember.roles.add(
//         NewMember.guild.roles.cache.find(value => {
//             return value.name == "NotRegistered";
//         })
//     ).then(value =>{
//         let BotAsMember = NewMember.guild.members.cache.find( mem => mem.id == global.Application.ModuleObjects.DiscordClient.user.id);
//         let BotName = NewMember.user.presence.clientStatus.mobile === undefined ? BotAsMember.displayName : global.Application.ModuleObjects.DiscordClient.user.tag;
//         let WelcomeMessage = Dictionary.events.onjoin
//                                 .replace("#MENTION", BotName)
//                                 .replace("#SIGN", BotCFG.commandsign)
//                                 .replace("#MENTION", BotName)
//                                 .replace("#SIGN",BotCFG.commandsign);
//         NewMember.guild.channels.cache.get(RuntimeCFG.noargs.GuestChannelID).send(`<@!${NewMember.id}> `+ WelcomeMessage);
//     });
// });


global.Application.ModuleObjects.DiscordClient.on("message", NewMessage => {
    if (!NewMessage.guild) return;
    if (NewMessage.mentions.everyone) return;
    if (NewMessage.author.bot) return;

    // Проверка на реджект от многоуровневой комманды.
    RegWaitInputCollection.findOne({userid: NewMessage.author.id}, (err, WaitInputRecord) =>{
        if (!WaitInputRecord){
            if (NewMessage.mentions.users.keyArray()[0] == global.Application.ModuleObjects.DiscordClient.user.id){
                var CommandObject = CommandHandler(NewMessage);
                switch(CommandObject.Error){
                    case 0: // Отсутствие ошибок
                        CommandObject.method();
                        break;
                    case 1: // Команда не найдена
                        NewMessage.reply(Dictionary.errors.unknowncommand);
                        break;
                    case 2: // У отправителя нет прав. 
                        NewMessage.reply(Dictionary.errors.notenoughperms);
                        break;
                }
            }
        }
    });
});

const Info = require(global.PROJECTDIR+'/system/info.js');
Info(PackageInfo, BotCFG);

global.Application.ModuleObjects.DiscordClient.login(BotCFG.bottoken);