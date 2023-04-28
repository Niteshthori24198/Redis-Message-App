
const mongoose = require('mongoose')

const connection = mongoose.connect("mongodb://127.0.0.1:27017/RDB")

const msgchema = mongoose.Schema({

    id:Number,
    Message:String,
    TTL:Number

})

const MM = mongoose.model("message", msgchema)

module.exports = {connection, MM}