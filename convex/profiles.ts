import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .unique();
  },
});

export const syncProfile = mutation({
  args: {
    userId: v.string(),
    fullName: v.string(),
    email: v.string(),
    role: v.union(v.literal("user"), v.literal("consultant")),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        fullName: args.fullName,
        email: args.email,
        avatarUrl: args.avatarUrl,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("profiles", {
        userId: args.userId,
        fullName: args.fullName,
        email: args.email,
        role: args.role,
        avatarUrl: args.avatarUrl,
        createdAt: Date.now(),
      });
    }
  },
});

export const updateProfile = mutation({
  args: {
    id: v.id("profiles"),
    fullName: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});
