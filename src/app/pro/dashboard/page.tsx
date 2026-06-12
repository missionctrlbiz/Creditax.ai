"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const statCards = [
  { label: "Revenue (June)", value: "₦2,400,000", change: "+12% vs last month", variant: "success" as const },
  { label: "Pending Tasks", value: "8", change: "3 due in 24hrs", variant: "warning" as const },
  { label: "Client Compliance Rate", value: "94%", change: "2 clients need attention", variant: "success" as const },
  { label: "Active Clients", value: "47", change: "+3 new this month", variant: "success" as const },
];

const deadlines = [
  { date: "Jun 20", client: "Zenith Foods Ltd", task: "VAT Return", urgent: true },
  { date: "Jun 25", client: "Eko Logistics", task: "WHT Remittance", urgent: false },
  { date: "Jun 30", client: "Marina Tech", task: "CIT Filing", urgent: false },
  { date: "Jul 10", client: "Okafor & Sons", task: "Quarterly Review", urgent: false },
  { date: "Jul 15", client: "Sunrise Bakery", task: "Annual Return", urgent: false },
];

const activities = [
  { text: "Zenith Foods Ltd uploaded 3 new receipts", time: "2 min ago" },
  { text: "Eko Logistics requested compliance report", time: "15 min ago" },
  { text: "Marina Tech completed onboarding", time: "1 hr ago" },
  { text: "Bulk calculation completed for 5 clients", time: "2 hr ago" },
  { text: "VAT filing submitted for Okafor & Sons", time: "3 hr ago" },
  { text: "New client Sunlight Ventures added", time: "5 hr ago" },
];

const recentClients = [
  { name: "Zenith Foods Ltd", cac: "RC-248571", tin: "1234567-0001", compliance: 94, lastActivity: "2 min ago", status: "active" },
  { name: "Eko Logistics", cac: "RC-189432", tin: "9876543-0002", compliance: 78, lastActivity: "15 min ago", status: "alert" },
  { name: "Marina Tech Ltd", cac: "RC-301287", tin: "5678901-0003", compliance: 100, lastActivity: "1 hr ago", status: "active" },
  { name: "Okafor & Sons", cac: "RC-145678", tin: "2345678-0004", compliance: 85, lastActivity: "3 hr ago", status: "active" },
  { name: "Sunrise Bakery", cac: "RC-298761", tin: "3456789-0005", compliance: 62, lastActivity: "5 hr ago", status: "pending" },
];

