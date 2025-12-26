import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  let connection;
  try {
    const body = await request.json();
    const { guarantee_number, anti_fake_code } = body;

    if (!guarantee_number || !anti_fake_code) {
      return new Response(
        JSON.stringify({ error: '保函编号和防伪码不能为空' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 创建数据库连接
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'mysql6.sqlpub.com',
      port: parseInt(process.env.DB_PORT || '3311'),
      user: process.env.DB_USER || 'baobaowang',
      password: process.env.DB_PASSWORD || '7EfdBg2FqB65A59o',
      database: process.env.DB_NAME || 'baobaowang',
      connectTimeout: 10000 // 10秒连接超时
    });

    // 查询保函信息
    const [rows] = await connection.execute(
      'SELECT id, guarantee_number, anti_fake_code, beneficiary, applicant, project_name, guarantee_amount, guarantee_period, guarantor, created_at FROM guarantees WHERE guarantee_number = ? AND anti_fake_code = ?',
      [guarantee_number, anti_fake_code]
    ) as [mysql.RowDataPacket[], any];

    await connection.end();

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: '保函信息不存在或防伪码错误' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ guarantee: rows[0] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('验证保函信息时出错:', error);
    // 确保在出错时关闭连接
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('关闭数据库连接时出错:', closeError);
      }
    }
    return new Response(
      JSON.stringify({ error: '服务器内部错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}