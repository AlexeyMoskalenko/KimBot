module.exports = 
function(PackageInfo, BotConfig){
    let infoobj = {
        delimitersize: 0,
        delimiter: "",
        fields: [
            author = "By " + PackageInfo.author,
            version = `Version of application: ${PackageInfo.version}`,
            bottoken = "Token of bot: " + BotConfig.bottoken
        ]
    }
    infoobj.fields.forEach( el => {
        if (el.length > infoobj.delimitersize) infoobj.delimitersize = el.length;
    });
    for(let i = 0; i < infoobj.delimitersize; i++) infoobj.delimiter += '-'
    console.log(infoobj.delimiter);
    infoobj.fields.forEach(el => {
        console.log(el)
    });
    console.log(infoobj.delimiter);
}