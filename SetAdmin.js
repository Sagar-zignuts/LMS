const pg = require('./config/PgConfig')
const bcrypt = require('bcrypt')

const SetAdmin = async()=>{
    try {
        const username = 'admin'
        const password = 'admin@123'
        const email = 'admin123@gmail.com'
        const hashedPassword = await bcrypt.hash(password , 10)

        const query = `
            INSERT INTO users (username , email , password ,role)
            VALUES 
            ($1 , $2 , $3 , 'admin')
            ON CONFLICT (username) DO NOTHING
            RETURNING *
        `;

        const values = [username , email , hashedPassword]

        const {rows} = await pg.query(query , values)
        if (rows.length > 0) {
            // console.log("Admin user created successful");
        }else{
            // console.log("Admin user already exists");
        }
    } catch (error) {
        console.log(`Error in set admin : ${error}`);
    } 
}

module.exports = {SetAdmin};