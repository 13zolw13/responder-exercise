const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('../repositories/question')
const { get } = require('http')
const { writeToFileMockData } = require('./writeToFileMockData')

const QuestionsMock = [
  {
    id: faker.datatype.uuid(),
    summary: 'What is my name?',
    author: 'Tim Doods',
    answers: [
      {
        id: faker.datatype.uuid(),
        summary: 'Jack London'
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Jack Reacher'
      }
    ]
  },
  {
    id: faker.datatype.uuid(),
    summary: 'who let the dogs out?',
    author: 'Jack  Ryan',
    answers: []
  },
  {
    id: faker.datatype.uuid(),
    summary: 'who let the dogs out?',
    author: 'Jack London',
    answers: []
  }
]
describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })
  beforeEach(async () => {
    writeToFileMockData(TEST_QUESTIONS_FILE_PATH, QuestionsMock)
  })

  describe('Questions', () => {
    describe('Test method getQuestions', () => {
      test(`should return a list of ${QuestionsMock.length} questions`, async () => {
        expect(await questionRepo.getQuestions()).toHaveLength(
          QuestionsMock.length
        )
      })
    })

    describe('Test method getQuestionById', () => {
      test('should return a question search by id', async () => {
        questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)

        const response = await questionRepo.getQuestionById(QuestionsMock[0].id)
        expect(response).toEqual(QuestionsMock[0])
      })
    })

    describe('Test method addQuestion', () => {
      test('should add a question', async () => {
        const newQuestion = {
          id: faker.datatype.uuid(),
          summary: 'What the fox say?',
          answers: []
        }

        questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
        await questionRepo.addQuestion(newQuestion)
        expect(await questionRepo.getQuestions()).toContainEqual(newQuestion)
      })
    })
  })

  describe('Answers', () => {
    describe('Test getAnswers', () => {
      test('should return answers from specific question ', async () => {
        const response = await questionRepo.getAnswers(QuestionsMock[0].id)
        expect(response).toEqual(QuestionsMock[0].answers)
      })
    })
    describe('Test getAnswer', () => {
      test('should return a specific answer', async () => {
        const response = await questionRepo.getAnswer(
          QuestionsMock[0].id,
          QuestionsMock[0].answers[0].id
        )
        expect(response).toEqual(QuestionsMock[0].answers[0])
      })
    })
    describe('Test addAnswer', () => {
      test('should add answer to a question', async () => {
        const newAnswer = {
          id: faker.datatype.uuid(),
          summary: 'Jack London'
        }
        await questionRepo.addAnswer(QuestionsMock[1].id, newAnswer)
        expect(await questionRepo.getAnswers(QuestionsMock[1].id)).toEqual([
          newAnswer
        ])
      })
    })
  })
})

