import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface BrandIntroAnimationProps {
  onComplete: () => void;
  lang?: string;
}

type IntroPhase =
  | 'line_emerge'
  | 'logo_form'
  | 'text_reveal'
  | 'path_flow'
  | 'expand_exit';

export const BrandIntroAnimation: React.FC<BrandIntroAnimationProps> = ({
  onComplete,
  lang = 'en',
}) => {
  const [phase, setPhase] = useState<IntroPhase>('line_emerge');
  const [activePathNode, setActivePathNode] = useState(0);

  const subtitleMap: Record<string, string> = {
    en: 'Assistant for Microentrepreneurs',
    hi: 'सूक्ष्म उद्यमियों के लिए वित्तीय सलाहकार',
    mr: 'सूक्ष्म उद्योजकांसाठी विश्‍वासू सहाय्यक',
  };

  const journeyNodes = [
    { id: 1, label: 'LOCAL', desc: 'Ground Reality' },
    { id: 2, label: 'MARKET', desc: 'Customer Demand' },
    { id: 3, label: 'EVIDENCE', desc: 'Mandi Proof' },
    { id: 4, label: 'FINANCE', desc: 'Dual-Gate Solvency' },
    { id: 5, label: 'PLAN', desc: 'Daily Action' },
  ];

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const timer = window.setTimeout(() => {
        onComplete();
      }, 500);

      return () => window.clearTimeout(timer);
    }

    /*
      CINEMATIC INTRO TIMELINE

      0.0s - 1.5s  : Golden line emerges
      1.5s - 3.0s  : ARTH logo forms
      3.0s - 4.7s  : ARTH AI + subtitle reveal
      4.7s - 6.8s  : Journey path animation
      6.8s - 7.8s  : Exit transition
      ~7.8 seconds total
    */

    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        setPhase('logo_form');
      }, 1500)
    );

    timers.push(
      window.setTimeout(() => {
        setPhase('text_reveal');
      }, 3000)
    );

    timers.push(
      window.setTimeout(() => {
        setPhase('path_flow');

        timers.push(
          window.setTimeout(() => setActivePathNode(1), 150)
        );

        timers.push(
          window.setTimeout(() => setActivePathNode(2), 500)
        );

        timers.push(
          window.setTimeout(() => setActivePathNode(3), 850)
        );

        timers.push(
          window.setTimeout(() => setActivePathNode(4), 1200)
        );

        timers.push(
          window.setTimeout(() => setActivePathNode(5), 1550)
        );
      }, 4700)
    );

    timers.push(
      window.setTimeout(() => {
        setPhase('expand_exit');

        timers.push(
          window.setTimeout(() => {
            onComplete();
          }, 1000)
        );
      }, 6800)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [onComplete]);

  const isLogoVisible =
    phase === 'logo_form' ||
    phase === 'text_reveal' ||
    phase === 'path_flow' ||
    phase === 'expand_exit';

  const isTextVisible =
    phase === 'text_reveal' ||
    phase === 'path_flow' ||
    phase === 'expand_exit';

  const isPathVisible =
    phase === 'path_flow' ||
    phase === 'expand_exit';

  return (
    <motion.div
      id="arth-cinematic-intro"
      initial={{
        opacity: 1,
        scale: 1,
      }}
      animate={{
        opacity: phase === 'expand_exit' ? 0 : 1,
        scale: phase === 'expand_exit' ? 1.08 : 1,
      }}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        flex-col
        items-center
        justify-center
        bg-[#071324]
        text-white
        overflow-hidden
        select-none
      "
      role="dialog"
      aria-label="ARTH AI Brand Experience"
    >
      {/* =========================================================
          AMBIENT BACKGROUND
      ========================================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Main ambient glow */}
        <motion.div
          animate={{
            scale:
              phase === 'path_flow' ||
              phase === 'expand_exit'
                ? 1.5
                : 1,
            opacity:
              phase === 'line_emerge'
                ? 0.18
                : 0.38,
          }}
          transition={{
            duration: 3,
            ease: 'easeOut',
          }}
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[600px]
            h-[600px]
            sm:w-[800px]
            sm:h-[800px]
            rounded-full
            bg-[radial-gradient(circle,rgba(245,158,11,0.22),rgba(13,148,136,0.12),transparent_70%)]
            blur-[80px]
          "
        />

        {/* Secondary glow */}
        <motion.div
          animate={{
            rotate: phase === 'expand_exit' ? 45 : 0,
            scale: phase === 'expand_exit' ? 1.3 : 1,
          }}
          transition={{
            duration: 4,
            ease: 'easeOut',
          }}
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[350px]
            h-[350px]
            sm:w-[500px]
            sm:h-[500px]
            rounded-full
            bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_70%)]
            blur-[60px]
          "
        />

        {/* Subtle grid */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(#ffffff09_1px,transparent_1px)]
            [background-size:32px_32px]
            opacity-50
          "
        />

        {/* Decorative particles */}
        <motion.div
          animate={{
            y: [-12, 12, -12],
            opacity: [0.25, 0.7, 0.25],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute
            top-[22%]
            left-[18%]
            w-1.5
            h-1.5
            rounded-full
            bg-amber-400
            shadow-[0_0_14px_rgba(245,158,11,0.9)]
          "
        />

        <motion.div
          animate={{
            y: [10, -10, 10],
            opacity: [0.2, 0.65, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute
            bottom-[24%]
            right-[19%]
            w-2
            h-2
            rounded-full
            bg-teal-400
            shadow-[0_0_16px_rgba(45,212,191,0.8)]
          "
        />
      </div>

      {/* =========================================================
          SKIP INTRO
      ========================================================== */}

      <motion.button
        initial={{
          opacity: 0,
          y: -8,
        }}
        animate={{
          opacity: 0.75,
          y: 0,
        }}
        transition={{
          delay: 1,
          duration: 0.6,
        }}
        whileHover={{
          opacity: 1,
          scale: 1.04,
        }}
        onClick={onComplete}
        className="
          absolute
          top-5
          right-5
          sm:top-7
          sm:right-7
          z-30
          flex
          items-center
          gap-2
          text-xs
          sm:text-sm
          text-amber-200
          bg-white/5
          hover:bg-white/10
          px-4
          py-2
          rounded-full
          border
          border-white/10
          backdrop-blur-md
          transition-all
          cursor-pointer
        "
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
      </motion.button>

      {/* =========================================================
          MAIN CINEMATIC STAGE
      ========================================================== */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-6
          w-full
          max-w-3xl
        "
      >

        {/* =======================================================
            LOGO FORMATION
        ======================================================== */}

        <div
          className="
            relative
            w-36
            h-36
            sm:w-44
            sm:h-44
            mb-7
            flex
            items-center
            justify-center
          "
        >

          {/* Initial laser */}
          <AnimatePresence>
            {phase === 'line_emerge' && (
              <motion.div
                initial={{
                  width: 0,
                  opacity: 0,
                }}
                animate={{
                  width: 'min(220px, 70vw)',
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  scaleX: 1.4,
                }}
                transition={{
                  duration: 1.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  h-[2px]
                  bg-gradient-to-r
                  from-transparent
                  via-amber-400
                  to-transparent
                  shadow-[0_0_22px_rgba(245,158,11,0.9)]
                "
              />
            )}
          </AnimatePresence>

          {/* Logo */}
          <AnimatePresence>
            {isLogoVisible && (
              <motion.div
                className="
                  relative
                  w-36
                  h-36
                  sm:w-44
                  sm:h-44
                  flex
                  items-center
                  justify-center
                "
                initial={{
                  scale: 0.45,
                  opacity: 0,
                  rotate: -12,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >

                {/* Outer aura */}
                <motion.div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    border-2
                    border-amber-400/40
                  "
                  initial={{
                    scale: 0.7,
                    rotate: -180,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeOut',
                  }}
                />

                {/* Rotating dashed ring */}
                <motion.div
                  className="
                    absolute
                    -inset-2
                    rounded-full
                    border
                    border-dashed
                    border-amber-500/30
                  "
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Inner ring */}
                <motion.div
                  className="
                    absolute
                    inset-3
                    rounded-full
                    border
                    border-teal-400/25
                  "
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.3,
                  }}
                />

                {/* Logo glow */}
                <motion.div
                  className="
                    absolute
                    inset-3
                    rounded-full
                    bg-gradient-to-tr
                    from-emerald-500/20
                    via-amber-500/20
                    to-teal-400/20
                    blur-xl
                  "
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Official logo */}
                <motion.div
                  className="
                    relative
                    z-10
                    w-28
                    h-28
                    sm:w-36
                    sm:h-36
                    rounded-full
                    overflow-hidden
                    border-2
                    border-amber-400/80
                    shadow-[0_0_45px_rgba(245,158,11,0.5)]
                    bg-slate-950
                  "
                  initial={{
                    scale: 0.7,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0.88, 1.05, 1],
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <img
                    src="/arth_logo.jpg"
                    alt="ARTH AI Logo"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Sparkles */}
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0.7],
                    scale: [0, 1, 1],
                  }}
                  transition={{
                    duration: 1.3,
                    delay: 0.4,
                  }}
                  className="
                    absolute
                    -top-1
                    -right-1
                    z-20
                  "
                >
                  <Sparkles
                    className="
                      w-7
                      h-7
                      text-amber-300
                      drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]
                    "
                  />
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =======================================================
            BRAND TEXT
        ======================================================== */}

        <div
          className="
            min-h-[105px]
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <AnimatePresence>
            {isTextVisible && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 22,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="space-y-2"
              >
                <motion.h1
                  initial={{
                    letterSpacing: '0.25em',
                  }}
                  animate={{
                    letterSpacing: '-0.02em',
                  }}
                  transition={{
                    duration: 1,
                    ease: 'easeOut',
                  }}
                  className="
                    text-4xl
                    sm:text-5xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  ARTH{' '}
                  <span className="text-amber-400">
                    AI
                  </span>
                </motion.h1>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.35,
                    duration: 0.7,
                  }}
                  className="
                    text-sm
                    sm:text-base
                    text-slate-300
                    font-medium
                    tracking-wide
                  "
                >
                  {subtitleMap[lang] || subtitleMap.en}
                </motion.p>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.55,
                    duration: 0.7,
                  }}
                  className="
                    text-[10px]
                    sm:text-xs
                    text-amber-300/90
                    font-semibold
                    tracking-[0.18em]
                    uppercase
                    pt-1
                  "
                >
                  Validate your business before you finance it.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =======================================================
            VALIDATION JOURNEY
        ======================================================== */}

        <div
          className="
            w-full
            mt-8
            min-h-[90px]
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <AnimatePresence>
            {isPathVisible && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.7,
                }}
                className="w-full max-w-xl"
              >

                {/* Track */}
                <div className="relative flex items-center justify-between">

                  {/* Base track */}
                  <div
                    className="
                      absolute
                      top-1/2
                      left-5
                      right-5
                      h-[2px]
                      bg-slate-800
                      -translate-y-1/2
                    "
                  />

                  {/* Progress track */}
                  <motion.div
                    className="
                      absolute
                      top-1/2
                      left-5
                      h-[2px]
                      bg-gradient-to-r
                      from-amber-400
                      to-teal-400
                      -translate-y-1/2
                    "
                    initial={{
                      width: '0%',
                    }}
                    animate={{
                      width: `${Math.max(
                        0,
                        ((activePathNode - 1) / 4) * 100
                      )}%`,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeOut',
                    }}
                  />

                  {journeyNodes.map((node) => {
                    const isLit =
                      activePathNode >= node.id;

                    const isCurrent =
                      activePathNode === node.id;

                    return (
                      <div
                        key={node.id}
                        className="
                          relative
                          z-10
                          flex
                          flex-col
                          items-center
                          min-w-0
                        "
                      >
                        <motion.div
                          animate={{
                            scale: isCurrent ? 1.25 : 1,
                          }}
                          transition={{
                            duration: 0.3,
                          }}
                          className={`
                            w-9
                            h-9
                            sm:w-10
                            sm:h-10
                            rounded-full
                            flex
                            items-center
                            justify-center
                            border
                            transition-all
                            duration-300
                            ${
                              isLit
                                ? 'bg-[#071324] border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.45)]'
                                : 'bg-[#071324] border-slate-700'
                            }
                          `}
                        >
                          <span
                            className={`
                              w-2
                              h-2
                              rounded-full
                              ${
                                isLit
                                  ? 'bg-amber-400'
                                  : 'bg-slate-700'
                              }
                            `}
                          />
                        </motion.div>

                        <div className="mt-2">
                          <div
                            className={`
                              text-[8px]
                              sm:text-[9px]
                              font-bold
                              tracking-wider
                              ${
                                isLit
                                  ? 'text-amber-300'
                                  : 'text-slate-600'
                              }
                            `}
                          >
                            {node.label}
                          </div>

                          <div className="hidden sm:block text-[8px] text-slate-500 mt-0.5">
                            {node.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Bottom branding */}
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.55,
        }}
        transition={{
          delay: 3.5,
          duration: 1,
        }}
        className="
          absolute
          bottom-5
          text-[9px]
          sm:text-[10px]
          uppercase
          tracking-[0.3em]
          text-slate-500
        "
      >
        ARTH AI • Intelligent Financial Guidance
      </motion.div>
    </motion.div>
  );
};