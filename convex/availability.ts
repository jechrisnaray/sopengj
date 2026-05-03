import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByConsultant = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("availability")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect();
  },
});

export const updateAvailability = mutation({
  args: {
    consultantId: v.id("consultants"),
    availability: v.array(v.object({
      dayOfWeek: v.number(),
      slots: v.array(v.object({
        start: v.string(),
        end: v.string(),
      })),
      isActive: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    // Delete existing
    const existing = await ctx.db
      .query("availability")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect();
    
    for (const e of existing) {
      await ctx.db.delete(e._id);
    }

    // Insert new
    for (const a of args.availability) {
      await ctx.db.insert("availability", {
        consultantId: args.consultantId,
        ...a,
      });
    }
  },
});
