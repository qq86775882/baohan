'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GuaranteeFormModal from '../components/GuaranteeFormModal';
import QRCodeModal from '../components/QRCodeModal';

export default function GuaranteeListPage() {
  const [guarantees, setGuarantees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [selectedQRCodeData, setSelectedQRCodeData] = useState({ guarantee_number: '', anti_fake_code: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // 添加message状态
  const router = useRouter();

  // 检查认证状态
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/admin/login');
    } else {
      fetchGuarantees();
    }
  }, [router]);

  const fetchGuarantees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('未授权访问');
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/guarantees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGuarantees(data.guarantees);
      } else {
        setError('获取保函列表失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, guarantee_number: string) => {
    if (!window.confirm('确定要删除这条保函信息吗？')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setMessage({ type: 'error', text: '未授权访问' });
        return;
      }

      // 通过保函编号删除保函信息
      const response = await fetch(`/api/guarantees/by-number/${guarantee_number}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '保函信息删除成功' });
        // 刷新保函列表
        fetchGuarantees();
      } else {
        setMessage({ type: 'error', text: data.error || '删除失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请稍后重试' });
    }
  };

  const handleGenerateQRCode = (guarantee_number: string, anti_fake_code: string) => {
    setSelectedQRCodeData({ guarantee_number, anti_fake_code });
    setShowQRCodeModal(true);
  };

  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('未授权访问');
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/guarantees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // 关闭弹窗并重新获取列表
        setShowModal(false);
        fetchGuarantees();
        setMessage({ type: 'success', text: `保函信息录入成功！系统生成的防伪码：${result.anti_fake_code}` });
      } else {
        setMessage({ type: 'error', text: result.error || '录入失败' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setFormLoading(false);
    }
  };

  // 过滤保函数据
  const filteredGuarantees = guarantees.filter(guarantee =>
    guarantee.guarantee_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guarantee.beneficiary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guarantee.applicant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-list-container">
        <h2 className="admin-list-title">保函列表</h2>
        <div className="text-center py-8">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">保函信息列表</h2>
            <div className="admin-list-actions">
              <button
                onClick={() => {
                  // 生成查询页面的二维码
                  setSelectedQRCodeData({ 
                    guarantee_number: 'query', 
                    anti_fake_code: 'query' 
                  });
                  setShowQRCodeModal(true);
                }}
                className="admin-list-add-button mr-2"
              >
                生成查询二维码
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="admin-list-add-button"
              >
                新增保函
              </button>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {/* 搜索框 */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="搜索保函编号、受益人或申请单位..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-list-search"
            />
          </div>

          {/* 表格容器 */}
          <div className="admin-list-table-container">
            <table className="admin-list-table">
              <thead>
                <tr>
                  <th className="admin-list-th">保函编号</th>
                  <th className="admin-list-th">受益人</th>
                  <th className="admin-list-th">申请单位</th>
                  <th className="admin-list-th">工程名称</th>
                  <th className="admin-list-th">担保金额(万元)</th>
                  <th className="admin-list-th">担保期限</th> {/* 改为担保期限 */}
                  <th className="admin-list-th">担保人</th>
                  <th className="admin-list-th">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuarantees.map((guarantee) => (
                  <tr key={guarantee.id} className="admin-list-tr">
                    <td className="admin-list-td">{guarantee.guarantee_number}</td>
                    <td className="admin-list-td">{guarantee.beneficiary}</td>
                    <td className="admin-list-td">{guarantee.applicant}</td>
                    <td className="admin-list-td">{guarantee.project_name}</td>
                    <td className="admin-list-td">{guarantee.guarantee_amount}</td>
                    <td className="admin-list-td">{guarantee.guarantee_period}</td> {/* 改为担保期限 */}
                    <td className="admin-list-td">{guarantee.guarantor}</td>
                    <td className="admin-list-td">
                      <div className="admin-list-actions-cell">
                        <button
                          onClick={() => router.push(`/admin/edit-by-number/${guarantee.guarantee_number}`)}
                          className="admin-list-action-button admin-list-edit-button"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(guarantee.id, guarantee.guarantee_number)}
                          className="admin-list-action-button admin-list-delete-button"
                        >
                          删除
                        </button>
                        <button
                          onClick={() => {
                            setSelectedQRCodeData({
                              guarantee_number: guarantee.guarantee_number,
                              anti_fake_code: guarantee.anti_fake_code
                            });
                            setShowQRCodeModal(true);
                          }}
                          className="admin-list-action-button admin-list-qr-button"
                        >
                          二维码
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">加载中...</span>
            </div>
          )}
        </div>
      </div>

      {/* 弹窗录入组件 */}
      <GuaranteeFormModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSubmit={handleFormSubmit} // 使用实际的提交处理函数
        loading={formLoading}
      />

      {/* 二维码模态框 */}
      <QRCodeModal 
        isOpen={showQRCodeModal} 
        onClose={() => setShowQRCodeModal(false)} 
        guaranteeNumber={selectedQRCodeData.guarantee_number} 
        antiFakeCode={selectedQRCodeData.anti_fake_code} 
      />
    </div>
  );
}
