import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Pagination } from '@mui/lab';
import Layout from '@/components/Layout';
import { semuaKehadiran } from '@/services/kehadiranApi';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ubahTanggal } from '@/services/utils';
import { WS_BASE_URL } from '@/services/configService';

interface Pegawai {
  _id: string;
  nama: string;
}
interface Kehadiran {
  _id: string;
  pegawai: Pegawai;
  datang: string;
  pulang: string;
}

const DaftarKehadiran: React.FC = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataKehadiran, setDataKehadiran] = useState<Kehadiran[]>([]);
  const data = useSelector((state: any) => state.data.data);
  const router = useRouter();

  // Memoize fungsi ambilData
  const ambilData = useCallback(async () => {
    try {
      const respon = await semuaKehadiran(page);
      console.log(respon.kehadiran);
      setDataKehadiran(respon.kehadiran);
      setTotalPages(respon.halamanInfo.totalHalaman);
    } catch (error) {
      console.error(error);
    }
  }, [page]); // Tambahkan 'page' sebagai dependency

  useEffect(() => {
    const cekProfil = async () => {
      if (typeof data === 'undefined' || typeof data.nama === 'undefined') {
        router.push('/');
        return;
      }
      ambilData();
    };
    cekProfil();
  }, [data, page, ambilData, router]); // Tambahkan 'ambilData' dan 'router' sebagai dependency

  useEffect(() => {
    const ws = new WebSocket(WS_BASE_URL);

    ws.addEventListener('message', (event) => {
      console.log('WebSocket message received:', event);
      ambilData(); // Gunakan fungsi yang stabil
    });

    return () => {
      ws.removeEventListener('message', ambilData);
      ws.close();
    };
  }, [ambilData]); // Tambahkan 'ambilData' sebagai dependency

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Daftar Kehadiran
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Datang</TableCell>
                <TableCell>Pulang</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(dataKehadiran) && dataKehadiran.length > 0 ? (
                dataKehadiran.map((kehadiran) => (
                  <TableRow key={kehadiran._id}>
                    <TableCell>{kehadiran.pegawai.nama}</TableCell>
                    <TableCell>{ubahTanggal(kehadiran.datang)}</TableCell>
                    <TableCell>{ubahTanggal(kehadiran.pulang)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Tidak ada data kehadiran
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} sx={{ mt: 3 }} />
      </Container>
    </Layout>
  );
};

export default DaftarKehadiran;
