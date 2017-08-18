import * as redis from 'redis'

const redisPort = process.env.IS_OFFLINE ? 6379 : Number(process.env.CACHE_PORT)
const redisUrl = process.env.IS_OFFLINE ? 'localhost' : process.env.CACHE_URL

const createClient = () => redis.createClient(redisPort, redisUrl, { no_ready_check: true })

export const get = (key: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const client = createClient()
    client.on('error', err => reject(err))

    client.get(key, (error, result) => {
      client.quit()
      if (error) {
        return reject(error)
      }
      resolve(result)
    })
  })
}

export const set = (key: string, value: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const client = createClient()
    client.on('error', err => reject(err))

    client.set(key, value, error => {
      client.quit()
      if (error) {
        return reject(error)
      }
      resolve()
    })
  })
}
