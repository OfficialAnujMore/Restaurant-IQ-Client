export default function InsightPanel({
  insights,
  loading,
  error,
  cached,
  parseError,
  provider,
  onRegenerate,
  onDismiss,
}) {
  if (loading) {
    return (
      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-2 text-blue-700">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium">Analyzing site data with AI...</span>
        </div>
        <p className="mt-1 text-xs text-blue-500">First generation takes 3–8 seconds.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">{error}</p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={onRegenerate}
            className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={onDismiss}
            className="rounded border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-purple-600 text-sm">✦</span>
          <span className="text-sm font-semibold text-purple-800">AI Site Analysis</span>
          {cached && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">
              cached
            </span>
          )}
          {parseError && (
            <span
              className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700"
              title="AI response partially failed. Fallback shown."
            >
              fallback
            </span>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-purple-400 hover:text-purple-600 transition-colors text-base leading-none"
          aria-label="Close insights"
        >
          ×
        </button>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-700 leading-relaxed">{insights.summary}</p>

      {/* Key data points */}
      {insights.highlights?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-purple-700 mb-1">
            Key Data Points
          </h4>
          <ul className="space-y-0.5">
            {insights.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                <span className="mt-0.5 text-purple-400">•</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pros / Cons */}
      <div className="grid grid-cols-2 gap-3">
        {insights.pros?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">
              Pros
            </h4>
            <ul className="space-y-0.5">
              {insights.pros.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                  <span className="mt-0.5 text-green-500">+</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {insights.cons?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-red-700 mb-1">
              Cons
            </h4>
            <ul className="space-y-0.5">
              {insights.cons.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                  <span className="mt-0.5 text-red-400">−</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Best restaurant formats */}
      {insights.best_for?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-1">
            Best Restaurant Formats
          </h4>
          <div className="flex flex-wrap gap-1">
            {insights.best_for.map((b, i) => (
              <span
                key={i}
                className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs text-blue-700"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Peak traffic */}
      {insights.best_time_to_visit && (
        <div className="rounded bg-white/60 px-3 py-2">
          <span className="text-xs font-semibold text-gray-600">Peak Traffic: </span>
          <span className="text-xs text-gray-700">{insights.best_time_to_visit}</span>
        </div>
      )}

      {/* Things to verify on-site */}
      {insights.things_to_verify?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-orange-700 mb-1">
            Verify On-Site
          </h4>
          <ul className="space-y-0.5">
            {insights.things_to_verify.map((t, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <span className="mt-0.5 text-orange-400">?</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confidence / data quality note */}
      {insights.confidence_note && (
        <p className="rounded bg-gray-100 px-3 py-2 text-xs text-gray-500 italic">
          {insights.confidence_note}
        </p>
      )}

      {/* Footer: provider label + regenerate */}
      <div className="flex items-center justify-between pt-1 border-t border-purple-100">
        <span className="text-xs text-purple-400">via GPT-4o mini</span>
        <button
          onClick={onRegenerate}
          className="text-xs text-purple-500 hover:text-purple-700 underline transition-colors"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}
