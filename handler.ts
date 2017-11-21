import { search } from './src/cached-search'
import { handleUpdate } from './src/telegram-bot'

export const seonbi: AWSLambda.ProxyHandler = (event, _context, callback) => {
  if (callback == null) {
    return
  }
  if (
    event.queryStringParameters == null ||
    (event.queryStringParameters && event.queryStringParameters.query == null)
  ) {
    return callback(undefined, { statusCode: 400, body: '' })
  }

  // TODO: allow users to specify options for search through queryStringParameters
  search(event.queryStringParameters.query.trim().toLowerCase())
    .then(results => {
      callback(undefined, { statusCode: 200, body: JSON.stringify(results) })
    })
    .catch(error => {
      callback(error, { statusCode: 500, body: '' })
    })
}

export const telegramBot: AWSLambda.ProxyHandler = (event, _context, callback) => {
  if (!callback) {
    return
  }
  if (!event.body || event.body == null) {
    return callback(undefined, { statusCode: 400, body: '' })
  }

  try {
    const update = JSON.parse(event.body)
    handleUpdate(update)
    callback(undefined, {
      statusCode: 200,
      body: '',
    })
  } catch (error) {
    callback(error, { statusCode: 500, body: '' })
  }
}
