let FS = require('fs');

module.exports=
function(arg, _, aliassettings){
    let image = FS.readFileSync(global.RESOURCESPATH+"CFUDIS.jpg");
    let imgbuffer = Buffer.from(image,'base64');
    let attachment = new arg.Discord.MessageAttachment(imgbuffer, "supersecret.png")
    arg.msg.reply(attachment);
};