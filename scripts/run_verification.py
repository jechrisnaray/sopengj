import asyncio
import os
import datetime
from supabase import create_client, Client
from dotenv import load_dotenv
from verify_consultant import get_public_info_from_linkedin

load_dotenv()

# Konfigurasi Supabase
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

async def run_batch_verification():
    print(f"[{datetime.datetime.now()}] Memulai verifikasi batch...")
    
    # 1. Ambil konsultan yang belum diverifikasi
    # Asumsi ada kolom 'linkedin_url' di tabel consultants
    response = supabase.table("consultants").select("id, profile_id").eq("is_verified", False).execute()
    new_consultants = response.data

    if not new_consultants:
        print("Tidak ada konsultan baru untuk diverifikasi.")
        return

    with open("verification_log.txt", "a") as log:
        for consultant in new_consultants:
            c_id = consultant['id']
            print(f"Memproses Konsultan ID: {c_id}")
            
            # Simulasi pengambilan URL (Sesuaikan dengan skema Anda)
            # Misalnya kita ambil dari metadata atau kolom khusus
            test_url = "https://id.linkedin.com/in/konsultan-contoh" 
            
            # 2. Jalankan Verifikasi
            result = await get_public_info_from_linkedin(test_url)
            
            # 3. Log Hasil
            log.write(f"{datetime.datetime.now()} - ID: {c_id} - Result: {result}\n")
            
            # 4. Update Database jika data ditemukan
            if "error" not in str(result):
                supabase.table("consultants").update({
                    "is_verified": True,
                    # "bio": result.get('summary', '') # Opsional: Update bio otomatis
                }).eq("id", c_id).execute()
                print(f"Berhasil memverifikasi ID: {c_id}")
            else:
                print(f"Gagal verifikasi ID: {c_id}: {result.get('error')}")

if __name__ == "__main__":
    asyncio.run(run_batch_verification())
