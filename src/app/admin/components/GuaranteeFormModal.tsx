'use client';

import { useState } from 'react';

interface GuaranteeFormData {
  guarantee_number: string;
  anti_fake_code: string;
  beneficiary: string;
  applicant: string;
  project_name: string;
  guarantee_amount: number;
  guarantee_period: string;
  guarantor: string;
}

interface GuaranteeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GuaranteeFormData) => void;
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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="mr-3 bg-blue-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">新增保函信息</h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 保函编号 */}
              <div>
                <label htmlFor="guarantee_number" className="block text-sm font-medium text-gray-700 mb-2">
                  保函编号 *
                </label>
                <input
                  type="text"
                  id="guarantee_number"
                  name="guarantee_number"
                  value={formData.guarantee_number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="请输入保函编号"
                />
              </div>

              {/* 防伪码 */}
              <div>
                <label htmlFor="anti_fake_code" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${autoGenerateCode ? 'bg-gray-100' : ''}`}
                    placeholder="请输入防伪码"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto_generate"
                      checked={autoGenerateCode}
                      onChange={(e) => setAutoGenerateCode(e.target.checked)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="auto_generate" className="ml-2 block text-sm text-gray-700">
                      自动生成
                    </label>
                  </div>
                </div>
              </div>

              {/* 受益人 */}
              <div className="md:col-span-2">
                <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700 mb-2">
                  受益人 *
                </label>
                <input
                  type="text"
                  id="beneficiary"
                  name="beneficiary"
                  value={formData.beneficiary}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="请输入受益人"
                />
              </div>

              {/* 申请单位 */}
              <div className="md:col-span-2">
                <label htmlFor="applicant" className="block text-sm font-medium text-gray-700 mb-2">
                  申请单位 *
                </label>
                <input
                  type="text"
                  id="applicant"
                  name="applicant"
                  value={formData.applicant}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="请输入申请单位"
                />
              </div>

              {/* 工程名称 */}
              <div className="md:col-span-2">
                <label htmlFor="project_name" className="block text-sm font-medium text-gray-700 mb-2">
                  工程名称 *
                </label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="请输入工程名称"
                />
              </div>

              {/* 担保金额 */}
              <div>
                <label htmlFor="guarantee_amount" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="请输入担保金额"
                />
              </div>

              {/* 担保期限 */}
              <div>
                <label htmlFor="guarantee_period" className="block text-sm font-medium text-gray-700 mb-2">
                  担保期限 *
                </label>
                <input
                  type="text"
                  id="guarantee_period"
                  name="guarantee_period"
                  value={formData.guarantee_period}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="yyyy-mm-dd"
                />
              </div>

              {/* 担保人 */}
              <div className="md:col-span-2">
                <label htmlFor="guarantor" className="block text-sm font-medium text-gray-700 mb-2">
                  担保人 *
                </label>
                <input
                  type="text"
                  id="guarantor"
                  name="guarantor"
                  value={formData.guarantor}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="请输入担保人"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-6 pt-6 border-t border-gray-200 pt-8">
              <button style={{ marginRight: '8px' }}
                type="button"
                onClick={handleClose}
                className="admin-list-action-button admin-list-delete-button"
              >
                取消
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="admin-list-action-button admin-list-edit-button flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    提交中...
                  </>
                ) : '提交'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}
