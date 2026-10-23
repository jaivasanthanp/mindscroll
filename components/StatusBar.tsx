"use client";

const STEPS = [
  "Analyzing concepts",
  "Calibrating difficulty",
  "Forging your boss",
  "Assembling game",
];

export default function StatusBar({ step }: { step: number }) {
  const i = Math.min(step, STEPS.length - 1);
  const pct = Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/85 text-white backdrop-blur">
      <div className="w-72">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">⚔️ {STEPS[i]}</span>
          <span className="font-mono text-white/60">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-4 text-center text-xs text-white/50">
          Forging a boss battle from your exact video sequence
        </p>
      </div>
    </div>
  );
}
