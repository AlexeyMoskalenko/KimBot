

function msghascertperm(msg, PermissonsToCheck){
    let ithas = msg.member.roles.cache.find((value) =>{
        return value.name === PermissonsToCheck ? true : false; 
    });

    return ithas === undefined ? false : true;
}

function msghasleastperms(msg, PermissonsToCheck){
    let role = undefined;
    let every = PermissonsToCheck.some(permission => {
        role = msg.member.roles.cache.find((value) =>{
            return value.name === permission ? true : false; 
        });
        if (role !== undefined) return true;
    });
    
    return role === undefined ? false : true;
}


function makeinputwait(WaitInputCollection, InputUserID){
    WaitInputCollection.insertOne({userid: InputUserID}, (err,res) => {});    
}

function cancelinputwait(WaitInputCollection, InputUserID){
    WaitInputCollection.findOneAndDelete({userid: InputUserID}, (err,res) => {});
}


exports.makeinputwait   = makeinputwait;
exports.cancelinputwait = cancelinputwait;

exports.msghascertperm      = msghascertperm;
exports.msghasleastperms    = msghasleastperms;