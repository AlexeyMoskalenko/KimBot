function msghascertperm(msg, PermToCheck){
    let ishaveperrmissions = false;
    let arr = Array.from(msg.member.roles.cache);
    arr.forEach((data) =>{
        let Role = data[1];
        if (Role.name == PermToCheck) ishaveperrmissions = true;
        if (ishaveperrmissions) return;
    });
    return ishaveperrmissions;
}

function msghasleastperms(msg, PermissonsToCheck){
    let ishaveperrmissions = false;
    let arr = Array.from(msg.member.roles.cache);
    PermissonsToCheck.forEach(permission => {
        arr.forEach((data) =>{
            let Role = data[1];
            if (Role.name == permission) ishaveperrmissions = true;
        });
        if (ishaveperrmissions) return;
    })
    return ishaveperrmissions;
}

exports.msghascertperm = msghascertperm;
exports.msghasleastperms = msghasleastperms;