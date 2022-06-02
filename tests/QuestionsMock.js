const { faker } = require('@faker-js/faker')

const QuestionsMock = [
  {
    id: faker.datatype.uuid(),
    summary: 'What is my name?',
    author: 'Tim Doods',
    answers: [
      {
        id: faker.datatype.uuid(),
        summary: 'Jack London'
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Jack Reacher'
      }
    ]
  },
  {
    id: faker.datatype.uuid(),
    summary: 'who let the dogs out?',
    author: 'Jack  Ryan',
    answers: []
  },
  {
    id: faker.datatype.uuid(),
    summary: 'who let the dogs out?',
    author: 'Jack London',
    answers: []
  }
]
exports.QuestionsMock = QuestionsMock
