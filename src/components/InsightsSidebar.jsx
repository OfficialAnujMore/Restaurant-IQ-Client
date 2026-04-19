import { useEffect } from 'react';
import { useInsights } from '../hooks/useInsights.js';
import InsightPanel from './InsightPanel.jsx';

export default function InsightsSidebar({ target, onClose }) {
  const {
    insights,
    loading,
    error,
    cached,
    parseError,
    provider,
    generate,
    regenerate,
    dismiss,
  } = useInsights(target?.location, target?.context);

  useEffect(() => {
    if (target) generate();
  }, [target?.location?.rank]);

  return (
    <aside className="z-10 flex w-[320px] shrink-0 flex-col overflow-hidden border-l border-cyan-100/70 bg-[linear-gradient(180deg,rgba(236,254,255,0.94)_0%,rgba(224,247,250,0.9)_100%)] backdrop-blur-xl xl:w-[348px]">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-cyan-100/70 px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-purple-700">✦ AI Insights</span>
          {target && (
            <span className="rounded-full border border-cyan-100 bg-white/70 px-2 py-0.5 text-[0.65rem] font-semibold text-slate-500">
              Location #{target.location?.rank}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-cyan-100 bg-white/60 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-cyan-200 hover:text-slate-800"
          aria-label="Close insights panel"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {!target ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed22,#0891b222)] text-xl">
              ✦
            </div>
            <p className="text-sm font-medium text-slate-500">
              Select a location and click<br />
              <span className="font-semibold text-purple-600">Generate Insights</span> to start.
            </p>
          </div>
        ) : (
          <InsightPanel
            insights={insights}
            loading={loading}
            error={error}
            cached={cached}
            parseError={parseError}
            provider={provider}
            onRegenerate={regenerate}
            onDismiss={onClose}
          />
        )}
      </div>
    </aside>
  );
}
