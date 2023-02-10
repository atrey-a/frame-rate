import redis from 'redis'
export const client = redis.createClient();

// (async () => {
//   await client.connect();
// })();

client.on("ready", () => {
  console.log("Connected to Redis!");
});

client.on('ready', () => {
  console.log("Redis is Ready!");
})

client.on('error', (err) => {
  console.log(err.message);
})

client.on('end', () => {
  console.log("\nDisconnected from Redis!")
})

process.on('SIGINT', () => {
  client.quit()
})
