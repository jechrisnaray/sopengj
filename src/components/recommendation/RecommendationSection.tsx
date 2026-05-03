'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles, Star, Clock, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Recommendation {
  consultant_id: string
  score: number
  reasons: string[]
  best_slots: string[]
  personalized_message?: string
  consultant_info?: any // Will be merged from original data
}

export default function RecommendationSection() {
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState([250000])
  const [time, setTime] = useState('fleksibel')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleGetRecommendation = async () => {
    if (description.length < 10) {
      toast.error('Ceritakan masalah Anda minimal 10 karakter')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          budget: budget[0],
          preferredTime: time === 'fleksibel' ? undefined : time,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      
      setResults(data)
      toast.success('Rekomendasi berhasil dibuat!')
    } catch (error: any) {
      toast.error(error.message || 'Gagal mendapatkan rekomendasi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 py-8">
      {/* Input Form */}
      <Card className="border-blue-100 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Temukan Konsultan dengan AI
          </CardTitle>
          <CardDescription>
            Ceritakan masalah Anda, AI kami akan mencocokkan Anda dengan ahli yang paling tepat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Masalah yang ingin dikonsultasikan</Label>
            <Textarea 
              placeholder="Contoh: Saya sedang mencari saran karir untuk pindah dari akuntansi ke data science, saya butuh bantuan menyusun roadmap belajar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] bg-white"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Budget per jam</Label>
                <span className="text-sm font-medium text-blue-600">Rp {budget[0].toLocaleString()}</span>
              </div>
              <Slider 
                value={budget} 
                onValueChange={(val) => setBudget(Array.isArray(val) ? val : [val])} 
                max={500000} 
                min={50000} 
                step={10000} 
              />
            </div>

            <div className="space-y-4">
              <Label>Preferensi Waktu</Label>
              <RadioGroup value={time} onValueChange={setTime} className="flex flex-wrap gap-4">
                {['fleksibel', 'pagi', 'siang', 'sore', 'malam'].map((t) => (
                  <div key={t} className="flex items-center space-x-2">
                    <RadioGroupItem value={t} id={t} />
                    <Label htmlFor={t} className="capitalize">{t}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGetRecommendation} 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'AI sedang menganalisis...' : 'Dapatkan Rekomendasi AI ✨'}
          </Button>
        </CardFooter>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {results && !isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Hasil Rekomendasi</h3>
            {results.isFallback && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Rekomendasi berdasarkan algoritma matching
              </span>
            )}
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {results.recommendations.map((rec: Recommendation) => (
              <Card key={rec.consultant_id} className="relative overflow-hidden border-blue-100 transition-all hover:shadow-lg">
                <div className="absolute top-0 right-0 p-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px]">
                    <Sparkles className="mr-1 h-3 w-3" /> Rekomendasi AI
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-blue-50 text-blue-600">C</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">Ahli Terpilih</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-slate-600 font-medium text-xs">Skor: {rec.score}%</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 pb-4">
                  <div className="space-y-1">
                    <Progress value={rec.score} className={`h-1.5 ${
                      rec.score > 70 ? 'bg-green-100 [&>div]:bg-green-500' : 
                      rec.score > 50 ? 'bg-amber-100 [&>div]:bg-amber-500' : 'bg-red-100 [&>div]:bg-red-500'
                    }`} />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kenapa Cocok?</p>
                    <ul className="space-y-1">
                      {rec.reasons.slice(0, 2).map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-blue-500" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {rec.personalized_message && (
                    <div className="rounded-lg bg-slate-50 p-3 text-[11px] italic text-slate-600 border-l-2 border-blue-400">
                      "{rec.personalized_message}"
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>Waktu terbaik: {rec.best_slots[0]}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button className="w-full group" variant="outline" size="sm">
                    Booking Sekarang
                    <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm text-slate-600 italic">"💡 {results.generalTip}"</p>
          </div>
        </div>
      )}
    </div>
  )
}
