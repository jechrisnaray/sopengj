import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.id("profiles"),
    consultantId: v.id("consultants"),
    scheduledAt: v.string(),
    durationMinutes: v.number(),
    topic: v.string(),
    notes: v.optional(v.string()),
    totalPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: Date.now(),
    });

    // Create notification for consultant
    const consultant = await ctx.db.get(args.consultantId);
    if (consultant) {
      await ctx.db.insert("notifications", {
        userId: consultant.profileId,
        title: "Booking Baru",
        message: `Anda menerima permintaan konsultasi baru untuk topik: ${args.topic}`,
        isRead: false,
        type: "booking_new",
        link: `/dashboard/consultant`,
        createdAt: Date.now(),
      });
    }

    return bookingId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.union(v.literal("confirmed"), v.literal("completed"), v.literal("cancelled")),
    meetingLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const booking = await ctx.db.get(id);
    if (!booking) throw new Error("Booking tidak ditemukan");

    await ctx.db.patch(id, updates);

    // Notify user
    await ctx.db.insert("notifications", {
      userId: booking.userId,
      title: `Booking ${args.status.toUpperCase()}`,
      message: `Status booking Anda telah diperbarui menjadi ${args.status}`,
      isRead: false,
      type: `booking_${args.status}`,
      link: `/dashboard/user`,
      createdAt: Date.now(),
    });
  },
});

export const listForUser = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return await Promise.all(
      bookings.map(async (b) => {
        const consultant = await ctx.db.get(b.consultantId);
        const consultantProfile = consultant ? await ctx.db.get(consultant.profileId) : null;
        return {
          ...b,
          consultantName: consultantProfile?.fullName ?? "Konsultan",
          consultantAvatar: consultantProfile?.avatarUrl,
        };
      })
    );
  },
});

export const listForConsultant = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .order("desc")
      .collect();

    return await Promise.all(
      bookings.map(async (b) => {
        const userProfile = await ctx.db.get(b.userId);
        return {
          ...b,
          userName: userProfile?.fullName ?? "User",
          userAvatar: userProfile?.avatarUrl,
        };
      })
    );
  },
});
