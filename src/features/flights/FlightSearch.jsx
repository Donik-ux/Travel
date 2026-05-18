import React, { useState } from 'react';
import {
  MapPin, Calendar, Search, ArrowRightLeft, Users, Briefcase, Plane,
  ChevronDown, RotateCcw, Loader2,
} from 'lucide-react';
import { useTranslation } from '../../store/useLangStore';

const POPULAR_FROM = ['Bishkek (FRU)', 'Almaty (ALA)', 'Tashkent (TAS)', 'Astana (NQZ)', 'Osh (OSS)'];
const POPULAR_TO   = ['Dubai (DXB)', 'Istanbul (IST)', 'Moscow (SVO)', 'Bangkok (BKK)', 'London (LHR)', 'Paris (CDG)', 'Tokyo (HND)', 'New York (JFK)'];

const CABINS = [
  { val: 'Economy',         label: 'Economy'         },
  { val: 'Premium Economy', label: 'Premium Economy' },
  { val: 'Business',        label: 'Business'        },
  { val: 'First',           label: 'First Class'     },
];

export default function FlightSearch({ formData, onChange, onSubmit, loading }) {
  const { t } = useTranslation();
  const [tripType, setTripType] = useState('roundtrip');
  const [pax, setPax]           = useState(1);
  const [cabin, setCabin]       = useState('Economy');
  const [paxOpen, setPaxOpen]   = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const set = (key) => (e) => onChange({ ...formData, [key]: e.target.value });
  const swap = () => onChange({ ...formData, from: formData.to, to: formData.from });
  const reset = () => onChange({ from: '', to: '', date: '', returnDate: '' });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ ...e, formData: { ...formData, pax, cabin, tripType } });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl ring-4 ring-[#febb02]/20 border border-[#febb02]/50 overflow-hidden">
      {/* ── Trip type / pax / cabin row ── */}
      <div className="bg-[#f8f9fa] border-b border-[#e7e7e7] px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        {/* Trip type tabs */}
        <div className="flex items-center gap-1 bg-white border border-[#e7e7e7] rounded-lg p-0.5">
          {[
            { v: 'roundtrip', l: 'Round-trip' },
            { v: 'oneway',    l: 'One-way'    },
            { v: 'multi',     l: 'Multi-city' },
          ].map(({ v, l }) => (
            <button key={v} type="button" onClick={() => setTripType(v)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-black transition ${
                tripType === v ? 'bg-[#003580] text-white' : 'text-[#595959] hover:bg-gray-50'
              }`}>
              {l}
            </button>
          ))}
        </div>

        {/* Pax + cabin combined dropdown */}
        <div className="relative" onMouseLeave={() => setPaxOpen(false)}>
          <button type="button" onClick={() => setPaxOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e7e7e7] bg-white text-[12px] font-bold text-[#1a1a1a] hover:border-[#0071c2] transition">
            <Users className="w-3.5 h-3.5 text-[#0071c2]" />
            {pax} {pax === 1 ? 'traveler' : 'travelers'}
            <span className="text-[#9ca3af]">·</span>
            <Briefcase className="w-3.5 h-3.5 text-[#0071c2]" /> {cabin}
            <ChevronDown className={`w-3 h-3 text-[#9ca3af] transition ${paxOpen ? 'rotate-180' : ''}`} />
          </button>
          {paxOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-[#e7e7e7] rounded-xl shadow-2xl z-30 p-3 page-fade">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] mb-2">Travelers</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-bold text-[#1a1a1a]">Adults</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setPax(p => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-md border-2 border-[#0071c2] text-[#0071c2] font-black hover:bg-[#f0f5ff] active:scale-95 transition">−</button>
                  <span className="w-6 text-center font-black">{pax}</span>
                  <button type="button" onClick={() => setPax(p => Math.min(9, p + 1))}
                    className="w-7 h-7 rounded-md border-2 border-[#0071c2] text-[#0071c2] font-black hover:bg-[#f0f5ff] active:scale-95 transition">+</button>
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] mb-2">Cabin class</p>
              <div className="grid grid-cols-2 gap-1.5">
                {CABINS.map(c => (
                  <button key={c.val} type="button" onClick={() => { setCabin(c.val); setPaxOpen(false); }}
                    className={`px-2.5 py-2 rounded-lg text-[11.5px] font-black transition ${
                      cabin === c.val ? 'bg-[#003580] text-white' : 'bg-[#f8f9fa] text-[#1a1a1a] hover:bg-[#f0f5ff]'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main inputs ── */}
      <form onSubmit={submit} className="p-3 md:p-4 space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-1 items-stretch">
          {/* From */}
          <FieldInput
            className="md:col-span-3"
            icon={<MapPin className="w-4 h-4" />}
            label={t('flights.form.from') || 'From'}
            placeholder="Bishkek (FRU)"
            value={formData.from}
            onChange={set('from')}
            listId="from-suggestions"
            list={POPULAR_FROM}
          />

          {/* Swap button — sits between the two fields */}
          <button type="button" onClick={swap}
            className="md:col-span-1 flex items-center justify-center self-center mx-auto md:mx-0 -my-1 md:my-0 w-9 h-9 rounded-full bg-white border-2 border-[#0071c2] text-[#0071c2] hover:bg-[#f0f5ff] active:scale-95 transition shadow-sm"
            aria-label="Swap from and to"
            title="Swap From ↔ To">
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* To */}
          <FieldInput
            className="md:col-span-3"
            icon={<MapPin className="w-4 h-4" />}
            label={t('flights.form.to') || 'To'}
            placeholder="Dubai (DXB)"
            value={formData.to}
            onChange={set('to')}
            listId="to-suggestions"
            list={POPULAR_TO}
          />

          {/* Departure date */}
          <FieldInput
            className="md:col-span-2"
            icon={<Calendar className="w-4 h-4" />}
            label={t('flights.form.date') || 'Departure'}
            type="date"
            min={today}
            value={formData.date}
            onChange={set('date')}
            required
          />

          {/* Return date (only for round-trip) */}
          {tripType === 'roundtrip' ? (
            <FieldInput
              className="md:col-span-2"
              icon={<Calendar className="w-4 h-4" />}
              label="Return"
              type="date"
              min={formData.date || today}
              value={formData.returnDate || ''}
              onChange={set('returnDate')}
            />
          ) : (
            <div className="md:col-span-2 hidden md:block" />
          )}

          {/* Search button */}
          <button type="submit" disabled={loading || !formData.from || !formData.to}
            className="md:col-span-1 flex items-center justify-center gap-2 bg-[#febb02] hover:bg-[#ffb700] disabled:opacity-60 disabled:cursor-not-allowed text-[#1a1a1a] font-black text-[14px] rounded-xl py-3 px-4 transition active:scale-95 shadow-md">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="md:hidden">{loading ? 'Searching…' : 'Search'}</span>
          </button>
        </div>

        {/* Quick from/to chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 px-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af]">Popular routes:</span>
          {[
            { from: 'Bishkek (FRU)', to: 'Dubai (DXB)',    label: 'FRU → DXB' },
            { from: 'Bishkek (FRU)', to: 'Istanbul (IST)', label: 'FRU → IST' },
            { from: 'Almaty (ALA)',  to: 'Bangkok (BKK)',  label: 'ALA → BKK' },
            { from: 'Tashkent (TAS)',to: 'Istanbul (IST)', label: 'TAS → IST' },
            { from: 'Bishkek (FRU)', to: 'London (LHR)',   label: 'FRU → LHR' },
          ].map(r => {
            const active = formData.from === r.from && formData.to === r.to;
            return (
              <button key={r.label} type="button"
                onClick={() => onChange({ ...formData, from: r.from, to: r.to })}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition ${
                  active ? 'bg-[#003580] text-white' : 'bg-[#f0f5ff] text-[#0071c2] hover:bg-[#dceaff]'
                }`}>
                {r.label}
              </button>
            );
          })}
          {(formData.from || formData.to || formData.date) && (
            <button type="button" onClick={reset}
              className="ml-auto flex items-center gap-1 text-[11px] font-black text-[#9ca3af] hover:text-red-500 transition">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </form>

      {/* Hidden datalists for autocomplete */}
      <datalist id="from-suggestions">
        {POPULAR_FROM.map(c => <option key={c} value={c} />)}
      </datalist>
      <datalist id="to-suggestions">
        {POPULAR_TO.map(c => <option key={c} value={c} />)}
      </datalist>
    </div>
  );
}

/* ── Light Booking-style input ── */
function FieldInput({ icon, label, placeholder, type = 'text', value, onChange, className = '', list, listId, min, required }) {
  return (
    <label className={`block bg-white border-2 border-[#e7e7e7] hover:border-[#0071c2] focus-within:border-[#0071c2] focus-within:ring-4 focus-within:ring-[#0071c2]/15 rounded-xl px-3 py-2.5 transition ${className}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#9ca3af] mb-0.5">
        <span className="text-[#0071c2]">{icon}</span>{label}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        list={listId}
        min={min}
        required={required}
        className="w-full bg-transparent outline-none text-[14px] font-bold text-[#1a1a1a] placeholder:text-[#b0b0b0]"
      />
    </label>
  );
}
