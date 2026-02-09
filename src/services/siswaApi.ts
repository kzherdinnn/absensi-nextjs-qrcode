import { API_BASE_URL, getToken } from "./configService";

export const loginApi = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/siswa/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    const data = await response.json()
    let pesanError = `Login gagal: ${response.status} ${response.statusText}`
    if (typeof data !== 'undefined' && typeof data.message === 'string') {
      pesanError = data.message
    }
    throw new Error(pesanError);
  }
}

export const profil = async () => {
  const response = await fetch(`${API_BASE_URL}/siswa/profil`, {
    headers: {
      'Authorization': getToken(),
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Profil gagal: ${response.status} ${response.statusText}`);
  }
}

export const registrasiSiswa = async (nama: string, email: string, password: string, peran: string) => {
  const response = await fetch(`${API_BASE_URL}/siswa`, {
    method: 'POST',
    headers: {
      'Authorization': getToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nama, email, password, peran }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Lis Siswa gagal: ${response.status} ${response.statusText}`);
  }
}

export const semuaSiswa = async (halaman: number = 1) => {
  const response = await fetch(`${API_BASE_URL}/siswa?halaman=${halaman}`, {
    headers: {
      'Authorization': getToken(),
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Lis Siswa gagal: ${response.status} ${response.statusText}`);
  }
}

export const updateSiswa = async (id: string, nama?: string, email?: string, password?: string, peran?: string) => {
  const body: any = {};
  if (nama) body.nama = nama;
  if (email) body.email = email;
  if (password) body.password = password;
  if (peran) body.peran = peran;

  const response = await fetch(`${API_BASE_URL}/siswa/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': getToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Update Siswa gagal: ${response.status} ${response.statusText}`);
  }
}

export const hapusSiswa = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/siswa/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': getToken(),
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Hapus Siswa gagal: ${response.status} ${response.statusText}`);
  }
}
