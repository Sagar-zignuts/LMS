const redis = require("redis")

const redisClient= redis.createClient({
    url : "http://127.0.0.1:8081/"
})

redisClient.on('error' , ()=>console.log(`error in connection of redis`))

(async()=>{
    await redisClient.connect()
    console.log("redis client connected...");
})

module.exports = {redisClient}