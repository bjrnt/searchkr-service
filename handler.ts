import * as makeDebug from 'debug'
import searchKr from '@bjrnt/searchkr'
import * as cache from './src/cache'

const debug = makeDebug('searchkr:handler')

const performSearch = async (query: string): Promise<string> => {
  const cacheResult = await cache.get(query)

  if (cacheResult == null) {
    debug(`Cache miss, getting results for ${query}...`)
    const searchResult = await searchKr(query)
    debug(`Queried results for ${query}`)
    const stringifiedResult = JSON.stringify(searchResult)
    try {
      await cache.set(query, stringifiedResult)
      debug(`Cached results for ${query}`)
    } catch (error) {
      debug('Could not set cache', query, stringifiedResult, error)
    }
    debug(`Returning results for ${query}`)
    return stringifiedResult
  } else {
    debug(`Cache hit for ${query}`)
    debug(`Returning results for ${query}`)
    return cacheResult
  }
}

export const searchkr: AWSLambda.ProxyHandler = (event, _context, callback) => {
  if (event.queryStringParameters == null || (event.queryStringParameters && event.queryStringParameters.query == null )) {
    callback(undefined, { statusCode: 400, body: '' })
  }

  performSearch(event.queryStringParameters.query).then(results => {
    callback(undefined, { statusCode: 200, body: results })
  }).catch(error => {
    callback(error, { statusCode: 500, body: '' })
  })
}
