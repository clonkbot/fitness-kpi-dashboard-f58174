import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all KPI metrics for the dashboard
export const getDashboardMetrics = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    // Revenue metrics
    const allRevenue = await ctx.db.query("revenue").collect();

    const collectedCash = allRevenue
      .filter(r => r.type === "collected" && r.createdAt >= thirtyDaysAgo)
      .reduce((sum, r) => sum + r.amount, 0);

    const closedRevenue = allRevenue
      .filter(r => r.type === "closed" && r.createdAt >= thirtyDaysAgo)
      .reduce((sum, r) => sum + r.amount, 0);

    const upcomingInstallments = allRevenue
      .filter(r => r.type === "installment" && r.dueDate && r.dueDate > now)
      .reduce((sum, r) => sum + r.amount, 0);

    const overduePayments = allRevenue
      .filter(r => r.type === "overdue" || (r.type === "installment" && r.dueDate && r.dueDate < now && !r.paidAt))
      .reduce((sum, r) => sum + r.amount, 0);

    // Leads metrics
    const allLeads = await ctx.db.query("leads").collect();
    const newLeads = allLeads.filter(l => l.createdAt >= sevenDaysAgo).length;
    const totalLeadsMonth = allLeads.filter(l => l.createdAt >= thirtyDaysAgo).length;

    // Appointments metrics
    const allAppointments = await ctx.db.query("appointments").collect();
    const recentAppointments = allAppointments.filter(a => a.scheduledAt >= thirtyDaysAgo && a.scheduledAt <= now);
    const bookedAppointments = allAppointments.filter(a => a.scheduledAt >= sevenDaysAgo).length;

    const completedAppointments = recentAppointments.filter(a => a.status === "completed").length;
    const totalScheduled = recentAppointments.filter(a => a.status !== "cancelled").length;
    const showRate = totalScheduled > 0 ? Math.round((completedAppointments / totalScheduled) * 100) : 0;

    // Close rate (converted leads / qualified leads)
    const qualifiedLeads = allLeads.filter(l => l.status === "qualified" || l.status === "converted").length;
    const convertedLeads = allLeads.filter(l => l.status === "converted").length;
    const closeRate = qualifiedLeads > 0 ? Math.round((convertedLeads / qualifiedLeads) * 100) : 0;

    // Active clients
    const allClients = await ctx.db.query("clients").collect();
    const activeClients = allClients.filter(c => c.status === "active").length;

    return {
      collectedCash,
      closedRevenue,
      upcomingInstallments,
      overduePayments,
      newLeads,
      bookedAppointments,
      showRate,
      closeRate,
      activeClients,
      lastUpdated: now,
    };
  },
});

