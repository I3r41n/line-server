import { appBuilder } from '../src/app'
import supertest from 'supertest'

describe('GET', () => {
    it('should get a 413 when line doesn\'t exist', async () => {
        const app = await appBuilder('/Users/bsantos/projects/line-server/data/empty')
        const {status} = await supertest(app).get('/lines/10')

        expect(status).toBe(413)
    })

    it('should get a 200 and the content of the line when line exists', async () => {
        const app = await appBuilder('/Users/bsantos/projects/line-server/data/lorem')

        const {status, text} = await supertest(app).get('/lines/10')

        expect(status).toBe(200)
        expect(text).toEqual('Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC')
    })

})
