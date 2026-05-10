import { Loader2, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createInteraction, summarizeInteraction, updateInteraction } from "../features/interactionsSlice";

const emptyForm = {
  hcp_name: "",
  specialty: "",
  organization: "",
  interaction_type: "Clinic Visit",
  interaction_date: new Date().toISOString().slice(0, 10),
  products_discussed: "",
  notes: "",
  ai_summary: "",
  sentiment: "Neutral",
  follow_up_required: false,
  follow_up_date: "",
  action_items: "",
  next_best_action: ""
};

const toForm = (interaction) => ({
  ...emptyForm,
  ...interaction,
  products_discussed: (interaction?.products_discussed || []).join(", "),
  action_items: (interaction?.action_items || []).join("\n"),
  follow_up_date: interaction?.follow_up_date || ""
});

const toPayload = (form) => ({
  ...form,
  products_discussed: form.products_discussed.split(",").map((item) => item.trim()).filter(Boolean),
  action_items: form.action_items.split("\n").map((item) => item.trim()).filter(Boolean),
  follow_up_date: form.follow_up_required && form.follow_up_date ? form.follow_up_date : null
});

export default function InteractionForm({ initialValue = null, onDone }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.interactions);
  const [form, setForm] = useState(() => toForm(initialValue));
  const isEdit = useMemo(() => Boolean(initialValue?.id), [initialValue]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleEnhance = async () => {
    const result = await dispatch(summarizeInteraction(toPayload(form))).unwrap();
    setForm(toForm({ ...toPayload(form), ...result }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = toPayload(form);
    if (isEdit) {
      await dispatch(updateInteraction({ id: initialValue.id, payload })).unwrap();
    } else {
      await dispatch(createInteraction(payload)).unwrap();
      setForm(emptyForm);
    }
    onDone?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className="label">HCP name</label>
          <input className="field" value={form.hcp_name} onChange={(e) => setField("hcp_name", e.target.value)} required />
        </div>
        <div>
          <label className="label">Specialty</label>
          <input className="field" value={form.specialty} onChange={(e) => setField("specialty", e.target.value)} required />
        </div>
        <div>
          <label className="label">Organization</label>
          <input className="field" value={form.organization} onChange={(e) => setField("organization", e.target.value)} required />
        </div>
        <div>
          <label className="label">Interaction type</label>
          <select className="field" value={form.interaction_type} onChange={(e) => setField("interaction_type", e.target.value)}>
            <option>Clinic Visit</option>
            <option>Virtual Call</option>
            <option>Conference Meeting</option>
            <option>Phone Call</option>
            <option>Email</option>
          </select>
        </div>
        <div>
          <label className="label">Interaction date</label>
          <input type="date" className="field" value={form.interaction_date} onChange={(e) => setField("interaction_date", e.target.value)} required />
        </div>
        <div>
          <label className="label">Products discussed</label>
          <input className="field" value={form.products_discussed} onChange={(e) => setField("products_discussed", e.target.value)} placeholder="Comma separated" />
        </div>
      </div>

      <div>
        <label className="label">Interaction notes</label>
        <textarea className="field min-h-32" value={form.notes} onChange={(e) => setField("notes", e.target.value)} required />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <label className="label">AI summary</label>
          <textarea className="field min-h-24" value={form.ai_summary || ""} onChange={(e) => setField("ai_summary", e.target.value)} />
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Sentiment</label>
            <select className="field" value={form.sentiment || "Neutral"} onChange={(e) => setField("sentiment", e.target.value)}>
              <option>Positive</option>
              <option>Neutral</option>
              <option>Negative</option>
            </select>
          </div>
          <label className="flex items-center gap-3 rounded-md border border-line bg-white px-3 py-2.5 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={form.follow_up_required} onChange={(e) => setField("follow_up_required", e.target.checked)} />
            Follow-up required
          </label>
          <input type="date" className="field" value={form.follow_up_date || ""} onChange={(e) => setField("follow_up_date", e.target.value)} disabled={!form.follow_up_required} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="label">Action items</label>
          <textarea className="field min-h-24" value={form.action_items || ""} onChange={(e) => setField("action_items", e.target.value)} placeholder="One per line" />
        </div>
        <div>
          <label className="label">Next best action</label>
          <textarea className="field min-h-24" value={form.next_best_action || ""} onChange={(e) => setField("next_best_action", e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={handleEnhance} disabled={loading || !form.notes}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? "Working..." : "Generate AI fields"}
        </button>
        <button className="btn-primary" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {loading ? "Saving..." : isEdit ? "Save changes" : "Save interaction"}
        </button>
      </div>
    </form>
  );
}
