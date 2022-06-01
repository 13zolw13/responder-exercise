require('dotenv').config()
const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions_test.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  return res.status(200).json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  return res.status(200).json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  try {
    const question = await req.repositories.questionRepo.getQuestionById(
      req.params.questionId
    )

    return question
      ? res.status(200).json(question)
      : res.status(404).json({ message: 'Question not found' })
  } catch (error) {
    console.error(error)
  }
})

app.post('/questions', async (req, res) => {
  const question = await req.repositories.questionRepo.addQuestion(req.body)
  return res.status(201).json(question)
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const answers = await req.repositories.questionRepo.getAnswers(
    req.params.questionId
  )
  return answers
    ? res.status(200).json(answers)
    : res.status(404).json({ message: 'Answers not found' })
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const answer = await req.repositories.questionRepo.addAnswer(
    req.params.questionId,
    req.body
  )
  return res.status(201).json(answer)
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const answer = await req.repositories.questionRepo.getAnswer(
    req.params.questionId,
    req.params.answerId
  )

  return answer
    ? res.status(200).json(answer)
    : res.status(404).json({ message: 'Answer not found' })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Responder app listening on port ${PORT}`)
  })
}
module.exports = app
