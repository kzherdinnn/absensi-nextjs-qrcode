import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Pagination } from '@mui/lab';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { semuaPegawai } from '@/services/pegawaiApi';

interface UserProfile {
  nama: string;
  email: string;
  peran: string;
}

function DaftarPegawai() {
  const [dataPegawai, setDataPegawai] = useState<UserProfile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const data = useSelector((state: any) => state.data.data);
  const router = useRouter();

  // Memoize fungsi ambilData
  const ambilData = useCallback(async () => {
    try {
      const respon = await semuaPegawai(page);
      setDataPegawai(respon.data);
      setTotalPages(respon.totalHalaman);
    } catch (error) {
      console.error('Gagal mengambil data pegawai:', error);
    }
  }, [page]); // Tambahkan 'page' sebagai dependency

  useEffect(() => {
    const cekProfil = async () => {
      if (!data || !data.nama) {
        router.push('/');
        return;
      }
      ambilData();
    };
    cekProfil();
  }, [data, router, ambilData]); // Tambahkan 'router' dan 'ambilData' sebagai dependency

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Daftar Pegawai
        </Typography>
        <Paper sx={{ width: '100%', overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Peran</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(dataPegawai) && dataPegawai.length > 0 ? (
                dataPegawai.map((pegawai) => (
                  <TableRow key={pegawai.email}>
                    <TableCell>{pegawai.nama}</TableCell> {/* Perbaikan urutan */}
                    <TableCell>{pegawai.email}</TableCell>
                    <TableCell>{pegawai.peran}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Tidak ada data pegawai
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 3 }}
        />
      </Container>
    </Layout>
  );
}

export default DaftarPegawai;
