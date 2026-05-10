import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditModal from "../components/EditModal";
import InteractionCard from "../components/InteractionCard";
import { deleteInteraction, fetchInteractions, setSelected } from "../features/interactionsSlice";

export default function History() {
  const dispatch = useDispatch();
  const { items, selected, loading } = useSelector((state) => state.interactions);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return items.filter((item) =>
      [item.hcp_name, item.specialty, item.organization, item.interaction_type, item.sentiment]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [items, query]);

  const handleDelete = (interaction) => {
    const confirmed = window.confirm(`Delete the interaction with ${interaction.hcp_name}? This cannot be undone.`);
    if (confirmed) {
      dispatch(deleteInteraction(interaction.id));
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-md border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold">Interaction history</h2>
            <p className="text-sm text-slate-500">
              {loading ? "Refreshing saved HCP logs..." : `${filtered.length} of ${items.length} interactions visible`}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 md:max-w-xl md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input className="field pl-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search HCP, specialty, organization" />
            </div>
            <div className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-600">
              <SlidersHorizontal size={16} />
              Smart search
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        {filtered.length === 0 && (
          <div className="rounded-md border border-line bg-white p-8 text-center text-sm text-slate-500 shadow-soft">
            No interactions match the current view.
          </div>
        )}
        {filtered.map((interaction) => (
          <InteractionCard
            key={interaction.id}
            interaction={interaction}
            onEdit={(item) => dispatch(setSelected(item))}
            onDelete={handleDelete}
          />
        ))}
      </section>

      <EditModal interaction={selected} onClose={() => dispatch(setSelected(null))} />
    </div>
  );
}
