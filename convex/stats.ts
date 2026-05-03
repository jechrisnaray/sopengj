import { v } from "convex/values";
import { query } from "./_generated/server";

export const getConsultantStats = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect();

    const completed = bookings.filter(b => b.status === "completed");
    const totalIncome = completed.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const pendingCount = bookings.filter(b => b.status === "pending").length;

    const consultant = await ctx.db.get(args.consultantId);

    return {
      totalSessions: completed.length,
      rating: consultant?.rating ?? 0,
      totalIncome,
      pendingCount,
    };
  },
});
