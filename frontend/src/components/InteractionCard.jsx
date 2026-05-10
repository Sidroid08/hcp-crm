import { CalendarDays, Edit3, Trash2 } from "lucide-react";
import Badge from "./Badge";

const sentimentTone = {
  Positive: "green",
  Neutral: "blue",
  Negative: "red"
};

export default function InteractionCard({ interaction, onEdit, onDelete }) {
  return (
    <article className="rounded-md border border-line bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-ink">{interaction.hcp_name}</h3>
            <Badge tone={sentimentTone[interaction.sentiment] || "slate"}>{interaction.sentiment || "Unscored"}</Badge>
            {interaction.follow_up_required && <Badge tone="amber">Follow-up</Badge>}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {interaction.specialty} - {interaction.organization}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary px-3" onClick={() => onEdit(interaction)} aria-label="Edit interaction">
            <Edit3 size={16} />
          </button>
          <button className="btn-secondary px-3 text-rose-600" onClick={() => onDelete(interaction)} aria-label="Delete interaction">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          {interaction.interaction_date}
        </span>
        <span>{interaction.interaction_type}</span>
        {(interaction.products_discussed || []).map((product) => (
          <Badge key={product} tone="slate">
            {product}
          </Badge>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-700">{interaction.ai_summary || interaction.notes}</p>
      {interaction.next_best_action && (
        <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
          <span className="font-semibold text-ink">Next best action: </span>
          {interaction.next_best_action}
        </div>
      )}
    </article>
  );
}
