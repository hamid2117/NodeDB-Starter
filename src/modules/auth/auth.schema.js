const { z } = require('zod')

exports.registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})
exports.verifyEmailSchema = z.object({
  email: z.string().email(),
  verificationToken: z.string(),
})
exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
exports.forgotPasswordSchema = z.object({
  email: z.string().email(),
})
exports.resetPasswordSchema = z.object({
  token: z.string().uuid(),
  newPassword: z.string().min(6),
})
