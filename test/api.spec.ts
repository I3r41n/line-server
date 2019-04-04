import { app } from '../src/app'
import supertest from 'supertest'

describe('GET', () => {
    it('should get a 413 when line doesn\'t exist', async () => {
        const {status} = await supertest(app).get('/lines/10')

        expect(status).toBe(413)
    })

})
