/**
 * Vercel serverless function.  GET /api/flights?from=FRU&to=DXB&date=2026-06-15&adults=1&cabin=ECONOMY
 *
 * Proxies the Amadeus Self-Service "Flight Offers Search" API so the browser
 * never sees the secret key, and we avoid CORS issues calling Amadeus directly.
 *
 * Env vars (set in Vercel Project Settings → Environment Variables):
 *   AMADEUS_CLIENT_ID
 *   AMADEUS_CLIENT_SECRET
 *
 * Free tier: 2000 calls / month.  Returns realistic GDS prices from real airlines
 * (the same data Skyscanner / Kayak / Google Flights pull from).
 */

const AMADEUS_BASE = process.env.AMADEUS_ENV === 'production'
  ? 'https://api.amadeus.com'
  : 'https://test.api.amadeus.com';

// in-memory token cache (per warm Vercel instance)
let TOKEN = null;        // { access_token, expires_at }
let TOKEN_PROMISE = null;

async function getToken() {
  const now = Date.now();
  if (TOKEN && TOKEN.expires_at > now + 30_000) return TOKEN.access_token;
  if (TOKEN_PROMISE) return TOKEN_PROMISE;

  const cid = process.env.AMADEUS_CLIENT_ID;
  const sec = process.env.AMADEUS_CLIENT_SECRET;
  if (!cid || !sec) throw new Error('AMADEUS_NO_KEY');

  TOKEN_PROMISE = (async () => {
    const r = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${encodeURIComponent(cid)}&client_secret=${encodeURIComponent(sec)}`,
    });
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      throw new Error(`AMADEUS_AUTH ${r.status}: ${text.slice(0, 160)}`);
    }
    const j = await r.json();
    TOKEN = {
      access_token: j.access_token,
      expires_at: Date.now() + (Number(j.expires_in) || 1700) * 1000,
    };
    return TOKEN.access_token;
  })();

  try { return await TOKEN_PROMISE; }
  finally { TOKEN_PROMISE = null; }
}

const IATA = (s) => {
  if (!s) return '';
  const m = String(s).match(/\(([A-Z]{3,4})\)/);
  return (m ? m[1] : String(s).toUpperCase().replace(/[^A-Z]/g, '')).slice(0, 3);
};
const cabinNorm = (c) => {
  const x = String(c || '').toUpperCase().replace(/\s+/g, '_');
  if (['ECONOMY','PREMIUM_ECONOMY','BUSINESS','FIRST'].includes(x)) return x;
  return 'ECONOMY';
};

/** Convert Amadeus flight offer → our app's flat flight model */
function normalize(offer, fromCity, toCity) {
  const itin = offer.itineraries?.[0];
  const segments = itin?.segments || [];
  const first = segments[0];
  const last  = segments[segments.length - 1];
  if (!first || !last) return null;

  const price = Math.round(Number(offer.price?.grandTotal || offer.price?.total) || 0);
  if (!price) return null;

  const stops = Math.max(0, segments.length - 1);
  const duration = (itin?.duration || 'PT0H').replace('PT', '').replace('H', 'h ').replace('M', 'm').trim() || '—';

  const formatTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return '—';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const carrier = offer.validatingAirlineCodes?.[0] || first.carrierCode || '';
  const airlineName = AIRLINE_NAMES[carrier] || carrier;

  return {
    id: `${offer.id || carrier}-${Math.random().toString(36).slice(2,6)}`,
    airline: airlineName,
    airlineCode: `${carrier}-${first.number || ''}`,
    airlineLogo: AIRLINE_FLAGS[carrier] || '✈️',
    cabin: cabinNorm(offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY').replace('_', ' '),
    price,
    pricePerPerson: price,
    totalPrice: price,
    departure: formatTime(first.departure?.at),
    arrival:   formatTime(last.arrival?.at),
    duration,
    stops,
    from: fromCity,
    to:   toCity,
    date: first.departure?.at?.slice(0, 10),
    seats: Number(offer.numberOfBookableSeats) || null,
    eco: stops === 0,
    source: 'amadeus',
  };
}

/* Minimal carrier code → name & flag map. Expand as needed. */
const AIRLINE_NAMES = {
  EK: 'Emirates',          TK: 'Turkish Airlines',  FZ: 'Fly Dubai',
  QR: 'Qatar Airways',     SU: 'Aeroflot',          KC: 'Air Astana',
  HY: 'Uzbekistan Airways',PC: 'Pegasus Airlines',  G9: 'Air Arabia',
  BA: 'British Airways',   LH: 'Lufthansa',         SQ: 'Singapore Airlines',
  AF: 'Air France',        KL: 'KLM',               AC: 'Air Canada',
  AA: 'American Airlines', DL: 'Delta',             UA: 'United',
  EY: 'Etihad',            SV: 'Saudia',            MH: 'Malaysia Airlines',
  TG: 'Thai Airways',      JL: 'Japan Airlines',    NH: 'ANA',
  KE: 'Korean Air',        OZ: 'Asiana',            CZ: 'China Southern',
  CA: 'Air China',         MU: 'China Eastern',     CX: 'Cathay Pacific',
};
const AIRLINE_FLAGS = {
  EK: '🇦🇪', TK: '🇹🇷', FZ: '🇦🇪', QR: '🇶🇦', SU: '🇷🇺', KC: '🇰🇿',
  HY: '🇺🇿', PC: '🇹🇷', G9: '🇦🇪', BA: '🇬🇧', LH: '🇩🇪', SQ: '🇸🇬',
  AF: '🇫🇷', KL: '🇳🇱', AC: '🇨🇦', AA: '🇺🇸', DL: '🇺🇸', UA: '🇺🇸',
  EY: '🇦🇪', SV: '🇸🇦', MH: '🇲🇾', TG: '🇹🇭', JL: '🇯🇵', NH: '🇯🇵',
  KE: '🇰🇷', OZ: '🇰🇷', CZ: '🇨🇳', CA: '🇨🇳', MU: '🇨🇳', CX: '🇭🇰',
};

export default async function handler(req, res) {
  // basic CORS for safety in case it gets called from a preview deployment
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');

  try {
    const { from, to, date, adults = '1', cabin = 'ECONOMY' } = req.query || {};

    if (!from || !to) {
      res.status(400).json({ error: 'Missing `from` or `to`' });
      return;
    }

    const origin      = IATA(from);
    const destination = IATA(to);
    const depDate     = date || new Date(Date.now() + 14*86400000).toISOString().slice(0, 10);

    const token = await getToken();
    const params = new URLSearchParams({
      originLocationCode:      origin,
      destinationLocationCode: destination,
      departureDate:           depDate,
      adults:                  String(Math.max(1, Math.min(9, Number(adults) || 1))),
      currencyCode:            'USD',
      travelClass:             cabinNorm(cabin),
      max:                     '8',
    });

    const url = `${AMADEUS_BASE}/v2/shopping/flight-offers?${params.toString()}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

    if (!r.ok) {
      const text = await r.text().catch(() => '');
      res.status(r.status).json({ error: `Amadeus ${r.status}`, detail: text.slice(0, 320) });
      return;
    }

    const json = await r.json();
    const offers = Array.isArray(json.data) ? json.data : [];

    const flights = offers
      .map(o => normalize(o, from, to))
      .filter(Boolean)
      .sort((a, b) => a.price - b.price);

    res.status(200).json({
      flights,
      source: 'amadeus',
      count: flights.length,
      meta: { origin, destination, depDate, env: AMADEUS_BASE.includes('test') ? 'test' : 'production' },
    });
  } catch (err) {
    const msg = err.message || 'Unknown error';
    const status = msg === 'AMADEUS_NO_KEY' ? 501 : 500;
    res.status(status).json({ error: msg });
  }
}
