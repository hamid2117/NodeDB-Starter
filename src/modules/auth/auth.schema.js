const { z } = require('zod')

exports.registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

exports.verifyEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
  verificationToken: z.string().min(1, 'Verification token is required'),
})

exports.loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

exports.forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
})

exports.resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
