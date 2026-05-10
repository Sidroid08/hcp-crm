import { CalendarClock, CheckCircle2, ClipboardList, MessageSquareText, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Badge from "../components/Badge";
import StatCard from "../components/StatCard";
import { fetchInteractions, fetchStats } from "../features/interactionsSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, items, loading } = useSelector((state) => state.interactions);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchInteractions());
  }, [dispatch]);

  const recent = items.slice(0, 4);
  const last = stats?.last_logged_interaction;
  const positiveRate = stats?.total_interactions
    ? Math.round((stats.positive_interactions / stats.total_interactions) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-line bg-white px-5 py-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Field intelligence cockpit</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">HCP engagement command center</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Track interaction quality, follow-up pressure, and AI-generated next actions from one operational view.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-80">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Positive rate</p>
              <p className="mt-1 text-2xl font-bold">{positiveRate}%</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Open actions</p>
              <p className="mt-1 text-2xl font-bold">{stats?.pending_follow_ups ?? 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total interactions" value={stats?.total_interactions ?? 0} icon={ClipboardList} accent="blue" />
        <StatCard label="Positive interactions" value={stats?.positive_interactions ?? 0} icon={CheckCircle2} accent="green" />
        <StatCard label="Pending follow-ups" value={stats?.pending_follow_ups ?? 0} icon={CalendarClock} accent="amber" />
        <StatCard label="Last logged" value={last?.interaction_date || "No logs"} icon={MessageSquareText} accent="slate" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-md border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Recent interactions</h2>
              <p className="text-sm text-slate-500">Latest HCP engagement activity</p>
            </div>
            <Badge tone="blue">{loading ? "Syncing" : "Live CRM feed"}</Badge>
          </div>
          <div className="mt-5 divide-y divide-line">
            {loading && recent.length === 0 && <DashboardSkeleton />}
            {!loading && recent.length === 0 && <p className="py-8 text-sm text-slate-500">No interactions logged yet.</p>}
            {recent.map((item) => (
              <div key={item.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{item.hcp_name}</p>
                    <p className="text-sm text-slate-500">
                      {item.specialty} - {item.interaction_type}
                    </p>
                  </div>
                  <Badge tone={item.sentiment === "Positive" ? "green" : item.sentiment === "Negative" ? "red" : "blue"}>
                    {item.sentiment || "Neutral"}
                  </Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.ai_summary || item.notes}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Last logged interaction</h2>
            <TrendingUp size={18} className="text-brand-600" />
          </div>
          {last ? (
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">HCP</p>
                <p className="mt-1 font-bold">{last.hcp_name}</p>
                <p className="text-sm text-slate-500">{last.organization}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">AI summary</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{last.ai_summary || last.notes}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Next best action</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{last.next_best_action || "No recommendation generated yet."}</p>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">Create a structured or chat-based log to populate this panel.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 py-2">
      {[1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse py-4">
          <div className="h-4 w-44 rounded bg-slate-100" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
