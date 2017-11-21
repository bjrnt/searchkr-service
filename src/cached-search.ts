import * as makeDebug from 'debug'
import seonbi, { transform, Options, Result } from '@bjrnt/seonbi-core'
import * as cache from './cache'

const debug = makeDebug('seonbi-service:search')

export async function search(query: string, options?: Options): Promise<Result[]> {
  let results: Result[] = await cache.get(query).then(JSON.parse)

  if (results == null) {
    debug(`Cache miss, getting results for ${query}...`)
    const searchResult = await seonbi(query)
    debug(`Queried results for ${query}`)
    const stringifiedResult = JSON.stringify(searchResult)
    try {
      await cache.set(query, stringifiedResult)
      debug(`Cached results for ${query}`)
    } catch (error) {
      debug('Could not set cache', query, stringifiedResult, error)
    }
    results = searchResult
  } else {
    debug(`Cache hit for ${query}`)
  }

  if (options) {
    debug(`Transforming results with options ${JSON.stringify(options)}`)
    results = await transform(query, results, options)
  }

  debug(`Returning results for ${query}`)
  return results
}
