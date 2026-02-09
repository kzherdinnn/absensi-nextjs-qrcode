export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://absensi-api-qrcode.vercel.app/api';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://absensi-api-qrcode.vercel.app/ws';
let token = '';

export const getToken = () => token
export const setToken = (dataToken: string) => token = dataToken
