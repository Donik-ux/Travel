import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane, Hotel, Package, Car, Search, MapPin, Calendar, Users, ArrowRight,
  Flame, Sparkles, Star, Shield, Headphones, BadgePercent, Globe,
  TrendingUp, Heart, Mountain, Waves, Building2, Compass, Clock, Wand2, Wallet,
  ChevronRight, Award, ThumbsUp, Check, Mail,
} from 'lucide-react';
import useAdminStore from '../store/useAdminStore';
import useWishlistStore from '../store/useWishlistStore';
import useSEO from '../hooks/useSEO';
import { useDateDaysSync } from '../hooks/useDateDaysSync';
import { handleImgError } from '../utils/imageFallback';
import { heroFor } from '../utils/destinationImages';
import { toast } from '../components/Toast';
import SmartImage from '../components/SmartImage';
import BudgetAdvisory from '../components/BudgetAdvisory';

/* ── Static showcases ─────────────────────────────────────────────── */
const TRENDING = [
  { city: 'Dubai',     country: 'UAE',         from: 280, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80' },
  { city: 'Bali',      country: 'Indonesia',   from: 540, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80' },
  { city: 'Istanbul',  country: 'Turkey',      from: 220, img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80' },
  { city: 'Tokyo',     country: 'Japan',       from: 680, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80' },
  { city: 'Maldives',  country: 'Maldives',    from: 920, img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80' },
  { city: 'Paris',     country: 'France',      from: 410, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80' },
  { city: 'Bangkok',   country: 'Thailand',    from: 380, img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80' },
  { city: 'Barcelona', country: 'Spain',       from: 360, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80' },
];

const THEMES = [
  { id: 'beach',    label: 'Beach',     icon: Waves,    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80' },
  { id: 'city',     label: 'City',      icon: Building2,img: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=700&q=80' },
  { id: 'mountain', label: 'Mountains', icon: Mountain, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80' },
  { id: 'culture',  label: 'Cultural',  icon: Globe,    img: 'https://images.unsplash.com/photo-1539020140153-e479b8c7d486?auto=format&fit=crop&w=700&q=80' },
  { id: 'family',   label: 'Family',    icon: Heart,    img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=700&q=80' },
  { id: 'luxury',   label: 'Luxury',    icon: Award,    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=700&q=80' },
];

const Home = () => {
  const navigate = useNavigate();
  useSEO({
    title: 'Cheap Flights, Tours & AI Trip Plans | MAFTRAVEL',
    description: 'Search flights, book tour packages, grab hot deals and let our AI build a full trip inside your budget. MAFTRAVEL — your one-stop travel platform.',
    url: 'https://maftravel.com',
    keywords: ['cheap flights', 'tour packages', 'hot tours', 'AI trip planner', 'budget travel', 'booking', 'kiwi'],
  });

  const packages = useAdminStore(s => s.packages);
  const toggleWishlist = useWishlistStore(s => s.toggleWishlist);
  const isInWishlist   = useWishlistStore(s => s.isInWishlist);

  const featured = useMemo(() => packages.filter(p => p.featured).slice(0, 4), [packages]);
  const allPackages = useMemo(() => packages.slice(0, 8), [packages]);

  // search widget state
  const [tab, setTab]         = useState('tours');
  const [from, setFrom]       = useState('Bishkek (FRU)');
  const [to, setTo]           = useState('');
  const [dest, setDest]       = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [travelers, setTravelers] = useState(2);
  // dedicated AI-tab state — keeps it isolated from the flight/tour fields
  const [aiBalance, setAiBalance] = useState(2000);
  const [aiDays,    setAiDays]    = useState(7);
  const [aiVibe,    setAiVibe]    = useState('any');
  const [aiDest,    setAiDest]    = useState('');
  const [aiFrom,    setAiFrom]    = useState('Bishkek');
  const [aiStart,   setAiStart]   = useState('');
  const [aiReturn,  setAiReturn]  = useState('');

  // Two-way sync for the AI tab (departure ↔ return ↔ days)
  const aiSync = useDateDaysSync({
    departure: aiStart, returnDate: aiReturn, days: aiDays,
    setDeparture: setAiStart, setReturn: setAiReturn, setDays: setAiDays,
  });

  // Two-way sync for the Tours tab (uses `checkin` as departure, `checkout` as return)
  const [toursDays, setToursDays] = useState(7);
  const toursSync = useDateDaysSync({
    departure: checkin, returnDate: checkout, days: toursDays,
    setDeparture: setCheckin, setReturn: setCheckout, setDays: setToursDays,
  });

  const submit = (e) => {
    e?.preventDefault?.();
    if (tab === 'flights') navigate('/flights');
    else if (tab === 'tours' || tab === 'packages') navigate('/hot-tours');
    else if (tab === 'stays') navigate('/exotic-tours');
    else if (tab === 'ai') {
      // Clamp values so the API never gets garbage
      const rawBalance = Number(aiBalance);
      const rawDays    = Number(aiDays);
      const balance    = Number.isFinite(rawBalance) && rawBalance >= 100
        ? Math.min(50000, rawBalance)
        : 2000;
      const d          = Number.isFinite(rawDays) && rawDays > 0
        ? Math.min(21, Math.max(1, Math.round(rawDays)))
        : 7;
      const trimmedDest = (aiDest || '').trim().replace(/\s+/g, ' ');
      const trimmedFrom = (aiFrom || '').trim() || 'Bishkek';

      // If user provided a destination → go straight to the full Berlin-style trip plan,
      // and pass params via both router state AND URL query so refresh / share still works.
      if (trimmedDest.length > 1) {
        const item = {
          id: `direct-${Date.now()}`,
          name: `${d}-day trip to ${trimmedDest}`,
          destination: trimmedDest,
          duration: d,
          price: balance,
          category: 'standard',
          image: heroFor(trimmedDest),
          description: `A ${d}-day AI-built trip plan for ${trimmedDest} on a $${balance} budget.`,
        };
        const qs = new URLSearchParams({
          to:      trimmedDest,
          days:    String(d),
          balance: String(balance),
          from:    trimmedFrom,
          ...(aiStart  ? { start:  aiStart }  : {}),
          ...(aiReturn ? { return: aiReturn } : {}),
        });
        navigate(`/trip-plan?${qs.toString()}`, {
          state: {
            item, type: 'package',
            fromCity: trimmedFrom,
            startDate: aiStart || '',
            returnDate: aiReturn || '',
            purpose: 'Tourism and cultural exploration',
          },
        });
        return;
      }

      // No destination → 4-package picker on /hot-tours
      navigate(`/hot-tours?balance=${balance}&days=${d}&vibe=${encodeURIComponent(aiVibe || 'any')}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] -mt-[64px]">

      {/* ─── HERO + SEARCH (Booking.com style) ───────────────────── */}
      <section className="relative bg-[#003580] pt-[100px] pb-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none"
             style={{ backgroundImage:'radial-gradient(circle at 15% 25%, #0071c2 0%, transparent 45%), radial-gradient(circle at 85% 75%, #febb02 0%, transparent 30%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
             style={{ backgroundImage:'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1800&q=80")', backgroundSize:'cover', backgroundPosition:'center' }} />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-white max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#febb02] text-[#1a1a1a] text-[11px] font-black uppercase tracking-widest mb-5">
              <Sparkles className="w-3.5 h-3.5" /> AI-powered · 10k+ travelers · 4.9 ★
            </div>
            <h1 className="text-[34px] md:text-[58px] font-black tracking-tight leading-[1.05] mb-3">
              Find your next stay,<br className="hidden md:block" /> flight or hot tour.
            </h1>
            <p className="text-[15px] md:text-[18px] text-white/85 font-medium max-w-xl mb-8">
              Search and compare flights, packages and AI-built trip plans — from Bishkek to Bali in two clicks.
            </p>
          </div>
        </div>

        {/* Floating Search Card */}
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 -mb-24 md:-mb-28">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#febb02]/50 ring-4 ring-[#febb02]/20">
            <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
              <Tab active={tab === 'tours'}    onClick={() => setTab('tours')}    icon={<Package className="w-4 h-4" />} label="Tours" />
              <Tab active={tab === 'flights'}  onClick={() => setTab('flights')}  icon={<Plane className="w-4 h-4" />}   label="Flights" />
              <Tab active={tab === 'stays'}    onClick={() => setTab('stays')}    icon={<Hotel className="w-4 h-4" />}   label="Stays" />
              <Tab active={tab === 'ai'}       onClick={() => setTab('ai')}       icon={<Sparkles className="w-4 h-4" />} label="AI Trip" highlight />
              <Tab active={tab === 'cars'}     onClick={() => setTab('cars')}     icon={<Car className="w-4 h-4" />}     label="Cars" />
            </div>

            <form onSubmit={submit} className="p-3 md:p-4">
              {tab === 'flights' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-1">
                  <SearchInput className="md:col-span-3" icon={<Plane className="w-4 h-4" />} label="From" placeholder="Bishkek (FRU)" value={from} onChange={setFrom} />
                  <SearchInput className="md:col-span-3" icon={<Plane className="w-4 h-4 rotate-90" />} label="To" placeholder="Dubai (DXB)" value={to} onChange={setTo} />
                  <SearchInput className="md:col-span-3" icon={<Calendar className="w-4 h-4" />} label="Departure" type="date" value={checkin} onChange={setCheckin} />
                  <SearchInput className="md:col-span-2" icon={<Users className="w-4 h-4" />} label="Travelers" type="number" value={travelers} onChange={setTravelers} />
                  <SearchButton className="md:col-span-1" />
                </div>
              )}

              {tab === 'tours' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-1">
                  <SearchInput
                    className="md:col-span-4"
                    icon={<MapPin className="w-4 h-4" />}
                    label="Where to?"
                    placeholder="Dubai, Bali, Maldives…"
                    value={dest}
                    onChange={setDest}
                  />
                  <SearchInput
                    className="md:col-span-3"
                    icon={<Calendar className="w-4 h-4" />}
                    label="Depart"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={checkin}
                    onChange={toursSync.onChangeDeparture}
                  />
                  <SearchInput
                    className="md:col-span-3"
                    icon={<Calendar className="w-4 h-4" />}
                    label="Return"
                    type="date"
                    min={checkin || new Date().toISOString().split('T')[0]}
                    value={toursSync.returnDate}
                    onChange={toursSync.onChangeReturn}
                  />
                  <SearchInput
                    className="md:col-span-1"
                    icon={<Users className="w-4 h-4" />}
                    label="Pax"
                    type="number"
                    value={travelers}
                    onChange={setTravelers}
                  />
                  <SearchButton className="md:col-span-1" />
                </div>
              )}

              {tab === 'stays' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-1">
                  <SearchInput className="md:col-span-4" icon={<MapPin className="w-4 h-4" />} label="Destination" placeholder="Dubai" value={dest} onChange={setDest} />
                  <SearchInput className="md:col-span-3" icon={<Calendar className="w-4 h-4" />} label="Check-in" type="date" value={checkin} onChange={setCheckin} />
                  <SearchInput className="md:col-span-3" icon={<Calendar className="w-4 h-4" />} label="Check-out" type="date" value={checkout} onChange={setCheckout} />
                  <SearchInput className="md:col-span-1" icon={<Users className="w-4 h-4" />} label="Guests" type="number" value={travelers} onChange={setTravelers} />
                  <SearchButton className="md:col-span-1" />
                </div>
              )}

              {tab === 'ai' && (
                <div className="space-y-2">
                  {/* Row 1: destination + from + start date */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-1">
                    <SearchInput
                      className="md:col-span-5"
                      icon={<MapPin className="w-4 h-4" />}
                      label="Where to?"
                      placeholder="Berlin, Dubai, Tokyo… (or leave empty)"
                      value={aiDest}
                      onChange={setAiDest}
                    />
                    <SearchInput
                      className="md:col-span-3"
                      icon={<Plane className="w-4 h-4" />}
                      label="From"
                      placeholder="Bishkek"
                      value={aiFrom}
                      onChange={setAiFrom}
                    />
                    <SearchInput
                      className="md:col-span-2"
                      icon={<Calendar className="w-4 h-4" />}
                      label="Depart"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={aiStart}
                      onChange={aiSync.onChangeDeparture}
                    />
                    <SearchInput
                      className="md:col-span-2"
                      icon={<Calendar className="w-4 h-4" />}
                      label="Return"
                      type="date"
                      min={aiStart || new Date().toISOString().split('T')[0]}
                      value={aiSync.returnDate}
                      onChange={aiSync.onChangeReturn}
                    />
                  </div>

                  {/* Row 2: balance + days + vibe + button */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-1">
                    <SearchInput
                      className="md:col-span-4"
                      icon={<Wallet className="w-4 h-4" />}
                      label="Your balance (USD)"
                      placeholder="2000"
                      type="number"
                      value={aiBalance}
                      onChange={setAiBalance}
                    />
                    <SearchInput
                      className="md:col-span-2"
                      icon={<Calendar className="w-4 h-4" />}
                      label="Days"
                      type="number"
                      placeholder="7"
                      value={aiDays}
                      onChange={aiSync.onChangeDays}
                    />
                    {!aiDest && (
                      <label className="md:col-span-5 block border-2 border-[#e7e7e7] hover:border-[#0071c2] focus-within:border-[#0071c2] rounded-xl px-3 py-2.5 transition">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#9ca3af] mb-0.5">
                          <Compass className="w-4 h-4 text-[#0071c2]" />Vibe (if AI picks for you)
                        </div>
                        <select value={aiVibe} onChange={e => setAiVibe(e.target.value)}
                          className="w-full bg-transparent outline-none text-[14px] font-bold text-[#1a1a1a] cursor-pointer">
                          <option value="any">Surprise me</option>
                          <option value="warm">Warm / Sunshine</option>
                          <option value="beach">Beach &amp; Ocean</option>
                          <option value="city">City Break</option>
                          <option value="cultural">Cultural &amp; Historic</option>
                          <option value="nature">Nature &amp; Outdoors</option>
                          <option value="luxury">Luxury &amp; Spa</option>
                        </select>
                      </label>
                    )}
                    {aiDest && (
                      <div className="md:col-span-5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#f0fdf4] border-2 border-[#bbf7d0]">
                        <Sparkles className="w-4 h-4 text-[#008009] shrink-0" />
                        <span className="text-[12px] font-bold text-[#155724] leading-snug">
                          Direct mode — building a full {aiDays}-day plan for <strong>{aiDest.split(',')[0]}</strong>
                        </span>
                      </div>
                    )}
                    <SearchButton className="md:col-span-1" icon={<Wand2 className="w-4 h-4" />} />
                  </div>

                  {/* Quick day chips for AI */}
                  <div className="flex items-center flex-wrap gap-1.5 pt-0.5 px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] self-center">Quick days:</span>
                    {[3, 5, 7, 10, 14].map(n => (
                      <button key={n} type="button" onClick={() => aiSync.onChangeDays(n)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-black transition ${Number(aiDays) === n ? 'bg-[#003580] text-white' : 'bg-[#f0f5ff] text-[#0071c2] hover:bg-[#dceaff]'}`}>
                        {n}d
                      </button>
                    ))}
                  </div>

                  {/* Low-budget advisory — appears when balance < $500 */}
                  <BudgetAdvisory balance={aiBalance} className="mt-1" />
                </div>
              )}

              {tab === 'cars' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-1">
                  <SearchInput className="md:col-span-5" icon={<MapPin className="w-4 h-4" />} label="Pick-up location" placeholder="Dubai International Airport" value={dest} onChange={setDest} />
                  <SearchInput className="md:col-span-3" icon={<Calendar className="w-4 h-4" />} label="Pick-up date" type="date" value={checkin} onChange={setCheckin} />
                  <SearchInput className="md:col-span-3" icon={<Calendar className="w-4 h-4" />} label="Return date" type="date" value={checkout} onChange={setCheckout} />
                  <SearchButton className="md:col-span-1" />
                </div>
              )}

              {/* Quick destination chips — fills the destination field of the CURRENT tab, never switches */}
              <div className="flex items-center flex-wrap gap-1.5 pt-3 px-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">Popular:</span>
                {['Dubai', 'Bali', 'Istanbul', 'Maldives', 'Tokyo', 'Berlin', 'Paris'].map(c => {
                  // What value is the current tab's destination field showing?
                  const currentValue =
                    tab === 'ai'      ? aiDest :
                    tab === 'flights' ? to     :
                                         dest;
                  const active = String(currentValue || '').toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        // Never change tab — just fill the destination input of the current tab.
                        if (tab === 'ai')            setAiDest(c);
                        else if (tab === 'flights')  setTo(c);
                        else                          setDest(c); // tours / stays / cars
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition active:scale-95 ${
                        active ? 'bg-[#003580] text-white shadow-md' : 'bg-[#f0f5ff] text-[#0071c2] hover:bg-[#dceaff]'
                      }`}
                    >{c}</button>
                  );
                })}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* spacer for the floating card */}
      <div className="h-24 md:h-28" />

      {/* ─── TRUST STRIP ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: BadgePercent,  title: 'Best Price Guarantee', sub: 'We refund the difference' },
            { icon: Shield,        title: 'Secure Bookings',      sub: 'SSL · 2FA · PCI compliant' },
            { icon: Headphones,    title: '24 / 7 Support',       sub: 'Real humans, real fast' },
            { icon: ThumbsUp,      title: '4.9 / 5 from travelers',sub: '14,000+ verified reviews' },
          ].map((f, i) => (
            <div key={i} className="bg-white border border-[#e7e7e7] rounded-xl p-4 flex items-center gap-3 hover:border-[#0071c2] hover:shadow-md transition">
              <div className="w-10 h-10 rounded-lg bg-[#f0f5ff] text-[#0071c2] flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-black text-[#1a1a1a] truncate">{f.title}</div>
                <div className="text-[11px] font-semibold text-[#9ca3af] truncate">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOT TOURS TEASER ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[#febb02] text-[11px] font-black uppercase tracking-widest mb-1">
              <Flame className="w-3.5 h-3.5" /> Hot tours
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] tracking-tight">Last-minute deals leaving soon</h2>
          </div>
          <button onClick={() => navigate('/hot-tours')} className="hidden md:flex items-center gap-1 text-[13px] font-bold text-[#0071c2] hover:underline">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((p, i) => {
            const discount = [42, 35, 28, 22][i] || 20;
            const original = Math.round(p.price / (1 - discount / 100));
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group bg-white rounded-2xl overflow-hidden border border-[#e7e7e7] hover:shadow-xl transition cursor-pointer"
                onClick={() => navigate('/hot-tours')}
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={p.image} alt={p.name} loading="lazy" onError={handleImgError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2.5 left-2.5 bg-[#febb02] text-[#1a1a1a] text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">-{discount}%</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const wasIn = isInWishlist(p.id, 'package');
                      toggleWishlist('package', p);
                      if (wasIn) toast.info('Removed from wishlist', p.name);
                      else       toast.success('Saved to wishlist', p.name);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow"
                    aria-label={isInWishlist(p.id, 'package') ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(p.id, 'package') ? 'fill-red-500 text-red-500' : 'text-[#595959]'}`} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-[11px] text-[#595959] font-bold mb-1">
                    <MapPin className="w-3 h-3 text-[#0071c2]" /> {p.destination}
                  </div>
                  <h3 className="text-[15px] font-black text-[#1a1a1a] mb-1.5 line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#595959] mb-3">
                    <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-[#febb02] text-[#febb02]" /> {p.rating}</span>
                    <span>· {p.duration} days</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[11px] text-[#9ca3af] line-through font-bold">${original}</div>
                      <div className="text-[18px] font-black text-[#003580]">${p.price}</div>
                    </div>
                    <span className="text-[11px] font-black text-[#0071c2] flex items-center gap-0.5">
                      Book <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="md:hidden mt-4 text-center">
          <button onClick={() => navigate('/hot-tours')} className="text-[14px] font-black text-[#0071c2]">View all deals →</button>
        </div>
      </section>

      {/* ─── AI BUDGET CTA STRIP ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#003580] via-[#0058b1] to-[#0071c2] rounded-3xl p-7 md:p-12 text-white">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#febb02]/30 blur-3xl pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#febb02] text-[#1a1a1a] text-[11px] font-black uppercase tracking-widest mb-4">
                <Wand2 className="w-3.5 h-3.5" /> New · AI Budget Planner
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-3">
                Got a budget? We'll build the trip.
              </h2>
              <p className="text-[15px] text-white/85 font-medium mb-6 max-w-md">
                Type in what you can spend and how many days you have. Our AI picks a destination that fits, books the right tier of hotel, and lays out a day-by-day plan in seconds.
              </p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => navigate('/hot-tours')} className="px-6 py-3 rounded-xl bg-[#febb02] hover:bg-[#ffb700] text-[#1a1a1a] font-black text-[14px] active:scale-95 transition flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Try AI planner
                </button>
                <button onClick={() => navigate('/planner')} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 font-black text-[14px] active:scale-95 transition">
                  See sample plans
                </button>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-3">
              {[
                { icon: Wallet,  label: 'Picks destination from your budget tier' },
                { icon: Hotel,   label: 'Suggests hotels at the right star level' },
                { icon: Compass, label: 'Lays out day-by-day real places & food' },
                { icon: Check,   label: 'Full transparent cost breakdown' },
              ].map((f, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
                  <f.icon className="w-5 h-5 text-[#febb02] mb-2" />
                  <p className="text-[13px] font-semibold leading-snug">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRENDING DESTINATIONS ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[#0071c2] text-[11px] font-black uppercase tracking-widest mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Trending destinations
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] tracking-tight">Travelers' favorites this season</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {TRENDING.map((d, i) => (
            <button key={i} onClick={() => navigate('/flights')}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-xl">
              <SmartImage src={d.img} alt={d.city} wrapperClassName="absolute inset-0" className="group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end text-left text-white">
                <div className="text-[16px] md:text-[18px] font-black leading-tight">{d.city}</div>
                <div className="text-[11px] text-white/75 font-semibold mb-1.5">{d.country}</div>
                <div className="text-[11px] inline-flex items-center gap-1 bg-white/95 text-[#003580] font-black px-2 py-0.5 rounded-md w-fit">
                  <Plane className="w-3 h-3" /> from ${d.from}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── BROWSE BY THEME ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] tracking-tight mb-1">Browse by trip type</h2>
        <p className="text-[14px] text-[#595959] font-medium mb-6">Find tours that match your kind of holiday.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {THEMES.map((th, i) => (
            <button key={th.id} onClick={() => navigate('/hot-tours')}
              className="group bg-white rounded-2xl border border-[#e7e7e7] hover:border-[#0071c2] hover:shadow-md overflow-hidden transition">
              <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage:`url(${th.img})` }} />
              <div className="p-3 flex items-center gap-2">
                <th.icon className="w-4 h-4 text-[#0071c2] shrink-0" />
                <div className="text-[13px] font-black text-[#1a1a1a]">{th.label}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── ALL PACKAGES (Booking.com property cards style) ─────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] tracking-tight">Recommended for you</h2>
            <p className="text-[14px] text-[#595959] font-medium">Hand-picked tour packages travelers loved this week.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allPackages.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-[#e7e7e7] hover:shadow-xl transition group cursor-pointer"
                 onClick={() => navigate('/hot-tours')}>
              <div className="relative h-44 overflow-hidden">
                <img src={p.image} alt={p.name} loading="lazy" onError={handleImgError}
                  className="w-full h-full object-cover group-hover:scale-105 transition" />
                {p.featured && <span className="absolute top-2.5 left-2.5 bg-white text-[#0071c2] text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">Bestseller</span>}
              </div>
              <div className="p-4">
                <h3 className="text-[15px] font-black text-[#1a1a1a] mb-1 line-clamp-1">{p.name}</h3>
                <div className="flex items-center gap-1 text-[11px] text-[#595959] font-semibold mb-2">
                  <MapPin className="w-3 h-3 text-[#0071c2]" /> {p.destination}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#595959] mb-3">
                  <span className="flex items-center gap-1 font-bold">
                    <span className="bg-[#003580] text-white px-1.5 py-0.5 rounded text-[10px] font-black">{p.rating}</span>
                    <span className="font-bold">{p.rating >= 4.8 ? 'Exceptional' : 'Very Good'}</span>
                    <span className="text-[#9ca3af]">· {p.reviews} reviews</span>
                  </span>
                </div>
                <div className="flex items-end justify-between border-t border-[#f0f0f0] pt-3">
                  <div>
                    <div className="text-[10px] text-[#9ca3af] font-bold uppercase">{p.duration} days · per person</div>
                    <div className="text-[20px] font-black text-[#1a1a1a]">${p.price}</div>
                  </div>
                  <span className="text-[12px] font-black text-white bg-[#0071c2] hover:bg-[#005fa3] px-3 py-2 rounded-lg transition">View deal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── REVIEWS ─────────────────────────────────────────────── */}
      <section className="bg-white border-y border-[#e7e7e7]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1 text-[#febb02] mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-[#febb02]" />)}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a]">Trusted by travelers worldwide</h2>
            <p className="text-[14px] text-[#595959] font-medium">14,000+ verified reviews · 4.9 average rating</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Aisha R.', city: 'Bishkek', text: '“I gave the AI my budget and it built a 7-day Bali plan that came in $40 under. Booking was painless.”', rating: 5 },
              { name: 'Daniyar K.', city: 'Almaty', text: '“Found a Dubai package 38% cheaper than what I had on Booking.com. Customer service replied in minutes.”', rating: 5 },
              { name: 'Sofia M.', city: 'Tashkent', text: '“Halal restaurants for every day of the trip — I didn’t even know I needed this feature until I saw it.”', rating: 5 },
            ].map((r, i) => (
              <div key={i} className="bg-[#f8f9fa] rounded-2xl border border-[#e7e7e7] p-5">
                <div className="flex items-center gap-1 mb-2 text-[#febb02]">
                  {Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="w-3.5 h-3.5 fill-[#febb02]" />)}
                </div>
                <p className="text-[14px] text-[#1a1a1a] font-medium leading-relaxed mb-3">{r.text}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#003580] text-white text-[11px] font-black flex items-center justify-center">
                    {r.name.charAt(0)}
                  </div>
                  <div className="text-[12px]">
                    <div className="font-black text-[#1a1a1a]">{r.name}</div>
                    <div className="text-[#9ca3af] font-semibold">{r.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-[#003580] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-[#febb02]/20 blur-3xl pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Mail className="w-8 h-8 text-[#febb02] mb-3" />
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Get the best deals first</h2>
              <p className="text-[14px] text-white/80 font-medium">Subscribe and we'll send hot tour drops, flash flight prices, and AI travel tips weekly. No spam — promise.</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); toast.success('Subscribed', 'Hot tour drops are heading your inbox.'); }}
              className="flex gap-2 bg-white/10 backdrop-blur rounded-xl p-1.5 border border-white/15">
              <input type="email" required placeholder="you@email.com" className="flex-1 bg-transparent px-3 py-3 text-[14px] font-bold placeholder:text-white/50 outline-none" />
              <button className="px-5 py-3 rounded-lg bg-[#febb02] hover:bg-[#ffb700] text-[#1a1a1a] font-black text-[13px] uppercase tracking-wider active:scale-95 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

/* ── Reusable subcomponents ───────────────────────────────────────── */
const Tab = ({ active, onClick, icon, label, highlight }) => (
  <button type="button" onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-[13px] font-black whitespace-nowrap transition ${
      active
        ? 'bg-white text-[#003580] shadow-[0_-2px_0_#0071c2_inset]'
        : 'text-[#595959] hover:bg-gray-50'
    }`}>
    {icon}{label}
    {highlight && !active && <span className="ml-1 px-1.5 py-0.5 rounded bg-[#febb02] text-[#1a1a1a] text-[9px] font-black uppercase">New</span>}
  </button>
);

const SearchInput = ({ icon, label, placeholder, type = 'text', value, onChange, className = '', min, max }) => (
  <label className={`block border-2 border-[#e7e7e7] hover:border-[#0071c2] focus-within:border-[#0071c2] rounded-xl px-3 py-2.5 transition ${className}`}>
    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#9ca3af] mb-0.5">
      <span className="text-[#0071c2]">{icon}</span>{label}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      min={min}
      max={max}
      onChange={e => onChange?.(e.target.value)}
      className="w-full bg-transparent outline-none text-[14px] font-bold text-[#1a1a1a] placeholder:text-[#b0b0b0]"
    />
  </label>
);

const SearchButton = ({ className = '', icon }) => (
  <button type="submit" className={`flex items-center justify-center gap-2 bg-[#0071c2] hover:bg-[#005fa3] text-white font-black text-[14px] rounded-xl py-3 px-5 transition active:scale-95 ${className}`}>
    {icon || <Search className="w-5 h-5" />}
    <span className="md:hidden">Search</span>
  </button>
);

export default Home;
