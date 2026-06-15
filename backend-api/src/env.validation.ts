import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // DATABASE_URL must exist — app refuses to start without it
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment variables:');
    console.error(result.error.format());
    process.exit(1);
  }

  return result.data;
}