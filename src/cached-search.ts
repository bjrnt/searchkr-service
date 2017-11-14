import * as makeDebug from 'debug'
import lookup from '@bjrnt/seonbi-core'
import * as cache from './cache'

const debug = makeDebug('seonbi-service:search')

export async function search(query: string): Promise<string> {
  const cacheResult = await cache.get(query)

  if (cacheResult == null) {
    debug(`Cache miss, getting results for ${query}...`)
    const searchResult = await lookup(query)
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
