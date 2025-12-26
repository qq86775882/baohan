import { NextRequest } from 'next/server';
import { validateAdmin, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 限制请求大小
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB限制
      return new Response(
        JSON.stringify({ error: '请求体过大' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    // 验证输入
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: '用户名和密码不能为空' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 验证类型
    if (typeof username !== 'string' || typeof password !== 'string') {
      return new Response(
        JSON.stringify({ error: '用户名和密码必须是字符串' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 限制长度
    if (username.length > 100 || password.length > 100) {
      return new Response(
        JSON.stringify({ error: '用户名或密码长度超过限制' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isValid = validateAdmin(username, password);

    if (!isValid) {
      // 为了安全，不区分用户名或密码错误
      return new Response(
        JSON.stringify({ error: '用户名或密码错误' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 生成JWT令牌
    const user = {
      id: 1,
      username: username,
      role: 'admin'
    };
    
    const token = generateToken(user);

    // 返回成功响应，包括token
    return new Response(
      JSON.stringify({ 
        message: '登录成功',
        token, // 现在返回token
        user: { id: user.id, username: user.username, role: user.role }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('登录时发生错误:', error);
    
    // 对于解析错误，返回通用错误消息
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ error: '请求格式错误' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: '服务器内部错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}