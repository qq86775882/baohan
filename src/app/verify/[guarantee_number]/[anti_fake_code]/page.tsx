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
    <div className="verify-result-container">
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

      {/* 内容区域 */}
      <div className="verify-result-content">
        <div className="verify-result-title-section">
          <img 
            src="/images/magnifier.png" 
            alt="Magnifier" 
            className="verify-result-magnifier-icon"
          />
          <h1 className="verify-result-title">中泰汇宏担保</h1>
          <p className="verify-result-explain">中泰汇宏 专业第三方担保信息查询平台</p>
        </div>
        
        {/* 结果显示区域 */}
        <div className="detail max-w-6xl mx-auto pb-50">
          <div id="no_result" className={!result && error ? '' : 'hidden'}>
            <div className="code-list border-0 text-center" style={{ border: '0px solid' }}>
              <p className="text-gray-700">温馨提醒：如果查询无结果，说明您输入的保函编号或者防伪码有误。</p>
            </div>
          </div>
          
          <div id="result" className={result ? '' : 'hidden'}>
            <div className="verify-result-code-list">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="font-semibold">保函编号：</span>
                  <span className="blue text-blue-700 ml-2" id="GuarateeCodeVal">{result?.guarantee_number}</span>
                </div>
                <div>
                  <span className="font-semibold">防伪码：</span>
                  <span className="blue text-blue-700 ml-2" id="SecurityCodeVal">{anti_fake_code}</span>
                </div>
              </div>
            </div>

            <div className="verify-result-content-title">
              查询结果
            </div>

            <div className="verify-result-content-body">
              <div className="remark p-10">
                {/* 验证成功提示 */}
              </div>

              <div className="verify-result-jsondata" id="JsondataBox">
                <ul>
                  <li>
                    <span className="verify-result-jsondata-key" id="JsonSyrKey">受益人：</span>
                    <span className="verify-result-jsondata-val" id="JsonSyr">{result?.beneficiary}</span>
                  </li>
                  <li>
                    <span className="verify-result-jsondata-key" id="JsonSqdwKey">申请单位：</span>
                    <span className="verify-result-jsondata-val" id="JsonSqdw">{result?.applicant}</span>
                  </li>
                  <li>
                    <span className="verify-result-jsondata-key" id="JsonGcmcKey">工程名称：</span>
                    <span className="verify-result-jsondata-val" id="JsonGcmc">{result?.project_name}</span>
                  </li>
                  <li>
                    <span className="verify-result-jsondata-key" id="JsonDgjeKey">担保金额(万元)：</span>
                    <span className="verify-result-jsondata-val" id="JsonDgje">{result?.guarantee_amount}</span>
                  </li>
                  <li>
                    <span className="verify-result-jsondata-key" id="DbqsKey">担保期限：</span> {/* 改为担保期限 */}
                    <span className="verify-result-jsondata-val" id="Dbqs">{result?.guarantee_period}</span> {/* 改为担保期限 */}
                  </li>
                  <li>
                    <span className="verify-result-jsondata-key" id="JsonDgrKey">担保人：</span>
                    <span className="verify-result-jsondata-val" id="JsonDgr">{result?.guarantor}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <div className="verify-result-footer">
        中泰汇宏版权所有 &nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </div>
  );
}