import { v } from "convex/values";
import { query } from "./_generated/server";

export const getConsultantStats = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx: any, args: any) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_consultant", (q: any) => q.eq("consultantId", args.consultantId))
      .collect();

    const completed = bookings.filter((b: any) => b.status === "completed");
    const totalIncome = completed.reduce((acc: number, curr: any) => acc + curr.totalPrice, 0);
    const pending = bookings.filter((b: any) => b.status === "pending").length;

    const consultant = await ctx.db.get(args.consultantId);

    return {
      totalSessions: completed.length,
      totalIncome,
      pendingRequests: pending,
      rating: consultant?.rating ?? 0,
    };
  },
});
