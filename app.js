const e = require('express')
const express =require('express')
const pg = require("./config/PgConfig")

require('dotenv').config()

const app = express()


app.listen(3000 , ()=>{
    console.log("Running");
})