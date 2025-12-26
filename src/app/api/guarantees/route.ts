import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';

// 生成防伪码函数
const generateAntiFakeCode = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefhijkmnpqrstuvwxyz2345678';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export async function GET(request: NextRequest) {
  let connection;
  try {
    // 创建数据库连接
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'mysql6.sqlpub.com',
      port: parseInt(process.env.DB_PORT || '3311'),
      user: process.env.DB_USER || 'baobaowang',
      password: process.env.DB_PASSWORD || '7EfdBg2FqB65A59o',
      database: process.env.DB_NAME || 'baobaowang',
      connectTimeout: 10000 // 10秒连接超时
    });

    // 获取所有保函信息（限制数量以避免性能问题）
    const [rows] = await connection.execute(
      'SELECT id, guarantee_number, anti_fake_code, beneficiary, applicant, project_name, guarantee_amount, guarantee_period, guarantor, created_at FROM guarantees ORDER BY created_at DESC LIMIT 100'
    ) as [mysql.RowDataPacket[], any];
    
    await connection.end();

    return new Response(
      JSON.stringify({ guarantees: rows }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('获取保函列表时出错:', error);
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

export async function POST(request: NextRequest) {
  let connection;
  try {
    const body = await request.json();
    const { 
      guarantee_number, 
      anti_fake_code, 
      beneficiary, 
      applicant, 
      project_name, 
      guarantee_amount, 
      guarantee_period,  // 改为担保期限
      guarantor 
    } = body;

    // 验证必填字段
    if (!guarantee_number || !beneficiary || !applicant || !project_name || !guarantee_amount || !guarantee_period || !guarantor) {
      return new Response(
        JSON.stringify({ error: '缺少必要字段' }),
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

    // 检查保函编号是否已存在
    const [existingRows] = await connection.execute(
      'SELECT id FROM guarantees WHERE guarantee_number = ?',
      [guarantee_number]
    ) as [mysql.RowDataPacket[], any];

    if (existingRows.length > 0) {
      await connection.end();
      return new Response(
        JSON.stringify({ error: '保函编号已存在' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 生成防伪码（如果未提供）
    const finalAntiFakeCode = anti_fake_code || generateAntiFakeCode();

    // 插入保函信息
    const [result] = await connection.execute(
      'INSERT INTO guarantees (guarantee_number, anti_fake_code, beneficiary, applicant, project_name, guarantee_amount, guarantee_period, guarantor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [guarantee_number, finalAntiFakeCode, beneficiary, applicant, project_name, guarantee_amount, guarantee_period, guarantor]
    ) as [mysql.RowDataPacket, any];

    await connection.end();

    return new Response(
      JSON.stringify({ 
        message: '保函信息创建成功',
        id: (result as any).insertId,
        anti_fake_code: finalAntiFakeCode // 返回防伪码
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('创建保函信息时出错:', error);
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