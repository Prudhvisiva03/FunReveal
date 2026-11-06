"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogOut, TrendingUp, Users, CreditCard, AlertCircle, Settings, RefreshCcw } from "lucide-react";

interface DashboardData {
  stats: {
    totalSessions: number;
    paidSessions: number;
    pendingSessions: number;
    totalRevenuePaise: number;
    totalPayments: number;
    failedPayments: number;
  };
  payments: Array<{
    id: string;
    toolType: string;
    orderId: string;
    paymentId: string | null;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    verifiedAt: string | null;
  }>;
  pagination: { page: number; limit: number; total: number; pages: number };
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <Card className="card-glow p-5">
      <CardContent className="p-0">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color || "from-purple-600/20 to-pink-700/20"} border border-purple-700/30 flex items-center justify-center mb-3`}>
          {icon}
        </div>
        <div className="text-2xl font-black text-white mb-0.5">{value}</div>
        <div className="text-purple-300/60 text-sm">{label}</div>
        {sub && <div className="text-purple-400/50 text-xs mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: "success" | "warning" | "destructive" | "secondary"; label: string }> = {
    COMPLETED: { variant: "success", label: "Paid ✓" },
    PENDING: { variant: "warning", label: "Pending" },
    FAILED: { variant: "destructive", label: "Failed" },
    CANCELLED: { variant: "secondary", label: "Cancelled" },
    REFUNDED: { variant: "secondary", label: "Refunded" },
  };
  const cfg = map[status] || { variant: "secondary", label: status };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [price, setPrice] = useState("500");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");

  const fetchDashboard = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard?page=${page}`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Failed to load dashboard");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const s = await res.json();
      setPrice(s.default_price_paise || "500");
    }
  };

  useEffect(() => { fetchDashboard(); fetchSettings(); }, []);

  const saveSettings = async () => {
    setSavingSettings(true);
    setSettingsMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "default_price_paise", value: price }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSettingsMsg("✅ Price updated successfully!");
    } catch (err: any) {
      setSettingsMsg("❌ Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-white">{error}</p>
          <Button onClick={() => fetchDashboard()} className="mt-4"><RefreshCcw className="w-4 h-4 mr-2" />Retry</Button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const revenueINR = ((stats?.totalRevenuePaise || 0) / 100).toFixed(0);

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(circle at 50% 0%, #1a0533 0%, #0a0014 100%)" }}>
      {/* Header */}
      <div className="glass-panel border-b border-purple-900/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-black text-xl">FunReveal Admin</h1>
          <p className="text-purple-300/50 text-xs">Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setSettingsOpen(!settingsOpen)}>
            <Settings className="w-4 h-4 mr-1" />Settings
          </Button>
          <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
            <LogOut className="w-4 h-4 mr-1" />Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon={<Users className="w-5 h-5 text-purple-400" />} label="Total Sessions" value={stats?.totalSessions || 0} />
          <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} label="Paid Sessions" value={stats?.paidSessions || 0} color="from-emerald-600/20 to-teal-700/20" />
          <StatCard icon={<CreditCard className="w-5 h-5 text-pink-400" />} label="Total Revenue" value={`₹${revenueINR}`} sub={`${stats?.totalPayments || 0} transactions`} color="from-pink-600/20 to-rose-700/20" />
          <StatCard icon={<AlertCircle className="w-5 h-5 text-amber-400" />} label="Pending" value={stats?.pendingSessions || 0} color="from-amber-600/20 to-yellow-700/20" />
          <StatCard icon={<CreditCard className="w-5 h-5 text-blue-400" />} label="Total Payments" value={stats?.totalPayments || 0} color="from-blue-600/20 to-indigo-700/20" />
          <StatCard icon={<AlertCircle className="w-5 h-5 text-red-400" />} label="Failed Payments" value={stats?.failedPayments || 0} color="from-red-600/20 to-rose-700/20" />
        </div>

        {/* Settings Panel */}
        {settingsOpen && (
          <Card className="card-glow p-6">
            <CardContent className="p-0">
              <h2 className="text-white font-bold text-lg mb-5">⚙️ Site Settings</h2>
              <div className="max-w-sm space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Default Unlock Price (paise) — 500 = ₹5</Label>
                  <Input id="price" type="number" min="100" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <p className="text-purple-400/50 text-xs">Current: ₹{(parseInt(price || "0") / 100).toFixed(2)}</p>
                </div>
                {settingsMsg && <p className="text-sm text-purple-200">{settingsMsg}</p>}
                <Button onClick={saveSettings} disabled={savingSettings}>
                  {savingSettings ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction Table */}
        <Card className="card-glow overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-purple-800/30">
            <h2 className="text-white font-bold">Recent Transactions</h2>
            <Button variant="ghost" size="sm" onClick={() => fetchDashboard()} disabled={loading}>
              <RefreshCcw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-800/30">
                  {["Tool", "Order ID", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left text-purple-400/60 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.payments.map((p) => (
                  <tr key={p.id} className="border-b border-purple-800/20 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-purple-200 font-medium">{p.toolType.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-purple-300/60 font-mono text-xs">{p.orderId.slice(0, 20)}...</td>
                    <td className="px-4 py-3 text-white font-semibold">₹{(p.amount / 100).toFixed(0)}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-purple-300/60">{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
                {(!data?.payments || data.payments.length === 0) && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-purple-400/40">No transactions yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="p-4 flex justify-center gap-2">
              {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={p === data.pagination.page ? "default" : "ghost"}
                  onClick={() => fetchDashboard(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
