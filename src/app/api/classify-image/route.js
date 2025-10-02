import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // --- Langkah 1: Upload gambar ke Supabase Storage ---
    const fileName = `img_${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('overtaking-images')
      .upload(fileName, imageFile);

    if (uploadError) throw uploadError;

    // --- Langkah 2: Dapatkan URL publik dari gambar ---
    const { data: urlData } = supabase.storage
      .from('overtaking-images')
      .getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    // ===================================================================
    // --- Langkah 3: Jalankan Logika Klasifikasi (Simulasi) ---
    const detectedLength = Math.random() * (12 - 3) + 3;
    let vehicleType;
    if (detectedLength <= 5.5) {
      vehicleType = 'car';
    } else if (detectedLength <= 10) {
      vehicleType = 'medium_truck_bus';
    } else {
      vehicleType = 'large_truck_bus';
    }
    // ===================================================================

    // --- Langkah 4: Kirim balasan LENGKAP ke ESP32 ---
    return NextResponse.json({
      message: "Image classified and stored successfully",
      vehicle_type: vehicleType,
      detected_length_m: parseFloat(detectedLength.toFixed(2)),
      image_url: imageUrl, // URL gambar ikut dikirim kembali!
    });

  } catch (e) {
    console.error("Error in classify-image:", e);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}