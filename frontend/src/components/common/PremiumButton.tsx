import React from 'react';
import { motion } from 'motion/react';

interface PremiumButtonProps {
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  id,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  disabled = false,
  type = 'button',
  title,
}) => {
  // Size styles following the 2x horizontal-to-vertical padding math
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs min-h-[38px] gap-2 rounded-lg',
    md: 'px-6 py-3 text-sm min-h-[46px] gap-2.5 rounded-xl font-bold',
    lg: 'px-8 py-4 text-base min-h-[54px] gap-3 rounded-xl font-extrabold tracking-wide',
  }[size];

  // Visual variants with refined palettes: Deep navy, emerald/teal, and warm amber
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] text-white border border-amber-400/40 shadow-[0_4px_20px_-4px_rgba(11,37,69,0.4)] hover:shadow-[0_6px_25px_-4px_rgba(217,119,6,0.35)] hover:border-amber-300',
    gold:
      'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 border border-amber-300 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.45)] hover:shadow-[0_6px_25px_-4px_rgba(245,158,11,0.6)] font-black',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-slate-400 shadow-xs hover:shadow-sm',
    outline:
      'bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white/60 backdrop-blur-xs',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-transparent',
  }[variant];

  return (
    <motion.button
      id={id}
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.015, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.985, y: 0 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`relative inline-flex items-center justify-center overflow-hidden cursor-pointer select-none transition-colors duration-200 group ${sizeStyles} ${variantStyles} ${
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
    >
      {/* Moving Sheen / Light Reflection Effect for Primary and Gold buttons */}
      {(variant === 'primary' || variant === 'gold') && !disabled && (
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Subtle top inner highlight border */}
      <span
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Icon (Left) */}
      {icon && iconPosition === 'left' && (
        <span className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">
          {icon}
        </span>
      )}

      {/* Text Label */}
      <span className="relative z-10 whitespace-nowrap">{children}</span>

      {/* Icon (Right) */}
      {icon && iconPosition === 'right' && (
        <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </motion.button>
  );
};
