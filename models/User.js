const pg = require('../config/PgConfig')
const bcrypt = require("bcrypt")

const CreateUserTable  = async ()=>{
    
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS users (
        id serial primary key,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) default 'user'
        )`;
        await pg.query(query)
        
    } catch (error) {
        console.log(`error in create table for user : ${error}`);
        
    }
}

const CreateUser = async(username , email , password)=>{
   try {
     const hashedPassword = await bcrypt.hash(password , 10)
     const query =  `
     INSERT INTO users
     (username , email , password )
     VALUES
     ($1 , $2 , $3)
     RETURNING *
     `
     const values = [username , email , hashedPassword]
     const { rows } =await pg.query(query, values)
     return rows[0];
   } catch (error) {
        console.log(`error in create user : ${error}`);
        throw error
   }
}

const FindUser = async(email)=>{
    try {
        const query = `
        SELECT * FROM users
        WHERE email = $1
        `;
        const value = [email]
        const {rows} =await pg.query(query , value)
        return rows[0]
    } catch (error) {
        console.log(`error in find use : ${error}`);
        throw error
    }
}

module.exports = {CreateUser , CreateUserTable , FindUser}