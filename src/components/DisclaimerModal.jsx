import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';

const DISCLAIMER_KEY = 'imaf_disclaimer_accepted';

export default function DisclaimerModal() {
  const [visible, setVisible] = useState(false);
  const [read, setRead] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(DISCLAIMER_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(DISCLAIMER_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#003580] px-7 py-5 flex items-center gap-3">
          <Shield className="w-6 h-6 text-yellow-300 shrink-0" />
          <div>
            <h2 className="text-white font-black text-[17px] leading-tight">MAFTRAVEL</h2>
            <p className="text-white/60 text-[11px] uppercase tracking-widest font-bold">Пользовательское соглашение</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6 max-h-[60vh] overflow-y-auto">
          <div className="flex items-start gap-3 mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[13px] font-bold text-amber-800">
              Пожалуйста, внимательно прочитайте перед использованием сервиса
            </p>
          </div>

          <div className="space-y-4 text-[13px] text-[#595959] leading-relaxed">
            <p>
              <strong className="text-[#1a1a1a]">1. Ограничение ответственности за бюджет.</strong>{' '}
              Все расчёты бюджета, предоставляемые платформой MAFTRAVEL, носят <em>исключительно ориентировочный и информационный</em> характер. Мы не гарантируем, что ваши реальные расходы совпадут с расчётными. Цены на авиабилеты, отели, питание и развлечения могут изменяться в любое время без предупреждения.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">2. Отсутствие финансовых гарантий.</strong>{' '}
              MAFTRAVEL и её сотрудники не несут ответственности за любые финансовые убытки, перерасход бюджета, незапланированные траты или иные денежные потери, возникшие в результате использования предоставленных расчётов.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">3. Визовые требования.</strong>{' '}
              Информация о визах носит справочный характер. Мы настоятельно рекомендуем самостоятельно уточнять актуальные визовые требования в посольстве или консульстве страны назначения. MAFTRAVEL не несёт ответственности за отказ в выдаче визы или въезде.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">4. Изменение условий.</strong>{' '}
              Все маршруты, цены и рекомендации формируются автоматически на основе ИИ и открытых источников данных. Сервис не является турагентством и не осуществляет продажу туристических услуг напрямую.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">5. Авторские права.</strong>{' '}
              Все материалы сайта (тексты, дизайн, программный код) защищены авторским правом © 2025 MAFTRAVEL. Копирование без разрешения запрещено.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">6. Использование сервиса.</strong>{' '}
              Нажимая кнопку «Продолжить», вы подтверждаете, что прочитали, поняли и согласны со всеми условиями данного соглашения. Вы также подтверждаете, что не будете предъявлять претензий к MAFTRAVEL в связи с несовпадением реальных расходов с расчётными.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-[#f0f0f0] bg-[#f8f9fa]">
          <label className="flex items-start gap-3 cursor-pointer mb-5 select-none">
            <div
              onClick={() => setRead(v => !v)}
              className={`w-5 h-5 rounded shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all cursor-pointer ${
                read ? 'bg-[#003580] border-[#003580]' : 'border-[#c9d1d9] bg-white'
              }`}
            >
              {read && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-[13px] text-[#595959] leading-snug">
              Я прочитал(а) все условия соглашения и принимаю их в полном объёме
            </span>
          </label>

          <button
            onClick={handleAccept}
            disabled={!read}
            className={`w-full py-3.5 rounded-2xl font-black text-[14px] uppercase tracking-wider transition-all ${
              read
                ? 'bg-[#003580] text-white hover:bg-[#002060] active:scale-95'
                : 'bg-[#e7e7e7] text-[#9ca3af] cursor-not-allowed'
            }`}
          >
            Продолжить
          </button>

          <p className="text-center text-[11px] text-[#9ca3af] mt-3">
            Продолжая использование сайта, вы соглашаетесь с нашими критериями
          </p>
        </div>
      </div>
    </div>
  );
}
