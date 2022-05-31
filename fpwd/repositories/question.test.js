const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')
const { get } = require('http')

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

  describe('Questions', () => {
    describe('Test method getQuestions', () => {
      test('should return a list of 0 questions', async () => {
        expect(await questionRepo.getQuestions()).toHaveLength(0)
      })

      test('should return a list of 2 questions', async () => {
        const testQuestions = [
          {
            id: faker.datatype.uuid(),
            summary: 'What is my name?',
            author: 'Jack London',
            answers: []
          },
          {
            id: faker.datatype.uuid(),
            summary: 'Who are you?',
            author: 'Tim Doods',
            answers: []
          }
        ]

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

        expect(await questionRepo.getQuestions()).toHaveLength(2)
      })
    })

    describe('Test method getQuestionById', () => {
      test('should return a question search by id', async () => {
        const testQuestions = [
          {
            id: faker.datatype.uuid(),
            summary: 'What is my name?',
            answers: []
          },
          {
            id: faker.datatype.uuid(),
            summary: 'who let the dogs out?',
            answers: []
          }
        ]

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
        questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)

        const response = await questionRepo.getQuestionById(testQuestions[0].id)
        expect(response).toEqual(testQuestions[0])
      })
    })

    describe('Test method addQuestion', () => {
      test('should add a question', async () => {
        const newQuestion = {
          id: faker.datatype.uuid(),
          summary: 'What the fox say?',
          answers: []
        }
        const testQuestions = [
          {
            id: faker.datatype.uuid(),
            summary: 'What is my name?',
            answers: []
          },
          {
            id: faker.datatype.uuid(),
            summary: 'who let the dogs out?',
            answers: []
          }
        ]

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
        questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
        await questionRepo.addQuestion(newQuestion)
        expect(await questionRepo.getQuestions()).toHaveLength(3)
      })
    })
  })

  describe('Answers', () => {
    describe('Test getAnswers', () => {
      test('should return answers from specific question ', async () => {
        const testQuestions = [
          {
            id: faker.datatype.uuid(),
            summary: 'What is my name?',
            answers: []
          },
          {
            id: faker.datatype.uuid(),
            summary: 'who let the dogs out?',
            answers: []
          }
        ]

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
        const response = await questionRepo.getAnswers(testQuestions[0].id)
        expect(response).toEqual(testQuestions[0].answers)
      })
    })
    describe('Test getAnswer', () => {
      test('should return a specific answer', async () => {
        const testQuestions = [
          {
            id: faker.datatype.uuid(),
            summary: 'What is my name?',
            answers: [
              {
                id: faker.datatype.uuid(),
                summary: 'Jack London'
              }
            ]
          }
        ]

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
        const response = await questionRepo.getAnswer(
          testQuestions[0].id,
          testQuestions[0].answers[0].id
        )
        expect(response).toEqual(testQuestions[0].answers[0])
      })
    })
    describe('Test addAnswer', () => {
      test('should add answer to question', async () => {
        const testQuestions = [
          {
            id: faker.datatype.uuid(),
            summary: 'What is my name?',
            answers: []
          }
        ]

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
        const newAnswer = {
          id: faker.datatype.uuid(),
          summary: 'Jack London'
        }
        await questionRepo.addAnswer(testQuestions[0].id, newAnswer)
        expect(await questionRepo.getAnswers(testQuestions[0].id)).toEqual([
          newAnswer
        ])
      })
    })
  })
})