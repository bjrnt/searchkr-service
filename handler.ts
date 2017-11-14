import { search } from './src/cached-search'

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

  search(event.queryStringParameters.query)
    .then(results => {
      callback(undefined, { statusCode: 200, body: results })
    })
    .catch(error => {
      callback(error, { statusCode: 500, body: '' })
    })
}
