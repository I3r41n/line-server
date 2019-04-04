import express = require("express")

const app = express()
app.set("port", process.env.PORT || 3000)

app.get("/lines/:id", (_, res) => res.sendStatus(413))

export { app }

