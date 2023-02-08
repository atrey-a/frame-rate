import {createClient} from 'redis'

// export const client = (process.env.REDIS_URL) ? createClient({url: process.env.REDIS_URL}) : createClient();
export const client = createClient();

await client.connect()

client.on('connect', () => {
  console.log("Connected to Redis!");
})

client.on('ready', () => {
  console.log("Redis is Ready!");
})

client.on('error', (err) => {
  console.log(err.message);
})

client.on('end', () => {
  console.log("Disconnected from Redis!")
})

process.on('SIGINT', () => {
  client.quit()
})