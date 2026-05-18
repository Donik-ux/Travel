import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, Eye, EyeOff, AlertCircle, UserCheck } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useSEO from '../hooks/useSEO';
import { useTranslation } from '../store/useLangStore';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useSEO({
    title: 'Sign In — Your Travel Account',
    description: 'Sign in to your MAFTRAVEL account to manage bookings, save itineraries, and access exclusive travel deals.',
    keywords: ['MAFTRAVEL login', 'travel account', 'sign in'],
  });

  const login      = useAuthStore(s => s.login);
  const guestLogin = useAuthStore(s => s.guestLogin);
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate(from, { replace: true });
    else setError(result.error);
  };

  const handleGuest = () => {
    guestLogin();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm page-fade">

        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-[#003580] flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-[#003580]">MAFTRAVEL</span>
        </div>

        <div className="bg-white border border-[#e7e7e7] rounded-2xl p-7 shadow-sm">
          <h1 className="text-2xl font-black text-[#1a1a1a] mb-1">{t('login.title')}</h1>
          <p className="text-[#9ca3af] text-sm mb-6">{t('login.sub')}</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] mb-1.5 block">
                {t('login.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9d1d9]" />
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-white border-[1.5px] border-[#e7e7e7] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#c9d1d9] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] mb-1.5 block">
                {t('login.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9d1d9]" />
                <input type={show ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-white border-[1.5px] border-[#e7e7e7] rounded-xl pl-10 pr-10 py-3 text-sm text-[#1a1a1a] placeholder:text-[#c9d1d9] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/10 transition-all"
                />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c9d1d9] hover:text-[#595959] transition-all">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0071c2] text-white text-[14px] font-bold hover:bg-[#005fa3] transition-premium disabled:opacity-50 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('login.submitting')}</>
              ) : (
                <>{t('login.submit')}</>
              )}
            </button>
          </form>

          <p className="text-center text-[#9ca3af] text-sm mt-5">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-[#0071c2] hover:text-[#003580] font-bold transition-all">{t('login.create')}</Link>
          </p>

          <button type="button" onClick={handleGuest}
            className="w-full mt-3 py-3 rounded-xl border border-[#e7e7e7] bg-white text-[#1a1a1a] text-[14px] font-bold hover:bg-[#f3f3f3] transition-premium flex items-center justify-center gap-2">
            <UserCheck className="w-4 h-4 text-[#0071c2]" />
            {t('login.guest')}
          </button>
        </div>

        <div className="mt-4 p-3 bg-white border border-[#e7e7e7] rounded-xl text-center">
          <p className="text-[#c9d1d9] text-xs">
            Admin: <span className="text-[#9ca3af]">admin@maftravel.com</span> / <span className="text-[#9ca3af]">Admin@2026</span>
          </p>
        </div>
      </div>
    </div>
  );
}
