export interface Pegawai {
  Nama: string;
  NIP: string;
  Golongan: string;
  Jabatan: string;
}

export interface PreviewData {
  newEmployees: Pegawai[];
  updatedEmployees: Pegawai[];
  totalProcessed: number;
}