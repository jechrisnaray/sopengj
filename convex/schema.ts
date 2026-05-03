import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    userId: v.string(), // Supabase Auth ID
    fullName: v.string(),
    email: v.string(),
    role: v.union(v.literal("user"), v.literal("consultant")),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  consultants: defineTable({
    profileId: v.id("profiles"),
    specializations: v.array(v.string()),
    experienceYears: v.number(),
    hourlyRate: v.number(),
    rating: v.number(),
    totalReviews: v.number(),
    isAvailable: v.boolean(),
    bio: v.string(),
    about: v.optional(v.string()), // Detailed about section
    languages: v.array(v.string()),
    education: v.optional(v.array(v.string())),
    certifications: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
  }).index("by_profileId", ["profileId"]),

  bookings: defineTable({
    userId: v.id("profiles"),
    consultantId: v.id("consultants"),
    scheduledAt: v.string(), // ISO string
    durationMinutes: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("completed"), v.literal("cancelled")),
    topic: v.string(),
    notes: v.optional(v.string()),
    totalPrice: v.number(),
    paymentStatus: v.union(v.literal("unpaid"), v.literal("paid"), v.literal("refunded")),
    meetingLink: v.optional(v.string()),
    createdAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_consultant", ["consultantId"]),

  availability: defineTable({
    consultantId: v.id("consultants"),
    dayOfWeek: v.number(), // 0-6
    slots: v.array(v.object({
      start: v.string(), // "HH:mm"
      end: v.string(),
    })),
    isActive: v.boolean(),
  }).index("by_consultant", ["consultantId"]),

  reviews: defineTable({
    bookingId: v.id("bookings"),
    userId: v.id("profiles"),
    consultantId: v.id("consultants"),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
  })
  .index("by_consultant", ["consultantId"])
  .index("by_booking", ["bookingId"]),

  notifications: defineTable({
    userId: v.id("profiles"),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    type: v.string(), // "booking_new", "booking_confirmed", "system", etc.
    link: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  messages: defineTable({
    bookingId: v.id("bookings"),
    senderId: v.id("profiles"),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("file"), v.literal("system")),
    fileUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_booking", ["bookingId"]),

  transactions: defineTable({
    bookingId: v.id("bookings"),
    userId: v.id("profiles"),
    amount: v.number(),
    method: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
