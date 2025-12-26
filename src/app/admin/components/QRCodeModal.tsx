'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  guaranteeNumber: string;
  antiFakeCode: string;
}

export default function QRCodeModal({ isOpen, onClose, guaranteeNumber, antiFakeCode }: QRCodeModalProps) {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  if (!isOpen) return null;

  // 如果是查询页面的二维码
  const isQueryPage = guaranteeNumber === 'query' && antiFakeCode === 'query';
  const qrCodeUrl = isQueryPage 
    ? `${baseUrl}/verify`  // 指向查询页面
    : `${baseUrl}/verify/${guaranteeNumber}/${antiFakeCode}`; // 指向具体保函验证页面

  // 根据类型显示不同的提示文本
  const title = isQueryPage ? '查询页面二维码' : '保函二维码';
  const description = isQueryPage 
    ? '扫描二维码进入保函查询页面' 
    : '扫描二维码查看保函验证信息';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <QRCodeSVG 
                value={qrCodeUrl} 
                size={200} 
                level="H" 
                includeMargin={true}
              />
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              {description}
            </p>
            <div className="mt-4 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                链接：
              </label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={qrCodeUrl}
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(qrCodeUrl)}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 border border-l-0 border-gray-300 rounded-r-md text-sm"
                >
                  复制
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}