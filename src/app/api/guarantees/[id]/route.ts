import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  try {
    const { id } = await params;

    // 验证ID
    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify({ error: '无效的ID' }),
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

    // 查询保函信息（不包含防伪码）
    const [rows] = await connection.execute(
      'SELECT id, guarantee_number, beneficiary, applicant, project_name, guarantee_amount, start_date, expiry_date, guarantor, created_at FROM guarantees WHERE id = ?',
      [id]
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
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  try {
    const { id } = await params;
    const body = await request.json();

    // 验证ID
    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify({ error: '无效的ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 验证请求体
    const { 
      guarantee_number, 
      anti_fake_code, 
      beneficiary, 
      applicant, 
      project_name, 
      guarantee_amount, 
      start_date,  // 新增担保开始日
      expiry_date, 
      guarantor 
    } = body;

    if (!guarantee_number || !beneficiary || !applicant || !project_name || !guarantee_amount || !start_date || !expiry_date || !guarantor) {
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

    // 更新保函信息，确保null值被转换为空字符串
    const [result, fields] = await connection.execute(
      'UPDATE guarantees SET guarantee_number = ?, anti_fake_code = ?, beneficiary = ?, applicant = ?, project_name = ?, guarantee_amount = ?, start_date = ?, expiry_date = ?, guarantor = ? WHERE id = ?',
      [
        guarantee_number,
        anti_fake_code ?? '', // 将null或undefined转换为空字符串
        beneficiary,
        applicant,
        project_name,
        guarantee_amount,
        start_date,  // 新增担保开始日
        expiry_date,
        guarantor,
        id
      ]
    );

    await connection.end();

    const updateResult = result as mysql.OkPacket;
    if (updateResult.affectedRows === 0) {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  try {
    const { id } = await params;

    // 验证ID
    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify({ error: '无效的ID' }),
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
    const [result, fields] = await connection.execute(
      'DELETE FROM guarantees WHERE id = ?',
      [id]
    );

    await connection.end();

    const deleteResult = result as mysql.OkPacket;
    if (deleteResult.affectedRows === 0) {
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