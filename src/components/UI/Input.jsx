import React from 'react';
import { cn } from '../../utils/cn';

const Input = ({ label, icon: Icon, className, wrapperClassName, ...props }) => {
  return (
    <div className={cn('flex flex-col gap-2.5', wrapperClassName)}>
      {label && (
        <label className="text-[10px] uppercase font-black tracking-[0.18em] text-white/35 flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3 text-white/30" />}
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-3.5 outline-none',
          'text-white font-medium text-sm placeholder:text-white/20',
          'focus:border-white/30 focus:bg-white/[0.08] focus:ring-1 focus:ring-white/10 transition-premium',
          className
        )}
        {...props}
      />
    </div>
  );
};

export default Input;
