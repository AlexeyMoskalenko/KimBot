const HttpModule    = require('http');
var RequestModule = require('sync-request');


const MAXFILESIZE = 8380000;

module.exports = class VKAPIWebServer{

    constructor(Port, Config){
        this.Port = Port ? Port : 80;
        this.Config = Config ? Config : undefined;
        this.MAXFILESIZE = 8380000;
        this.MAXMSGLEN = 1999;
    }
    
    StartServer(){
        this.ServerHandle = HttpModule.createServer( (ConnectionRequest, ConnectionResponse) => {
            let RequestBody = ""
            ConnectionRequest.on("data", PostData =>{
                RequestBody += PostData;
                if (RequestBody.length > 10000)
                    ConnectionRequest.destroy();
            });

            ConnectionRequest.on("end", () =>{
                try{
                    let BodyObject = JSON.parse(RequestBody);
                    if (BodyObject.secret !== this.Config.secretkey)
                        return ConnectionResponse.end("");
                    
                    if (!BodyObject.type)
                        return ConnectionResponse.end("");
                    
                    return  ConnectionResponse.end(this.RequestHandler(BodyObject));
                }
                catch(ex){
                    return ConnectionResponse.end("Wrong JSON data.");
                }
            });
        });

        this.ServerHandle.listen(this.Port);
    }

    RequestHandler(PostData){
        // console.log(PostData);
        switch(PostData.type){
            case "confirmation":
                return "94f8f953"
                break;
            case "wall_post_new":
                if (PostData.object.text.includes("#KIMDiscord")){
                    let AttachmentUrls = {
                        images: [],
                        otherdocs: []
                    };

                    PostData.object.attachments.forEach( Attachment => {
                        switch(Attachment.type){
                            case "doc":
                                AttachmentUrls.otherdocs.push(
                                    {
                                        url: Attachment.doc.url,
                                        name: Attachment.doc.title,
                                        overlimit: Attachment.doc.size < this.MAXFILESIZE ? false : true
                                    }
                                );
                            break;
                            case "photo":
                                let AsMap = Object.entries(Attachment.photo);
                                AsMap = AsMap.filter( 
                                    Pair => Pair.find(
                                      key => key.toString().includes("photo")
                                    )
                                );
                                let BiggerPhoto = "";
                                AsMap.reduce((acc, pair) => {
                                    let PhotoSize = parseInt(pair[0].split("_")[1]);
                                    if (PhotoSize > acc) BiggerPhoto = pair[1];
                                    return PhotoSize > acc ? PhotoSize : acc;
                                }, 0);

                                AttachmentUrls.images.push(
                                    {
                                        url: BiggerPhoto,
                                        overlimit: null
                                    }
                                );
                            break;
                        }
                    });

                    const RuntimeCFG    = require(global.RUNTIMECFG);
                    
                    let HomeGuild = global.Application.ModuleObjects.DiscordClient
                                    .guilds.cache.find( 
                                        guild => guild.id = global.Application.Configs.Bot.homeguildid
                                    );

                    if (HomeGuild){
                        let NewsChannel = HomeGuild.channels.cache.find( ch => ch.id == RuntimeCFG.noargs.NewsChannelID);
                        if (NewsChannel){
                            try{
                                let PostText = PostData.object.text.replace("#KIMDiscord", "");
                                
                                let AllowedImagesUrls   = [];
                                let AllowedDocsUrls     = [];

                                AttachmentUrls.images.forEach(ImageAttachment => {
                                    var RequestResult = RequestModule('HEAD', ImageAttachment.url);
                                    if (parseInt(RequestResult.headers['content-length']) > this.MAXFILESIZE)
                                        PostText += "\n" + ImageAttachment.url;
                                    else{
                                        AllowedImagesUrls.push(ImageAttachment.url);
                                    }
                                });
                                
                                AttachmentUrls.otherdocs.forEach( Attachment =>{
                                    if (Attachment.overlimit) 
                                        PostText += "\n" + Attachment.url;
                                    else{
                                        let EncodedName = global.Application.Modules
                                                            .CyrilicTransformator()
                                                            .transform(Attachment.name,"_");

                                        AllowedDocsUrls.push({
                                            attachment: Attachment.url,
                                            name: EncodedName
                                        });
                                    }
                                });
                                
                                let TextParts = [];
                                while(PostText.length){
                                    TextParts.push(PostText.slice(0, this.MAXMSGLEN));
                                    PostText = PostText.slice(this.MAXMSGLEN, PostText.length);
                                }

                                if (TextParts.length)
                                    TextParts.forEach( Message =>{
                                        NewsChannel.send(Message);
                                    });

                                if (AllowedImagesUrls.length)
                                    NewsChannel.send({
                                        files: AllowedImagesUrls
                                    });

                                if (AllowedDocsUrls.length)
                                    NewsChannel.send( { 
                                        files: AllowedDocsUrls
                                    });
                            }
                            catch(ex){
                                console.log("Error on news sending stage!");
                                console.log(ex);
                            }
                        }
                        else console.log("News channel configured wrong!");
                    }
                    else console.log("Home guild configured wrong!");
                }
                break;
        }
        return "ok";
    }

    StopServer(){
        this.ServerHandle.close();
    }

}
