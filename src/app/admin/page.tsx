'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    guarantee_number: '',
    anti_fake_code: '',
    beneficiary: '',
    applicant: '',
    project_name: '',
    guarantee_amount: '',
    guarantee_period: '', // 改为担保期限
    guarantor: ''
  });
  const [autoGenerateCode, setAutoGenerateCode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  // 检查认证状态
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  // 生成防伪码函数
  const generateAntiFakeCode = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefhijkmnpqrstuvwxyz2345678';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setMessage({ type: 'error', text: '未授权访问' });
        return;
      }

      // 创建保函信息
      const response = await fetch('/api/guarantees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          anti_fake_code: autoGenerateCode ? generateAntiFakeCode() : (formData.anti_fake_code || '') // 如果选择自动生成，则生成防伪码
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 显示成功消息，如果是自动生成的防伪码，则显示生成的防伪码
        let successMessage = '保函信息录入成功';
        if (autoGenerateCode && data.anti_fake_code) {
          successMessage += `！系统生成的防伪码：${data.anti_fake_code}`;
        }
        setMessage({ type: 'success', text: successMessage });
        
        // 清空表单
        setFormData({
          guarantee_number: '',
          anti_fake_code: '',
          beneficiary: '',
          applicant: '',
          project_name: '',
          guarantee_amount: '',
          guarantee_period: '', // 清空担保期限
          guarantor: ''
        });
        // 如果是自动生成防伪码，重置复选框
        if (autoGenerateCode) {
          setAutoGenerateCode(false);
        }
      } else {
        setMessage({ type: 'error', text: data.error || '录入失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">保函信息录入</h2>
          </div>
          
          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 保函编号 */}
              <div>
                <label htmlFor="guarantee_number" className="admin-login-label">
                  保函编号 *
                </label>
                <input
                  type="text"
                  id="guarantee_number"
                  name="guarantee_number"
                  value={formData.guarantee_number}
                  onChange={handleChange}
                  required
                  className="admin-login-input"
                  placeholder="请输入保函编号"
                />
              </div>

              {/* 防伪码 */}
              <div>
                <label htmlFor="anti_fake_code" className="admin-login-label">
                  防伪码 *
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    id="anti_fake_code"
                    name="anti_fake_code"
                    value={formData.anti_fake_code}
                    onChange={handleChange}
                    disabled={autoGenerateCode}
                    required={!autoGenerateCode}
                    className={`flex-1 admin-login-input ${autoGenerateCode ? 'bg-gray-100' : ''}`}
                    placeholder="请输入防伪码"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto_generate"
                      checked={autoGenerateCode}
                      onChange={(e) => setAutoGenerateCode(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="auto_generate" className="ml-2 block text-sm text-gray-700">
                      自动生成
                    </label>
                  </div>
                </div>
              </div>

              {/* 受益人 */}
              <div className="md:col-span-2">
                <label htmlFor="beneficiary" className="admin-login-label">
                  受益人 *
                </label>
                <input
                  type="text"
                  id="beneficiary"
                  name="beneficiary"
                  value={formData.beneficiary}
                  onChange={handleChange}
                  required
                  className="admin-login-input"
                  placeholder="请输入受益人"
                />
              </div>

              {/* 申请单位 */}
              <div className="md:col-span-2">
                <label htmlFor="applicant" className="admin-login-label">
                  申请单位 *
                </label>
                <input
                  type="text"
                  id="applicant"
                  name="applicant"
                  value={formData.applicant}
                  onChange={handleChange}
                  required
                  className="admin-login-input"
                  placeholder="请输入申请单位"
                />
              </div>

              {/* 工程名称 */}
              <div className="md:col-span-2">
                <label htmlFor="project_name" className="admin-login-label">
                  工程名称 *
                </label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  required
                  className="admin-login-input"
                  placeholder="请输入工程名称"
                />
              </div>

              {/* 担保金额 */}
              <div>
                <label htmlFor="guarantee_amount" className="admin-login-label">
                  担保金额 *
                </label>
                <input
                  type="number"
                  id="guarantee_amount"
                  name="guarantee_amount"
                  value={formData.guarantee_amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="admin-login-input"
                  placeholder="请输入担保金额"
                />
              </div>

              {/* 担保期限 */}
              <div>
                <label htmlFor="guarantee_period" className="admin-login-label">
                  担保期限 *
                </label>
                <input
                  type="text"
                  id="guarantee_period"
                  name="guarantee_period"
                  value={formData.guarantee_period}
                  onChange={handleChange}
                  required
                  placeholder="yyyy-mm-dd"
                  className="admin-login-input"
                />
              </div>

              {/* 担保人 */}
              <div className="md:col-span-2">
                <label htmlFor="guarantor" className="admin-login-label">
                  担保人 *
                </label>
                <input
                  type="text"
                  id="guarantor"
                  name="guarantor"
                  value={formData.guarantor}
                  onChange={handleChange}
                  required
                  className="admin-login-input"
                  placeholder="请输入担保人"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="admin-login-button"
              >
                {loading ? '提交中...' : '提交'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}