const request = require('supertest')
const app = require('../index')

describe('e2e tests', () => {
  test(' #/ should  return message ', async () => {
    const response = await request(app).get('/')
    expect(response.body.message).toBe('Welcome to responder!')
    expect(response.statusCode).toBe(200)
  })

      test(' #/questions should return questions', async () => {
        const response = await request(app).get('/questions ')
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(2)
      })
    
})
