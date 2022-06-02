const { valid } = require('joi')
const { IdDto } = require('./checkId.validation')

const checkForQuestionValidId = function (req, res, next) {
  if (!req.params.questionId) {
    next()
  } else {
    const value = IdDto.validate(req.params.questionId)

    if (value.error) {
      return res.status(400).json({ message: value.error.details[0].message })
    }
    next()
  }
}

const checkForAnswerValidId = function (req, res, next) {
  if (!req.params.answerId) {
    next()
  } else {
    const value = IdDto.validate(req.params.answerId)

    if (value.error) {
      return res.status(400).json({ message: value.error.details[0].message })
    }
    next()
  }
}

module.exports = { checkForQuestionValidId, checkForAnswerValidId }
