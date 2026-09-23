"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Calculator,
  Eye,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSession } from "@/lib/auth";
import type { ProDashboard } from "@/ai/pro-portal";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

// P9 — offline fallback shapes (the store serves identical data when the API is
// unreachable, so the demo never dead-ends). Field names match ProDashboard.
const FALLBACK: ProDashboard = {
  stats: [
    { label: "Revenue (June)", value: "₦2,400,000", change: "+12% vs last month", tone: "success" },
    { label: "Pending Tasks", value: "8", change: "3 due within 24 hrs", tone: "warning" },
    { label: "Client Compliance Rate", value: "94%", change: "2 clients need attention", tone: "success" },
    { label: "Active Clients", value: "47", change: "+3 new this month", tone: "success" },
  ],
  deadlines: [
    { id: "dl-1", proId: "u-pro", date: "Jun 20", client: "Zenith Foods Ltd", task: "VAT Return", urgent: true, demo_seed: true },
    { id: "dl-2", proId: "u-pro", date: "Jun 25", client: "Eko Logistics", task: "WHT Remittance", urgent: false, demo_seed: true },
    { id: "dl-3", proId: "u-pro", date: "Jun 30", client: "Marina Tech", task: "CIT Filing", urgent: false, demo_seed: true },
    { id: "dl-4", proId: "u-pro", date: "Jul 10", client: "Okafor & Sons", task: "Quarterly Review", urgent: false, demo_seed: true },
    { id: "dl-5", proId: "u-pro", date: "Jul 15", client: "Sunrise Bakery", task: "Annual Return", urgent: false, demo_seed: true },
  ],
  activities: [
    { id: "ac-1", proId: "u-pro", text: "Zenith Foods Ltd uploaded 3 new receipts", time: "2 min ago", demo_seed: true },
    { id: "ac-2", proId: "u-pro", text: "Eko Logistics requested a compliance report", time: "15 min ago", demo_seed: true },
    { id: "ac-3", proId: "u-pro", text: "Marina Tech completed onboarding", time: "1 hr ago", demo_seed: true },
    { id: "ac-4", proId: "u-pro", text: "Bulk calculation completed for 5 clients", time: "2 hr ago", demo_seed: true },
    { id: "ac-5", proId: "u-pro", text: "VAT filing submitted for Okafor & Sons", time: "3 hr ago", demo_seed: true },
    { id: "ac-6", proId: "u-pro", text: "New client Sunlight Ventures added", time: "5 hr ago", demo_seed: true },
  ],
  recentClients: [
    { id: "1", proId: "u-pro", name: "Zenith Foods Ltd", cac: "RC-248571", tin: "1234567-0001", compliance: 94, lastActivity: "2 min ago", status: "active", location: "Ikeja, Lagos, Nigeria", industry: "Food & Beverage", taxYear: "2024", assignedPro: "Ayo Ogundimu", email: "finance@zenithfoods.com", phone: "+234 801 234 5678", registrationDate: "January 15, 2018", lastFiling: "March 31, 2025", demo_seed: true },
    { id: "2", proId: "u-pro", name: "Eko Logistics", cac: "RC-189432", tin: "9876543-0002", compliance: 78, lastActivity: "15 min ago", status: "alert", location: "Apapa, Lagos, Nigeria", industry: "Logistics", taxYear: "2024", assignedPro: "Ayo Ogundimu", email: "admin@ekologistics.ng", phone: "+234 802 555 0182", registrationDate: "March 2, 2016", lastFiling: "April 12, 2025", demo_seed: true },
    { id: "3", proId: "u-pro", name: "Marina Tech Ltd", cac: "RC-301287", tin: "5678901-0003", compliance: 100, lastActivity: "1 hr ago", status: "active", location: "Victoria Island, Lagos", industry: "Technology", taxYear: "2024", assignedPro: "Ayo Ogundimu", email: "hello@marinatech.io", phone: "+234 803 777 4410", registrationDate: "July 19, 2019", lastFiling: "March 28, 2025", demo_seed: true },
    { id: "4", proId: "u-pro", name: "Okafor & Sons", cac: "RC-145678", tin: "2345678-0004", compliance: 85, lastActivity: "3 hr ago", status: "active", location: "Onitsha, Anambra", industry: "Trading", taxYear: "2024", assignedPro: "Ayo Ogundimu", email: "contact@okaforandsons.com", phone: "+234 806 222 9031", registrationDate: "November 8, 2012", lastFiling: "March 30, 2025", demo_seed: true },
    { id: "5", proId: "u-pro", name: "Sunrise Bakery", cac: "RC-298761", tin: "3456789-0005", compliance: 62, lastActivity: "5 hr ago", status: "pending", location: "Surulere, Lagos, Nigeria", industry: "Food & Beverage", taxYear: "2024", assignedPro: "Ayo Ogundimu", email: "bake@sunrisebakery.ng", phone: "+234 807 100 2245", registrationDate: "February 27, 2021", lastFiling: "April 18, 2025", demo_seed: true },
  ],
  demo_seed: true,
};

const quickActions = [
  { href: "/pro/verify", label: "Verify New Client", icon: ShieldCheck },
  { href: "/pro/calculations", label: "Run Bulk Calculation", icon: Calculator },
  { href: "/pro/clients", label: "Manage Clients", icon: Users },
];

