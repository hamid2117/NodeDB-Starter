const nodemailer = require('nodemailer')
const { emailConfig } = require('../../config/config')

const sendEmail = async ({ to, subject, html }) => {
  //const testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport(emailConfig)

  return transporter.sendMail({
    from: '"Node Starter" <nodestarter@gmail.com>', // sender address
    to,
    subject,
    html,
  })
}

module.exports = sendEmail
