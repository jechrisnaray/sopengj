import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    specialization: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let consultants = await ctx.db
      .query("consultants")
      .filter((q) => q.eq(q.field("isAvailable"), true))
      .collect();

    const consultantsWithProfiles = await Promise.all(
      consultants.map(async (c) => {
        const profile = await ctx.db.get(c.profileId);
        return {
          ...c,
          fullName: profile?.fullName ?? "Konsultan",
          avatarUrl: profile?.avatarUrl ?? "",
          email: profile?.email ?? "",
        };
      })
    );

    let filtered = consultantsWithProfiles;

    if (args.specialization && args.specialization !== "Semua") {
      filtered = filtered.filter((c) => 
        c.specializations.includes(args.specialization!)
      );
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      filtered = filtered.filter((c) => 
        c.fullName.toLowerCase().includes(searchLower) ||
        c.specializations.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    return filtered.sort((a, b) => b.rating - a.rating);
  },
});

export const getById = query({
  args: { id: v.id("consultants") },
  handler: async (ctx, args) => {
    const consultant = await ctx.db.get(args.id);
    if (!consultant) return null;

    const profile = await ctx.db.get(consultant.profileId);
    return {
      ...consultant,
      fullName: profile?.fullName ?? "Konsultan",
      avatarUrl: profile?.avatarUrl ?? "",
      bio: consultant.bio || profile?.bio || "",
    };
  },
});

export const getByProfileId = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("consultants")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .unique();
  },
});

export const register = mutation({
  args: {
    profileId: v.id("profiles"),
    specializations: v.array(v.string()),
    experienceYears: v.number(),
    hourlyRate: v.number(),
    bio: v.string(),
    languages: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("consultants", {
      ...args,
      rating: 5.0,
      totalReviews: 0,
      isAvailable: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("consultants"),
    specializations: v.optional(v.array(v.string())),
    experienceYears: v.optional(v.number()),
    hourlyRate: v.optional(v.number()),
    bio: v.optional(v.string()),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});
