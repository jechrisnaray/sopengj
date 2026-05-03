import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const markAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.id, { isRead: true });
  },
});
