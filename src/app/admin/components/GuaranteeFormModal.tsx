'use client';

import { useState } from 'react';

interface GuaranteeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function GuaranteeFormModal({ isOpen, onClose, onSubmit, loading }: GuaranteeFormProps) {
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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除之前的消息
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 准备数据
    const submitData = {
      ...formData,
      anti_fake_code: autoGenerateCode ? '' : formData.anti_fake_code, // 如果选择自动生成，则不发送防伪码
      guarantee_amount: parseFloat(formData.guarantee_amount)
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    // 重置表单和消息
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
    setAutoGenerateCode(true);
    setMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">新增保函信息</h3>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          
          {message && (
            <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 保函编号 */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入保函编号"
                />
              </div>

              {/* 防伪码 */}
              <div>
                <label htmlFor="anti_fake_code" className="block text-sm font-medium text-gray-700 mb-1">
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
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${autoGenerateCode ? 'bg-gray-100' : ''}`}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入受益人"
                />
              </div>

              {/* 申请单位 */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入申请单位"
                />
              </div>

              {/* 工程名称 */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入工程名称"
                />
              </div>

              {/* 担保金额 */}
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
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入担保金额"
                />
              </div>

              {/* 担保期限 */}
              <div>
                <label htmlFor="guarantee_period" className="block text-sm font-medium text-gray-700 mb-1">
                  担保期限 *
                </label>
                <input
                  type="text"
                  id="guarantee_period"
                  name="guarantee_period"
                  value={formData.guarantee_period}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="yyyy-mm-dd"
                />
              </div>

              {/* 担保人 */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入担保人"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
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