import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );
    
    if (excelFile) {
      onFileSelect(excelFile);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-blue-50 rounded-full">
            <FileSpreadsheet className="w-8 h-8 text-blue-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Upload File Excel
            </h3>
            <p className="text-sm text-gray-600">
              Drag & drop file Excel atau klik untuk memilih
            </p>
            <p className="text-xs text-gray-500">
              Format yang didukung: .xlsx, .xls
            </p>
          </div>
          
          <label className="btn-primary cursor-pointer inline-flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>{isProcessing ? 'Memproses...' : 'Pilih File'}</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
              disabled={isProcessing}
            />
          </label>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Format Excel yang diharapkan:</p>
        <div className="bg-gray-50 p-3 rounded border text-xs">
          <div className="grid grid-cols-4 gap-2 font-medium border-b pb-1 mb-1">
            <span>Nama</span>
            <span>NIP</span>
            <span>Golongan</span>
            <span>Jabatan</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-gray-600">
            <span>John Doe</span>
            <span>123456789</span>
            <span>III/a</span>
            <span>Staff</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;