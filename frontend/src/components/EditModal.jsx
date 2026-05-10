import { X } from "lucide-react";
import InteractionForm from "./InteractionForm";

export default function EditModal({ interaction, onClose }) {
  if (!interaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/40 px-4 py-8">
      <div className="w-full max-w-5xl rounded-md bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="text-lg font-bold">Edit interaction</h2>
            <p className="text-sm text-slate-500">{interaction.hcp_name}</p>
          </div>
          <button className="btn-secondary px-3" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <InteractionForm initialValue={interaction} onDone={onClose} />
        </div>
      </div>
    </div>
  );
}
