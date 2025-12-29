'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../verify.css'; // 引入验证页面样式

export default function VerifyPage() {
  const [guaranteeNumber, setGuaranteeNumber] = useState('');
  const [antiFakeCode, setAntiFakeCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guaranteeNumber || !antiFakeCode) {
      setError('请输入保函编号和防伪码');
      return;
    }
    
    // 清除错误信息
    setError('');
    
    // 跳转到验证结果页面
    router.push(`/verify/${guaranteeNumber}/${antiFakeCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="verify-result-header bg-white">
        <div className="verify-result-header-content px-4">
          <div className="flex items-center">
            <img 
              src="/images/logo.jpg" 
              alt="Logo" 
              className="verify-result-logo h-8 w-auto"
            />
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/images/magnifier.png" 
                alt="Magnifier" 
                className="w-16 h-16"
              />
            </div>
            <h1 className="verify-result-title text-xl font-bold text-blue-800">中泰汇宏担保</h1>
            <p className="verify-result-explain text-orange-600 text-sm mt-2">中泰汇宏 专业第三方担保信息查询平台</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-md bg-red-50 text-red-800 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">保函编号</label>
              <input
                type="text"
                id="guarantee_number"
                name="guarantee_number"
                value={guaranteeNumber}
                onChange={(e) => setGuaranteeNumber(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="请输入保函编号"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">防伪码</label>
              <input
                type="text"
                id="anti_fake_code"
                name="anti_fake_code"
                value={antiFakeCode}
                onChange={(e) => setAntiFakeCode(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="请输入防伪码"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                id="submitBtn"
                className="verify-btn w-full py-3 text-base"
              >
                验证
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 底部 */}
      <div className="verify-result-footer py-3">
        <div className="text-center text-sm text-gray-600">
          中泰汇宏版权所有
        </div>
      </div>
    </div>
  );
}