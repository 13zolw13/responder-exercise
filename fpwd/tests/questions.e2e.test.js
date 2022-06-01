const { faker } = require('@faker-js/faker')
const request = require('supertest')
const app = require('../index')
const QuestionsMock = require('./QuestionsMock')
describe('e2e tests', () => {

  describe('/', () => {
    describe('GET', () => {
      test('should  return message ', async () => {
        const response = await request(app).get('/')
        expect(response.body.message).toBe('Welcome to responder!')
        expect(response.statusCode).toBe(200)
      })
    })
  })

  describe('/questions', () => {
    describe('GET', () => {
      test('  should return questions', async () => {
        const response = await request(app).get('/questions ')
        expect(response.statusCode).toBe(200)
      })
    })

    describe('POST', () => {
      test('should add new question', async () => {
        const response = await request(app)
          .post('/questions')
          .send(QuestionsMock[1])
        expect(response.statusCode).toBe(201)
      })
    })
  })

  describe(' /questions/:questionId', () => {
    describe('GET', () => {
      test(' should return question details', async () => {
        const questionId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3'
        const response = await request(app).get(`/questions/${questionId}`)
        expect(response.statusCode).toBe(200)
      })

      test(' should return 404 if question not found', async () => {
        const questionId = 'WrongId'
        const response = await request(app).get(`/questions/${questionId}`)
        expect(response.statusCode).toBe(404)
      })
    })
  })

  describe('/questions/:questionId/answers', () => {
    describe('GET ', () => {
      test('should return answers', async () => {
        const questionId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3'
        const response = await request(app).get(
          `/questions/${questionId}/answers`
        )
        expect(response.statusCode).toBe(200)
      })

      test('should return 404 - wrong id ', async () => {
        const questionId = 'WrongId'
        const response = await request(app).get(
          `/questions/${questionId}/answers`
        )
        expect(response.statusCode).toBe(404)
      })
    })

    describe('POST ', () => {
      test('should add new answer', async () => {
        const questionId = '0f9e662-fa0e-4ec7-b53b-7845e8f821c3'
        const newAnswer = {
          id: faker.datatype.uuid(),
          author: 'Brian McKenzie',
          summary: 'The Earth is flat.'
        }
        const response = await request(app)
          .post(`/questions/${questionId}/answers`)
          .send(newAnswer)
        expect(response.statusCode).toBe(201)
      })
    })
  })

  describe(' /questions/:questionId/answers/:answerId', () => {
    describe('GET', () => {
      test('should return answer details', async () => {
        const questionId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3'
        const answerId = 'ce7bddfb-0544-4b14-92d8-188b03c41ee4'
        const response = await request(app).get(
          `/questions/${questionId}/answers/${answerId}`
        )
        expect(response.statusCode).toBe(200)
      })
    })
  })

})
