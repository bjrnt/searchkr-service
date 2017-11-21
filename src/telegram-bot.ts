import search, { Result, Meaning } from '@bjrnt/seonbi-core'
const Telegraf: any = require('telegraf')

const bot = new Telegraf('465288108:AAEy_fltPZdZQMsBaHX4zFEyJlxznCfknYY')

function formatMeaning(meaning: Meaning, index: number, meanings: Meaning[]) {
  return `
    ${meanings.length > 1 ? `${index + 1}. ` : ''}*${meaning.translation}*
    ${meaning.kr}
    _${meaning.en}_`
}

function formatResult(result: Result, index: number, results: Result[]): string {
  return `
${results.length > 1 ? `${index + 1}.` : ''} *${result.word}* ${result.hanja || ''}
${result.meanings.map(formatMeaning).join('\n')}
`
}

bot.on('text', async (ctx: any, next: any) => {
  const { message } = ctx
  if (message.entities) {
    return next()
  }
  const text: string = ctx.message.text
  const results = await search(text.trim().toLowerCase(), { matchExactly: true })
  if (results.length === 0) {
    return ctx.reply('No results :(')
  }
  return ctx.replyWithMarkdown(results.map(formatResult).join('\n'))
})

export const handleUpdate = bot.handleUpdate.bind(bot)
