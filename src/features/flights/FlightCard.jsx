import React, { useState } from 'react';
import { Plane, Clock, Users, Leaf, ExternalLink, BadgeCheck } from 'lucide-react';
import { useTranslation } from '../../store/useLangStore';
import FlightBookingModal from '../../components/FlightBookingModal';
import { officialUrlFor, airlineMetaOf } from '../../services/airlineLinks';

export default function FlightCard({ flight, index, aiPriced }) {
  const { t }   = useTranslation();
  const [open, setOpen] = useState(false);

  const seatsTight = flight.seats != null && flight.seats <= 5;
  const officialUrl = officialUrlFor(flight);
  const meta = airlineMetaOf(flight);

  return (
    <>
      <div
        className="bg-white border border-[#e7e7e7] hover:border-[#0071c2] hover:shadow-lg rounded-2xl p-5 cursor-pointer transition-all"
        style={{ animationDelay: `${(index || 0) * 0.05}s` }}
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Airline — clickable when an official site is known */}
          {officialUrl ? (
            <a href={officialUrl} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-3 lg:w-44 shrink-0 rounded-lg -m-1 p-1 hover:bg-[#f0f5ff] transition group/airline"
              title={`Book directly on ${meta?.domain || flight.airline}`}>
              <div className="w-12 h-12 rounded-xl bg-[#f0f5ff] border border-[#dceaff] flex items-center justify-center text-2xl shrink-0">
                {meta?.flag || flight.airlineLogo || <Plane className="w-5 h-5 text-[#0071c2] -rotate-45" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-black text-[#1a1a1a] truncate">{flight.airline}</p>
                  <BadgeCheck className="w-3.5 h-3.5 text-[#008009] shrink-0" />
                </div>
                <p className="text-[11px] text-[#0071c2] font-bold truncate flex items-center gap-1">
                  {meta?.domain || flight.airlineCode} <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </p>
              </div>
            </a>
          ) : (
            <div className="flex items-center gap-3 lg:w-44 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-[#f0f5ff] border border-[#dceaff] flex items-center justify-center text-2xl shrink-0">
                {flight.airlineLogo || <Plane className="w-5 h-5 text-[#0071c2] -rotate-45" />}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-black text-[#1a1a1a] truncate">{flight.airline}</p>
                <p className="text-[11px] text-[#9ca3af] font-semibold">{flight.airlineCode} · {flight.cabin}</p>
              </div>
            </div>
          )}

          {/* Route */}
          <div className="flex-1 flex items-center gap-3 w-full">
            <div className="text-center shrink-0 min-w-[68px]">
              <p className="text-[22px] font-black text-[#1a1a1a] leading-none tabular-nums">{flight.departure}</p>
              <p className="text-[11px] font-bold text-[#9ca3af] mt-1 truncate">{(flight.from || '').split('(')[0].trim()}</p>
            </div>

            <div className="flex-1 flex flex-col items-center gap-1 min-w-0 px-2">
              <div className="flex items-center gap-1 text-[#9ca3af]">
                <Clock className="w-3 h-3" />
                <span className="text-[11px] font-bold">{flight.duration}</span>
              </div>
              <div className="w-full flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full border-2 border-[#0071c2] shrink-0" />
                <div className={`flex-1 h-px ${flight.stops === 0 ? 'bg-[#008009]' : 'bg-[#febb02]'} relative`}>
                  {flight.stops > 0 && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#febb02] border-2 border-white" />
                  )}
                  <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-[#9ca3af]" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#003580] shrink-0" />
              </div>
              <span className={`text-[10px] font-black ${flight.stops === 0 ? 'text-[#008009]' : 'text-[#a45e00]'}`}>
                {flight.stops === 0
                  ? `✓ ${t('flights.results.direct') || 'Non-stop'}`
                  : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}
              </span>
            </div>

            <div className="text-center shrink-0 min-w-[68px]">
              <p className="text-[22px] font-black text-[#1a1a1a] leading-none tabular-nums">{flight.arrival}</p>
              <p className="text-[11px] font-bold text-[#9ca3af] mt-1 truncate">{(flight.to || '').split('(')[0].trim()}</p>
            </div>
          </div>

          {/* Price + Button */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 w-full lg:w-auto lg:min-w-[160px]">
            <div className="text-right">
              <p className="text-[26px] font-black text-[#003580] leading-none tabular-nums">${flight.price}</p>
              <p className="text-[11px] text-[#9ca3af] font-semibold mt-0.5">
                {aiPriced ? '🤖 AI-priced' : (t('flights.results.perPerson') || 'per person')}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {officialUrl && (
                <a href={officialUrl} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 rounded-lg bg-[#008009] hover:bg-[#006d07] text-white text-[11px] font-black transition active:scale-95 whitespace-nowrap shadow-sm flex items-center gap-1.5">
                  <BadgeCheck className="w-3 h-3" /> Book on {meta?.domain.split('.')[0]}
                </a>
              )}
              <button
                onClick={e => { e.stopPropagation(); setOpen(true); }}
                className="px-3 py-2 rounded-lg bg-[#febb02] hover:bg-[#ffb700] text-[#1a1a1a] text-[11px] font-black transition active:scale-95 whitespace-nowrap shadow-sm">
                Compare prices
              </button>
            </div>
          </div>
        </div>

        {/* Bottom badges */}
        <div className="mt-3 pt-3 border-t border-[#f0f0f0] flex items-center gap-2 flex-wrap">
          {flight.stops === 0 && (
            <span className="px-2.5 py-1 bg-[#e8f5e9] text-[#008009] text-[10px] font-black rounded-full uppercase tracking-wider">
              {t('flights.results.nonstop') || 'Non-stop'}
            </span>
          )}
          <span className="px-2.5 py-1 bg-[#f0f5ff] text-[#0071c2] text-[10px] font-black rounded-full uppercase tracking-wider">{flight.cabin}</span>
          {flight.eco && (
            <span className="px-2.5 py-1 bg-[#e8f5e9] text-[#008009] text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-2.5 h-2.5" /> Lower CO₂
            </span>
          )}
          {flight.seats != null && (
            <span className={`text-[11px] font-bold flex items-center gap-1 ${seatsTight ? 'text-red-500' : 'text-[#9ca3af]'}`}>
              <Users className="w-3 h-3" />{flight.seats} {seatsTight ? 'left!' : (t('flights.results.seats') || 'seats')}
            </span>
          )}
          <span className="ml-auto text-[11px] text-[#0071c2] font-black">{t('flights.results.comparePrices') || 'Compare prices'} →</span>
        </div>
      </div>

      {/* Booking Modal */}
      {open && (
        <FlightBookingModal
          flight={flight}
          date={flight.date || null}
          pax={1}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
