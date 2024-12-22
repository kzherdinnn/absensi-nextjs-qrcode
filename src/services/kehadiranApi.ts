import { API_BASE_URL, getToken } from "./configService";

// Fungsi untuk fetch data dengan penanganan token
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login ulang.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request gagal: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

// Ambil kode kehadiran
export const ambilKode = async () => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/kehadiran/kode`);
  } catch (error) {
    console.error('Kesalahan saat mengambil kode:', error);
    throw error;
  }
};

// Absen kehadiran (datang/pulang)
export const absenKehadiran = async (kode: string, jenis: string) => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/kehadiran`, {
      method: 'POST',
      body: JSON.stringify({ kode, jenis }),
    });
  } catch (error) {
    console.error('Kesalahan saat absen kehadiran:', error);
    throw error;
  }
};

// Ambil semua data kehadiran dengan paginasi
export const semuaKehadiran = async (halaman: number = 1) => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/kehadiran?halaman=${halaman}`);
  } catch (error) {
    console.error('Kesalahan saat mengambil daftar kehadiran:', error);
    throw error;
  }
};
