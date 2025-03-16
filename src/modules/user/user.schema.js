const { z } = require('zod')

exports.userIdSchema = z.object({
  id: z
    .string()
    .or(z.number().int().positive())
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: 'ID must be a valid number',
    }),
})

exports.updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  email: z.string().email('Invalid email format').optional(),
})

exports.updatePasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Old password must be at least 6 characters'),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters')
    .max(50, 'New password must be less than 50 characters'),
})

exports.getUsersQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => Number(val) || 1)
    .optional(),
  limit: z
    .string()
    .transform((val) => Number(val) || 10)
    .optional(),
  sortBy: z.string().optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
})
