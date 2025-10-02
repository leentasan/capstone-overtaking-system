import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    // 1. Terima data LENGKAP dalam format JSON
    const logData = await request.json();

    // 2. Masukkan data log ke tabel 'overtaking_logs'
    const { data: logInsertData, error: logInsertError } = await supabase
      .from('overtaking_logs')
      .insert([
        {
          vehicle_type: logData.vehicle_type,
          classification_time: logData.classification_time,
          distance_ab: logData.distance_ab,
          feasibility_result: logData.feasibility_result,
          feasibility_time: logData.feasibility_time,
          vehicle_speed: logData.vehicle_speed,
          detected_length_m: logData.detected_length_m,
        },
      ])
      .select()
      .single();

    if (logInsertError) throw logInsertError;

    // 3. Masukkan URL gambar (yang diterima dari JSON) ke tabel 'overtaking_images'
    const { error: imageInsertError } = await supabase
      .from('overtaking_images')
      .insert([
        {
          overtaking_log_id: logInsertData.id,
          image_url: logData.image_url, // URL gambar didapat dari body JSON
        }
      ]);

    if (imageInsertError) throw imageInsertError;

    // 4. Kirim respons sukses
    return NextResponse.json({ message: "Log saved successfully", data: logInsertData });

  } catch (e) {
    console.error("Error saving log:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}