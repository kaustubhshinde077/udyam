import React from 'react';

interface ArthLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSubtitle?: boolean;
  subtitleText?: string;
  variant?: 'light' | 'dark' | 'gold' | 'full';
  showPillars?: boolean;
  animated?: boolean;
  className?: string;
}

export const ArthLogo: React.FC<ArthLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitleText = 'Assistant for Microentrepreneurs',
  variant = 'light',
  showPillars = false,
  className = '',
}) => {
  // Dimensions
  const dimensions = {
    sm: { box: 36, titleText: 'text-base', subText: 'text-[10px]' },
    md: { box: 48, titleText: 'text-xl', subText: 'text-xs' },
    lg: { box: 60, titleText: 'text-2xl', subText: 'text-xs' },
    xl: { box: 76, titleText: 'text-3xl', subText: 'text-sm' },
    hero: { box: 96, titleText: 'text-4xl sm:text-5xl', subText: 'text-sm sm:text-base' },
  }[size];

  const isDark = variant === 'dark' || variant === 'gold';
  const isGold = variant === 'gold';

  const titleColor = isDark ? 'text-white' : 'text-slate-900';
  const subColor = isDark ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="inline-flex items-center gap-3">
        {/* ARTH AI Emblem: Ascending Mountain 'A', Rising Sun, Vibrant Leaf, Community Landscape */}
        <div
          className={`relative shrink-0 flex items-center justify-center rounded-2xl p-1 transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-br from-[#061e38] to-[#020e1c] border border-amber-400/40 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
              : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 shadow-md shadow-slate-200/50'
          }`}
          style={{ width: dimensions.box, height: dimensions.box }}
        >
          <img
            src="/arth_emblem.jpg"
            alt="ARTH AI Emblem"
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              // Fallback to SVG if image fails to load
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full hidden"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="ARTH AI Emblem"
          >
            <defs>
              {/* Cyan to Deep Emerald Slope Gradient */}
              <linearGradient id="arth-slope-grad" x1="15" y1="85" x2="52" y2="15" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="45%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Sun & Arch Radiant Gold Gradient */}
              <linearGradient id="arth-sun-grad" x1="60" y1="15" x2="85" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>

              {/* Leaf Vibrant Green Gradient */}
              <linearGradient id="arth-leaf-grad" x1="50" y1="15" x2="90" y2="45" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>

              {/* Base Horizon Ribbon */}
              <linearGradient id="arth-base-ribbon" x1="10" y1="85" x2="90" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Background Horizon Luster */}
              <radialGradient id="arth-inner-glow" cx="50" cy="45" r="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={isDark ? '#0e3a5a' : '#f0fdf4'} stopOpacity="0.9" />
                <stop offset="100%" stopColor={isDark ? '#041628' : '#e0f2fe'} stopOpacity="0.4" />
              </radialGradient>
            </defs>

            {/* Inner Circular Ground Reality Disc */}
            <circle cx="50" cy="50" r="44" fill="url(#arth-inner-glow)" />

            {/* Rising Golden Sun (Top Right) */}
            <circle cx="68" cy="30" r="14" fill="url(#arth-sun-grad)" />
            {/* Sun Rays */}
            <g stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.75">
              <line x1="68" y1="11" x2="68" y2="7" />
              <line x1="82" y1="18" x2="85" y2="15" />
              <line x1="87" y1="30" x2="91" y2="30" />
              <line x1="82" y1="42" x2="85" y2="45" />
            </g>

            {/* Inside Landscape - Crop Furrows (Agriculture/Dairy) */}
            <g opacity="0.85">
              <path d="M22 75 Q32 68 42 75" stroke="#10b981" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M24 79 Q32 73 40 79" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M26 83 Q32 78 38 83" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Inside Landscape - Local Shop with Awning (Retail & Stores) */}
            <g transform="translate(42, 60)">
              {/* Storefront Box */}
              <rect x="0" y="8" width="16" height="15" rx="1.5" fill={isDark ? '#1e293b' : '#ffffff'} stroke="#0284c7" strokeWidth="1.2" />
              {/* Awning stripes */}
              <path d="M-1 8 L17 8 L15 3 L1 3 Z" fill="#0284c7" />
              <line x1="3" y1="3" x2="3" y2="8" stroke="#ffffff" strokeWidth="1.2" />
              <line x1="8" y1="3" x2="8" y2="8" stroke="#ffffff" strokeWidth="1.2" />
              <line x1="13" y1="3" x2="13" y2="8" stroke="#ffffff" strokeWidth="1.2" />
              {/* Door & Display Window */}
              <rect x="2" y="11" width="5" height="12" fill="#0284c7" opacity="0.8" />
              <rect x="9" y="11" width="5" height="7" fill="#38bdf8" opacity="0.9" />
            </g>

            {/* Inside Landscape - Workshop / Production Unit & Town Tree (Micro-Manufacturing & Services) */}
            <g transform="translate(62, 62)">
              {/* Small Workshop with pitched roof */}
              <path d="M0 10 L6 5 L12 10 L12 21 L0 21 Z" fill={isDark ? '#0f172a' : '#f8fafc'} stroke="#0284c7" strokeWidth="1.2" />
              {/* Workshop Chimney */}
              <rect x="8" y="2" width="2.5" height="6" fill="#0284c7" />
              {/* Community Green Tree */}
              <circle cx="17" cy="9" r="5" fill="#10b981" />
              <rect x="16" y="14" width="2" height="7" fill="#78350f" />
            </g>

            {/* Microentrepreneurs Silhouette Standing Together */}
            <g fill={isDark ? '#e2e8f0' : '#0f172a'} opacity="0.9" transform="translate(33, 67)">
              <circle cx="5" cy="2" r="2.2" />
              <path d="M2 7 C2 4.5 8 4.5 8 7 L8 14 L2 14 Z" />
              <circle cx="12" cy="3" r="2" />
              <path d="M9 7.5 C9 5.5 15 5.5 15 7.5 L15 14 L9 14 Z" />
            </g>

            {/* Left Mountain 'A' Apex Curve (Ascending Path) */}
            <path
              d="M16 85 C22 75 35 40 48 18 C51 14 55 14 57 18 C61 24 64 34 66 44"
              stroke="url(#arth-slope-grad)"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Right Sprouting Leaf (Prosperity & Growth) */}
            <path
              d="M54 22 C64 16 82 18 86 32 C78 42 62 38 54 22 Z"
              fill="url(#arth-leaf-grad)"
              stroke="#15803d"
              strokeWidth="1.2"
            />
            {/* Leaf Central Vein */}
            <path d="M56 24 Q68 26 82 30" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round" />

            {/* Golden Base Horizon Ribbon */}
            <path
              d="M12 85 Q50 82 88 85"
              stroke="url(#arth-base-ribbon)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Brand Typography */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            {/* ARTH with stylized golden triangle in 'A' */}
            <span className={`font-black tracking-tight ${dimensions.titleText} ${titleColor}`}>
              ARTH
            </span>
            {/* AI in Metallic Golden Amber Gradient */}
            <span className="font-black tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 text-[0.8em] px-2 py-0.5 rounded-lg shadow-sm border border-amber-300/40">
              AI
            </span>
          </div>

          {showSubtitle && (
            <p className={`font-semibold tracking-normal mt-1 leading-none ${dimensions.subText} ${subColor}`}>
              {subtitleText}
            </p>
          )}
        </div>
      </div>

      {/* Optional Inclusive Microentrepreneur 5-Pillar Badges */}
      {(showPillars || variant === 'full') && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60">
            🌱 Farmers
          </span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60">
            🏪 Local Shops
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60">
            🏭 Micro Manufacturers
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/60">
            👥 Service Providers
          </span>
          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60">
            💡 Aspiring Entrepreneurs
          </span>
        </div>
      )}
    </div>
  );
};

