import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  console.log("Testing insert into session_pengunjung...")
  const sessionId = "TEST_SESSION_123"
  const { data: sessionData, error: sessionError } = await supabase
    .from("session_pengunjung")
    .upsert(
      { session_id: sessionId, last_activity: new Date().toISOString() }, 
      { onConflict: "session_id" }
    )
  
  if (sessionError) {
    console.error("session_pengunjung Error:", sessionError)
  } else {
    console.log("session_pengunjung Success:", sessionData)
  }

  console.log("Testing insert into hasil_klasifikasi...")
  const payload = {
    klasifikasi_id: "test_" + Date.now(),
    session_id: sessionId,
    kategori_id: 1, // Organik
    nama_gambar: "test.jpg",
    path_gambar: "http://example.com/test.jpg",
    confidence: 0.99,
    tanggal_klasifikasi: new Date().toISOString()
  }

  const { data: insertData, error: insertError } = await supabase
    .from("hasil_klasifikasi")
    .insert(payload)
    .select()
    .single()

  if (insertError) {
    console.error("hasil_klasifikasi Error:", insertError)
  } else {
    console.log("hasil_klasifikasi Success:", insertData)
  }
}

testInsert()
