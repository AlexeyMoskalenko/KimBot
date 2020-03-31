function msghascertperm(msg, PermissonsToCheck){
    let ithas = msg.member.roles.cache.find((value) =>{
        return value.name === PermissonsToCheck ? true : false; 
    });

    //OPIMIZED
    // let ishaveperrmissions = false;
    // let arr = Array.from(msg.member.roles.cache);
    // arr.forEach((data) =>{
    //     let Role = data[1];
    //     if (Role.name == PermissonsToCheck) ishaveperrmissions = true;
    //     if (ishaveperrmissions) return;
    // });
    // return ishaveperrmissions;
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
    // OPTIMIZED
    // let ishaveperrmissions = false;
    // let arr = Array.from(msg.member.roles.cache);
    // PermissonsToCheck.forEach(permission => {
    //     arr.forEach((data) =>{
    //         let Role = data[1];
    //         if (Role.name == permission) ishaveperrmissions = true;
    //     });
    //     if (ishaveperrmissions) return;
    // })
    // return ishaveperrmissions;
    return role === undefined ? false : true;
}

exports.msghascertperm = msghascertperm;
exports.msghasleastperms = msghasleastperms;