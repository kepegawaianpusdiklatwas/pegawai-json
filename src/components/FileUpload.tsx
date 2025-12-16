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
          <div className="space-y-1">
            <div className="font-medium text-gray-800 border-b pb-1 mb-2">Posisi Kolom Excel:</div>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>• Kolom B (2): NIP</div>
              <div>• Kolom C (3): Nama</div>
              <div>• Kolom K (11): Golongan</div>
              <div>• Kolom N (14): Jabatan</div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded border text-xs mt-2">
          <div className="font-medium text-blue-800 mb-1">Contoh Data:</div>
          <div className="text-blue-700">
            <div>• NIP: 19760420202521022 (tanpa spasi)</div>
            <div>• Nama: Abdul Kodir</div>
            <div>• Golongan: III/a</div>
            <div>• Jabatan: Pengelola Umum Operasional</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-red-600">
          <p><strong>Penting:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>NIP diambil dari kolom B (2), Nama dari kolom C (3)</li>
            <li>Golongan diambil dari kolom K (11), Jabatan dari kolom N (14)</li>
            <li>Baris pertama adalah header, data dimulai dari baris kedua</li>
            <li>NIP akan otomatis dihapus spasinya</li>
            <li>Pastikan kolom yang diperlukan tidak kosong</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;