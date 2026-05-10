import { Activity, BarChart3, ClipboardPlus, History, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { clearError } from "../features/interactionsSlice";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/log", label: "Log Interaction", icon: ClipboardPlus },
  { to: "/history", label: "History", icon: History }
];

export default function Layout() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.interactions);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-ink">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-line bg-white px-5 py-6 shadow-soft transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-600 text-white">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-sm font-bold">AI-First CRM</p>
            <p className="text-xs text-slate-500">HCP interaction module</p>
          </div>
        </div>
        <nav className="mt-9 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 rounded-md border border-line bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Activity size={16} className="text-brand-600" />
            AI workflow active
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">LangGraph tools enrich summaries, action items, and next steps.</p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-line bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between">
            <button className="btn-secondary px-3 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-lg font-bold">AI-First CRM HCP Module</h1>
              <p className="text-sm text-slate-500">Field interaction logging for life science teams</p>
            </div>
            <div className="hidden rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 sm:block">
              Production-style demo
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">
          {error && (
            <div className="mb-5 flex items-start justify-between gap-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <div>
                <p className="font-bold">Request failed</p>
                <p className="mt-1 leading-6">{error}</p>
              </div>
              <button className="rounded-md p-1 hover:bg-rose-100" onClick={() => dispatch(clearError())} aria-label="Dismiss error">
                <X size={16} />
              </button>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
