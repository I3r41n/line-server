import * as fs from 'fs'
import * as es from 'event-stream'

type preprocessor = (file: string) => Promise<Array<number>>
export const preprocessor = async (file: string) => {
    var pos:Array<number> = [0]

    return new Promise<Array<number>>((resolve, reject) => {
        fs.createReadStream(file, {flags: 'r', autoClose: true, encoding: 'utf8'})
            .on('error', (err: any) => (console.error(err), reject(err)))
            .pipe(es.split())
            .pipe(es.mapSync((line: string) => pos.push(pos[pos.length - 1] + line.length + 1)))
            .on('end', () => (pos.pop(), resolve(pos.length > 1 ? pos : [])))
    })
}