
const express = require('express')

const app = express()

app.use(express.json())

const { connection, MM } = require("./db")

const Redis = require('ioredis')

const redis = new Redis()



app.get("/", (req, res) => {
    res.send("Ok")
})




app.get("/getmsg/:id", async (req, res) => {

    const id = req.params.id;

    redis.get(`msg${id}`, async (err, data) => {

        if (data) {

            res.send({ "msg": "Message received from redis", "data": JSON.parse(data) })

        }

        else {

            try {

                const usermsg = await MM.findOne({ id })

                if(!usermsg) return res.status(401).send({"msg":"User Not Found !!"})

                redis.set(`msg${id}`, JSON.stringify(usermsg), "EX", usermsg.TTL)

                res.send({ "msg": "Message received from DB", usermsg })

            }

            catch (error) {

                return res.status(400).send(error.message)

            }


        }



    })


})




app.post("/usermessage", async (req, res) => {

    const { id } = req.body;

    const msg = new MM({ ...req.body })

    await msg.save()

    redis.set(`msg${id}`, JSON.stringify(msg), "EX", msg.TTL)

    res.status(200).send({ "msg": "message Sent Successfully !!" })

})




app.listen(2100, async () => {

    try {

        await connection

        console.log("Connected to DB")


    } catch (error) {

        console.log(error)
    }

})