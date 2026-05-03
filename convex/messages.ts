import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const send = mutation({
  args: {
    bookingId: v.id("bookings"),
    senderId: v.id("profiles"),
    content: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("messages", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

export const listByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_booking", (q: any) => q.eq("bookingId", args.bookingId))
      .order("asc")
      .collect();
  },
});
