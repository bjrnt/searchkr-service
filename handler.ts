import * as makeDebug from 'debug'
import searchKr from '@bjrnt/searchkr'
import * as cache from './src/cache'

const debug = makeDebug('searchkr:handler')

const performSearch = async (query: string): Promise<string> => {
  console.log('a')
  const cacheResult = await cache.get(query)

  console.log('d')
  if (cacheResult == null) {
    debug(`Cache miss, getting results for ${query}...`)
    console.log('e')
    const searchResult = await searchKr(query)
    console.log('f')
    debug(`Queried results for ${query}`)
    const stringifiedResult = JSON.stringify(searchResult)
    try {
      console.log('g')
      await cache.set(query, stringifiedResult)
      debug(`Cached results for ${query}`)
      console.log('h')
    } catch (error) {
      console.log('j')
      debug('Could not set cache', query, stringifiedResult, error)
    }
    debug(`Returnign results for ${query}`)
    return stringifiedResult
  } else {
    console.log('k')
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
