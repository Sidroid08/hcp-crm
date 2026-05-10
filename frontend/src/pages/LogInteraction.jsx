import { Bot, ClipboardList, Loader2, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InteractionForm from "../components/InteractionForm";
import { clearChatDraft, createInteraction, runChatLogger } from "../features/interactionsSlice";

const prompts = [
  "Met Dr. Rao, cardiologist at Apollo Heart Institute, to discuss Cardiostat XR. She was positive and requested outcomes data before a follow-up next Thursday.",
  "Virtual call with Dr. Mehta from City Clinic about GlucoPlus XR. He had pricing concerns and asked for a short comparison sheet.",
  "Conference meeting with Dr. Shah, pulmonologist at Metro Medical Center. Discussed Respira LA safety data for elderly patients."
];

export default function LogInteraction() {
  const dispatch = useDispatch();
  const { loading, chatDraft, chatReply } = useSelector((state) => state.interactions);
  const [tab, setTab] = useState("form");
  const [message, setMessage] = useState("");

  const handleChat = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    await dispatch(runChatLogger(message)).unwrap();
  };

  const saveDraft = async () => {
    await dispatch(createInteraction(chatDraft)).unwrap();
    dispatch(clearChatDraft());
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-line bg-white p-2 shadow-soft">
        <div className="grid grid-cols-2 gap-2">
          <button
            className={`flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition ${
              tab === "form" ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
            onClick={() => setTab("form")}
          >
            <ClipboardList size={17} />
            Structured Form
          </button>
          <button
            className={`flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition ${
              tab === "chat" ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
            onClick={() => setTab("chat")}
          >
            <Bot size={17} />
            AI Chat Logger
          </button>
        </div>
      </div>

      {tab === "form" ? (
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <div className="mb-5">
            <h2 className="text-lg font-bold">Log HCP interaction</h2>
            <p className="text-sm text-slate-500">Capture structured details and generate AI enrichment before saving.</p>
          </div>
          <InteractionForm />
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-md border border-line bg-white shadow-soft">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-lg font-bold">Conversational logger</h2>
              <p className="text-sm text-slate-500">Describe the interaction naturally and let the workflow agent draft the log.</p>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                  <Bot size={18} />
                </div>
                <div className="rounded-md bg-slate-100 p-3 text-sm leading-6 text-slate-700">
                  Share the HCP name, specialty, organization, product topics, meeting type, sentiment signals, and follow-up context in one note.
                </div>
              </div>
              <div className="grid gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="rounded-md border border-line bg-white px-3 py-2 text-left text-xs leading-5 text-slate-600 transition hover:border-brand-500 hover:bg-brand-50"
                    onClick={() => setMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              {chatReply && (
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white">
                    <Sparkles size={18} />
                  </div>
                  <div className="rounded-md bg-brand-50 p-3 text-sm leading-6 text-brand-700">{chatReply}</div>
                </div>
              )}
              <form onSubmit={handleChat} className="space-y-3">
                <textarea
                  className="field min-h-40"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Example: Met Dr. Rao, cardiologist at Apollo, to discuss Cardiostat XR. She was interested in outcomes data and asked for a follow-up next Thursday..."
                />
                <button className="btn-primary w-full" disabled={loading || !message.trim()}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? "Generating draft..." : "Generate interaction draft"}
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-md border border-line bg-white p-5 shadow-soft">
            <h2 className="text-lg font-bold">AI draft preview</h2>
            {chatDraft ? (
              <div className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Preview label="HCP" value={chatDraft.hcp_name} />
                  <Preview label="Specialty" value={chatDraft.specialty} />
                  <Preview label="Organization" value={chatDraft.organization} />
                  <Preview label="Sentiment" value={chatDraft.sentiment} />
                </div>
                <Preview label="Summary" value={chatDraft.ai_summary} />
                <Preview label="Action items" value={(chatDraft.action_items || []).join(", ")} />
                <Preview label="Next best action" value={chatDraft.next_best_action} />
                <button className="btn-primary w-full" onClick={saveDraft} disabled={loading}>
                  {loading ? "Saving..." : "Save AI draft"}
                </button>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-slate-500">Generated fields will appear here after the agent runs.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function Preview({ label, value }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-700">{value || "Not captured"}</p>
    </div>
  );
}
