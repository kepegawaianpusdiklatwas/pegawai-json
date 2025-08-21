import React from 'react';
import { UserPlus, UserCheck, Users } from 'lucide-react';
import { PreviewData } from '../types/pegawai';

interface PreviewTableProps {
  previewData: PreviewData;
  onConfirm: () => void;
  onCancel: () => void;
  isUpdating: boolean;
}

const PreviewTable: React.FC<PreviewTableProps> = ({ 
  previewData, 
  onConfirm, 
  onCancel, 
  isUpdating 
}) => {
  const { newEmployees, updatedEmployees, totalProcessed } = previewData;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Ringkasan Perubahan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalProcessed}</p>
                <p className="text-sm text-blue-700">Total Data</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-green-600">{newEmployees.length}</p>
                <p className="text-sm text-green-700">Data Baru</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{updatedEmployees.length}</p>
                <p className="text-sm text-orange-700">Data Update</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Employees */}
      {newEmployees.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Data Pegawai Baru ({newEmployees.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Golongan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jabatan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newEmployees.slice(0, 10).map((emp, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{emp.Nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.NIP}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.Golongan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.Jabatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {newEmployees.length > 10 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                ... dan {newEmployees.length - 10} data lainnya
              </p>
            )}
          </div>
        </div>
      )}

      {/* Updated Employees */}
      {updatedEmployees.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-orange-700 mb-4 flex items-center">
            <UserCheck className="w-5 h-5 mr-2" />
            Data Pegawai yang Akan Diupdate ({updatedEmployees.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Golongan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jabatan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {updatedEmployees.slice(0, 10).map((emp, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{emp.Nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.NIP}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.Golongan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.Jabatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {updatedEmployees.length > 10 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                ... dan {updatedEmployees.length - 10} data lainnya
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          onClick={onCancel}
          className="btn-secondary"
          disabled={isUpdating}
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="btn-success"
          disabled={isUpdating}
        >
          {isUpdating ? 'Menyimpan...' : 'Konfirmasi & Simpan'}
        </button>
      </div>
    </div>
  );
};

export default PreviewTable;