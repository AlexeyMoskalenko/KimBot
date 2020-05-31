const Sleep = require('sleep');

module.exports=
function(){
    let FoundedRole = HomeGuild.roles.cache.find( r => r.name == "NotRegistered");

    let CounterGiven = 0;

    HomeGuild.members.cache.forEach( Member => {
        if (Member.roles.cache.size === 1){
            Sleep.msleep(700);
            console.log(Member.displayName);
            Member.roles.add(FoundedRole);
            CounterGiven++;
        }
    });
    
    console.log(FMember.roles.cache.size);

    console.log("Counter given: " + CounterGiven);

    this.CallMessage.reply("Ok");
}