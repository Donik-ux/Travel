import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Sparkles, Flame, Plane } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#f5f5f5]">
      <div className="max-w-xl w-full bg-white border border-[#e7e7e7] rounded-3xl shadow-sm p-10 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#003580] text-white flex items-center justify-center mx-auto mb-5 rotate-3">
          <Compass className="w-10 h-10" />
        </div>
        <p className="text-[12px] font-black uppercase tracking-widest text-[#0071c2] mb-2">404 · This page took a wrong turn</p>
        <h1 className="text-3xl md:text-4xl font-black text-[#1a1a1a] tracking-tight mb-3">
          The page you're looking for is off the map.
        </h1>
        <p className="text-[14px] text-[#595959] font-medium mb-6">
          But there's plenty to discover — start a new trip with AI or browse our hot deals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/')}
            className="px-5 py-3 rounded-xl border-2 border-[#e7e7e7] hover:border-[#0071c2] hover:bg-[#f0f5ff] text-[13px] font-black text-[#1a1a1a] transition active:scale-95 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>
          <button onClick={() => navigate('/hot-tours')}
            className="px-5 py-3 rounded-xl bg-[#febb02] hover:bg-[#ffb700] text-[#1a1a1a] text-[13px] font-black transition active:scale-95 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Try AI Trip Studio
          </button>
        </div>
        <div className="mt-7 pt-6 border-t border-[#f0f0f0] flex justify-center gap-5 text-[#595959]">
          <button onClick={() => navigate('/flights')} className="flex items-center gap-1.5 text-[12px] font-bold hover:text-[#0071c2] transition">
            <Plane className="w-3.5 h-3.5" /> Search flights
          </button>
          <button onClick={() => navigate('/hot-tours')} className="flex items-center gap-1.5 text-[12px] font-bold hover:text-[#0071c2] transition">
            <Flame className="w-3.5 h-3.5" /> Hot tours
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
