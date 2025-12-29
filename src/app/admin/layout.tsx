'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import '../../admin.css'; // 引入后台管理样式

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    
    // 检查是否在登录页面，如果是则不进行认证检查
    if (pathname === '/admin/login') {
      return;
    }
    
    // 检查是否访问 /admin 根路径，如果是则重定向到 /admin/list
    if (pathname === '/admin') {
      router.push('/admin/list');
      return;
    }
    
    // 检查认证状态
    const token = localStorage.getItem('auth-token');
    if (token) {
      // 在实际应用中，你可能需要验证JWT令牌的有效性
      setIsAuthenticated(true);
    } else {
      // 重定向到登录页面
      router.push('/admin/login');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    // 清除认证令牌 - 同时清除 localStorage 和 cookie
    localStorage.removeItem('auth-token');
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'; // 清除cookie
    // 重定向到登录页面
    router.push('/admin/login');
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">保函后台管理系统</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">管理员</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        {children}
      </main>
    </div>
  );
}