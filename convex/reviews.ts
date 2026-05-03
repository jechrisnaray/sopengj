import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    bookingId: v.id("bookings"),
    consultantId: v.id("consultants"),
    userId: v.id("profiles"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const reviewId = await ctx.db.insert("reviews", {
      ...args,
      createdAt: Date.now(),
    });

    // Update consultant average rating
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_consultant", (q: any) => q.eq("consultantId", args.consultantId))
      .collect();
    
    const avgRating = reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length;

    await ctx.db.patch(args.consultantId, {
      rating: avgRating,
      totalReviews: reviews.length,
    });

    return reviewId;
  },
});

export const listByConsultant = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_consultant", (q: any) => q.eq("consultantId", args.consultantId))
      .order("desc")
      .collect();
  },
});
