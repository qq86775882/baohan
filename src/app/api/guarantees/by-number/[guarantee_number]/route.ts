import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(
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

    // 查询保函信息
    const [rows] = await connection.execute(
      'SELECT id, guarantee_number, anti_fake_code, beneficiary, applicant, project_name, guarantee_amount, guarantee_period, guarantor, created_at FROM guarantees WHERE guarantee_number = ?',
      [guarantee_number]
    ) as [mysql.RowDataPacket[], any];

    await connection.end();

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: '保函信息不存在' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ guarantee: rows[0] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('查询保函信息时出错:', error);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ guarantee_number: string }> }
) {
  let connection;
  try {
    const { guarantee_number: original_guarantee_number } = await params;
    const body = await request.json();
    const { 
      guarantee_number,
      anti_fake_code, 
      beneficiary, 
      applicant, 
      project_name, 
      guarantee_amount, 
      guarantee_period, // 改为担保期限
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

    // 更新保函信息
    const [result] = await connection.execute(
      'UPDATE guarantees SET guarantee_number = ?, anti_fake_code = ?, beneficiary = ?, applicant = ?, project_name = ?, guarantee_amount = ?, guarantee_period = ?, guarantor = ? WHERE guarantee_number = ?',
      [guarantee_number, anti_fake_code ?? '', beneficiary, applicant, project_name, guarantee_amount, guarantee_period, guarantor, original_guarantee_number]
    ) as [mysql.OkPacket, any];

    await connection.end();

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: '保函信息更新失败' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: '保函信息更新成功' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('更新保函信息时出错:', error);
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