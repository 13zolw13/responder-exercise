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
  res.status(200).json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.status(200).json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const question = await req.repositories.questionRepo.getQuestionById(
    req.params.questionId
  )
  res.status(200).json(question)
})

app.post('/questions', async (req, res) => {
  const question = await req.repositories.questionRepo.addQuestion(req.body)
  res.status(201).json(question)
})

app.get('/questions/:questionId/answers', (req, res) => {
  const answers = req.repositories.questionRepo.getAnswers(
    req.params.questionId
  )
  res.status(200).json(answers)
})

app.post('/questions/:questionId/answers', (req, res) => {})

app.get('/questions/:questionId/answers/:answerId', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})

module.exports = app