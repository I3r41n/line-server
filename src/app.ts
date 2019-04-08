import { preprocessor } from './preprocessor'
import express = require("express")
import * as es from 'event-stream'
import * as fs from 'fs'

const appBuilder = async (filePath: string) => {
    const lines = await preprocessor(filePath)
    const app = express()

    app.set("port", process.env.PORT || 3000)
    app.get("/lines/:id", (req, res) => {
        const line = req.params.id
        lines.length >= line
            ? fs.createReadStream(filePath,
                {flags: 'r', autoClose: true, encoding: 'utf8', start: lines[line-1], end: lines[line]-1})
                .pipe(es.mapSync((line: string) => line.replace('\n', '')))
                .pipe(res)
            : res.sendStatus(413)
    })

    return app
}

export { appBuilder }

