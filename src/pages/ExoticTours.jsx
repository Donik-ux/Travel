import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Snowflake, Globe, ArrowRight, Clock, Star, Users, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../store/useLangStore';

const TOURS = [
  {
    id: 1,
    type: 'hot-cold',
    badge: '🔥 → ❄️',
    badgeLabel: 'Hot to Cold',
    badgeColor: 'from-orange-500 to-blue-500',
    title: 'Dubai to Antarctic Expedition',
    tagline: 'From desert gold to the white continent',
    from: { city: 'Dubai', country: 'UAE', flag: '🇦🇪', temp: '+42°C', icon: '🏙️' },
    to:   { city: 'Antarctica', country: 'White Continent', flag: '🧊', temp: '-30°C', icon: '🧊' },
    days: 14,
    price: '€8,500',
    rating: 4.9,
    reviews: 128,
    groupSize: '8–12',
    desc: 'Begin your journey in the ultra-modern skyline of Dubai, then venture to the most remote continent on Earth. Witness emperor penguins, icebergs, and the clearest skies you\'ve ever seen.',
    highlights: ['Dubai city tour & desert safari', 'Flight to Ushuaia, Argentina', 'Antarctic cruise expedition', 'Penguin colony visits', 'Zodiac glacier landings'],
    image: 'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    type: 'hot-cold',
    badge: '🔥 → ❄️',
    badgeLabel: 'Hot to Cold',
    badgeColor: 'from-teal-400 to-indigo-600',
    title: 'Maldives to Iceland Northern Lights',
    tagline: 'Tropical lagoons to volcanic tundra',
    from: { city: 'Maldives', country: 'Indian Ocean', flag: '🇲🇻', temp: '+30°C', icon: '🏝️' },
    to:   { city: 'Reykjavik', country: 'Iceland', flag: '🇮🇸', temp: '-5°C', icon: '🌌' },
    days: 10,
    price: '€4,200',
    rating: 4.8,
    reviews: 94,
    groupSize: '6–10',
    desc: 'Snorkel in crystal-clear Maldivian waters, then chase the Aurora Borealis across Iceland\'s dramatic lava fields and waterfalls. A journey between two completely different worlds.',
    highlights: ['Maldives overwater bungalow stay', 'Snorkeling & whale watching', 'Blue Lagoon geothermal spa', 'Northern Lights tour', 'Glacier hike & volcano visit'],
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    type: 'hot-cold',
    badge: '🔥 → ❄️',
    badgeLabel: 'Hot to Cold',
    badgeColor: 'from-yellow-500 to-cyan-600',
    title: 'Sahara Desert to Norwegian Fjords',
    tagline: 'Sand dunes to glacier-carved valleys',
    from: { city: 'Marrakech', country: 'Morocco', flag: '🇲🇦', temp: '+38°C', icon: '🐪' },
    to:   { city: 'Bergen', country: 'Norway', flag: '🇳🇴', temp: '+8°C', icon: '⛰️' },
    days: 12,
    price: '€3,600',
    rating: 4.7,
    reviews: 67,
    groupSize: '8–14',
    desc: 'Ride camels through the Sahara dunes at sunset, then cruise through Norway\'s UNESCO-listed fjords. Two of Earth\'s most spectacular landscapes in one unforgettable journey.',
    highlights: ['Sahara camel trek & camp overnight', 'Marrakech medina exploration', 'Oslo city tour', 'Geirangerfjord UNESCO cruise', 'Trolltunga hike'],
    image: 'https://images.unsplash.com/photo-1574080388890-c8041bfb2017?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    type: 'hot-cold',
    badge: '🔥 → ❄️',
    badgeLabel: 'Hot to Cold',
    badgeColor: 'from-red-500 to-slate-600',
    title: 'Singapore to Siberia Winter',
    tagline: 'Tropical megacity to frozen taiga',
    from: { city: 'Singapore', country: 'Singapore', flag: '🇸🇬', temp: '+32°C', icon: '🌆' },
    to:   { city: 'Yakutsk', country: 'Russia', flag: '🇷🇺', temp: '-45°C', icon: '❄️' },
    days: 8,
    price: '€2,800',
    rating: 4.6,
    reviews: 41,
    groupSize: '4–8',
    desc: 'Experience the city of the future in Singapore, then plunge into the coldest inhabited city on Earth. Yakutsk in winter is a surreal world of frozen rivers, ice sculptures, and reindeer herds.',
    highlights: ['Marina Bay & Gardens by the Bay', 'Singapore hawker food tour', 'Lena Pillars nature park', 'Yakutian horse riding', 'Ice sculpture festival'],
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    type: 'cultural',
    badge: '🌍 Cultural Mix',
    badgeLabel: 'Cultural Contrast',
    badgeColor: 'from-purple-500 to-pink-500',
    title: 'Dubai + Serbia Hidden Gems',
    tagline: 'Luxury skyscrapers meets Balkan soul',
    from: { city: 'Dubai', country: 'UAE', flag: '🇦🇪', temp: '+35°C', icon: '🏙️' },
    to:   { city: 'Belgrade', country: 'Serbia', flag: '🇷🇸', temp: '+20°C', icon: '🏰' },
    days: 7,
    price: '€1,900',
    rating: 4.8,
    reviews: 153,
    groupSize: '6–16',
    desc: 'Explore the glittering excess of Dubai\'s ultra-modern architecture, then discover Serbia\'s deeply authentic culture — medieval fortresses, vibrant nightlife, and farm-to-table cuisine.',
    highlights: ['Burj Khalifa & Dubai Mall', 'Desert quad biking', 'Belgrade Fortress tour', 'Danube river cruise', 'Traditional Serbian village'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    type: 'cold-hot',
    badge: '❄️ → 🔥',
    badgeLabel: 'Cold to Hot',
    badgeColor: 'from-blue-500 to-orange-500',
    title: 'Greenland Ice Sheet to Miami Beach',
    tagline: 'Arctic wilderness to neon paradise',
    from: { city: 'Nuuk', country: 'Greenland', flag: '🇬🇱', temp: '-10°C', icon: '🏔️' },
    to:   { city: 'Miami', country: 'USA', flag: '🇺🇸', temp: '+30°C', icon: '🌴' },
    days: 10,
    price: '€4,800',
    rating: 4.7,
    reviews: 38,
    groupSize: '6–12',
    desc: 'Trek across the Greenland ice sheet where ancient glaciers meet the sea, then defrost on Miami\'s iconic Art Deco beachfront. The ultimate contrast of raw wilderness and urban heat.',
    highlights: ['Greenland ice sheet trekking', 'Dog sledding excursion', 'Miami Art Deco tour', 'Everglades airboat ride', 'South Beach sunset cocktails'],
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    type: 'cultural',
    badge: '🌍 Cultural Mix',
    badgeLabel: 'Cultural Contrast',
    badgeColor: 'from-emerald-500 to-violet-600',
    title: 'Tokyo to Patagonia',
    tagline: 'Ultra-modern megacity to end of the world',
    from: { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', temp: '+20°C', icon: '🗼' },
    to:   { city: 'Torres del Paine', country: 'Chile', flag: '🇨🇱', temp: '+10°C', icon: '🏔️' },
    days: 21,
    price: '€6,200',
    rating: 5.0,
    reviews: 72,
    groupSize: '6–12',
    desc: 'From the hyper-connected neon chaos of Tokyo to the wind-swept silence of Patagonia\'s granite towers. This is a journey between civilization\'s peak and the planet\'s raw edge.',
    highlights: ['Tokyo shibuya & Harajuku', 'Mount Fuji sunrise climb', 'Patagonia W-Trek', 'Torres del Paine peak', 'Cape Horn southern tip'],
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    type: 'hot-cold',
    badge: '🔥 → ❄️',
    badgeLabel: 'Hot to Cold',
    badgeColor: 'from-amber-400 to-blue-700',
    title: 'Morocco Desert + Swiss Alps',
    tagline: 'Saharan spice to Alpine snow peaks',
    from: { city: 'Fes', country: 'Morocco', flag: '🇲🇦', temp: '+35°C', icon: '🕌' },
    to:   { city: 'Zermatt', country: 'Switzerland', flag: '🇨🇭', temp: '-2°C', icon: '🏔️' },
    days: 10,
    price: '€3,100',
    rating: 4.9,
    reviews: 89,
    groupSize: '8–12',
    desc: 'Lose yourself in the ancient medina of Fes, sleep under a billion stars in the Sahara, then wake up beneath the Matterhorn in car-free Zermatt. Two worlds separated by just a short flight.',
    highlights: ['Fes ancient medina UNESCO', 'Sahara 2-night camp', 'Geneva lake tour', 'Matterhorn cogwheel railway', 'Swiss fondue & alpine hike'],
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80',
  },
];

// TYPE_FILTERS uses t() inside component — moved below

const TourCard = ({ tour }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="group bg-white rounded-[24px] border border-[#e7e7e7] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-black text-white bg-gradient-to-r ${tour.badgeColor} shadow-lg`}>
          {tour.badge}
        </div>
        {/* Price */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-xl">
          <span className="text-white font-black text-[16px]">{tour.price}</span>
          <span className="text-white/60 text-[11px] ml-1">{t('exotic.perPerson')}</span>
        </div>
      </div>

      <div className="p-6">
        {/* Route */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[20px]">{tour.from.flag}</span>
          <div className="text-center">
            <div className="text-[11px] font-black text-[#1a1a1a]">{tour.from.city}</div>
            <div className="text-[10px] text-[#9ca3af]">{tour.from.temp}</div>
          </div>
          <div className="flex-1 flex items-center gap-1 px-2">
            <div className="flex-1 h-px border-t-2 border-dashed border-[#d1d5db]" />
            <Plane className="w-3.5 h-3.5 text-[#0071c2] shrink-0" />
            <div className="flex-1 h-px border-t-2 border-dashed border-[#d1d5db]" />
          </div>
          <div className="text-center">
            <div className="text-[11px] font-black text-[#1a1a1a]">{tour.to.city}</div>
            <div className="text-[10px] text-[#9ca3af]">{tour.to.temp}</div>
          </div>
          <span className="text-[20px]">{tour.to.flag}</span>
        </div>

        {/* Title */}
        <h3 className="text-[18px] font-black text-[#1a1a1a] mb-1 leading-tight">{tour.title}</h3>
        <p className="text-[13px] text-[#595959] mb-4">{tour.tagline}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-[12px] text-[#9ca3af]">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{tour.days} {t('exotic.days')}</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{tour.rating} ({tour.reviews})</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{tour.groupSize} pax</span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#595959] leading-relaxed mb-4">{tour.desc}</p>

        {/* Highlights toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-[12px] font-bold text-[#0071c2] hover:underline mb-3 flex items-center gap-1"
        >
          {expanded ? t('exotic.hideHighlights') : t('exotic.showHighlights')} <ArrowRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {expanded && (
          <ul className="mb-4 space-y-1.5">
            {tour.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2 text-[13px] text-[#595959]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0071c2] shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <button
          onClick={() => { navigate('/'); setTimeout(() => { document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }, 300); }}
          className="w-full py-3 rounded-xl bg-[#003580] text-white font-black text-[13px] uppercase tracking-wider hover:bg-[#0071c2] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {t('exotic.viewItinerary')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const ExoticTours = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const { t } = useTranslation();

  const TYPE_FILTERS = [
    { key: null,        label: t('exotic.allTours'),      icon: Globe },
    { key: 'hot-cold',  label: t('exotic.filterHotCold'), icon: Thermometer },
    { key: 'cold-hot',  label: t('exotic.filterColdHot'), icon: Snowflake },
    { key: 'cultural',  label: t('exotic.filterCultural'), icon: Globe },
  ];

  const filtered = activeFilter
    ? TOURS.filter(t => t.type === activeFilter)
    : TOURS;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">

      {/* Hero */}
      <div className="relative bg-[#003580] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[200%] bg-white/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[200%] bg-[#0071c2]/30 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Globe className="w-4 h-4 text-white/80" />
              <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                {t('exotic.badge')}
              </span>
            </div>

            <h1 className="text-[52px] md:text-[72px] font-black text-white leading-[0.95] tracking-tighter mb-6">
              {t('exotic.title1')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-blue-300">
                {t('exotic.title2')}
              </span>
            </h1>

            <p className="text-[17px] text-white/70 max-w-xl leading-relaxed mb-10">
              {t('exotic.sub')}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: '8', label: t('exotic.tours') },
                { value: '4', label: t('exotic.continents') },
                { value: '100+', label: t('exotic.travelers') },
                { value: '4.8★', label: t('exotic.rating') },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-[28px] font-black text-white">{s.value}</div>
                  <div className="text-[12px] text-white/50 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 720 0 0 40V60Z" fill="#f8f9fa" />
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-wrap gap-2 mb-10">
          {TYPE_FILTERS.map(f => (
            <button
              key={String(f.key)}
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all border ${
                activeFilter === f.key
                  ? 'bg-[#003580] text-white border-[#003580] shadow-md'
                  : 'bg-white text-[#595959] border-[#e7e7e7] hover:border-[#003580] hover:text-[#003580]'
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto self-center text-[13px] text-[#9ca3af] font-medium">
            {filtered.length} {t('exotic.toursFound')}
          </span>
        </div>

        {/* Tour grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(tour => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-[#003580] rounded-[32px] p-10 md:p-16 text-center">
          <h2 className="text-[36px] font-black text-white mb-4">
            {t('exotic.ctaTitle')}
          </h2>
          <p className="text-[16px] text-white/70 mb-8 max-w-lg mx-auto">
            {t('exotic.ctaSub')}
          </p>
          <button className="px-10 py-4 rounded-2xl bg-white text-[#003580] font-black text-[15px] hover:bg-white/90 transition-all active:scale-95">
            {t('exotic.ctaBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExoticTours;
