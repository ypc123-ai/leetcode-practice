import fs from 'node:fs'
import { removeDomTags } from '../functions/removeDomTags.js'
import { getTestCase } from './getTestCase.js'
import { createMarkdown } from './createMarkdown.js'
import { getQuestionChineseName } from '#common/utils/question-handler/getQuestionChineseName.js'
import { getConsoleText } from '#common/utils/question-handler/getConsoleText.js'
import { template } from '#resources/template/template.js'
import { setBlockComment } from '#common/utils/question-handler/questionLanguage.js'

/**
 * @typedef {object} Question
 * @property {string} title
 * @property {string} title
 * @property {number} date
 * @property {string} detail
 * @property {string} lang
 * @property {string} code
 */

/**
 * @type {Question}
 */

/**
 *
 * @param {string} data
 * @param {Question} question
 *
 */
export function generateTemplateContent(question) {
  const title = `${getQuestionChineseName(question)} ${question.date ? `[${question.date}]` : ''}\n`
  const describe = removeDomTags(question.detail).replace(/\n+/g, '\n')
  const code = question.code
  return template
    .replace('@Title', setBlockComment(question.lang, title + describe))
    .replace('@Describe', '')
    .replace('@Function', code)
    .replace('@TestCase', getTestCase(question))
    .replace('@Console', getConsoleText(question))
}
/**
 * 模板文件内容替换并生成文件
 * @param questionPath
 * @param question
 */
export function fulfillQuestion(questionPath, question) {
  return new Promise((resolve) => {
    // 创建描述文件 md
    createMarkdown(question.detail, questionPath)
    // 创建填充内容并创建
    // 开始填充内容
    const newData = generateTemplateContent(question)
    // 创建文件
    fs.writeFile(questionPath, newData, (err) => {
      if (err)
        throw err
      resolve()
    })
  })
}
