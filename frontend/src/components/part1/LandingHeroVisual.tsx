import React from 'react';
import { TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  className?: string;
}

export const LandingHeroVisual: React.FC<Props> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50/70 via-slate-50 to-amber-50/50 dark:from-[#091524] dark:via-[#0c1c30] dark:to-[#0f253e] border border-slate-200/80 dark:border-slate-800 shadow-xl ${className}`}
    >
      {/* Top Banner Accent: Slogan & Hand-drawn arrow */}
      <div className="pt-5 px-6 sm:px-8 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-emerald-800 dark:text-emerald-300 font-bold text-sm sm:text-base tracking-wide">
            Stronger Businesses, Stronger Communities
          </span>
          {/* Curved Hand-drawn SVG Arrow */}
          <svg
            className="w-8 h-6 text-emerald-600 dark:text-emerald-400 hidden sm:inline-block rotate-6"
            viewBox="0 0 40 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M 4,6 Q 20,2 32,16" />
            <path d="M 24,17 L 34,17 L 33,8" />
          </svg>
        </div>

        {/* Circular Growth Partner Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 shadow-xs">
          <div className="w-5 h-5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
            ↻
          </div>
          <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 whitespace-nowrap">
            Your Growth Partner
          </span>
        </div>
      </div>

      {/* Main Illustration Stage: Farmer & Woman Microentrepreneur with Agricultural Backdrop */}
      <div className="relative w-full h-[330px] sm:h-[400px] flex items-end justify-center overflow-hidden select-none">
        {/* Real Digital Artwork of Indian Farmer & Woman Entrepreneur */}
        <img
          src="/assets/images/arth_hero_people_1789895991589.jpg"
          alt="Indian Farmer and Microentrepreneur"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // Hide image if missing and show SVG fallback
            (e.currentTarget as HTMLElement).style.display = 'none';
            const fallback = document.getElementById('hero-svg-fallback');
            if (fallback) fallback.style.display = 'block';
          }}
        />

        {/* Fallback Vector Illustration (if image is blocked or loading) */}
        <div id="hero-svg-fallback" style={{ display: 'none' }} className="w-full h-full relative">
        {/* Background Landscape: Rolling green hills, distant sunrise warmth, crops */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 600 400"
          fill="none"
        >
          <defs>
            {/* Sky gradient */}
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#fef3c7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ecfdf5" stopOpacity="0.9" />
            </linearGradient>

            {/* Hill gradient */}
            <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect width="600" height="400" fill="url(#skyGrad)" className="dark:opacity-20" />

          {/* Distant soft sun aura */}
          <circle cx="300" cy="180" r="140" fill="#fef08a" opacity="0.35" />

          {/* Distant green hills */}
          <path
            d="M 0,260 Q 150,210 320,240 T 600,220 L 600,400 L 0,400 Z"
            fill="url(#hillGrad2)"
            opacity="0.5"
          />
          <path
            d="M 0,285 Q 220,240 400,270 T 600,260 L 600,400 L 0,400 Z"
            fill="url(#hillGrad1)"
            opacity="0.6"
          />

          {/* Contour crop lines on ground */}
          <path
            d="M 50,330 Q 300,310 550,330"
            stroke="#047857"
            strokeWidth="2"
            strokeDasharray="6 8"
            opacity="0.4"
          />
          <path
            d="M 0,365 Q 300,345 600,365"
            stroke="#047857"
            strokeWidth="2.5"
            strokeDasharray="8 10"
            opacity="0.4"
          />
        </svg>

        {/* Character Visuals: Indian Farmer (Left) & Woman Entrepreneur (Right) */}
        <div className="relative z-10 w-full max-w-[500px] h-[310px] sm:h-[350px] flex items-end justify-center">
          <svg
            className="w-full h-full max-h-[350px]"
            viewBox="0 0 540 380"
            fill="none"
            preserveAspectRatio="xMidYBottom meet"
          >
            {/* Soft shadow under characters */}
            <ellipse cx="270" cy="370" rx="200" ry="12" fill="#0f172a" opacity="0.18" />

            {/* ----------------- LEFT CHARACTER: INDIAN FARMER ----------------- */}
            <g id="farmer" transform="translate(45, 10)">
              {/* Torso / Kurti: Crisp traditional cotton kurta */}
              <path
                d="M 90,200 L 160,200 L 180,360 L 70,360 Z"
                fill="#F8FAFC"
                stroke="#CBD5E1"
                strokeWidth="2"
              />
              {/* Kurta Collar & Placket */}
              <path d="M 125,200 L 125,270" stroke="#94A3B8" strokeWidth="2.5" />
              <circle cx="125" cy="225" r="2.5" fill="#64748B" />
              <circle cx="125" cy="245" r="2.5" fill="#64748B" />

              {/* Nehru / Bandi Vest: Forest green tailored vest */}
              <path
                d="M 85,210 L 120,225 L 120,350 L 75,350 Z"
                fill="#15803D"
                stroke="#166534"
                strokeWidth="1.5"
              />
              <path
                d="M 165,210 L 130,225 L 130,350 L 175,350 Z"
                fill="#15803D"
                stroke="#166534"
                strokeWidth="1.5"
              />

              {/* Left Arm holding crop sheaf */}
              <path
                d="M 85,210 L 45,260 L 65,290 L 95,250"
                fill="#F8FAFC"
                stroke="#CBD5E1"
                strokeWidth="2"
              />
              {/* Right Arm resting warmly */}
              <path
                d="M 165,210 L 195,260 L 175,290 L 155,250"
                fill="#F8FAFC"
                stroke="#CBD5E1"
                strokeWidth="2"
              />

              {/* Neck */}
              <rect x="114" y="168" width="22" height="34" rx="4" fill="#E0A96D" />

              {/* Head & Face */}
              <ellipse cx="125" cy="148" rx="30" ry="34" fill="#E0A96D" />
              {/* Ears */}
              <ellipse cx="94" cy="148" rx="6" ry="10" fill="#D29A5C" />
              <ellipse cx="156" cy="148" rx="6" ry="10" fill="#D29A5C" />

              {/* Dignified Mustache */}
              <path
                d="M 108,154 Q 125,162 142,154 Q 125,148 108,154 Z"
                fill="#334155"
              />
              {/* Warm Smile under mustache */}
              <path
                d="M 116,164 Q 125,170 134,164"
                stroke="#B45309"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Eyes & Eyebrows (Warm, confident expression) */}
              <ellipse cx="112" cy="140" rx="3" ry="3" fill="#1E293B" />
              <ellipse cx="138" cy="140" rx="3" ry="3" fill="#1E293B" />
              <path d="M 106,134 Q 112,131 118,134" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 132,134 Q 138,131 144,134" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />

              {/* Traditional White / Cream Safa (Turban) with Gold Trim */}
              <path
                d="M 90,140 C 85,90 165,90 160,140 C 158,115 92,115 90,140 Z"
                fill="#FAF5FF"
                stroke="#E2E8F0"
                strokeWidth="2"
              />
              <path
                d="M 88,125 Q 125,95 162,125"
                fill="none"
                stroke="#EAB308"
                strokeWidth="4"
              />
              <path
                d="M 94,115 Q 125,82 156,115"
                fill="none"
                stroke="#F8FAFC"
                strokeWidth="8"
              />
              {/* Turban folds */}
              <path d="M 95,120 Q 125,108 155,122" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M 100,105 Q 125,92 150,108" stroke="#CBD5E1" strokeWidth="1.5" />

              {/* Sheaf of Golden Wheat in hand */}
              <g transform="translate(30, 220) rotate(-15)">
                <path d="M 20,70 Q 15,20 25,0" stroke="#CA8A04" strokeWidth="2.5" />
                <ellipse cx="25" cy="5" rx="5" ry="10" fill="#EAB308" />
                <ellipse cx="18" cy="15" rx="5" ry="10" fill="#FACC15" />
                <ellipse cx="30" cy="22" rx="5" ry="10" fill="#EAB308" />
                <ellipse cx="16" cy="32" rx="5" ry="10" fill="#FACC15" />
                <ellipse cx="28" cy="40" rx="5" ry="10" fill="#EAB308" />
              </g>
            </g>

            {/* ----------------- RIGHT CHARACTER: WOMAN MICROENTREPRENEUR ----------------- */}
            <g id="woman_entrepreneur" transform="translate(260, 15)">
              {/* Kurti: Warm Golden Mustard */}
              <path
                d="M 95,195 L 165,195 L 185,360 L 75,360 Z"
                fill="#D97706"
                stroke="#B45309"
                strokeWidth="1.5"
              />

              {/* Modern Business Apron: Emerald Green with ARTH badge pocket */}
              <path
                d="M 105,210 L 155,210 L 170,355 L 90,355 Z"
                fill="#047857"
                stroke="#065F46"
                strokeWidth="2"
              />
              {/* Apron Straps over shoulders */}
              <path d="M 108,210 L 100,195" stroke="#047857" strokeWidth="4" />
              <path d="M 152,210 L 160,195" stroke="#047857" strokeWidth="4" />

              {/* Measuring Tape / Yellow Ribbon around collar */}
              <path
                d="M 104,198 C 115,245 145,245 156,198"
                fill="none"
                stroke="#FACC15"
                strokeWidth="4"
                strokeDasharray="3 3"
              />

              {/* Apron Pocket with Pen & Small Note */}
              <rect x="112" y="270" width="36" height="32" rx="4" fill="#065F46" />
              <line x1="120" y1="262" x2="120" y2="274" stroke="#F1F5F9" strokeWidth="2" />
              <line x1="126" y1="260" x2="126" y2="274" stroke="#F59E0B" strokeWidth="2.5" />

              {/* Arms holding a Digital Tablet / Ledger */}
              <path
                d="M 95,200 L 75,250 L 105,280"
                fill="#E0A96D"
                stroke="#D29A5C"
                strokeWidth="1.5"
              />
              <path
                d="M 165,200 L 180,250 L 150,280"
                fill="#E0A96D"
                stroke="#D29A5C"
                strokeWidth="1.5"
              />
              {/* Tablet in Hands */}
              <rect
                x="98"
                y="250"
                width="64"
                height="44"
                rx="4"
                fill="#0F172A"
                stroke="#334155"
                strokeWidth="2"
                transform="rotate(-5, 130, 270)"
              />
              <rect
                x="102"
                y="254"
                width="56"
                height="36"
                rx="2"
                fill="#10B981"
                opacity="0.85"
                transform="rotate(-5, 130, 270)"
              />
              {/* Tablet screen line graphs */}
              <path
                d="M 106,275 L 118,268 L 132,272 L 148,262"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                transform="rotate(-5, 130, 270)"
              />

              {/* Neck & Gold Mangalsutra / Chain */}
              <rect x="120" y="165" width="20" height="32" rx="3" fill="#E0A96D" />
              <path
                d="M 122,176 Q 130,188 138,176"
                fill="none"
                stroke="#EAB308"
                strokeWidth="1.5"
              />

              {/* Face & Head */}
              <ellipse cx="130" cy="144" rx="27" ry="31" fill="#E0A96D" />
              {/* Ears with small gold studs */}
              <ellipse cx="102" cy="144" rx="5" ry="8" fill="#D29A5C" />
              <ellipse cx="158" cy="144" rx="5" ry="8" fill="#D29A5C" />
              <circle cx="102" cy="146" r="2" fill="#EAB308" />
              <circle cx="158" cy="146" r="2" fill="#EAB308" />

              {/* Traditional Red Bindi */}
              <circle cx="130" cy="132" r="2.5" fill="#DC2626" />

              {/* Eyes & Eyebrows (Inspiring, confident gaze) */}
              <ellipse cx="118" cy="138" rx="3.2" ry="2.8" fill="#0F172A" />
              <ellipse cx="142" cy="138" rx="3.2" ry="2.8" fill="#0F172A" />
              <path d="M 112,131 Q 118,127 124,131" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              <path d="M 136,131 Q 142,127 148,131" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

              {/* Bright, Warm Professional Smile */}
              <path
                d="M 121,154 Q 130,163 139,154"
                stroke="#B91C1C"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="#FFFFFF"
              />

              {/* Neat Hair Tied in Professional Low Bun with Jasmine Gajra Accent */}
              <path
                d="M 103,140 C 100,105 160,105 157,140 C 155,116 105,116 103,140 Z"
                fill="#1E293B"
              />
              {/* Hair strands */}
              <path d="M 106,122 Q 130,110 154,122" stroke="#0F172A" strokeWidth="2" />
              {/* Traditional White Gajra flowers at back of hair */}
              <circle cx="100" cy="130" r="4" fill="#FFFFFF" stroke="#E2E8F0" />
              <circle cx="98" cy="138" r="4" fill="#FFFFFF" stroke="#E2E8F0" />
              <circle cx="102" cy="146" r="3.5" fill="#FFFFFF" stroke="#E2E8F0" />
            </g>
          </svg>
        </div>
        </div>
      </div>

      {/* Floating Card: "From Ideas to Sustainable Growth" (Bottom Left Overlay) */}
      <div className="absolute bottom-4 left-4 sm:left-6 max-w-[280px] sm:max-w-[320px] bg-white/95 dark:bg-[#0c1a2e]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 dark:border-slate-700/80 shadow-lg z-30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
              From Ideas to Sustainable Growth
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Empowering local entrepreneurs with real data and practical tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
