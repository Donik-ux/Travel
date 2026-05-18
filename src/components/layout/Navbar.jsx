import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, ChevronDown, User, LogOut, BookOpen, ShieldCheck, CreditCard, Heart, Search, LayoutDashboard } from 'lucide-react';
import { useTranslation } from '../../store/useLangStore';
import useAuthStore  from '../../store/useAuthStore';
import useWishlistStore from '../../store/useWishlistStore';
import GlobalSearch from '../UI/GlobalSearch';
import { langNames } from '../../utils/translations';

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [langOpen,   setLangOpen]   = useState(false);
  const navigate                    = useNavigate();
  const { lang, setLang, t }        = useTranslation();
  const user    = useAuthStore(s => s.user);
  const logout  = useAuthStore(s => s.logout);
  const wishlistItems = useWishlistStore(s => s.items);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setUserOpen(false); setLangOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const links = [
    { to: '/',             label: t('nav.home')    },
    { to: '/flights',      label: t('nav.flights') },
    { to: '/hot-tours',    label: '🔥 Hot Tours'   },
    { to: '/exotic-tours', label: t('nav.exotic')  },
  ];

  const handleLogout = () => { logout(); navigate('/'); setUserOpen(false); };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-premium ${scrolled ? 'shadow-md' : 'shadow-sm border-b border-[#e7e7e7]'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[60px] flex items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#003580] flex items-center justify-center">
              <Compass className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            </div>
            <span className="text-[15px] font-black text-[#003580] tracking-tight hidden sm:block">MAFTRAVEL</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-[13px] font-semibold transition-premium ${isActive ? 'text-[#0071c2] bg-blue-50' : 'text-[#595959] hover:text-[#003580] hover:bg-gray-50'}`
                }
              >{label}</NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="mr-2">
              <GlobalSearch />
            </div>

            {/* Wishlist (Desktop) */}
            {user && (
              <button onClick={() => navigate('/wishlist')}
                className="relative p-2 rounded-lg text-[#595959] hover:bg-gray-100 transition-premium">
                <Heart className={`w-5 h-5 ${wishlistItems.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            )}
            {/* Language */}
            <div className="relative hidden md:block" data-dropdown>
              <button onClick={() => { setLangOpen(v => !v); setUserOpen(false); }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-[12px] font-bold text-[#595959] hover:bg-gray-100 transition-premium border border-[#e7e7e7]">
                {langNames[lang]}
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-24 bg-white border border-[#e7e7e7] rounded-xl shadow-lg overflow-hidden z-50 page-fade">
                  {Object.entries(langNames).map(([code, label]) => (
                    <button key={code} onClick={() => { setLang(code); setLangOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-[12px] font-bold transition-premium ${lang === code ? 'text-[#0071c2] bg-blue-50' : 'text-[#595959] hover:bg-gray-50'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {user ? (
              <div className="relative hidden md:block" data-dropdown>
                <button onClick={() => { setUserOpen(v => !v); setLangOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e7e7e7] hover:border-[#0071c2] hover:bg-blue-50 transition-premium">
                  <div className="w-6 h-6 rounded-full bg-[#003580] flex items-center justify-center text-[11px] font-black text-white">
                    {user.avatar}
                  </div>
                  <span className="text-[13px] font-semibold text-[#1a1a1a] max-w-28 truncate">{user.name}</span>
                  <ChevronDown className={`w-3 h-3 text-[#595959] transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#e7e7e7] rounded-xl shadow-lg overflow-hidden z-50 page-fade">
                    <div className="px-4 py-3 border-b border-[#f0f0f0]">
                      <p className="text-[13px] font-bold text-[#1a1a1a]">{user.name}</p>
                      <p className="text-[11px] text-[#9ca3af] truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <button onClick={() => { navigate('/admin'); setUserOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-purple-600 hover:bg-purple-50 border-b border-[#f0f0f0] transition-premium">
                        <ShieldCheck className="w-4 h-4" /> {t('nav.adminPanel')}
                      </button>
                    )}
                    <button onClick={() => { navigate('/dashboard'); setUserOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-[#0071c2] hover:bg-blue-50 border-b border-[#f0f0f0] transition-premium">
                      <LayoutDashboard className="w-4 h-4" /> My Dashboard
                    </button>
                    <button onClick={() => { navigate('/profile'); setUserOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-[#595959] hover:bg-gray-50 transition-premium">
                      <User className="w-4 h-4" /> {t('nav.myProfile')}
                    </button>
                    <button onClick={() => { navigate('/wishlist'); setUserOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-[#595959] hover:bg-gray-50 transition-premium">
                      <Heart className="w-4 h-4" /> My Wishlist
                    </button>
                    <button onClick={() => { navigate('/my-bookings'); setUserOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-[#595959] hover:bg-gray-50 transition-premium">
                      <BookOpen className="w-4 h-4" /> {t('nav.myBookings')}
                    </button>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-red-500 hover:bg-red-50 border-t border-[#f0f0f0] transition-premium">
                      <LogOut className="w-4 h-4" /> {t('nav.signOut')}
                    </button>

                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button onClick={() => navigate('/login')}
                  className="px-4 py-2 text-[13px] font-semibold text-[#0071c2] hover:bg-blue-50 rounded-lg transition-premium">
                  {t('nav.signIn')}
                </button>
                <button onClick={() => navigate('/register')}
                  className="px-4 py-2 text-[13px] font-bold text-white bg-[#0071c2] hover:bg-[#005fa3] rounded-lg transition-premium">
                  {t('nav.register')}
                </button>
              </div>
            )}

            {/* Mobile burger */}
            <button className="md:hidden p-2 rounded-lg border border-[#e7e7e7] hover:bg-gray-50 transition-premium"
              onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X className="w-5 h-5 text-[#595959]" /> : <Menu className="w-5 h-5 text-[#595959]" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[60px] z-40 bg-white flex flex-col px-4 pt-4 pb-8 gap-1 md:hidden overflow-y-auto page-fade">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `py-3.5 px-4 rounded-lg text-[14px] font-semibold border-b border-[#f0f0f0] transition-premium ${isActive ? 'text-[#0071c2] bg-blue-50' : 'text-[#1a1a1a]'}`
              }>{label}</NavLink>
          ))}
          {user && (
            <>
                <button onClick={() => { navigate('/profile'); setMobileOpen(false); }}
                className="py-3.5 px-4 rounded-lg text-[14px] font-semibold text-[#595959] border-b border-[#f0f0f0] text-left flex items-center gap-2">
                <User className="w-4 h-4" /> {t('nav.myProfile')}
              </button>
              <button onClick={() => { navigate('/my-bookings'); setMobileOpen(false); }}
                className="py-3.5 px-4 rounded-lg text-[14px] font-semibold text-[#595959] border-b border-[#f0f0f0] text-left flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> {t('nav.myBookings')}
              </button>
              {user.role === 'admin' && (
                <button onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                  className="py-3.5 px-4 rounded-lg text-[14px] font-semibold text-purple-600 border-b border-[#f0f0f0] text-left flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> {t('nav.adminPanel')}
                </button>
              )}

            </>
          )}
          <div className="mt-3 flex gap-2">
            {Object.entries(langNames).map(([code, label]) => (
              <button key={code} onClick={() => setLang(code)}
                className={`px-4 py-2 rounded-lg text-[12px] font-bold border transition-premium ${lang === code ? 'bg-[#003580] text-white border-[#003580]' : 'text-[#595959] border-[#e7e7e7]'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full py-3 rounded-lg border border-red-200 text-red-500 text-[13px] font-semibold flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" /> {t('nav.signOut')}
              </button>
            ) : (
              <>
                <button onClick={() => { navigate('/login'); setMobileOpen(false); }}
                  className="w-full py-3 rounded-lg border border-[#0071c2] text-[#0071c2] text-[13px] font-bold">
                  {t('nav.signIn')}
                </button>
                <button onClick={() => { navigate('/register'); setMobileOpen(false); }}
                  className="w-full py-3 rounded-lg bg-[#0071c2] text-white text-[13px] font-bold">
                  {t('nav.registerFree')}
                </button>
              </>

            )}
          </div>
        </div>
      )}
    </>
  );
}
