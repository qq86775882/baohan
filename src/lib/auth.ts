import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-this-in-production';

// 管理员用户信息
export interface AdminUser {
  id: number;
  username: string;
  role: string;
}

// 生成JWT令牌
export function generateToken(user: AdminUser): string {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// 验证JWT令牌
export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch (error) {
    console.error('Token验证失败:', error);
    return null;
  }
}

// 简单的管理员验证（在实际应用中，您可能需要从数据库验证用户）
export function validateAdmin(username: string, password: string): boolean {
  // 在实际应用中，这里应该查询数据库验证用户
  // 为演示目的，使用默认管理员账户
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123'; // 在生产环境中应使用哈希密码

  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// 验证用户登录状态
export function isAuthenticated(token: string | undefined): boolean {
  if (!token) {
    return false;
  }
  return verifyToken(token) !== null;
}