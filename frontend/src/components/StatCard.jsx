export default function StatCard({ label, value, icon: Icon, accent = "blue" }) {
  const colors = {
    blue: "bg-brand-50 text-brand-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700"
  };

  return (
    <div className="rounded-md border border-line bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-normal text-ink">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-md ${colors[accent]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}
