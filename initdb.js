const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:8000';

const dbName = 'registration_system';

const collectname_reglist = "reg_requests";

const client = new MongoClient(url,{useUnifiedTopology: true});

const collcontent_reglist = [
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

const collcontent_reg = [
    {

    }
]

let doc = {
    name: "Сети",
    role: "Networks"
}

client.connect(function(err, res){
    let database = client.db(dbName);
    let collection_reglist = database.collection(collectname_reglist);
    // collection_reglist.drop(function(err, res){
        collection_reglist.find().toArray((err,res)=>{
            console.log(res);
            console.log(err);
            if (!res.length) console.log("Эээ блет");
            client.close();
        });
    // });
    // collection_reglist.drop(function(err, res){
    //     collection_reglist.insertMany(collcontent_reglist, function(err, res){
    //         collection_reglist.find(doc).toArray((err,res)=>{
    //             console.log(res);
    //             console.log(err);
    //             if (!res.length) console.log("Эээ блет");
    //             client.close();
    //         });
    //     });
    // });
    
});