import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ children, className, hover = true, padding = 'md', glow = false, ...props }) => {
  const paddings = { sm: 'p-5', md: 'p-6', lg: 'p-8', xl: 'p-10' };

  return (
    <div
      className={cn(
        'relative bg-[#111111] border border-white/[0.07] rounded-2xl',
        'shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
        hover && 'card-hover cursor-default',
        glow && 'card-glow',
        paddings[padding],
        className
        
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
// Additional code was removed here as it was a redundant copy of the above component with syntax errors.