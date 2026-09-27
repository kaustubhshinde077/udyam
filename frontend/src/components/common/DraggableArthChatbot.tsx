import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

interface Props {
  onOpenChat: (initialPrompt?: string) => void;
  language?: string;
}

export const DraggableArthChatbot: React.FC<Props> = ({ onOpenChat, language = 'en' }) => {
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    moved: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Position safely inside viewport on mount & resize
  useEffect(() => {
    const initPos = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Default: top-right on desktop, lower-right on mobile
      const x = w > 768 ? w - 195 : w - 85;
      const y = w > 768 ? 88 : h - 140;
      setPos((prev) => prev || { x: Math.max(12, x), y: Math.max(12, y) });
    };

    initPos();

    const handleResize = () => {
      setPos((prev) => {
        if (!prev || typeof window === 'undefined') return prev;
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 80;
        return {
          x: Math.min(Math.max(12, prev.x), Math.max(12, maxX)),
          y: Math.min(Math.max(12, prev.y), Math.max(12, maxY)),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button[data-dismiss="true"]')) return;
    const currentX = pos?.x ?? (window.innerWidth - 195);
    const currentY = pos?.y ?? 88;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY,
      moved: false,
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.moved = true;
    }

    const newX = dragStartRef.current.initX + dx;
    const newY = dragStartRef.current.initY + dy;

    const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 180) - 10;
    const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 80) - 10;

    setPos({
      x: Math.min(Math.max(10, newX), Math.max(10, maxX)),
      y: Math.min(Math.max(10, newY), Math.max(10, maxY)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // If practically stationary, trigger open chat!
    if (!dragStartRef.current.moved) {
      onOpenChat();
    }
  };

  const stylePosition = pos
    ? { left: `${pos.x}px`, top: `${pos.y}px` }
    : { right: '1.25rem', top: '5.5rem' };

  return (
    <div
      ref={containerRef}
      style={stylePosition}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`fixed z-50 select-none flex items-center gap-2 cursor-grab active:cursor-grabbing transition-transform duration-75 ${
        isDragging ? 'scale-105' : ''
      }`}
    >
      {/* Speech Bubble: "Need help? ✨ I'm ARTH Ask me anytime!" */}
      {showSpeechBubble && (
        <div className="relative flex items-center animate-fade-in group">
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!dragStartRef.current.moved) onOpenChat();
            }}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl p-2.5 sm:p-3 max-w-[155px] sm:max-w-[175px] text-left relative cursor-pointer hover:border-amber-400 dark:hover:border-amber-400 transition-colors"
          >
            {/* Dismiss button */}
            <button
              type="button"
              data-dismiss="true"
              onClick={(e) => {
                e.stopPropagation();
                setShowSpeechBubble(false);
              }}
              className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] shadow-xs cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Close message"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white leading-tight">
              <span>Need help?</span>
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 leading-snug mt-0.5">
              I'm <span className="font-extrabold text-slate-900 dark:text-white">ARTH</span>
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
              Ask me anytime!
            </p>
          </div>

          {/* Bubble Arrow Tail pointing right towards avatar */}
          <div className="w-0 h-0 border-y-6 border-y-transparent border-l-6 border-l-white dark:border-l-slate-900 -ml-px filter drop-shadow-xs" />
        </div>
      )}

      {/* Circular Avatar Button */}
      <div
        aria-label="Open ARTH AI Assistant"
        title="Drag anywhere or click to ask ARTH"
        className="group relative flex flex-col items-center shrink-0"
      >
        {/* Floating/Breathing Animation Container */}
        <div className="relative rounded-full p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-500 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-amber-500/30 active:scale-95 animate-[arth-breathe_3.5s_ease-in-out_infinite]">
          {/* Inner Circular Avatar */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white dark:border-slate-900 bg-emerald-700 shadow-inner relative flex items-center justify-center">
            <img
              src="/assets/images/arth_chatbot_avatar_1789895973497.jpg"
              alt="ARTH AI Assistant"
              className="w-full h-full object-cover pointer-events-none"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />

            {/* Active Online Status Dot */}
            <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
