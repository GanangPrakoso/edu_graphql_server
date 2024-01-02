const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://gansolo:v1ROoW8SxHZO9n0c@gansolo-test.efxbpjp.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

function getDb() {
  return db;
}

async function connect() {
  try {
    const database = client.db("lecture_db");
    db = database;
    return database;
  } catch (error) {
    console.log(error, "<<< error run connect");
  }
}

module.exports = { connect, getDb };
