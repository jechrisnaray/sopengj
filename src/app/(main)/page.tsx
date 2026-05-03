import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Zap, Star, Clock, CheckCircle2, ArrowRight, Quote } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Solusi Tepat dari <span className="text-blue-600">Ahli Terpercaya</span>
            </h1>
            <p className="mb-10 text-lg leading-8 text-slate-600 sm:text-xl">
              Konsultasi online lebih mudah, cepat, dan terjangkau. Temukan konsultan profesional di bidang hukum, keuangan, psikologi, dan bisnis dalam satu platform.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="px-8 text-lg" asChild>
                <Link href="/consultants">Cari Konsultan</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 text-lg" asChild>
                <Link href="/register?role=consultant">Daftar Jadi Konsultan</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">500+</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Ahli Terverifikasi</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">10k+</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Sesi Selesai</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">4.9/5</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Rating Kepuasan</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">24/7</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Layanan Tersedia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kategori Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Pilih Bidang Spesialisasi</h2>
            <p className="mt-4 text-slate-600">Temukan solusi dari praktisi yang tepat untuk masalah Anda.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {['Hukum', 'Keuangan', 'Psikologi', 'Karir', 'Bisnis', 'Teknologi', 'Kesehatan', 'Pendidikan'].map((cat) => (
              <Link 
                key={cat} 
                href={`/consultants?category=${cat}`}
                className="group rounded-xl border bg-white p-6 text-center transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-2 font-bold text-slate-900 group-hover:text-blue-600">{cat}</div>
                <div className="text-xs text-slate-500">50+ Konsultan</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">Kenapa Memilih KonsulIn?</h2>
            <p className="text-slate-600">Platform kami dirancang untuk memberikan pengalaman konsultasi terbaik bagi Anda.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              title="Konsultan Terverifikasi"
              description="Semua konsultan kami melewati proses verifikasi ketat untuk memastikan keahlian mereka."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-blue-600" />}
              title="Respon Cepat"
              description="Dapatkan rekomendasi instan berbasis AI untuk menemukan konsultan yang paling cocok."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-blue-600" />}
              title="Jadwal Fleksibel"
              description="Pilih waktu konsultasi yang paling nyaman bagi Anda, tersedia 24/7."
            />
          </div>
        </div>
      </section>

      {/* Featured Consultants */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Konsultan Pilihan</h2>
              <p className="mt-2 text-slate-600">Bekerja dengan ahli terbaik di bidangnya.</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/consultants">Lihat Semua <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Kartu akan diisi oleh data real nanti */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex gap-4 mb-4">
                  <div className="h-14 w-14 rounded-full bg-slate-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-3 w-full bg-slate-50 rounded" />
                  <div className="h-3 w-full bg-slate-50 rounded" />
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/consultants">Lihat Profil</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">Cara Kerja</h2>
          </div>
          <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
            <StepCard step="1" title="Pilih Konsultan" description="Cari dan pilih konsultan berdasarkan spesialisasi dan rating." />
            <StepCard step="2" title="Pesan Sesi" description="Tentukan tanggal dan jam yang tersedia, lalu lakukan pembayaran." />
            <StepCard step="3" title="Mulai Konsultasi" description="Lakukan sesi konsultasi secara privat melalui platform kami." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Apa Kata Mereka?</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { name: 'Andi Pratama', role: 'Pengusaha', text: 'KonsulIn membantu saya menemukan konsultan keuangan yang sangat ahli. Bisnis saya sekarang lebih terarah.' },
              { name: 'Sari Wijaya', role: 'Mahasiswa', text: 'Sesi psikologi di sini sangat membantu kesehatan mental saya. Prosesnya mudah dan privasi terjaga.' },
              { name: 'Budi Santoso', role: 'Karyawan', text: 'Konsultasi hukum yang cepat dan solutif. Tidak perlu repot cari kantor pengacara lagi.' }
            ].map((t, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 p-8 relative">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-blue-100" />
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Siap Mendapatkan Solusi?</h2>
          <p className="mb-8 text-lg opacity-90">Ribuan orang telah terbantu dengan platform kami.</p>
          <Button size="lg" variant="secondary" className="px-10" asChild>
            <Link href="/register">Mulai Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="rounded-xl border bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  )
}

function StepCard({ step, title, description }: { step: string, title: string, description: string }) {
  return (
    <div className="relative flex-1 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
        {step}
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  )
}
