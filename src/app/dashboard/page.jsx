// Import library untuk membuat koneksi ke Supabase
import { createClient } from '@supabase/supabase-js';

// Buat koneksi Supabase 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Komponen halaman dashboard
export default async function DashboardPage() {

  // 1. Ambil data dari tabel 'overtaking_logs'
  const { data: logs, error } = await supabase
    .from('overtaking_logs')
    .select('*') // Pakai .select('*') untuk mengambil semua kolom
    .order('created_at', { ascending: false }); // Order berdasarkan 'created_at' agar yang terbaru di atas

  // Jika ada error saat mengambil data, tampilkan pesan error
  if (error) {
    return <p>Gagal memuat data: {error.message}</p>;
  }

  // 2. Jika berhasil, tampilkan datanya
  return (
    <div>
      <h1>Real-time Overtaking Dashboard</h1>
      <p>Menampilkan {logs.length} log terbaru.</p>

      {/* Cara simpel untuk menampilkan data mentah dalam format JSON */}
      {/* <h2>Data Mentah:</h2>
      <pre style={{ background: '#eee', padding: '1rem', borderRadius: '5px' }}>
        {JSON.stringify(logs, null, 2)}
      </pre> */}

      {/* Nanti bisa ubah ini menjadi tabel yang lbh gacor */}
      <h2>Data dalam Bentuk Tabel (Contoh):</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Waktu</th>
            <th>Jenis Kendaraan</th>
            <th>Hasil</th>
            <th>Kecepatan (km/h)</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.created_at).toLocaleString('id-ID')}</td>
              <td>{log.vehicle_type}</td>
              <td>{log.feasibility_result}</td>
              <td>{log.vehicle_speed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}