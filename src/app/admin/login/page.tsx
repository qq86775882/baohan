'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 检查是否已经登录，如果是则重定向到管理页面
    const token = localStorage.getItem('auth-token');
    if (token) {
      router.push('/admin/list');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 登录成功，保存token到localStorage
        localStorage.setItem('auth-token', data.token);
        
        // 同时设置cookie以便中间件可以验证
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; SameSite=Lax; Secure=false`; // 24小时过期
        
        // 重定向到管理页面
        router.push('/admin/list');
      } else {
        setError(data.error || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2 className="admin-login-title">
          保函后台管理系统
        </h2>
        <p className="admin-login-subtitle">
          请登录您的账户
        </p>
        
        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}
          
          <div className="admin-login-input-group">
            <label htmlFor="username" className="admin-login-label">
              用户名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-login-input"
              placeholder="请输入用户名"
            />
          </div>
          <div className="admin-login-input-group">
            <label htmlFor="password" className="admin-login-label">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-login-input"
              placeholder="请输入密码"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="admin-login-button"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}