const Joi = require('joi')
const { answerDto } = require('./answer.validation')

const questionDto = Joi.object({
  author: Joi.string().required(),
  summary: Joi.string().required(),
  id: Joi.string().guid({ version: ['uuidv4'], separator: '-' }),
  answers: Joi.array().items(answerDto)
})

module.exports = { questionDto }
