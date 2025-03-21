const pg = require('../config/PgConfig')

const CreateBookTable = async ()=>{
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS books
        (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        author_id INTEGER REFERENCES authors(id),
        publication VARCHAR(50),
        cover_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    
        await pg.query(query)
        // console.log("Book table created sussessfuly");
    } catch (error) {
        console.log(`error in create book table  :${error}`);
    }
    
}

module.exports = {CreateBookTable}