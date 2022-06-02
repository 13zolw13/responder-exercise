const Joi = require('joi')

const IdDto = Joi.string().guid({ version: ['uuidv4'], separator: '-' })

module.exports = { IdDto }