const statusVariant: Record<string, "success" | "error" | "warning" | "info"> = {
  active: "success",
  alert: "error",
  pending: "warning",
};

const complianceTone = (value: number) =>
  value >= 80 ? "success" : value >= 60 ? "warning" : "error";

const toneBarClass: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

const toneTextClass: Record<string, string> = {
  success: "text-success-text",
  warning: "text-warning-text",
  error: "text-error-text",
};

export default function ProDashboardPage() {
  const [data, setData] = useState<ProDashboard>(FALLBACK);
  const [proName, setProName] = useState("Ayo Ogundimu");
  const [live, setLive] = useState(false);

  // P9 — hydrate the client book + bulk-calc summary from the pro store
  // (demo_seed); offline, the FALLBACK constants keep the board complete.
  useEffect(() => {
    let active = true;
    getSession().then((s) => {
      if (active && s.name) setProName(s.name);
    });
    fetch("/api/v1/pro/dashboard?proId=u-pro")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ProDashboard | null) => {
        if (!active || !d) return;
        setData(d);
        setLive(true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const pending = Number(data.stats.find((s) => s.label === "Pending Tasks")?.value ?? 0);
  const urgentDeadlines = data.deadlines.filter((d) => d.urgent).length;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1>Good morning, {proName.split(" ")[0]}</h1>
          <p className="text-text-muted text-sm mt-1">
            You have {pending} pending tasks and {urgentDeadlines} urgent filing deadline
            {urgentDeadlines === 1 ? "" : "s"} this week.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {live && <Badge variant="info">live · demo_seed</Badge>}
          <Link href="/pro/verify">
            <Button variant="primary" size="lg">
              <Plus size={16} />
              Add Client
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl font-mono font-bold text-text-primary mt-2">
              {stat.value}
            </p>
            <p
              className={`text-xs mt-1 ${
                stat.tone === "success" ? "text-success-text" : "text-warning-text"
              }`}
            >
              {stat.change}
            </p>
          </Card>
        ))}
      </motion.div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <motion.div variants={item}>
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 font-semibold text-text-primary">
                <CalendarDays size={16} className="text-text-muted" />
                Upcoming Deadlines
              </h2>
              <Link
                href="https://www.firs.gov.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
              >
                FIRS Calendar
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="space-y-1">
              {data.deadlines.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 p-2 rounded-btn transition-colors hover:bg-hover-overlay"
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      d.urgent ? "bg-error" : "bg-text-disabled"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{d.client}</p>
                    <p className="text-xs text-text-muted">{d.task}</p>
                  </div>
                  <span
                    className={`text-xs font-mono font-medium flex-shrink-0 ${
                      d.urgent ? "text-error-text" : "text-text-muted"
                    }`}
                  >
                    {d.date}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="https://www.firs.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-brand-primary hover:underline"
            >
              View FIRS Calendar
              <ArrowUpRight size={14} />
            </Link>
          </Card>
        </motion.div>

        {/* Client Activity */}
        <motion.div variants={item}>
          <Card className="p-5 h-full">
            <h2 className="font-semibold text-text-primary mb-4">Client Activity</h2>
            <div className="space-y-3">
              {data.activities.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-brand-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-text-secondary">{a.text}</p>
                    <p className="text-xs text-text-muted mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card className="p-5 h-full">
            <h2 className="font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <Button
                    variant={action.href === "/pro/calculations" ? "primary" : "secondary"}
                    size="lg"
                    fullWidth
                    className="justify-start"
                  >
                    <action.icon size={16} />
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* API Usage Widget */}
            <div className="mt-6 pt-4 border-t border-border-default">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-secondary">API Usage</span>
                <span className="text-xs font-mono text-text-muted">8,431 / 10,000</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-surface-inset">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "84%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full rounded-full bg-brand-action"
                />
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-brand-primary hover:underline"
              >
                Upgrade to Unlimited
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Clients Table */}
      <motion.div variants={item}>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-4">
            <h2 className="font-semibold text-text-primary">Recent Clients</h2>
            <Link
              href="/pro/clients"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
            >
              View all 47
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default bg-surface-inset">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Client</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">CAC Number</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">TIN</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Compliance</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Last Activity</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recentClients.map((client, idx) => {
                  const tone = complianceTone(client.compliance);
                  return (
                  <tr
                    key={client.id}
                    className="border-b border-border-subtle last:border-0 hover:bg-hover-overlay transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/images/avatars/avatar-${String((idx % 10) + 1).padStart(2, "0")}.png`}
                          alt=""
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-border-subtle"
                        />
                        <span className="text-sm font-medium text-text-primary">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-text-secondary">{client.cac}</td>
                    <td className="py-3 px-4 text-sm font-mono text-text-secondary">{client.tin}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden bg-surface-inset">
                          <div
                            className={`h-full rounded-full ${toneBarClass[tone]}`}
                            style={{ width: `${client.compliance}%` }}
                          />
                        </div>
                        <span className={`text-sm font-mono font-medium ${toneTextClass[tone]}`}>
                          {client.compliance}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-muted">{client.lastActivity}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant[client.status]}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/pro/clients/${client.id}`}
                          aria-label={`View ${client.name}`}
                          title="View"
                          className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          aria-label={`More actions for ${client.name}`}
                          title="More actions"
                          className="p-1.5 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
