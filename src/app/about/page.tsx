import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, Target, Users, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-blue-600">Visi & Misi Kami</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Demokratisasi Akses <br /> <span className="text-blue-500">Saran Ahli di Indonesia</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            KonsulIn lahir untuk menghubungkan setiap individu dengan ahli profesional secara instan, aman, dan terjangkau.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Keamanan Data", desc: "Privasi Anda adalah prioritas nomor satu kami." },
            { icon: Users, title: "Ahli Terpilih", desc: "Hanya konsultan dengan kredibilitas tinggi yang bergabung." },
            { icon: Target, title: "Solusi Tepat", desc: "Mencocokkan Anda dengan ahli yang spesifik di bidangnya." },
            { icon: Award, title: "Kualitas Premium", desc: "Standar layanan konsultasi terbaik di setiap sesi." }
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-lg bg-slate-50 hover:translate-y-[-5px] transition-transform">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Cerita Kami</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                Didirikan pada tahun 2024, KonsulIn melihat kesenjangan besar antara orang yang membutuhkan saran ahli dengan para pakar yang sulit dijangkau. Seringkali, mendapatkan waktu konsultasi membutuhkan waktu berminggu-minggu dan proses yang rumit.
              </p>
              <p>
                Kami membangun platform ini dengan satu tujuan sederhana: <strong>Memberikan solusi instan.</strong> Baik itu masalah hukum yang mendesak, perencanaan keuangan keluarga, hingga kesehatan mental, kami percaya setiap orang berhak mendapatkan saran dari yang terbaik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
