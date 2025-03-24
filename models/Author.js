const e = require("express");
const pg = require("../config/PgConfig");

const CreateAutherTable = async () => {
  try {
    const query = `
        CREATE TABLE IF NOT EXISTS authors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        gender VARCHAR(20),
        profile TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

    await pg.query(query);
    
  } catch (error) {
    console.log(`Error in create author table : ${error}`);
  }
};

module.exports = { CreateAutherTable };