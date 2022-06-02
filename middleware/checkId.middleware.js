const { valid } = require('joi')
const { IdDto } = require('./checkId.validation')

const checkValidId = function (req, res, next) {
  if (req.params?.answerId || req.params?.questionId) {
    const checkingID = req.params.answerId || req.params.questionId
    const value = IdDto.validate(checkingID)

    if (value.error?.details[0].message) {
      return res.status(400).json({ message: 'Invalid ID' })
    } else {
      next()
    }
  } else {
    next()
  }
}
module.exports = { checkValidId }
