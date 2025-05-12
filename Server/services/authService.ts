import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthService {
  async register(username: string, password: string, isAdmin: boolean = false): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin,
      },
    });
  }

  async login(username: string, password: string): Promise<{ token: string } | null> {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });
    return { token };
  }

  verifyToken(token: string): { userId: number; isAdmin: boolean } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; isAdmin: boolean };
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();