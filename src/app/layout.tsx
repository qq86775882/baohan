import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '保函验证系统',
  description: '保函信息验证系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}