import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'mysql6.sqlpub.com',
  port: parseInt(process.env.DB_PORT || '3311'),
  user: process.env.DB_USER || 'baobaowang',
  password: process.env.DB_PASSWORD || '7EfdBg2FqB65A59o',
  database: process.env.DB_NAME || 'baobaowang',
  // 添加安全配置
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  charset: 'utf8mb4',
  connectTimeout: 60000, // 60秒连接超时
  acquireTimeout: 60000, // 60秒获取超时
  timeout: 60000, // 60秒查询超时
};

// 数据清理函数
export function sanitizeInput(input: string): string {
  // 防止SQL注入的基本清理
  return input
    .replace(/'/g, "''")  // 转义单引号
    .replace(/;/g, '')    // 移除分号
    .replace(/--/g, '')   // 移除注释符
    .replace(/\/\*/g, '') // 移除块注释开始
    .replace(/\*\//g, '') // 移除块注释结束
    .trim();              // 移除首尾空格
}

let connection: mysql.Connection | null = null;

export async function getDbConnection(): Promise<mysql.Connection> {
  if (!connection) {
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('数据库连接成功');
    } catch (error) {
      console.error('数据库连接失败:', error);
      throw error;
    }
  }
  
  // 每次获取连接时，确保表结构正确
  try {
    // 检查表是否存在
    const [existingTables] = await connection.execute('SHOW TABLES LIKE \'guarantees\'') as [mysql.RowDataPacket[], any];
    
    if (existingTables.length === 0) {
      // 如果表不存在，创建表
      await connection.execute(`
        CREATE TABLE guarantees (
          id INT AUTO_INCREMENT PRIMARY KEY,
          guarantee_number VARCHAR(255) NOT NULL UNIQUE,
          anti_fake_code VARCHAR(255) NOT NULL UNIQUE,
          beneficiary VARCHAR(255) NOT NULL,
          applicant VARCHAR(255) NOT NULL,
          project_name VARCHAR(255) NOT NULL,
          guarantee_amount DECIMAL(15,2) NOT NULL,
          expiry_date DATE NOT NULL,
          guarantor VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('已创建guarantees表');
    } else {
      // 如果表存在，检查并修复列结构
      const [columns] = await connection.execute('DESCRIBE guarantees') as [mysql.RowDataPacket[], any];
      const existingColumns = columns.map((col: any) => col.Field);
      
   
      
      // 定义我们期望的列
      const expectedColumns = [
        'id', 'guarantee_number', 'anti_fake_code', 'beneficiary', 
        'applicant', 'project_name', 'guarantee_amount', 'expiry_date', 
        'guarantor', 'created_at', 'updated_at'
      ];
      
      // 找出多余的列
      const extraColumns = existingColumns.filter((col: string) => !expectedColumns.includes(col));
     
      
      // 删除多余的列
      for (const col of extraColumns) {
        try {
          await connection.execute(`ALTER TABLE guarantees DROP COLUMN \`${col}\``);
          console.log(`已删除错误的 ${col} 列`);
        } catch (err) {
          console.log(`删除列 ${col} 时出错（可能不存在）:`, err);
        }
      }
      
      // 确保所有必需的列都存在
      const missingColumns = expectedColumns.filter((col: string) => !existingColumns.includes(col));
      if (missingColumns.length > 0) {
        console.log('缺少的列:', missingColumns);
        for (const col of missingColumns) {
          if (col === 'id') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST');
          } else if (col === 'guarantee_number') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN guarantee_number VARCHAR(255) NOT NULL UNIQUE AFTER id');
          } else if (col === 'anti_fake_code') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN anti_fake_code VARCHAR(255) NOT NULL UNIQUE AFTER guarantee_number');
          } else if (col === 'beneficiary') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN beneficiary VARCHAR(255) NOT NULL AFTER anti_fake_code');
          } else if (col === 'applicant') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN applicant VARCHAR(255) NOT NULL AFTER beneficiary');
          } else if (col === 'project_name') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN project_name VARCHAR(255) NOT NULL AFTER applicant');
          } else if (col === 'guarantee_amount') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN guarantee_amount DECIMAL(15,2) NOT NULL AFTER project_name');
          } else if (col === 'expiry_date') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN expiry_date DATE NOT NULL AFTER guarantee_amount');
          } else if (col === 'guarantor') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN guarantor VARCHAR(255) NOT NULL AFTER expiry_date');
          } else if (col === 'created_at') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER guarantor');
          } else if (col === 'updated_at') {
            await connection.execute('ALTER TABLE guarantees ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at');
          }
        }
      }
      
      // 检查并修复列的数据类型和约束
      const [tableInfo] = await connection.execute('DESCRIBE guarantees') as [mysql.RowDataPacket[], any];
      for (const col of tableInfo) {
        const { Field, Type, Null, Key, Extra } = col;
        // 修复 id 列
        if (Field === 'id' && (Key !== 'PRI' || Extra !== 'auto_increment')) {
          try {
            await connection.execute('ALTER TABLE guarantees DROP PRIMARY KEY');
          } catch (e) {
            // 如果没有主键，忽略错误
          }
          await connection.execute('ALTER TABLE guarantees MODIFY COLUMN id INT AUTO_INCREMENT PRIMARY KEY');
        }
        // 修复 guarantee_number 列
        else if (Field === 'guarantee_number' && (Key !== 'UNI' || Type !== 'varchar(255)')) {
          await connection.execute('ALTER TABLE guarantees MODIFY COLUMN guarantee_number VARCHAR(255) NOT NULL UNIQUE');
        }
        // 修复 anti_fake_code 列
        else if (Field === 'anti_fake_code' && (Key !== 'UNI' || Type !== 'varchar(255)')) {
          await connection.execute('ALTER TABLE guarantees MODIFY COLUMN anti_fake_code VARCHAR(255) NOT NULL UNIQUE');
        }
      }
    }
  } catch (error) {
    console.error('检查/修复表结构时出错:', error);
    throw error;
  }

  return connection;
}