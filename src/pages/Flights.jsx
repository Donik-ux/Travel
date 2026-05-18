import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane, Filter, TrendingDown, ExternalLink, Search, Star, Globe, Clock,
  ArrowRight, Sparkles, Shield, BadgePercent, Headphones, ThumbsUp, MapPin,
  Sunrise, Sun, Moon, Sunset, X, Wallet,
} from 'lucide-react';
import FlightSearch from '../features/flights/FlightSearch';
import FlightCard from '../features/flights/FlightCard';
import { useFlights } from '../hooks/useFlights';
import useStore from '../store/useStore';
import { useTranslation } from '../store/useLangStore';
import useAdminStore from '../store/useAdminStore';
import useSEO from '../hooks/useSEO';
import { heroFor } from '../utils/destinationImages';
import { toast } from '../components/Toast';

/* ── External Booking Sites ── */
const getBookingSites = (t) => [
  { name: 'Aviasales',     logo: '✈️', url: 'https://aviasales.ru',   desc: t('flights.sites.aviasales.desc'), badge: t('flights.sites.aviasales.badge'),     rating: 4.8 },
  { name: 'Skyscanner',    logo: '🔍', url: 'https://skyscanner.com',  desc: t('flights.sites.skyscanner.desc'), badge: t('flights.sites.skyscanner.badge'),   rating: 4.7 },
  { name: 'Google Flights',logo: '🌐', url: 'https://flights.google.com', desc: t('flights.sites.google.desc'),  badge: t('flights.sites.google.badge'),         rating: 4.9 },
  { name: 'Kayak',         logo: '🛶', url: 'https://kayak.com',       desc: t('flights.sites.kayak.desc'),     badge: t('flights.sites.kayak.badge'),          rating: 4.6 },
  { name: 'Trip.com',      logo: '🗺️', url: 'https://trip.com',        desc: t('flights.sites.trip.desc'),      badge: t('flights.sites.trip.badge'),           rating: 4.5 },
  { name: 'Momondo',       logo: '💡', url: 'https://momondo.com',     desc: t('flights.sites.momondo.desc'),   badge: t('flights.sites.momondo.badge'),        rating: 4.5 },
];

const POPULAR_ROUTES = [
  { from: 'Bishkek (FRU)', to: 'Dubai (DXB)',     city: 'Dubai',     country: 'UAE',         from$: 240 },
  { from: 'Bishkek (FRU)', to: 'Istanbul (IST)',  city: 'Istanbul',  country: 'Turkey',      from$: 280 },
  { from: 'Bishkek (FRU)', to: 'London (LHR)',    city: 'London',    country: 'UK',          from$: 520 },
  { from: 'Almaty (ALA)',  to: 'Bangkok (BKK)',   city: 'Bangkok',   country: 'Thailand',    from$: 360 },
  { from: 'Tashkent (TAS)',to: 'Istanbul (IST)',  city: 'Istanbul',  country: 'Turkey',      from$: 290 },
  { from: 'Bishkek (FRU)', to: 'Tokyo (HND)',     city: 'Tokyo',     country: 'Japan',       from$: 720 },
  { from: 'Bishkek (FRU)', to: 'Paris (CDG)',     city: 'Paris',     country: 'France',      from$: 540 },
  { from: 'Almaty (ALA)',  to: 'New York (JFK)',  city: 'New York',  country: 'USA',         from$: 720 },
];

const TIME_SLOTS = [
  { id: 'early',   icon: Sunrise, label: 'Early',     range: 'Before 06:00', start: 0,  end: 6  },
  { id: 'morning', icon: Sun,     label: 'Morning',   range: '06:00–12:00',  start: 6,  end: 12 },
  { id: 'afternoon', icon: Sun,   label: 'Afternoon', range: '12:00–18:00',  start: 12, end: 18 },
  { id: 'evening', icon: Sunset,  label: 'Evening',   range: '18:00–24:00',  start: 18, end: 24 },
];

// Parse "HH:MM AM/PM" → hour (24h)
const parseHour = (str) => {
  const m = String(str || '').match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!m) return 12;
  let h = Number(m[1]);
  const ampm = (m[3] || '').toUpperCase();
  if (ampm === 'AM' && h === 12) h = 0;
  else if (ampm === 'PM' && h !== 12) h += 12;
  return h;
};

