import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
  handler: async (ctx) => {
    // Clear existing data (optional, only for dev)
    const existingConsultants = await ctx.db.query("consultants").collect();
    for (const c of existingConsultants) {
      await ctx.db.delete(c._id);
    }
    const existingProfiles = await ctx.db.query("profiles").collect();
    for (const p of existingProfiles) {
      await ctx.db.delete(p._id);
    }

    // Seed Profiles & Consultants
    const data = [
      {
        fullName: 'Budi Arto, S.H., LL.M.',
        email: 'budi@example.com',
        role: 'consultant' as const,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
        specializations: ['Hukum', 'Perdata', 'Korporat'],
        hourlyRate: 500000,
        rating: 4.9,
        totalReviews: 128,
        bio: 'Pengacara spesialis hukum perdata dan korporat dengan pengalaman 10 tahun.',
      },
      {
        fullName: 'Sari Keuangan, CFP',
        email: 'sari@example.com',
        role: 'consultant' as const,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sari',
        specializations: ['Keuangan', 'Investasi', 'Pajak'],
        hourlyRate: 350000,
        rating: 4.8,
        totalReviews: 94,
        bio: 'Perencana keuangan bersertifikasi yang fokus pada manajemen kekayaan keluarga.',
      },
      {
        fullName: 'Dr. Andi Psikolog, M.Psi',
        email: 'andi@example.com',
        role: 'consultant' as const,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi',
        specializations: ['Psikologi', 'Kesehatan Mental'],
        hourlyRate: 300000,
        rating: 4.9,
        totalReviews: 210,
        bio: 'Psikolog klinis berpengalaman menangani kesehatan mental remaja dan dewasa.',
      },
    ];

    for (const item of data) {
      const profileId = await ctx.db.insert("profiles", {
        userId: `mock-${Math.random().toString(36).substr(2, 9)}`,
        fullName: item.fullName,
        email: item.email,
        role: item.role,
        avatarUrl: item.avatarUrl,
        createdAt: Date.now(),
      });

      await ctx.db.insert("consultants", {
        profileId,
        specializations: item.specializations,
        experienceYears: 10,
        hourlyRate: item.hourlyRate,
        rating: item.rating,
        totalReviews: item.totalReviews,
        isAvailable: true,
        bio: item.bio,
        languages: ['Indonesia', 'Inggris'],
      });
    }
  },
});
