'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="verify-result-header">
        <div className="verify-result-header-content">
          <img 
            src="/images/logo.jpg" 
            alt="Logo" 
            className="verify-result-logo"
          />
        </div>
      </div>

      {/* 主体内容 */}
      <div className="centre max-w-4xl mx-auto px-4 py-8">
        <div className="verify-result-title-section mb-8 text-center">
          <img 
            src="/images/magnifier.png" 
            alt="Magnifier" 
            className="w-24 h-24 mx-auto"
          />
          <h1 className="verify-result-title text-3xl font-bold text-blue-800 mt-4">中泰汇宏担保</h1>
          <p className="verify-result-explain text-orange-600 mt-2">中泰汇宏 专业第三方担保信息查询平台</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 text-red-800 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="level-item relative mt-7.5 min-h-10 pl-25">
            <div className="key absolute w-25 left-0 top-0 leading-10 text-gray-600">保函编号：</div>
            <div className="input-text">
              <input
                type="text"
                id="guarantee_number"
                name="guarantee_number"
                value={guaranteeNumber}
                onChange={(e) => setGuaranteeNumber(e.target.value)}
                required
                className="p-0 pl-2.5 box-border w-full h-10 leading-10 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>
          </div>
          <div className="level-item relative mt-7.5 min-h-10 pl-25">
            <div className="key absolute w-25 left-0 top-0 leading-10 text-gray-600">防伪码：</div>
            <div className="input-text">
              <input
                type="text"
                id="anti_fake_code"
                name="anti_fake_code"
                value={antiFakeCode}
                onChange={(e) => setAntiFakeCode(e.target.value)}
                required
                className="p-0 pl-2.5 box-border w-full h-10 leading-10 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>
          </div>
          <div className="level-item submit-box text-center mt-7.5">
            <button
              type="submit"
              id="submitBtn"
              className="verify-btn mx-auto"
            >
              验证
            </button>
          </div>
        </form>
      </div>

      {/* 底部 */}
      <div className="foot fixed right-0 bottom-0 left-0 h-11.25 leading-11.25 bg-white border-t border-gray-300 text-center shadow-[0_0_4px_1px_#dcdcdc]">
        中泰汇宏版权所有 &nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </div>
  );
}