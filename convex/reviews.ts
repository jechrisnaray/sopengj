import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addReview = mutation({
  args: {
    bookingId: v.id("bookings"),
    userId: v.id("profiles"),
    consultantId: v.id("consultants"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const reviewId = await ctx.db.insert("reviews", {
      ...args,
      createdAt: Date.now(),
    });

    // Update consultant average rating
    const consultant = await ctx.db.get(args.consultantId);
    if (consultant) {
      const newTotal = consultant.totalReviews + 1;
      const newRating = (consultant.rating * consultant.totalReviews + args.rating) / newTotal;
      
      await ctx.db.patch(args.consultantId, {
        rating: newRating,
        totalReviews: newTotal,
      });
    }

    return reviewId;
  },
});

export const listByConsultant = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .order("desc")
      .collect();

    return await Promise.all(
      reviews.map(async (r) => {
        const user = await ctx.db.get(r.userId);
        return {
          ...r,
          userName: user?.fullName ?? "Anonym",
          userAvatar: user?.avatarUrl,
        };
      })
    );
  },
});
