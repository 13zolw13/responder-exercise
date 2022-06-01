const Joi = require('joi')

const answerDto = Joi.object({
  author: Joi.string().required(),
  summary: Joi.string().required(),
  id: Joi.string().guid({ version: ['uuidv4'], separator: '-' })
})

module.exports = { answerDto }
