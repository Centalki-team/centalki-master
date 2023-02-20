export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  rapidApiKey: process.env.RAPID_API_KEY,
  sentryDNS: process.env.SENTRY_DNS,
  redisURI: process.env.REDIS_URI,
});