export default function ProDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 
              className="text-2xl font-bold mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Good morning, Adaeze 👋
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              You have 8 pending tasks and 2 filing deadlines this week.
            </p>
          </div>
          <Button variant="primary" size="lg">
            Add Client +
          </Button>
        </motion.div>

        {/* Stat Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
            >
              <Card 
                className="p-5 cursor-pointer"
                accent={stat.variant === "success" ? "green" : "amber"}
              >
                <p 
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {stat.label}
                </p>
                <p 
                  className="text-3xl font-bold mb-1"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {stat.value}
                </p>
                <p 
                  className="text-sm"
                  style={{ color: stat.variant === "success" ? 'var(--color-success)' : 'var(--color-warning)' }}
                >
                  {stat.change}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Deadlines */}
          <motion.div variants={item}>
            <Card className="p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Upcoming Deadlines
                </h2>
                <a 
                  href="#" 
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'var(--color-brand-primary)' }}
                >
                  FIRS Calendar
                </a>
              </div>
              <div className="space-y-3">
                {deadlines.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-surface-inset"
                    style={{ '--tw-bg-opacity': '0.5' } as React.CSSProperties}
                  >
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ 
                        background: d.urgent ? 'var(--color-error)' : 'var(--color-text-muted)' 
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p 
                        className="text-sm font-medium truncate"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {d.client}
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {d.task}
                      </p>
                    </div>
                    <span 
                      className="text-xs font-medium flex-shrink-0"
                      style={{ color: d.urgent ? 'var(--color-error)' : 'var(--color-text-muted)' }}
                    >
                      {d.date}
                    </span>
                  </motion.div>
                ))}
              </div>
              <a 
                href="#" 
                className="inline-flex items-center gap-1 mt-4 text-sm font-medium hover:underline"
                style={{ color: 'var(--color-brand-primary)' }}
              >
                View FIRS Calendar →
              </a>
            </Card>
          </motion.div>

          {/* Client Activity */}
          <motion.div variants={item}>
            <Card className="p-5 h-full">
              <h2 
                className="font-semibold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Client Activity
              </h2>
              <div className="space-y-3">
                {activities.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: 'var(--color-brand-primary)' }}
                    />
                    <div className="flex-1">
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {a.text}
                      </p>
                      <p 
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {a.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item}>
            <Card className="p-5 h-full">
              <h2 
                className="font-semibold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link href="/pro/clients">
                  <Button variant="secondary" size="lg" fullWidth className="justify-start">
                    Add New Client
                  </Button>
                </Link>
                <Link href="/pro/calculations">
                  <Button variant="primary" size="lg" fullWidth className="justify-start">
                    Run Bulk Calculation
                  </Button>
                </Link>
                <Link href="/pro/verify">
                  <Button variant="ghost" size="lg" fullWidth className="justify-start">
                    Verify Client CAC/TIN
                  </Button>
                </Link>
              </div>

              {/* API Usage Widget */}
              <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    API Usage
                  </span>
                  <span 
                    className="text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    8,431 / 10,000
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--color-surface-inset)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "84%" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--color-brand-primary)' }}
                  />
                </div>
                <a 
                  href="#" 
                  className="inline-flex items-center gap-1 mt-3 text-sm font-medium hover:underline"
                  style={{ color: 'var(--color-brand-primary)' }}
                >
                  Upgrade to Unlimited →
                </a>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Clients Table */}
        <motion.div variants={item}>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 
                className="font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Recent Clients
              </h2>
              <Link 
                href="/pro/clients"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--color-brand-primary)' }}
              >
                View all 47 →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <th 
                      className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Client Name
                    </th>
                    <th 
                      className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      CAC Number
                    </th>
                    <th 
                      className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      TIN
                    </th>
                    <th 
                      className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Compliance
                    </th>
                    <th 
                      className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Last Activity
                    </th>
                    <th 
                      className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Status
                    </th>
                    <th 
                      className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentClients.map((client, i) => (
                    <motion.tr
                      key={client.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                      className="hover:bg-surface-inset transition-colors"
                    >
                      <td 
                        className="py-3 px-2 font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {client.name}
                      </td>
                      <td 
                        className="py-3 px-2 text-sm font-mono"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {client.cac}
                      </td>
                      <td 
                        className="py-3 px-2 text-sm font-mono"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {client.tin}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-16 h-1.5 rounded-full overflow-hidden"
                            style={{ background: 'var(--color-surface-inset)' }}
                          >
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${client.compliance}%`,
                                background: client.compliance >= 80 ? 'var(--color-success)' : 
                                           client.compliance >= 60 ? 'var(--color-warning)' : 'var(--color-error)'
                              }}
                            />
                          </div>
                          <span 
                            className="text-sm font-medium"
                            style={{ 
                              color: client.compliance >= 80 ? 'var(--color-success)' : 
                                     client.compliance >= 60 ? 'var(--color-warning)' : 'var(--color-error)'
                            }}
                          >
                            {client.compliance}%
                          </span>
                        </div>
                      </td>
                      <td 
                        className="py-3 px-2 text-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {client.lastActivity}
                      </td>
                      <td className="py-3 px-2">
                        <Badge 
                          variant={client.status === 'active' ? 'success' : 
                                    client.status === 'alert' ? 'error' : 'warning'}
                        >
                          ● {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Link 
                          href={`/pro/clients/${i + 1}`}
                          className="text-sm font-medium hover:underline"
                          style={{ color: 'var(--color-brand-primary)' }}
                        >
                          View
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}