'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function EditGuaranteePage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    guarantee_number: '',
    anti_fake_code: '',
    beneficiary: '',
    applicant: '',
    project_name: '',
    guarantee_amount: '',
    expiry_date: '',
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
  }, [id, router]);

  const fetchGuarantee = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setMessage({ type: 'error', text: '未授权访问' });
        return;
      }

      // 通过ID获取保函信息
      const response = await fetch(`/api/guarantees/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(data.guarantee);
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

      // 更新保函信息
      const response = await fetch(`/api/guarantees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">编辑保函信息</h2>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="guarantee_number" className="block text-sm font-medium text-gray-700 mb-1">
                  保函编号 *
                </label>
                <input
                  type="text"
                  id="guarantee_number"
                  name="guarantee_number"
                  value={formData.guarantee_number}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="anti_fake_code" className="block text-sm font-medium text-gray-700 mb-1">
                  防伪码
                </label>
                <input
                  type="text"
                  id="anti_fake_code"
                  name="anti_fake_code"
                  value={formData.anti_fake_code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700 mb-1">
                  受益人 *
                </label>
                <input
                  type="text"
                  id="beneficiary"
                  name="beneficiary"
                  value={formData.beneficiary}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="applicant" className="block text-sm font-medium text-gray-700 mb-1">
                  申请单位 *
                </label>
                <input
                  type="text"
                  id="applicant"
                  name="applicant"
                  value={formData.applicant}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="project_name" className="block text-sm font-medium text-gray-700 mb-1">
                  工程名称 *
                </label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="guarantee_amount" className="block text-sm font-medium text-gray-700 mb-1">
                  担保金额(万元) *
                </label>
                <input
                  type="number"
                  id="guarantee_amount"
                  name="guarantee_amount"
                  value={formData.guarantee_amount}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-1">
                  担保期限 *
                </label>
                <input
                  type="date"
                  id="expiry_date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="guarantor" className="block text-sm font-medium text-gray-700 mb-1">
                  担保人 *
                </label>
                <input
                  type="text"
                  id="guarantor"
                  name="guarantor"
                  value={formData.guarantor}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium"
              >
                更新保函
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/list')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md text-sm font-medium"
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