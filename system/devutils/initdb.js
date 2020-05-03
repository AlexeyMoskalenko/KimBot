const MongoClient   = require('mongodb').MongoClient;
const MongoCFG      = require('../../configs/mongodbcfg.json');

const client = new MongoClient(MongoCFG.url, {useUnifiedTopology: true});

const collcontent_regmemberlist = [
    {
        name: "ИВТ 19",
        roles: ["ИВТ-19", "Студент КИМ"],
        id: "1"
    },
    {
        name: "ПИ 19",
        roles: ["ПИ-19", "Студент КИМ"],
        id: "2"
    },
    {
        name: "ИВТ 18",
        roles: ["ИВТ-18", "Студент КИМ"],
        id: "3"
    },
    {
        name: "ПИ 18",
        roles: ["ПИ-18", "Студент КИМ"],
        id: "4"
    },
    {
        name: "ИВТ 17",
        roles: ["ИВТ-17", "Студент КИМ"],
        id: "5"
    },
    {
        name: "ПИ 17",
        roles: ["ПИ-17", "Студент КИМ"],
        id: "6"
    },
    {
        name: "ИВТ 16",
        roles: ["ИВТ-16", "Студент КИМ"],
        id: "7"
    },
    {
        name: "ПИ 16",
        roles: ["ПИ-16", "Студент КИМ"],
        id: "8"
    },
    {
        name: "Магистры",
        roles: ["Магистры-1", "Студент КИМ"],
        id: "9"
    },
    {
        name: "Студент ФТИ",
        roles: ["Студент ФТИ"],
        id: "10"
    },
    {
        name: "ДПО ЕГЭ Информатика",
        roles: ["ДПО ЕГЭ Информатика", "Абитуриент"],
        id: "11"
    },
    {
        name: "ДПО ЕГЭ Физика",
        roles: ["ДПО ЕГЭ Физика", "Абитуриент"],
        id: "12"
    },
    {
        name: "Преподаватель КИМ",
        roles: ["Преподаватель КИМ"],
        id: "13"
    },
    {
        name: "Преподаватель ФТИ",
        roles: ["Преподаватель ФТИ"],
        id: "14"
    }
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

const collcontent_voteslist = [
    {
        caption :  "Тестовое голосование",
        hash :  "haaash",
        emoji : [],
        duration : 30000
    }
]

client.connect(function(err, res){
    let sysfuncdatabase     = client.db(MongoCFG.dbsystemfunctions);
        let collection_regwaitinput = sysfuncdatabase.collection(MongoCFG.collwaitinput);

    let commandfunctiondatabase     = client.db(MongoCFG.dbcommandfunctions);
        let collection_voteslist = commandfunctiondatabase.collection(MongoCFG.collvoteslist);

    let registerdatabase    = client.db(MongoCFG.dbreg);
        let collection_regmemberlist        = registerdatabase.collection(MongoCFG.collregmemberlist);
        let collection_regmemberrequests    = registerdatabase.collection(MongoCFG.collregmemberreq);
        let collection_regprofilelist       = registerdatabase.collection(MongoCFG.collregprofilelist);
        let collection_regprofilerequests   = registerdatabase.collection(MongoCFG.collregprofilereq);
   
    //collection_regwaitinput.insertOne();

    collection_regmemberlist.find().toArray( (err,result) => {
	console.log(err);
	console.log(result);
    })

    // Delete collections
    //collection_regwaitinput.drop( err => {
    //     console.log(err);
    //});
    // collection_voteslist.drop( err => {
    //     console.log(err);
    // });
    // collection_regmemberlist.drop( err => {
    //     console.log(err);
    // });
    //collection_regmemberrequests.drop( err => {
    //   console.log(err);
    //});
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
