import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, MapPin, Calendar, Wallet, Trash2, ArrowRight, Map, Clock,
} from 'lucide-react';
import useSavedPlansStore from '../store/useSavedPlansStore';
import useStore from '../store/useStore';
import useSEO from '../hooks/useSEO';
import { heroFor } from '../utils/destinationImages';
import { toast } from '../components/Toast';
import SmartImage from '../components/SmartImage';

export default function MyPlans() {
  const navigate = useNavigate();
  const { plans, removePlan, clearPlans } = useSavedPlansStore();
  const { setItineraries, setItineraryMeta } = useStore();

  useSEO({
    title: 'My Trip Plans · Saved AI Itineraries',
    description: 'All your saved AI-generated travel plans in one place — reopen any plan, review the budget and itinerary.',
  });

  /* Restore a saved plan into the live store and open the planner */
  const openPlan = (plan) => {
    setItineraries(plan.itineraries || []);
    setItineraryMeta(plan.meta || null);
    navigate('/planner', { state: { restoredFormData: plan.formData } });
  };

  const handleRemove = (id, dest) => {
    removePlan(id);
    toast.info('Plan removed', dest);
  };

  const handleClear = () => {
    if (!plans.length) return;
    clearPlans();
    toast.info('All plans cleared', `${plans.length} plans removed`);
  };

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return ''; }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen -mt-[64px]">
      {/* ── Hero header ── */}
      <section className="relative bg-[#002250] text-white overflow-hidden pt-[100px] pb-12">
        <div className="absolute inset-0 opacity-25 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle at 25% 30%, #0071c2 0%, transparent 45%), radial-gradient(circle at 75% 70%, #f5b942 0%, transparent 35%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5b942] text-[#002250] text-[11px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Saved Itineraries
          </div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-2">My Trip Plans</h1>
              <p className="text-[14px] md:text-[15px] text-white/80 font-medium">
                {plans.length} saved {plans.length === 1 ? 'plan' : 'plans'} · reopen any one to review it
              </p>
            </div>
            {plans.length > 0 && (
              <button onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[12px] font-black transition active:scale-95">
                <Trash2 className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* ── Empty state ── */}
        {plans.length === 0 && (
          <div className="bg-white border border-[#e7e7e7] rounded-3xl p-10 md:p-14 text-center shadow-sm relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#f5b942]/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f5b942] to-[#d99a2b] flex items-center justify-center mx-auto mb-5 rotate-3 shadow-xl">
                <Map className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] mb-2">No saved plans yet</h2>
              <p className="text-[14px] text-[#595959] font-medium mb-7 max-w-md mx-auto">
                Generate a trip with the AI planner and tap <strong>“Save plan”</strong> — it will appear here so you never lose it.
              </p>
              <button onClick={() => navigate('/planner')}
                className="px-5 py-3 rounded-xl bg-[#f5b942] hover:bg-[#e0a435] text-[#002250] text-[13px] font-black inline-flex items-center justify-center gap-2 transition active:scale-95">
                <Sparkles className="w-4 h-4" /> Open AI Planner
              </button>
            </div>
          </div>
        )}

        {/* ── Plans grid ── */}
        {plans.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 page-fade">
            {plans.map((plan) => {
              const dest   = plan.formData?.destination || 'Trip';
              const days   = plan.itineraries?.length || plan.formData?.days || 0;
              const total  = plan.meta?.budgetBreakdown?.total;
              const budget = Number(plan.formData?.budget) || 0;
              const isAi   = plan.meta?.source === 'ai';
              return (
                <div key={plan.id}
                  className="group bg-white border border-[#e7e7e7] rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
                  <div className="relative">
                    <SmartImage src={heroFor(dest)} alt={dest} aspect="aspect-[16/10]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                    <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      isAi ? 'bg-[#f5b942] text-[#002250]' : 'bg-[#0071c2] text-white'
                    }`}>
                      <Sparkles className="w-3 h-3" /> {isAi ? 'AI Plan' : 'Plan'}
                    </span>
                    <button onClick={() => handleRemove(plan.id, dest)}
                      className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow hover:bg-red-50 hover:scale-110 transition"
                      aria-label="Delete plan">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <h3 className="absolute bottom-2.5 left-3 right-3 text-white text-[18px] font-black flex items-center gap-1.5 drop-shadow">
                      <MapPin className="w-4 h-4" /> {dest}
                    </h3>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-bold text-[#595959] mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#0071c2]" /> {days} days</span>
                      {budget > 0 && <span className="flex items-center gap-1"><Wallet className="w-3 h-3 text-[#0071c2]" /> ${budget.toLocaleString()} budget</span>}
                      <span className="flex items-center gap-1 text-[#9ca3af]"><Clock className="w-3 h-3" /> {fmtDate(plan.savedAt)}</span>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-3 border-t border-[#f0f0f0]">
                      <div>
                        {total != null ? (
                          <>
                            <div className="text-[10px] text-[#9ca3af] font-bold uppercase">Plan cost</div>
                            <div className="text-[20px] font-black text-[#003580] leading-none">${Number(total).toLocaleString()}</div>
                          </>
                        ) : (
                          <div className="text-[12px] text-[#9ca3af] font-bold">Open to view</div>
                        )}
                      </div>
                      <button onClick={() => openPlan(plan)}
                        className="px-3.5 py-2 rounded-lg bg-[#0071c2] hover:bg-[#005fa3] text-white text-[12px] font-black flex items-center gap-1 transition active:scale-95">
                        Open <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
