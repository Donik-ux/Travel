import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, CreditCard, Phone, Calendar, Globe, Save, CheckCircle,
  Shield, BookOpen, ArrowLeft, Edit2, Trash2
} from 'lucide-react';
import useAuthStore  from '../store/useAuthStore';
import useAdminStore from '../store/useAdminStore';
import { detectPassportCountry } from '../services/passportService';
import { useTranslation } from '../store/useLangStore';

export default function Profile() {
  const { t } = useTranslation();
  const user        = useAuthStore(s => s.user);
  const getProfile  = useAuthStore(s => s.getProfile);
  const saveProfile = useAuthStore(s => s.saveProfile);
  const getBookingsByUser = useAdminStore(s => s.getBookingsByUser);
  const navigate    = useNavigate();

  const saved = getProfile() || {};
  const [form, setForm] = useState({
    firstName:      saved.firstName   || user?.name?.split(' ')[0] || '',
    lastName:       saved.lastName    || user?.name?.split(' ').slice(1).join(' ') || '',
    phone:          saved.phone       || '',
    dob:            saved.dob         || '',
    nationality:    saved.nationality || '',
    passportNumber: saved.passportNumber || '',
    passportExpiry: saved.passportExpiry || '',
    address:        saved.address     || '',
  });
  const [saved2, setSaved2]   = useState(false);
  const [editing, setEditing] = useState(false);

  const passCountry = detectPassportCountry(form.passportNumber);
  const bookings    = getBookingsByUser(user?.id || '');

  const handleSave = () => {
    saveProfile(form);
    setSaved2(true);
    setEditing(false);
    setTimeout(() => setSaved2(false), 3000);
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 md:px-12 page-fade">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-premium">
          <ArrowLeft className="w-4 h-4" /> {t('profilePage.back')}
        </button>

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003580] to-[#0071c2] flex items-center justify-center text-2xl font-black text-[#febb02] border border-white/[0.08] shadow-float">
              {user?.avatar || user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{user?.name}</h1>
              <p className="text-white/40 text-sm">{user?.email}</p>
            </div>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/60 text-[11px] font-black uppercase tracking-widest hover:bg-white/[0.04] hover:text-white transition-premium">
              <Edit2 className="w-4 h-4" /> {t('profilePage.editProfile')}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/40 text-[11px] font-black uppercase tracking-widest hover:bg-white/[0.04] transition-premium">
                {t('profilePage.cancel')}
              </button>
              <button onClick={handleSave}
                className="btn-gold flex items-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-widest">
                <Save className="w-4 h-4" /> {t('profilePage.save')}
              </button>
            </div>
          )}
        </div>

        {saved2 && (
          <div className="flex items-center gap-3 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3 mb-6">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-green-400 text-sm font-bold">{t('profilePage.savedOk')}</p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Personal Info */}
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-premium shadow-float">
            <h2 className="text-sm font-black uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-[#febb02]" /> {t('profilePage.personalInfo')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { k: 'firstName', l: t('profilePage.firstName'),   type: 'text', ph: t('profilePage.phFirst'),       icon: User     },
                { k: 'lastName',  l: t('profilePage.lastName'),    type: 'text', ph: t('profilePage.phLast'),        icon: User     },
                { k: 'phone',     l: t('profilePage.phone'),       type: 'tel',  ph: t('profilePage.phPhone'),       icon: Phone    },
                { k: 'dob',       l: t('profilePage.dob'),         type: 'date', ph: '',                          icon: Calendar },
                { k: 'nationality', l: t('profilePage.nationality'), type: 'text', ph: t('profilePage.phNationality'), icon: Globe    },
                { k: 'address',   l: t('profilePage.address'),     type: 'text', ph: t('profilePage.phAddress'),     icon: Globe    },
              ].map(field => (
                <div key={field.k}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5 block flex items-center gap-1">
                    {field.l}
                  </label>
                  {editing ? (
                    <input type={field.type} placeholder={field.ph} value={form[field.k]}
                      onChange={e => f(field.k, e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-premium"
                    />
                  ) : (
                    <p className="text-sm text-white/70 py-3">{form[field.k] || <span className="text-white/20">{t('profilePage.notSet')}</span>}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Passport / Travel Document */}
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-premium shadow-float">
            <h2 className="text-sm font-black uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#febb02]" /> {t('profilePage.passportSection')}
            </h2>
            <p className="text-white/30 text-xs mb-5">
              {t('profilePage.passportHint')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5 block">{t('profilePage.passportNumber')}</label>
                {editing ? (
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input type="text" placeholder={t('profilePage.passportNumberPlaceholder')} value={form.passportNumber}
                      onChange={e => f('passportNumber', e.target.value.toUpperCase())}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-premium uppercase"
                    />
                  </div>
                ) : (
                  <p className="text-sm font-mono text-white/70 py-3">{form.passportNumber || <span className="text-white/20">{t('profilePage.notSaved')}</span>}</p>
                )}
                {passCountry && form.passportNumber && (
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {passCountry.flag} {passCountry.country} {t('profilePage.formatVerified')}
                  </p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5 block">{t('profilePage.passportExpiry')}</label>
                {editing ? (
                  <input type="date" value={form.passportExpiry} onChange={e => f('passportExpiry', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-premium"
                  />
                ) : (
                  <p className="text-sm text-white/70 py-3">
                    {form.passportExpiry ? new Date(form.passportExpiry).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : <span className="text-white/20">{t('profilePage.notSaved')}</span>}
                  </p>
                )}
              </div>
            </div>

            {!editing && !form.passportNumber && (
              <button onClick={() => setEditing(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/[0.1] text-white/30 text-[11px] font-bold hover:border-white/20 hover:text-white/50 transition-premium">
                <CreditCard className="w-4 h-4" /> {t('profilePage.addPassport')}
              </button>
            )}
          </div>

          {/* Booking History */}
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-premium shadow-float">
            <h2 className="text-sm font-black uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#febb02]" /> {t('profilePage.recentBookings')}
            </h2>
            {bookings.length === 0 ? (
              <p className="text-white/25 text-sm text-center py-6">{t('profilePage.noBookings')}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {[...bookings].slice(0, 5).map(b => (
                  <div key={b.id} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                    <div>
                      <p className="text-sm font-bold text-white">{b.itemName}</p>
                      <p className="text-xs text-white/35">{b.date ? new Date(b.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white">${b.total?.toLocaleString()}</p>
                      <span className={`text-[10px] font-black ${b.status === 'confirmed' ? 'text-green-400' : b.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
                {bookings.length > 5 && (
                  <button onClick={() => navigate('/my-bookings')} className="text-center text-white/35 text-xs py-2 hover:text-white transition-premium">
                    {t('profilePage.viewAll')} {bookings.length} {t('profilePage.bookingsWord')} →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
