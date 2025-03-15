const config = {
  host:
    process.env.NODE_ENV === 'production'
      ? process.env.EMAIL_HOST
      : 'localhost',
  port: process.env.NODE_ENV === 'production' ? process.env.EMAIL_PORT : 1025,
  secure: process.env.NODE_ENV === 'production',
  auth:
    process.env.NODE_ENV === 'production'
      ? {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        }
      : null, // No auth needed for MailHog
}

module.exports = config
