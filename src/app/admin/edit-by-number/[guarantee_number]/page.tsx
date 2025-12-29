'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function EditGuaranteeByNumberPage() {
  const { guarantee_number } = useParams();
  const [formData, setFormData] = useState({
    id: 0,
    guarantee_number: '',
    anti_fake_code: '',
    beneficiary: '',
    applicant: '',
    project_name: '',
    guarantee_amount: '',
    guarantee_period: '', // 改为担保期限
    guarantor: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  // 检查认证状态
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/admin/login');
    } else {
      fetchGuarantee();
    }
  }, [guarantee_number, router]);

  const fetchGuarantee = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setMessage({ type: 'error', text: '未授权访问' });
        return;
      }

      // 通过保函编号获取保函信息
      const response = await fetch(`/api/guarantees/by-number/${guarantee_number}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        // 设置表单数据
        setFormData({
          id: data.guarantee.id,
          guarantee_number: data.guarantee.guarantee_number,
          anti_fake_code: data.guarantee.anti_fake_code || '', // 确保防伪码被设置
          beneficiary: data.guarantee.beneficiary,
          applicant: data.guarantee.applicant,
          project_name: data.guarantee.project_name,
          guarantee_amount: data.guarantee.guarantee_amount,
          guarantee_period: data.guarantee.guarantee_period || '', // 直接使用日期字符串
          guarantor: data.guarantee.guarantor
        });
      } else {
        setMessage({ type: 'error', text: data.error || '获取保函信息失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除之前的错误消息
    if (message) {
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setMessage({ type: 'error', text: '未授权访问' });
        return;
      }

      // 通过保函编号更新保函信息，将undefined或null值转换为空字符串
      const response = await fetch(`/api/guarantees/by-number/${guarantee_number}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          guarantee_number: formData.guarantee_number, // 添加保函编号字段
          anti_fake_code: formData.anti_fake_code || '',
          beneficiary: formData.beneficiary,
          applicant: formData.applicant,
          project_name: formData.project_name,
          guarantee_amount: formData.guarantee_amount,
          guarantee_period: formData.guarantee_period,
          guarantor: formData.guarantor
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '保函信息更新成功' });
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          router.push('/admin/list');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || '更新失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请稍后重试' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">正在加载保函信息...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">编辑保函信息</h2>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  disabled
                  className="admin-login-input"
                />
              </div>

              <div>
                <label htmlFor="anti_fake_code" className="admin-login-label">
                  防伪码
                </label>
                <input
                  type="text"
                  id="anti_fake_code"
                  name="anti_fake_code"
                  value={formData.anti_fake_code}
                  onChange={handleChange}
                  className="admin-login-input"
                />
              </div>

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
                />
              </div>

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
                />
              </div>

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
                />
              </div>

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
                  className="admin-login-input"
                />
              </div>

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
                />
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                type="submit"
                className="admin-login-button"
              >
                更新保函
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/list')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}