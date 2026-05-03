import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">KonsulIn</Link>
            <p className="text-sm text-slate-500">
              Platform konsultasi online terpercaya untuk membantu Anda menemukan solusi terbaik dari para ahli di berbagai bidang.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-blue-600">Tentang Kami</Link></li>
              <li><Link href="/careers" className="hover:text-blue-600">Karir</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Layanan</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/consultants" className="hover:text-blue-600">Cari Konsultan</Link></li>
              <li><Link href="/register?role=consultant" className="hover:text-blue-600">Daftar Jadi Konsultan</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Kontak</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Email: hello@konsulin.id</li>
              <li>Telp: +62 21 1234 5678</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} KonsulIn. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
