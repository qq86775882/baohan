import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ guarantee_number: string }> }
) {
  let connection;
  try {
    const { guarantee_number } = await params;

    // 验证保函编号
    if (!guarantee_number) {
      return new Response(
        JSON.stringify({ error: '保函编号不能为空' }),
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

    // 删除保函信息
    const [result] = await connection.execute(
      'DELETE FROM guarantees WHERE guarantee_number = ?',
      [guarantee_number]
    ) as [mysql.OkPacket, any];

    await connection.end();

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: '保函信息删除失败' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: '保函信息删除成功' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('删除保函信息时出错:', error);
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