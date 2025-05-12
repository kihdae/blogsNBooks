import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginCredentials = z.infer<typeof loginSchema>;

export const adminLogin = async (credentials: LoginCredentials) => {
  loginSchema.parse(credentials);

  const user = await prisma.user.findUnique({
    where: { username: credentials.username },
  });

  if (!user) {
    throw new Error('invalid creds');
  }

  const passwordMatch = await bcrypt.compare(credentials.password, user.password);

  if (!passwordMatch) {
    throw new Error('invalid creds');
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '1h',
  });

  return { token };
};

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};