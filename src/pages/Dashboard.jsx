import React, { useMemo } from 'react';
import {
  LayoutDashboard, TrendingUp, DollarSign, PieChart,
  MapPin, Calendar, Clock, CreditCard, ChevronRight,
  Plane, Package, Hotel, Star, ArrowUpRight, Globe, Sparkles,
  Heart, Map
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useAdminStore from '../store/useAdminStore';
import useSEO from '../hooks/useSEO';
import { useTranslation } from '../store/useLangStore';

export default function Dashboard() {
  const user = useAuthStore(s => s.user);
  const { getBookingsByUser } = useAdminStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useSEO({
    title: 'User Dashboard — My Statistics',
    description: 'Track your travel spending, view upcoming trips, and manage your account in one place.',
  });

  const bookings = useMemo(() => getBookingsByUser(user?.id || ''), [user?.id, getBookingsByUser]);

  const stats = useMemo(() => {
    const totalSpent = bookings.filter(b => b.status === 'confirmed').reduce((acc, curr) => acc + (curr.total || 0), 0);
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const countries = new Set(bookings.map(b => b.itemName?.split('→')[1]?.trim() || b.itemName?.split(',')[1]?.trim())).size;

    return { totalSpent, pending, confirmed, countries };
  }, [bookings]);

  if (!user) return null;

  const quickActions = [
    { label: t('dashboard.searchFlights'), to: '/flights',       icon: Plane,     color: 'text-cyan-500'   },
    { label: t('dashboard.planTrip'),      to: '/planner',       icon: Globe,     color: 'text-purple-500' },
    { label: t('dashboard.berlinTrip'),    to: '/berlin-trip',   icon: Map,       color: 'text-blue-500'   },
    { label: t('dashboard.exoticTours'),   to: '/exotic-tours',  icon: Sparkles,  color: 'text-orange-500' },
    { label: t('nav.myBookings'),          to: '/my-bookings',   icon: Clock,     color: 'text-green-500'  },
    { label: 'Wishlist',                   to: '/wishlist',      icon: Heart,     color: 'text-red-500'    },
  ];

  const statCards = [
    { label: t('dashboard.totalSpent'),  value: `$${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'text-green-600',  bg: 'bg-green-50'  },
    { label: t('dashboard.confirmed'),   value: stats.confirmed,                          icon: Star,       color: 'text-amber-600',  bg: 'bg-amber-50'  },
    { label: t('dashboard.pending'),     value: stats.pending,                            icon: Clock,      color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { label: t('dashboard.countries'),   value: stats.countries || 0,                     icon: MapPin,     color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Header */}
      <div className="bg-[#003580] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-black border border-white/20 shadow-2xl">
                {user.avatar || user.name?.[0]}
              </div>
              <div>
                <h1 className="text-[28px] font-black tracking-tight leading-none mb-1">
                  {t('dashboard.welcome')}, {user.name}!
                </h1>
                <p className="text-white/60 text-sm font-medium">{t('dashboard.sub')}</p>
              </div>
            </div>
            <button onClick={() => navigate('/planner')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#003580] font-black text-[13px] hover:bg-white/90 transition-premium shadow-xl shadow-black/10">
              <Sparkles className="w-4 h-4" />
              {t('dashboard.planNew')} <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 pb-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white border border-[#eef2f6] rounded-2xl p-5 shadow-sm hover:translate-y-[-2px] transition-all page-fade" style={{animationDelay: `${i*100}ms`}}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] mb-1">{s.label}</p>
              <p className="text-2xl font-black text-[#1a1a1a]">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white border border-[#eef2f6] rounded-3xl p-6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-black text-[#1a1a1a]">{t('dashboard.recentBookings')}</h2>
                  <p className="text-[11px] text-[#9ca3af] font-bold uppercase tracking-widest">
                    {t('nav.myBookings')}
                  </p>
                </div>
                <button onClick={() => navigate('/my-bookings')} className="text-sm font-bold text-[#0071c2] hover:underline flex items-center gap-1">
                  {t('bookings.view')} <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="py-12 text-center">
                  <PieChart className="w-12 h-12 text-[#eef2f6] mx-auto mb-4" />
                  <p className="text-[#9ca3af] text-sm font-bold">{t('dashboard.noBookings')}</p>
                  <p className="text-[#c9d1d9] text-xs mt-1">{t('dashboard.noBookingsSub')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((b, i) => (
                    <div key={b.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-[#f8f9fa] border border-[#eef2f6] hover:bg-white hover:border-[#0071c2]/20 transition-all cursor-pointer"
                      onClick={() => navigate('/my-bookings')}>
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#eef2f6] flex items-center justify-center shrink-0">
                        {b.type === 'flight' ? <Plane className="w-6 h-6 text-[#0071c2]" /> :
                         b.type === 'package' ? <Package className="w-6 h-6 text-purple-600" /> :
                         <Hotel className="w-6 h-6 text-amber-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-[#1a1a1a] truncate mb-0.5">{b.itemName}</p>
                        <div className="flex items-center gap-3 text-[11px] text-[#9ca3af] font-bold uppercase">
                          <span>{b.type}</span>
                          <span>•</span>
                          <span>{new Date(b.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[15px] font-black text-[#1a1a1a] mb-0.5">${b.total?.toLocaleString()}</p>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {t(`bookings.status.${b.status}`) || b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Travel Insight */}
            <div className="bg-[#003580] rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl">
              <div className="relative z-10 max-w-sm">
                <h3 className="text-2xl font-black leading-tight mb-4 tracking-tighter">
                  {t('dashboard.planNew')} 💡
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6 font-medium">
                  {stats.confirmed > 2
                    ? "You're becoming a pro traveler! You visited more places than 85% of other members this year."
                    : "Ready for the next adventure? Our AI can help you plan your next trip based on your favorite styles."}
                </p>
                <button onClick={() => navigate('/planner')}
                  className="px-6 py-3 rounded-xl bg-white text-[#003580] font-black text-[13px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                  {t('dashboard.planNew')} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <Globe className="w-64 h-64" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-[#eef2f6] rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-[#1a1a1a] mb-5 uppercase tracking-widest">
                {t('dashboard.quickActions')}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {quickActions.map((item, i) => (
                  <button key={i} onClick={() => navigate(item.to)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#f8f9fa] border border-transparent hover:bg-white hover:border-[#eef2f6] hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm font-bold text-[#595959] group-hover:text-[#1a1a1a]">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#c9d1d9] group-hover:text-[#1a1a1a]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-200" />
              </div>
              <h3 className="text-lg font-black mb-2">Travel Rewards</h3>
              <p className="text-white/70 text-xs leading-relaxed mb-6">
                Earn points on every booking and unlock exclusive member-only discounts.
              </p>
              <div className="h-1.5 w-full bg-white/10 rounded-full mb-2">
                <div className="h-full w-[45%] bg-white rounded-full"></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/50">
                <span>Silver Member</span>
                <span>450 / 1000 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
