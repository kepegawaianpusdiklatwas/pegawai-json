import { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, RefreshCw, Download } from 'lucide-react';
import FileUpload from './components/FileUpload';
import PreviewTable from './components/PreviewTable';
import { Pegawai, PreviewData } from './types/pegawai';
import { processExcelFile, generatePreview, mergeData } from './utils/excelProcessor';

type AppState = 'upload' | 'preview' | 'success' | 'error';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [currentData, setCurrentData] = useState<Pegawai[]>([]);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [excelData, setExcelData] = useState<Pegawai[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load current data on mount
  useEffect(() => {
    loadCurrentData();
  }, []);

  const loadCurrentData = async () => {
    try {
      const response = await fetch('/pegawai.json');
      if (response.ok) {
        const data = await response.json();
        setCurrentData(data);
      }
    } catch (error) {
      console.error('Error loading current data:', error);
      setCurrentData([]);
    }
  };

  const downloadJSON = (data: Pegawai[], filename: string = 'pegawai.json') => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError('');
    
    try {
      const data = await processExcelFile(file);
      
      if (data.length === 0) {
        throw new Error('Tidak ada data valid yang ditemukan dalam file Excel');
      }
      
      const preview = generatePreview(data, currentData);
      setExcelData(data);
      setPreviewData(preview);
      setState('preview');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses file');
      setState('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!previewData) return;
    
    setIsUpdating(true);
    
    try {
      const mergedData = mergeData(currentData, excelData);
      
      // Update local state
      setCurrentData(mergedData);
      
      // Simpan ke localStorage sebagai backup
      localStorage.setItem('pegawai-data', JSON.stringify(mergedData));
      
      // Download file JSON
      downloadJSON(mergedData, 'pegawai.json');
      
      const { newEmployees, updatedEmployees } = previewData;
      setSuccessMessage(
        `Berhasil memproses data! ${newEmployees.length} data baru ditambahkan, ${updatedEmployees.length} data diperbarui. File JSON telah didownload.`
      );
      setState('success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data');
      setState('error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setPreviewData(null);
    setExcelData([]);
    setState('upload');
  };

  const handleReset = () => {
    setError('');
    setSuccessMessage('');
    setPreviewData(null);
    setExcelData([]);
    setState('upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Update Data Pegawai
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload file Excel untuk memperbarui data pegawai. Sistem akan menambahkan data baru 
            dan memperbarui data yang sudah ada berdasarkan NIP.
          </p>
        </div>

        {/* Current Data Info */}
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm text-gray-600">
                Data saat ini: <strong>{currentData.length} pegawai</strong>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadCurrentData}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="card p-6">
          {state === 'upload' && (
            <FileUpload 
              onFileSelect={handleFileSelect} 
              isProcessing={isProcessing}
            />
          )}

          {state === 'preview' && previewData && (
            <PreviewTable
              previewData={previewData}
              onConfirm={handleConfirmUpdate}
              onCancel={handleCancel}
              isUpdating={isUpdating}
            />
          )}

          {state === 'success' && (
            <div className="text-center py-8">
              <div className="flex justify-center items-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-600 mr-2" />
                <Download className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Data Berhasil Diproses!
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {successMessage}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => downloadJSON(currentData, 'pegawai.json')}
                  className="btn-secondary flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Ulang
                </button>
                <button
                  onClick={handleReset}
                  className="btn-primary"
                >
                  Upload File Lain
                </button>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Terjadi Kesalahan
              </h2>
              <p className="text-red-600 mb-6 max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={handleReset}
                className="btn-primary"
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Pastikan file Excel memiliki kolom: Nama, NIP, Golongan, Jabatan<br/>
            File JSON akan otomatis terdownload setelah proses selesai
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;