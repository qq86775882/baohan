'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import '../../../../verify.css';

export default function VerifyResultPage() {
  const { guarantee_number, anti_fake_code } = useParams();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyGuarantee = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guarantee_number,
            anti_fake_code
          })
        });

        const data = await response.json();

        if (response.ok) {
          setResult(data.guarantee);
        } else {
          setError(data.error || '验证失败');
        }
      } catch (err) {
        setError('网络错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    if (guarantee_number && anti_fake_code) {
      verifyGuarantee();
    }
  }, [guarantee_number, anti_fake_code]);

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

      {/* 内容区域 */}
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
          
          {/* 结果显示区域 */}
          <div>
            <div id="no_result" className={!result && error ? '' : 'hidden'}>
              <div className="border-0 text-center p-4">
                <p className="text-gray-700 text-sm">温馨提醒：如果查询无结果，说明您输入的保函编号或者防伪码有误。</p>
              </div>
            </div>
            
            <div id="result" className={result ? '' : 'hidden'}>
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
                  <div className="flex-1">
                    <span className="font-semibold text-sm text-gray-600">保函编号：</span>
                    <span className="blue text-blue-700 ml-1 text-sm break-all">{result?.guarantee_number}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm text-gray-600">防伪码：</span>
                    <span className="blue text-blue-700 ml-1 text-sm break-all">{anti_fake_code}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">查询结果</h2>

                <div className="space-y-3">
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">受益人</span>
                    <span className="text-base text-gray-800">{result?.beneficiary}</span>
                  </div>
                  
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">申请单位</span>
                    <span className="text-base text-gray-800">{result?.applicant}</span>
                  </div>
                  
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">工程名称</span>
                    <span className="text-base text-gray-800">{result?.project_name}</span>
                  </div>
                  
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">担保金额</span>
                    <span className="text-base text-gray-800">{result?.guarantee_amount}</span>
                  </div>
                  
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">担保期限</span>
                    <span className="text-base text-gray-800">{result?.guarantee_period}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">担保人</span>
                    <span className="text-base text-gray-800">{result?.guarantor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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