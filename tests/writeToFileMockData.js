const { writeFile } = require('fs/promises')

async function writeToFileMockData(TEST_QUESTIONS_FILE_PATH, QuestionsMock) {
  await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(QuestionsMock))
}
exports.writeToFileMockData = writeToFileMockData