export default function Flights() {
  const { t }      = useTranslation();
  const navigate   = useNavigate();
  useSEO({
    title: 'Search Cheap Flights · Compare 6 Airlines',
    description: 'Find cheap flights from Bishkek, Almaty, Tashkent to Dubai, Istanbul, London, Tokyo and 100+ destinations. Smart filters, real-time prices.',
    keywords: ['cheap flights', 'flight search', 'Bishkek flights', 'Dubai flights', 'compare airfare', 'MAFTRAVEL flights'],
  });

  const [formData, setFormData] = useState({ from: '', to: '', date: '', returnDate: '' });
  const [filter,   setFilter]   = useState('all');                         // all | nonstop | business
  const [airlineFilter, setAirlineFilter] = useState(null);                // null = all
  const [timeFilter, setTimeFilter]       = useState(null);                // null = all
  const [maxPrice,   setMaxPrice]         = useState(null);                // null = no cap

  const { flights }                   = useStore();
  const adminFlights                  = useAdminStore(s => s.adminFlights);
  const { getFlights, loading, error } = useFlights();

  const handleSearch = async (eOrPayload) => {
    if (eOrPayload?.preventDefault) eOrPayload.preventDefault();
    const payload = eOrPayload?.formData || formData;
    try {
      await getFlights(payload);
      setAirlineFilter(null);
      setTimeFilter(null);
      setMaxPrice(null);
      toast.success('Flights found', `${payload.from} → ${payload.to}`);
    } catch {
      toast.error('Search failed', 'Please try again in a moment.');
    }
  };

  const BOOKING_SITES = getBookingSites(t);
  const adminAvailable = adminFlights.filter(f => f.available);

  /* ── Derived: filter state ── */
  const priceRange = useMemo(() => {
    if (!flights.length) return [0, 1000];
    const prices = flights.map(f => f.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [flights]);

  const availableAirlines = useMemo(() => {
    const set = new Set(flights.map(f => f.airline));
    return Array.from(set);
  }, [flights]);

  const filtered = useMemo(() => {
    return flights.filter(f => {
      if (filter === 'nonstop'  && f.stops !== 0)       return false;
      if (filter === 'business' && f.cabin !== 'Business') return false;
      if (airlineFilter && f.airline !== airlineFilter) return false;
      if (maxPrice != null && f.price > maxPrice)        return false;
      if (timeFilter) {
        const slot = TIME_SLOTS.find(s => s.id === timeFilter);
        if (slot) {
          const h = parseHour(f.departure);
          if (h < slot.start || h >= slot.end)           return false;
        }
      }
      return true;
    });
  }, [flights, filter, airlineFilter, timeFilter, maxPrice]);

  const cheapest  = flights.length ? Math.min(...flights.map(f => f.price)) : null;
  const fastest   = flights.length ? flights.reduce((a, b) => durMins(a.duration) < durMins(b.duration) ? a : b) : null;

  const clearFilters = () => { setFilter('all'); setAirlineFilter(null); setTimeFilter(null); setMaxPrice(null); };
  const hasFilters = filter !== 'all' || airlineFilter || timeFilter || maxPrice != null;

  return (
    <div className="bg-[#f5f5f5] min-h-screen -mt-[60px]">

      {/* ── HERO + SEARCH ── */}
      <section className="relative bg-[#003580] text-white pt-[100px] pb-32 md:pb-36 overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none"
             style={{ backgroundImage:'radial-gradient(circle at 15% 30%, #0071c2 0%, transparent 45%), radial-gradient(circle at 85% 70%, #febb02 0%, transparent 35%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#febb02] text-[#1a1a1a] text-[11px] font-black uppercase tracking-widest mb-4">
              <Plane className="w-3.5 h-3.5" /> {t('flights.badge') || 'Flight Search'}
            </div>
            <h1 className="text-[34px] md:text-[56px] font-black tracking-tight leading-[1.05] mb-3">
              Compare flights<br className="hidden md:block" /> across the globe.
            </h1>
            <p className="text-[15px] md:text-[17px] text-white/85 font-medium max-w-xl">
              Real-time prices from 12+ airlines · smart filters · book on the platform with the best fare.
            </p>
          </div>
        </div>

        {/* Floating search card */}
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 -mb-24">
          <FlightSearch formData={formData} onChange={setFormData} onSubmit={handleSearch} loading={loading} />
          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-[13px] font-semibold text-red-700 flex items-center gap-2">
              <X className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
      </section>

      <div className="h-24" />

      {/* ── Trust strip ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: BadgePercent, t: 'Best Price Guarantee', s: '12+ airlines compared' },
            { icon: Shield,       t: 'Secure Bookings',      s: 'SSL · GDPR · PCI' },
            { icon: Headphones,   t: '24 / 7 Support',       s: 'Real humans, real fast' },
            { icon: ThumbsUp,     t: '4.9 / 5 from travelers',s: '14,000+ reviews' },
          ].map((f, i) => (
            <div key={i} className="bg-white border border-[#e7e7e7] rounded-xl p-4 flex items-center gap-3 hover:border-[#0071c2] hover:shadow-md transition">
              <div className="w-10 h-10 rounded-lg bg-[#f0f5ff] text-[#0071c2] flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-black text-[#1a1a1a] truncate">{f.t}</div>
                <div className="text-[11px] font-semibold text-[#9ca3af] truncate">{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="mt-2 space-y-3">
            <div className="h-6 w-48 bg-white border border-[#e7e7e7] rounded-md animate-pulse mb-3" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#e7e7e7] rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#eef2f6]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-[#eef2f6] rounded" />
                    <div className="h-3 w-1/2 bg-[#eef2f6] rounded" />
                  </div>
                  <div className="w-24 h-10 bg-[#eef2f6] rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Search results with smart filters ── */}
        {!loading && flights.length > 0 && (
          <div className="grid lg:grid-cols-4 gap-6 mt-4">
            {/* Filters sidebar */}
            <aside className="lg:col-span-1 space-y-3 lg:sticky lg:top-[80px] self-start max-h-[80vh] overflow-auto pr-1">
              <div className="bg-white border border-[#e7e7e7] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-black uppercase tracking-widest text-[#9ca3af]">Filters</h3>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-[11px] font-black text-red-500 hover:underline">Clear all</button>
                  )}
                </div>

                {/* Stops */}
                <FilterGroup title="Stops">
                  {[
                    { v: 'all',     l: 'Any'      },
                    { v: 'nonstop', l: 'Non-stop' },
                    { v: 'business',l: 'Business' },
                  ].map(o => (
                    <FilterChip key={o.v} active={filter === o.v} onClick={() => setFilter(o.v)}>{o.l}</FilterChip>
                  ))}
                </FilterGroup>

                {/* Price */}
                <FilterGroup title={`Max price · $${maxPrice ?? priceRange[1]}`}>
                  <input type="range"
                    min={priceRange[0]} max={priceRange[1]} step={10}
                    value={maxPrice ?? priceRange[1]}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#0071c2] cursor-pointer" />
                  <div className="flex justify-between text-[10px] font-bold text-[#9ca3af] mt-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </FilterGroup>

                {/* Departure time */}
                <FilterGroup title="Departure time">
                  <div className="grid grid-cols-2 gap-1.5">
                    {TIME_SLOTS.map(s => (
                      <button key={s.id} onClick={() => setTimeFilter(timeFilter === s.id ? null : s.id)}
                        className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg text-[11px] font-black transition border ${
                          timeFilter === s.id ? 'bg-[#003580] text-white border-[#003580]' : 'bg-white border-[#e7e7e7] text-[#1a1a1a] hover:border-[#0071c2]'
                        }`}>
                        <s.icon className="w-3.5 h-3.5" />
                        {s.label}
                        <span className={`text-[9px] font-bold ${timeFilter === s.id ? 'text-white/70' : 'text-[#9ca3af]'}`}>{s.range}</span>
                      </button>
                    ))}
                  </div>
                </FilterGroup>

                {/* Airlines */}
                <FilterGroup title="Airlines">
                  <div className="space-y-1">
                    {availableAirlines.map(a => {
                      const minP = Math.min(...flights.filter(f => f.airline === a).map(f => f.price));
                      return (
                        <button key={a} onClick={() => setAirlineFilter(airlineFilter === a ? null : a)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-bold transition ${
                            airlineFilter === a ? 'bg-[#003580] text-white' : 'hover:bg-[#f0f5ff] text-[#1a1a1a]'
                          }`}>
                          <span className="truncate">{a}</span>
                          <span className={airlineFilter === a ? 'text-white/80' : 'text-[#9ca3af]'}>${minP}</span>
                        </button>
                      );
                    })}
                  </div>
                </FilterGroup>
              </div>

              {/* Quick insights */}
              {cheapest && fastest && (
                <div className="bg-white border border-[#e7e7e7] rounded-2xl p-4 space-y-2.5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] mb-2">Highlights</h3>
                  <Insight icon={<Wallet className="w-3.5 h-3.5" />} label="Cheapest" val={`$${cheapest}`} sub={flights.find(f => f.price === cheapest)?.airline} />
                  <Insight icon={<Clock className="w-3.5 h-3.5" />}  label="Fastest"  val={fastest.duration} sub={fastest.airline} />
                </div>
              )}
            </aside>

            {/* Results list */}
            <div className="lg:col-span-3">
              <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-[20px] font-black text-[#1a1a1a]">{formData.from} → {formData.to}</h2>
                  <div className="text-[12px] text-[#595959] font-medium">
                    <strong>{filtered.length}</strong> of {flights.length} flights match your filters
                    {cheapest && <> · from <strong className="text-[#003580]">${cheapest}</strong></>}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {filtered.length > 0 ? (
                  filtered.map((flight, idx) => (
                    <motion.div key={flight.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: idx * 0.04 }}>
                      <FlightCard flight={flight} index={idx} />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-[#e7e7e7]">
                    <Filter className="w-10 h-10 mx-auto mb-3 text-[#c9d1d9]" />
                    <p className="text-[#1a1a1a] font-bold mb-1">No flights match your filters</p>
                    <p className="text-[#9ca3af] text-sm mb-4">Try clearing some filters to see more results.</p>
                    <button onClick={clearFilters}
                      className="px-4 py-2 rounded-lg bg-[#0071c2] hover:bg-[#005fa3] text-white text-[13px] font-black transition">
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Inspiration: Popular routes (only when no search yet) ── */}
        {!loading && flights.length === 0 && (
          <>
            <section className="mt-8">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <div className="inline-flex items-center gap-2 text-[#0071c2] text-[11px] font-black uppercase tracking-widest mb-1">
                    <TrendingDown className="w-3.5 h-3.5" /> Cheapest right now
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] tracking-tight">Popular routes from your region</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {POPULAR_ROUTES.map((r, i) => (
                  <button key={i}
                    onClick={() => {
                      setFormData({ from: r.from, to: r.to, date: '', returnDate: '' });
                      handleSearch({ formData: { from: r.from, to: r.to, date: '' } });
                      window.scrollTo({ top: 80, behavior: 'smooth' });
                    }}
                    className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-cover bg-center transition hover:-translate-y-1 hover:shadow-xl border border-[#e7e7e7]"
                    style={{ backgroundImage: `url(${heroFor(r.city)})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end text-left text-white">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#febb02] mb-1">{r.country}</div>
                      <div className="text-[18px] md:text-[20px] font-black leading-tight">{r.city}</div>
                      <div className="text-[10px] text-white/75 font-bold mb-2">{r.from.split(' (')[0]} → {r.to.split(' (')[0]}</div>
                      <div className="inline-flex items-center gap-1 bg-white/95 text-[#003580] font-black px-2 py-0.5 rounded-md w-fit text-[11px]">
                        <Plane className="w-3 h-3" /> from ${r.from$}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* AI Trip CTA */}
            <section className="mt-8">
              <div className="relative overflow-hidden bg-gradient-to-r from-[#003580] via-[#0058b1] to-[#0071c2] rounded-3xl p-6 md:p-8 text-white">
                <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#febb02]/30 blur-3xl pointer-events-none" />
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#febb02] text-[#1a1a1a] text-[11px] font-black uppercase tracking-widest mb-3">
                      <Sparkles className="w-3.5 h-3.5" /> Don't know where to go?
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-2">
                      Let AI plan your whole trip
                    </h2>
                    <p className="text-[14px] text-white/85 font-medium">
                      Tell us your budget — Grok picks a destination, builds a day-by-day plan, finds halal food and emergency numbers. 100% free.
                    </p>
                  </div>
                  <button onClick={() => navigate('/hot-tours')}
                    className="px-5 py-3 rounded-xl bg-[#febb02] hover:bg-[#ffb700] text-[#1a1a1a] font-black text-[14px] flex items-center gap-2 active:scale-95 transition shrink-0">
                    <Sparkles className="w-4 h-4" /> Open AI Trip Studio
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── Featured Routes (admin-curated) ── */}
        {!loading && flights.length === 0 && adminAvailable.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-4 h-4 text-[#0071c2]" />
              <h2 className="text-[18px] font-black text-[#1a1a1a]">{t('flights.available') || 'Featured routes'}</h2>
              <span className="ml-1 px-2 py-0.5 bg-blue-100 text-[#0071c2] text-[11px] font-bold rounded-full">{adminAvailable.length} {t('flights.routes') || 'routes'}</span>
            </div>
            <div className="space-y-3">
              {adminAvailable.map((f, idx) => (
                <FlightCard key={f.id} index={idx} flight={{
                  id: f.id, airline: f.airline, airlineCode: f.code, cabin: f.cabin,
                  departure: f.dep, arrival: f.arr, from: f.from, to: f.to,
                  duration: f.dur, stops: f.stops, price: f.price, seats: f.seats,
                }} />
              ))}
            </div>
          </section>
        )}

        {/* ── External Booking Sites ── */}
        <section className="mt-10">
          <div className="flex items-end gap-2 mb-3 flex-wrap">
            <Globe className="w-5 h-5 text-[#0071c2]" />
            <h2 className="text-[20px] font-black text-[#1a1a1a]">{t('flights.bookingSites') || 'Compare on top flight platforms'}</h2>
          </div>
          <p className="text-[#595959] text-[13px] font-medium mb-5">{t('flights.bookingSub') || 'Open the platform with the best fare for your route.'}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOOKING_SITES.map((site) => (
              <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"
                className="bg-white border border-[#e7e7e7] hover:border-[#0071c2] rounded-2xl p-5 flex flex-col gap-3 hover:shadow-xl transition group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{site.logo}</div>
                    <div>
                      <p className="text-[15px] font-black text-[#1a1a1a]">{site.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#febb02] fill-[#febb02]" />
                        <span className="text-[11px] font-bold text-[#595959]">{site.rating}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#febb02] text-[#1a1a1a] px-2 py-1 rounded">{site.badge}</span>
                </div>
                <p className="text-[13px] text-[#595959] leading-relaxed flex-1">{site.desc}</p>
                <div className="flex items-center gap-1.5 text-[#0071c2] text-[12px] font-black group-hover:gap-2.5 transition-all">
                  {t('flights.searchOn') || 'Search on'} {site.name} <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-5 bg-[#fff7e6] border border-[#ffd76e] rounded-xl p-4 flex items-start gap-3">
            <div className="text-xl shrink-0">💡</div>
            <div>
              <p className="text-[13px] font-black text-[#a45e00] mb-1">{t('flights.proTip') || 'Pro tip: compare before you buy'}</p>
              <p className="text-[12px] text-[#7c4a00] font-semibold">{t('flights.proTipSub') || 'Prices vary 10-30% between sites. Open 2-3 platforms before booking.'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Subcomponents ── */
const FilterGroup = ({ title, children }) => (
  <div className="mb-4 last:mb-0">
    <p className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] mb-2">{title}</p>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);

const FilterChip = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-[12px] font-black border transition ${
      active ? 'bg-[#003580] text-white border-[#003580]' : 'bg-white border-[#e7e7e7] text-[#1a1a1a] hover:border-[#0071c2]'
    }`}>
    {children}
  </button>
);

const Insight = ({ icon, label, val, sub }) => (
  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f8f9fa] border border-[#eef2f6]">
    <div className="w-8 h-8 rounded-lg bg-[#f0f5ff] flex items-center justify-center text-[#0071c2] shrink-0">{icon}</div>
    <div className="min-w-0">
      <div className="text-[9.5px] font-black uppercase tracking-widest text-[#9ca3af]">{label}</div>
      <div className="text-[13px] font-black text-[#003580] leading-tight">{val}</div>
      {sub && <div className="text-[10px] text-[#595959] font-semibold truncate">{sub}</div>}
    </div>
  </div>
);

/* Helper for duration sort */
function durMins(s) {
  const m = String(s || '').match(/(\d+)h\s*(\d+)?m?/);
  if (!m) return 999;
  return Number(m[1]) * 60 + Number(m[2] || 0);
}
