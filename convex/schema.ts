import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles with roles
  profiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    role: v.union(v.literal("ceo"), v.literal("manager"), v.literal("coach")),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Revenue tracking
  revenue: defineTable({
    type: v.union(v.literal("collected"), v.literal("closed"), v.literal("installment"), v.literal("overdue")),
    amount: v.number(),
    currency: v.string(),
    source: v.union(v.literal("stripe"), v.literal("paypal"), v.literal("gohighlevel")),
    clientName: v.string(),
    dueDate: v.optional(v.number()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    createdBy: v.id("users"),
  }).index("by_type", ["type"]).index("by_created", ["createdAt"]),

  // Leads from GoHighLevel
  leads: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    source: v.string(),
    status: v.union(v.literal("new"), v.literal("contacted"), v.literal("qualified"), v.literal("converted"), v.literal("lost")),
    createdAt: v.number(),
  }).index("by_status", ["status"]).index("by_created", ["createdAt"]),

  // Appointments/Bookings
  appointments: defineTable({
    leadId: v.optional(v.id("leads")),
    clientName: v.string(),
    type: v.union(v.literal("discovery"), v.literal("strategy"), v.literal("coaching")),
    scheduledAt: v.number(),
    status: v.union(v.literal("scheduled"), v.literal("completed"), v.literal("no_show"), v.literal("cancelled")),
    createdAt: v.number(),
  }).index("by_status", ["status"]).index("by_scheduled", ["scheduledAt"]),

  // Active clients
  clients: defineTable({
    name: v.string(),
    email: v.string(),
    program: v.string(),
    startDate: v.number(),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("completed"), v.literal("churned")),
    totalValue: v.number(),
    createdAt: v.number(),
  }).index("by_status", ["status"]),
});
