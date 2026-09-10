import express from "express"

const app = express()
const PORT = process.env.port || 9000


app.listen(PORT, (request, response) => {
    console.log(`the server started on port ${PORT}!`)
})