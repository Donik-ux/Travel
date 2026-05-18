import React from 'react';
import { X, ExternalLink, TrendingDown, Star, Plane } from 'lucide-react';

/* ── Extract IATA code from "City (IATA)" format ── */
function getIATA(str = '') {
  const m = str.match(/\(([A-Z]{3})\)/);
  return m ? m[1] : str.replace(/[^A-Z]/g, '').slice(0, 3);
}

/* ── Format date for each site ── */
function fmtAviasales(date) {
  // DDMM — e.g. 0106 for June 1
  if (!date) return '';
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}${mm}`;
}
function fmtSkyscanner(date) {
  // YYMMDD
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().slice(2,10).replace(/-/g,'');
}
function fmtKayak(date) {
  // YYYY-MM-DD
  if (!date) return new Date().toISOString().slice(0, 10);
  return new Date(date).toISOString().slice(0, 10);
}
function fmtGoogle(date) {
  // YYYY-MM-DD
  return fmtKayak(date);
}

/* ── Build search URLs ── */
function buildUrls(flight, date, pax = 1) {
  const from = getIATA(flight.from);
  const to   = getIATA(flight.to);
  const fromCity = (flight.from || '').split('(')[0].trim();
  const toCity   = (flight.to   || '').split('(')[0].trim();
  const d_as  = fmtAviasales(date);
  const d_sc  = fmtSkyscanner(date);
  const d_ky  = fmtKayak(date);
  const d_gg  = fmtGoogle(date);

  return [
    {
      name:    'Aviasales',
      logo:    '✈️',
      tagline: 'Best prices for CIS routes',
      badge:   'Recommended',
      badgeCls: 'bg-orange-100 text-orange-700',
      cardCls:  'border-orange-300 hover:border-orange-400 hover:shadow-orange-100',
      url: d_as
        ? `https://www.aviasales.ru/search/${from}${d_as}${to}${d_as}${pax}`
        : `https://www.aviasales.ru`,
    },
    {
      name:    'Skyscanner',
      logo:    '🔍',
      tagline: 'Compare 1000+ airlines worldwide',
      badge:   'Most Popular',
      badgeCls: 'bg-blue-100 text-blue-700',
      cardCls:  'border-blue-300 hover:border-blue-400 hover:shadow-blue-100',
      url: `https://www.skyscanner.com/transport/flights/${from}/${to}/${d_sc}/?adults=${pax}`,
    },
    {
      name:    'Google Flights',
      logo:    '🌐',
      tagline: 'Free • Price alerts • Best date calendar',
      badge:   'Free & Fast',
      badgeCls: 'bg-green-100 text-green-700',
      cardCls:  'border-green-300 hover:border-green-400 hover:shadow-green-100',
      url: `https://www.google.com/travel/flights?q=Flights+from+${encodeURIComponent(fromCity)}+to+${encodeURIComponent(toCity)}&hl=en&curr=USD`,
    },
    {
      name:    'Kayak',
      logo:    '🛶',
      tagline: 'Price prediction & deal alerts',
      badge:   'Price Alerts',
      badgeCls: 'bg-purple-100 text-purple-700',
      cardCls:  'border-purple-300 hover:border-purple-400 hover:shadow-purple-100',
      url: `https://www.kayak.com/flights/${from}-${to}/${d_ky}/${pax}adults`,
    },
  ];
}

export default function FlightBookingModal({ flight, date, pax = 1, onClose }) {
  if (!flight) return null;

  const sites = buildUrls(flight, date, pax);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg page-fade">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#f0f0f0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Plane className="w-4 h-4 text-[#0071c2]" />
              <p className="text-[13px] font-bold text-[#003580]">
                {flight.from?.split('(')[0]?.trim()} → {flight.to?.split('(')[0]?.trim()}
              </p>
            </div>
            <p className="text-[12px] text-[#9ca3af]">
              {flight.airline} · {flight.cabin} · {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
            </p>
          </div>
          <div className="text-right flex items-start gap-4">
            <div>
              <p className="text-2xl font-black text-[#003580] leading-none">${flight.price}</p>
              <p className="text-[11px] text-[#9ca3af]">per person</p>
            </div>
            <button onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#f5f5f5] transition-premium text-[#9ca3af] hover:text-[#595959]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tip */}
        <div className="px-5 pt-4 pb-1">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
            <TrendingDown className="w-4 h-4 text-[#0071c2] shrink-0" />
            <p className="text-[12px] text-[#595959]">
              Compare prices across these sites — same flight, possibly cheaper price!
            </p>
          </div>
        </div>

        {/* Sites */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sites.map((site) => (
            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col gap-2.5 p-4 bg-white border-2 ${site.cardCls} rounded-xl transition-all duration-200 hover:shadow-md group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{site.logo}</span>
                  <p className="text-[14px] font-black text-[#1a1a1a]">{site.name}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${site.badgeCls}`}>
                  {site.badge}
                </span>
              </div>
              <p className="text-[12px] text-[#9ca3af] leading-snug">{site.tagline}</p>
              <div className="flex items-center gap-1 text-[#0071c2] text-[12px] font-bold group-hover:gap-2 transition-all">
                Search <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>

        <div className="px-5 pb-5">
          <p className="text-center text-[#c9d1d9] text-[11px]">
            We show you the best sites to compare — always verify before booking
          </p>
        </div>
      </div>
    </div>
  );
}
