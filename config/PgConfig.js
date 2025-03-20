const { Client } = require("pg");
const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "Sagar@2004",
  database: "LMS",
  port: 5432,
});

client
  .connect()
  .then(() => console.log("Connected successfully"))
  .catch((err) => console.log(`Error in connection : ${err}`));


module.exports = client;