const MongoClient   = require('mongodb').MongoClient;
const MongoCFG      = require('./mongodbcfg.json');

const client = new MongoClient(MongoCFG.url, {useUnifiedTopology: true});

const collcontetn_regwaitinput = [
    {
        userid: "id",
        state: "",
        command: "",
        commandobj: null
    }
]

const collcontent_regmemberlist = [
    {
        name: "ИВТ 192",
        role: "IVT192",
        id: "1"
    },
    {
        name: "ИВТ 191",
        role: "IVT191",
        id: "2"
    },
    {
        name: "ПИ 192",
        role: "PI192",
        id: "3"
    },
    {
        name: "ПИ 191",
        role: "PI191",
        id: "4"
    },
]

const collcontent_regprofilelist = [
    {
        name: "3D моделлирование",
        role: "3DModeling",
        id: "1"
    },
    {
        name: "Программирование",
        role: "Programming",
        id: "2"
    },
    {
        name: "Сети",
        role: "Networks",
        id: "3"
    }
]

client.connect(function(err, res){
    let sysfuncdatabase     = client.db(MongoCFG.systemfunctions);
    let collection_regwaitinput = sysfuncdatabase.collection(MongoCFG.collregwaitinput);

    let registerdatabase    = client.db(MongoCFG.dbreg);
    let collection_regmemberlist        = registerdatabase.collection(MongoCFG.collregmemberlist);
    let collection_regmemberrequests    = registerdatabase.collection(MongoCFG.collregmemberreq);
    let collection_regprofilelist       = registerdatabase.collection(MongoCFG.collregprofilelist);
    let collection_regprofilerequests   = registerdatabase.collection(MongoCFG.collregprofilereq);
   
    //collection_regwaitinput.insertOne();
    


    // Delete collections
    // collection_regmemberlist.drop( err => {
    //     console.log(err);
    // });
    collection_regmemberrequests.drop( err => {
        console.log(err);
    });
    // collection_regprofilelist.drop( err => {
    //     console.log(err);
    // });
    // collection_regprofilerequests.drop( err => {
    //     console.log(err);
    // });

    // Init collections
    // collection_regprofilelist.insertMany(collcontent_regprofilelist, err, res =>{
    //     console.log("Insert regprofile_list err: ");
    //     console.log(err);
    // });

    // collection_regmemberlist.insertMany(collcontent_regmemberlist, err,res => {
    //     console.log("Insert regmember_list err: ");
    //     console.log(err);
    // });
});