// Seed demo data
export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    // Clear existing data
    const existingRevenue = await ctx.db.query("revenue").collect();
    for (const r of existingRevenue) await ctx.db.delete(r._id);

    const existingLeads = await ctx.db.query("leads").collect();
    for (const l of existingLeads) await ctx.db.delete(l._id);

    const existingAppointments = await ctx.db.query("appointments").collect();
    for (const a of existingAppointments) await ctx.db.delete(a._id);

    const existingClients = await ctx.db.query("clients").collect();
    for (const c of existingClients) await ctx.db.delete(c._id);

    // Add revenue entries
    const revenueEntries = [
      { type: "collected" as const, amount: 12500, source: "stripe" as const, clientName: "Max Müller", createdAt: now - 2 * day },
      { type: "collected" as const, amount: 8900, source: "paypal" as const, clientName: "Lisa Schmidt", createdAt: now - 5 * day },
      { type: "collected" as const, amount: 15000, source: "stripe" as const, clientName: "Thomas Weber", createdAt: now - 8 * day },
      { type: "closed" as const, amount: 24000, source: "gohighlevel" as const, clientName: "Anna Fischer", createdAt: now - 1 * day },
      { type: "closed" as const, amount: 18500, source: "gohighlevel" as const, clientName: "Jan Becker", createdAt: now - 3 * day },
      { type: "installment" as const, amount: 4500, source: "stripe" as const, clientName: "Sarah Klein", dueDate: now + 7 * day, createdAt: now - 10 * day },
      { type: "installment" as const, amount: 6000, source: "stripe" as const, clientName: "Michael Braun", dueDate: now + 14 * day, createdAt: now - 15 * day },
      { type: "installment" as const, amount: 3200, source: "paypal" as const, clientName: "Julia Hoffmann", dueDate: now + 21 * day, createdAt: now - 20 * day },
      { type: "overdue" as const, amount: 2800, source: "stripe" as const, clientName: "Peter Schulz", dueDate: now - 5 * day, createdAt: now - 35 * day },
      { type: "overdue" as const, amount: 1500, source: "paypal" as const, clientName: "Maria Wagner", dueDate: now - 12 * day, createdAt: now - 42 * day },
    ];

    for (const entry of revenueEntries) {
      await ctx.db.insert("revenue", { ...entry, currency: "EUR", createdBy: userId });
    }

    // Add leads
    const leadEntries = [
      { name: "Felix Richter", email: "felix@example.com", source: "Instagram", status: "new" as const, createdAt: now - 1 * day },
      { name: "Sophie Meyer", email: "sophie@example.com", source: "Facebook", status: "new" as const, createdAt: now - 2 * day },
      { name: "Lukas Wolf", email: "lukas@example.com", source: "Google", status: "contacted" as const, createdAt: now - 3 * day },
      { name: "Emma Schröder", email: "emma@example.com", source: "Referral", status: "qualified" as const, createdAt: now - 4 * day },
      { name: "Noah Zimmermann", email: "noah@example.com", source: "Instagram", status: "converted" as const, createdAt: now - 6 * day },
      { name: "Mia Krüger", email: "mia@example.com", source: "Facebook", status: "new" as const, createdAt: now - 1 * day },
      { name: "Ben Hartmann", email: "ben@example.com", source: "Google", status: "qualified" as const, createdAt: now - 5 * day },
      { name: "Lena Lange", email: "lena@example.com", source: "TikTok", status: "converted" as const, createdAt: now - 8 * day },
    ];

    for (const entry of leadEntries) {
      await ctx.db.insert("leads", entry);
    }

    // Add appointments
    const appointmentEntries = [
      { clientName: "Felix Richter", type: "discovery" as const, scheduledAt: now + 2 * day, status: "scheduled" as const, createdAt: now - 1 * day },
      { clientName: "Sophie Meyer", type: "strategy" as const, scheduledAt: now + 3 * day, status: "scheduled" as const, createdAt: now - 2 * day },
      { clientName: "Lukas Wolf", type: "discovery" as const, scheduledAt: now - 1 * day, status: "completed" as const, createdAt: now - 5 * day },
      { clientName: "Emma Schröder", type: "strategy" as const, scheduledAt: now - 2 * day, status: "completed" as const, createdAt: now - 6 * day },
      { clientName: "Noah Zimmermann", type: "coaching" as const, scheduledAt: now - 3 * day, status: "completed" as const, createdAt: now - 7 * day },
      { clientName: "Ben Hartmann", type: "discovery" as const, scheduledAt: now - 4 * day, status: "no_show" as const, createdAt: now - 8 * day },
    ];

    for (const entry of appointmentEntries) {
      await ctx.db.insert("appointments", entry);
    }

    // Add active clients
    const clientEntries = [
      { name: "Max Müller", email: "max@example.com", program: "Elite Performance", startDate: now - 60 * day, status: "active" as const, totalValue: 12500, createdAt: now - 60 * day },
      { name: "Lisa Schmidt", email: "lisa@example.com", program: "Premium Coaching", startDate: now - 45 * day, status: "active" as const, totalValue: 8900, createdAt: now - 45 * day },
      { name: "Thomas Weber", email: "thomas@example.com", program: "Elite Performance", startDate: now - 30 * day, status: "active" as const, totalValue: 15000, createdAt: now - 30 * day },
      { name: "Anna Fischer", email: "anna@example.com", program: "Premium Coaching", startDate: now - 20 * day, status: "active" as const, totalValue: 24000, createdAt: now - 20 * day },
      { name: "Jan Becker", email: "jan@example.com", program: "Elite Performance", startDate: now - 10 * day, status: "active" as const, totalValue: 18500, createdAt: now - 10 * day },
      { name: "Sarah Klein", email: "sarah@example.com", program: "Starter Program", startDate: now - 90 * day, status: "active" as const, totalValue: 4500, createdAt: now - 90 * day },
      { name: "Michael Braun", email: "michael@example.com", program: "Premium Coaching", startDate: now - 120 * day, status: "active" as const, totalValue: 6000, createdAt: now - 120 * day },
    ];

    for (const entry of clientEntries) {
      await ctx.db.insert("clients", entry);
    }

    return { success: true };
  },
});
