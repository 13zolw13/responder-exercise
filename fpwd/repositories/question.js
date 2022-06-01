const { faker } = require('@faker-js/faker')
const { readFile, writeFile } = require('fs/promises')
const { answerDto } = require('../middleware/answer.validation')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    try {
      const questions = await getQuestions()
      const question = questions.find(question => question.id === questionId)

      return question ? question : null
    } catch (error) {
      console.error(error)
    }
  }

  const addQuestion = async question => {
    const questions = await getQuestions()
    questions.push(question)

    await writeFile(fileName, JSON.stringify(questions))
  }
  const getAnswers = async questionId => {
    try {
      const question = await getQuestionById(questionId)

      return question ? question.answers : null
    } catch (error) {
      console.error(error)
    }
  }
  const getAnswer = async (questionId, answerId) => {
    try {
      const answers = await getAnswers(questionId)
      const answer = answers
        ? answers.find(answer => answer.id === answerId)
        : null

      return answer ? answer : null
    } catch (error) {
      console.error(error)
    }
  }
  const addAnswer = async (questionId, answer) => {
    try {
      const value = await answerDto.validate(answer)
      value.id = faker.datatype.uuid()
      const questions = await getQuestions()
      questions.forEach(question => {
        if (question.id === questionId) {
          question.answers.push({ id: value.id, ...value.value })
        }
      })
      await writeFile(fileName, JSON.stringify(questions))
    } catch (error) {}
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
