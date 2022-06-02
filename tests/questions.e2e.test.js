const { faker } = require('@faker-js/faker')
const request = require('supertest')
const app = require('../index')
const { questions } = require('./questionsMock.e2e')
const { writeToFileMockData } = require('./writeToFileMockData')
const { QuestionsMock } = require('./QuestionsMock')
const { rm } = require('fs/promises')

describe('e2e tests', () => {
  const TEST_QUESTIONS_FILE_PATH = process.env.STORAGE_TEST_FILE_PATH
  beforeAll(async () => {
    await writeToFileMockData(TEST_QUESTIONS_FILE_PATH, questions)
  })
  beforeEach(async () => {
    await writeToFileMockData(TEST_QUESTIONS_FILE_PATH, questions)
  })
  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })
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
      test('should not add new answer- no author', async () => {
        const questionId = '0f9e662-fa0e-4ec7-b53b-7845e8f821c3'
        const newAnswer = {
          id: faker.datatype.uuid(),

          summary: 'The Earth is flat.'
        }
        const response = await request(app)
          .post(`/questions/${questionId}/answers`)
          .send(newAnswer)
        expect(response.statusCode).toBe(400)
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

      test('should return wrong question id', async () => {
        const questionId = 'wrongId'
        const answerId = 'ce7bddfb-0544-4b14-92d8-188b03c41ee4'
        const response = await request(app).get(
          `/questions/${questionId}/answers/${answerId}`
        )
        expect(response.statusCode).toBe(404)
      })

      test('should return wrong answer id', async () => {
        const questionId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3'
        const answerId = 'wrongId'
        const response = await request(app).get(
          `/questions/${questionId}/answers/${answerId}`
        )
        expect(response.statusCode).toBe(404)
      })
    })
  })
})
