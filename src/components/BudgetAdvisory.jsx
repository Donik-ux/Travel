import React from 'react';
import { PiggyBank, TrendingUp, Calendar, Sparkles, AlertTriangle } from 'lucide-react';

/**
 * Friendly advisory shown when the user's travel balance is too small for
 * a comfortable trip. Encourages saving up rather than rushing a stressful
 * underfunded journey.
 *
 * Tiers (USD):
 *   < 200  → "way too low" — strong nudge, prefer staycation
 *   < 500  → "very tight"  — recommend saving up to ~$1000-$1500
 *
 * Returns null at ≥ $500 so the component is safe to render unconditionally.
 */
export default function BudgetAdvisory({ balance, className = '' }) {
  const b = Math.max(0, Number(balance) || 0);
  if (b >= 500) return null;

  const isTiny = b < 200;
  const target = isTiny ? 1500 : 1200;
  const gap    = target - b;

  // Savings scenarios — months to reach the recommended target
  const scenarios = [
    { perMonth: 50,  label: '$50 / month'  },
    { perMonth: 100, label: '$100 / month' },
    { perMonth: 200, label: '$200 / month' },
  ].map(s => ({ ...s, months: Math.max(1, Math.ceil(gap / s.perMonth)) }));

  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 ${isTiny ? 'border-red-300 bg-red-50' : 'border-[#ffd76e] bg-[#fff7e6]'} ${className}`}>
      <div className={`absolute -right-12 -top-12 w-44 h-44 rounded-full blur-3xl pointer-events-none ${isTiny ? 'bg-red-300/40' : 'bg-[#febb02]/30'}`} />

      <div className="relative p-4 md:p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isTiny ? 'bg-red-500 text-white' : 'bg-[#febb02] text-[#1a1a1a]'}`}>
            {isTiny ? <AlertTriangle className="w-6 h-6" /> : <PiggyBank className="w-6 h-6" />}
          </div>
          <div className="min-w-0">
            <p className={`text-[14px] md:text-[15px] font-black leading-tight ${isTiny ? 'text-red-900' : 'text-[#7c4a00]'}`}>
              {isTiny
                ? `$${b} — этого не хватит даже на скромную поездку`
                : `$${b} — пока маловато для комфортной поездки`}
            </p>
            <p className={`text-[12px] md:text-[13px] font-semibold mt-1 leading-snug ${isTiny ? 'text-red-800' : 'text-[#a45e00]'}`}>
              Честный совет: лучше подкопи ещё немного и слетай в следующем году — спокойно,
              без переплат за всё и стресса с бронями в последний момент.
            </p>
          </div>
        </div>

        {/* Savings calculator */}
        <div className={`rounded-xl border ${isTiny ? 'border-red-200 bg-white' : 'border-[#febb02]/40 bg-white/80'} p-3 md:p-4`}>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#9ca3af] mb-2">
            <TrendingUp className="w-3 h-3 text-[#008009]" />
            Сколько копить до комфортных $${target}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {scenarios.map(s => (
              <div key={s.perMonth} className="rounded-lg bg-[#f8f9fa] border border-[#e7e7e7] p-2.5 text-center">
                <div className="text-[10px] text-[#9ca3af] font-bold uppercase tracking-wider">Откладывай</div>
                <div className="text-[13px] font-black text-[#003580] leading-tight my-0.5">{s.label}</div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-black text-[#008009] mt-1">
                  <Calendar className="w-3 h-3" />
                  {s.months} {s.months === 1 ? 'мес' : s.months < 5 ? 'мес' : 'мес'}.
                </div>
              </div>
            ))}
          </div>
          <p className={`text-[11px] mt-3 leading-snug ${isTiny ? 'text-red-700' : 'text-[#7c4a00]'} font-semibold flex items-start gap-1.5`}>
            <Sparkles className="w-3 h-3 mt-0.5 shrink-0" />
            Через год у тебя будет реальный бюджет на нормальную поездку — отель 4★, нестрашная еда,
            экскурсии без отказа. Сейчас можно зайти в **AI Trip Studio** с этой суммой и просто
            посмотреть, что доступно — но мы рекомендуем подкопить.
          </p>
        </div>
      </div>
    </div>
  );
}
