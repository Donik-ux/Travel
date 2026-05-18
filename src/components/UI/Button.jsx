import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl font-black uppercase tracking-widest transition-premium active:scale-95 disabled:opacity-30 disabled:pointer-events-none select-none cursor-pointer';

  const variants = {
    primary:
      'bg-white text-[#0A0A0A] hover:bg-white/90 hover:scale-[1.03] shadow-[0_0_24px_rgba(255,255,255,0.12)]',
    outline:
      'bg-transparent text-white border border-white/[0.14] hover:border-white/40 hover:bg-white/[0.06] hover:scale-[1.03]',
    soft:
      'bg-white/[0.07] text-white border border-white/[0.06] hover:bg-white/[0.12] hover:scale-[1.03]',
    ghost:
      'bg-transparent text-white/45 hover:bg-white/[0.06] hover:text-white hover:scale-[1.02]',
    dark:
      'bg-[#111111] text-white border border-white/[0.08] hover:border-white/20 hover:bg-[#171717] hover:scale-[1.03]',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-7 py-3.5 text-[11px]',
    lg: 'px-10 py-4 text-[11px]',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
