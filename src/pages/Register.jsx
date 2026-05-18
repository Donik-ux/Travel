import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useSEO from '../hooks/useSEO';
import { useTranslation } from '../store/useLangStore';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const register = useAuthStore(s => s.register);
  const navigate = useNavigate();

  useSEO({
    title: 'Create Account — Join MAFTRAVEL',
    description: 'Create your free MAFTRAVEL account and join over 1 million travelers.',
    keywords: ['create account', 'sign up', 'MAFTRAVEL register'],
  });

  const rules = [
    { label: t('register.rule1'), ok: form.password.length >= 8 },
    { label: t('register.rule2'), ok: /\d/.test(form.password) },
    { label: t('register.rule3'), ok: form.password === form.confirm && form.confirm.length > 0 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError(t('register.errMatch')); return; }
    if (form.password.length < 8) { setError(t('register.errShort')); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = register(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);
    if (result.success) navigate('/', { replace: true });
    else setError(result.error);
  };

  const inp = 'w-full bg-white border-[1.5px] border-[#e7e7e7] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#c9d1d9] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/10 transition-all';

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm page-fade">

        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-[#003580] flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-[#003580]">MAFTRAVEL</span>
        </div>

        <div className="bg-white border border-[#e7e7e7] rounded-2xl p-7 shadow-sm">
          <h1 className="text-2xl font-black text-[#1a1a1a] mb-1">{t('register.title')}</h1>
          <p className="text-[#9ca3af] text-sm mb-6">{t('register.sub')}</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] mb-1.5 block">{t('register.name')}</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9d1d9]" />
                <input type="text" required minLength={2} value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith"
                  className={`${inp} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] mb-1.5 block">{t('register.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9d1d9]" />
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
                  className={`${inp} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] mb-1.5 block">{t('register.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9d1d9]" />
                <input type={show ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 8 characters"
                  className={`${inp} pl-10 pr-10`}
                />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c9d1d9] hover:text-[#595959] transition-all">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] mb-1.5 block">{t('register.confirm')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9d1d9]" />
                <input type={show ? 'text' : 'password'} required value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat password"
                  className={`${inp} pl-10`}
                />
              </div>
            </div>

            {form.password.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {rules.map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${r.ok ? 'text-green-500' : 'text-[#e7e7e7]'}`} />
                    <span className={`text-xs ${r.ok ? 'text-green-700' : 'text-[#9ca3af]'}`}>{r.label}</span>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0071c2] text-white text-[14px] font-bold hover:bg-[#005fa3] transition-premium disabled:opacity-50 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('register.submitting')}</>
              ) : (
                <>{t('register.submit')}</>
              )}
            </button>
          </form>

          <p className="text-center text-[#9ca3af] text-sm mt-5">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="text-[#0071c2] hover:text-[#003580] font-bold transition-all">{t('register.signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
