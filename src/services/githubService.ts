const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

export interface GitHubUploadResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export const uploadToGitHub = async (
  content: any,
  filename: string = 'pegawai.json',
  message?: string
): Promise<GitHubUploadResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload-to-github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        filename,
        message: message || `Update data pegawai - ${new Date().toLocaleString('id-ID')}`,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal terhubung ke server',
      message: 'Gagal mengupload ke GitHub'
    };
  }
};

export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    return result.status === 'OK';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};