import asyncio
import os
import json
from dotenv import load_dotenv
from browser_use import Agent
from langchain_groq import ChatGroq

load_dotenv()

# Inisialisasi LLM via Groq
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

async def get_public_info_from_linkedin(linkedin_url: str) -> dict:
    """
    Ambil informasi publik dari LinkedIn (tanpa login).
    """
    if not linkedin_url or "linkedin.com" not in linkedin_url:
        return {"error": "URL tidak valid"}

    agent = Agent(
        task=f"""
        Kunjungi URL ini: {linkedin_url}

        Kumpulkan HANYA informasi yang tampil tanpa login:
        - Nama lengkap
        - Jabatan saat ini
        - Perusahaan saat ini
        - Ringkasan/about
        - Pendidikan
        - Lokasi

        Return DALAM FORMAT JSON SAJA:
        {{
          "name": "...",
          "current_title": "...",
          "current_company": "...",
          "summary": "...",
          "education": "...",
          "location": "...",
          "data_complete": true
        }}
        """,
        llm=llm,
    )

    try:
        result = await agent.run()
        # Parsing result logic here depending on browser-use output format
        return result
    except Exception as e:
        return {"error": str(e), "data_complete": False}

async def check_website_availability(website_url: str) -> dict:
    """
    Cek website personal konsultan untuk info jadwal publik.
    """
    if not website_url:
        return {"error": "URL kosong"}

    agent = Agent(
        task=f"""
        Kunjungi {website_url}

        Cari informasi tentang:
        1. Apakah ada halaman 'jadwal', 'booking', atau 'appointment'?
        2. Jam operasional yang disebutkan
        3. Cara menghubungi (email, WhatsApp, dll)
        4. Bidang keahlian yang disebutkan

        Return JSON:
        {{
          "has_booking_page": true,
          "working_hours": "...",
          "contact_info": "...",
          "expertise": ["..."]
        }}
        """,
        llm=llm,
    )
    
    try:
        return await agent.run()
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Test sederhana
    async def test():
        print("Testing LinkedIn Scraper...")
        # Gantilah dengan URL publik yang valid untuk testing
        # res = await get_public_info_from_linkedin("https://id.linkedin.com/in/some-profile")
        # print(res)
    
    asyncio.run(test())
