import * as XLSX from 'xlsx';
import { Pegawai, PreviewData } from '../types/pegawai';

export const processExcelFile = (file: File): Promise<Pegawai[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Ambil sheet pertama
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert ke JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Proses data (skip header row)
        const employees: Pegawai[] = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          
          // Skip empty rows
          if (!row || row.length === 0 || !row[0]) continue;
          
          // Pastikan semua kolom ada dan tidak undefined
          const employee: Pegawai = {
            Nama: row[0] ? String(row[0]).trim() : '',
            NIP: row[1] ? String(row[1]).trim() : '',
            Golongan: row[2] ? String(row[2]).trim() : '',
            Jabatan: row[3] ? String(row[3]).trim() : ''
          };
          
          // Validasi data - pastikan minimal Nama dan NIP ada
          if (employee.Nama.length > 0 && employee.NIP.length > 0) {
            employees.push(employee);
          } else {
            console.warn(`Baris ${i + 1} dilewati: Nama="${employee.Nama}", NIP="${employee.NIP}"`);
          }
        }
        
        resolve(employees);
      } catch (error) {
        reject(new Error('Gagal memproses file Excel: ' + error));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Gagal membaca file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const generatePreview = (
  excelData: Pegawai[], 
  currentData: Pegawai[]
): PreviewData => {
  const newEmployees: Pegawai[] = [];
  const updatedEmployees: Pegawai[] = [];
  
  // Buat map dari data saat ini berdasarkan NIP
  const currentDataMap = new Map<string, Pegawai>();
  currentData.forEach(emp => {
    currentDataMap.set(emp.NIP, emp);
  });
  
  excelData.forEach(excelEmp => {
    const existing = currentDataMap.get(excelEmp.NIP);
    
    if (existing) {
      // Cek apakah ada perubahan
      if (
        existing.Nama !== excelEmp.Nama ||
        existing.Golongan !== excelEmp.Golongan ||
        existing.Jabatan !== excelEmp.Jabatan
      ) {
        updatedEmployees.push(excelEmp);
      }
    } else {
      newEmployees.push(excelEmp);
    }
  });
  
  return {
    newEmployees,
    updatedEmployees,
    totalProcessed: excelData.length
  };
};

export const mergeData = (
  currentData: Pegawai[], 
  excelData: Pegawai[]
): Pegawai[] => {
  // Buat map dari data saat ini berdasarkan NIP
  const dataMap = new Map<string, Pegawai>();
  
  // Masukkan data saat ini
  currentData.forEach(emp => {
    dataMap.set(emp.NIP, emp);
  });
  
  // Update/tambah data dari Excel
  excelData.forEach(emp => {
    dataMap.set(emp.NIP, emp);
  });
  
  // Convert kembali ke array dan sort berdasarkan nama
  return Array.from(dataMap.values()).sort((a, b) => 
    a.Nama.localeCompare(b.Nama, 'id')
  );
};