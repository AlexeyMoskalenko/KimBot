const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:8000';

// Database Name
const dbName = 'testdb';

// Create a new MongoClient
const client = new MongoClient(url,{useUnifiedTopology: true});

// Use connect method to connect to the Server
client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    let db = client.db(dbName);
    client.close();
});
