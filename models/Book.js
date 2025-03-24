const pg = require('../config/PgConfig')

const CreateBookTable = async ()=>{
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS books (
          id SERIAL PRIMARY KEY,
          title VARCHAR(100) NOT NULL,
          description TEXT,
          author_id INTEGER NOT NULL,
          publication DATE,
          cover_image VARCHAR(255),
          FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
        )`;
    
        await pg.query(query)

    } catch (error) {
        console.log(`error in create book table  :${error}`);
    }
    
}

module.exports = {CreateBookTable}