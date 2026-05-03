import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("availability")
      .withIndex("by_consultant", (q: any) => q.eq("consultantId", args.consultantId))
      .collect();
  },
});

export const update = mutation({
  args: {
    consultantId: v.id("consultants"),
    dayOfWeek: v.number(),
    isActive: v.boolean(),
    slots: v.array(v.object({
      start: v.string(),
      end: v.string(),
    })),
  },
  handler: async (ctx: any, args: any) => {
    const { consultantId, dayOfWeek, isActive, slots } = args;
    
    // Find existing for this day
    const existing = await ctx.db
      .query("availability")
      .withIndex("by_consultant", (q: any) => q.eq("consultantId", consultantId))
      .filter((q: any) => q.eq(q.field("dayOfWeek"), dayOfWeek))
      .unique();
    
    if (existing) {
      await ctx.db.patch(existing._id, { isActive, slots });
    } else {
      await ctx.db.insert("availability", {
        consultantId,
        dayOfWeek,
        isActive,
        slots,
      });
    }
  },
});
