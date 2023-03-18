const mongodb=require("mongodb");
const MongoClient=mongodb.MongoClient;

let database;
async function connect(){
    const client=await MongoClient.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0");
    database=client.db("blog");
}
function getDb(){
    if(!database){
        throw{message:"Database connection not established"}
    }
    return database;
}
module.exports={
    connectToDatabase:connect,
    getDb:getDb
};