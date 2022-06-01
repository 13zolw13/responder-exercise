const { readFile, writeFile } = require('fs/promises')

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
      throw new Error(error.message)
    }
  }
  
  const addQuestion = async question => {
    const questions = await getQuestions()
    questions.push(question)

    await writeFile(fileName, JSON.stringify(questions))
  }
  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)

    return question.answers
  }
  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)
    const answer = answers.find(answer => answer.id === answerId)

    return answer
  }
  const addAnswer = async (questionId, answer) => {
    const questions = await getQuestions()
    questions.forEach(question => {
      if (question.id === questionId) {
        question.answers.push(answer)
      }
    })
    await writeFile(fileName, JSON.stringify(questions))
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
