import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { 
    specialization: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    let consultants = await ctx.db
      .query("consultants")
      .filter((q: any) => q.eq(q.field("isAvailable"), true))
      .collect();

    if (args.specialization) {
      consultants = consultants.filter((c: any) => 
        c.specializations.includes(args.specialization)
      );
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      consultants = consultants.filter((c: any) => 
        c.fullName.toLowerCase().includes(searchLower) ||
        c.bio.toLowerCase().includes(searchLower)
      );
    }

    return consultants;
  },
});

export const getById = query({
  args: { id: v.id("consultants") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.get(args.id);
  },
});

export const getByProfileId = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("consultants")
      .withIndex("by_profileId", (q: any) => q.eq("profileId", args.profileId))
      .unique();
  },
});

export const create = mutation({
  args: {
    profileId: v.id("profiles"),
    fullName: v.string(),
    specializations: v.array(v.string()),
    hourlyRate: v.number(),
    bio: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("consultants", {
      ...args,
      rating: 5.0,
      totalReviews: 0,
      isAvailable: true,
      experienceYears: 0,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("consultants"),
    specializations: v.optional(v.array(v.string())),
    hourlyRate: v.optional(v.number()),
    bio: v.optional(v.string()),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx: any, args: any) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});
