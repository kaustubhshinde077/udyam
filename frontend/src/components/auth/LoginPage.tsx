import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  RotateCw,
  AlertTriangle,
  Smartphone,
  KeyRound
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: (verifiedMobile: string, uid?: string) => void;
  onBackToHome: () => void;
  language?: string;
}

const DEMO_MOBILE = '9876543210';
const DEMO_OTP = '123456';

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onBackToHome,
}) => {
  // Step state: 'phone' | 'otp' | 'success'
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  
  // Phone form state
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP form state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendNotice, setResendNotice] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for Resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Focus first OTP box when entering 'otp' step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 250);
    }
  }, [step]);

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, ''); // digits only
    if (rawVal.length <= 10) {
      setMobileNumber(rawVal);
      if (phoneError) setPhoneError('');
    }
  };

  // Demo Send OTP handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = mobileNumber.trim();

    if (cleanNum.length === 0) {
      setPhoneError('Please enter your mobile number');
      return;
    }

    if (cleanNum.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }

    // For SIH Prototype, allow only the configured demo number 9876543210
    if (cleanNum !== DEMO_MOBILE) {
      setPhoneError(`For the SIH Prototype, please use demo number ${DEMO_MOBILE}`);
      return;
    }

    setIsSendingOtp(true);
    setPhoneError('');

    // Smooth transition without external SMS
    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('otp');
      setResendTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
    }, 300);
  };

  // Handle single OTP digit change
  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = cleanVal.slice(-1);
    setOtp(newOtp);
    if (otpError) setOtpError('');

    // Move to next input box if digit entered
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keydown for Backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Paste event (allows pasting full 6 digits)
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      if (otpError) setOtpError('');
      
      const nextFocusIdx = Math.min(pastedData.length, 5);
      otpInputRefs.current[nextFocusIdx]?.focus();
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    
    if (fullOtp.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP');
      return;
    }

    // Strictly validate against DEMO_OTP (123456)
    if (fullOtp !== DEMO_OTP) {
      setOtpError('Invalid OTP. For this SIH prototype, please enter 123456.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    setTimeout(() => {
      setIsVerifyingOtp(false);
      setStep('success');

      setTimeout(() => {
        onSuccess(DEMO_MOBILE, 'demo-sih-user');
      }, 1000);
    }, 300);
  };

  // Resend OTP handler for Demo
  const handleResendOtp = () => {
    if (!canResend || isSendingOtp) return;
    setCanResend(false);
    setResendTimer(30);
    setResendNotice(true);
    setOtpError('');
    setOtp(['', '', '', '', '', '']);
    otpInputRefs.current[0]?.focus();

    setTimeout(() => {
      setResendNotice(false);
    }, 4000);
  };

  // Formatted mobile display (e.g. 98765 43210)
  const formattedMobile = mobileNumber.length === 10
    ? `${mobileNumber.slice(0, 5)} ${mobileNumber.slice(5)}`
    : mobileNumber;

  const maskedMobileDisplay = mobileNumber.length >= 4 
    ? `${countryCode} XXXXXX${mobileNumber.slice(-4)}`
    : `${countryCode} ${formattedMobile}`;

  return (
    <div className="relative min-h-screen w-full bg-[#040B15] text-slate-100 flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC BACKGROUND WITH SUBTLE AMBIENT LIGHTING & PARTICLES         */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Ambient Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-teal-500/10 blur-[100px]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 sm:w-[480px] sm:h-[480px] rounded-full bg-emerald-500/10 blur-[110px]" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 sm:w-[520px] sm:h-[520px] rounded-full bg-amber-500/10 blur-[120px]" />
        
        {/* Subtle Star/Particle Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />

        {/* Diagonal Light Streaks */}
        <div className="absolute top-1/4 left-1/12 w-64 h-0.5 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent rotate-[-35deg] blur-[1px]" />
        <div className="absolute bottom-1/3 right-1/12 w-80 h-0.5 bg-gradient-to-r from-transparent via-teal-400/20 to-transparent rotate-[-35deg] blur-[1px]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP NAVIGATION BAR WITH BACK TO HOME & DEMO BADGE                      */}
      {/* ========================================================================= */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo Login — SIH Prototype</span>
          </span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CENTERED AUTHENTICATION CARD                                           */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[460px] mx-auto"
        >
          {/* Outer Glass Card Container */}
          <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-slate-700/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.08)] p-6 sm:p-9 text-center overflow-hidden">
            {/* Subtle Top Accent Glowing Border */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full opacity-80" />

            {/* ------------------------------------------------------------- */}
            {/* ARTH AI LOGO (Center Prominent with Glowing Badge)           */}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col items-center mb-6">
              {/* Emblem Badge Container */}
              <div className="relative mb-3.5">
                {/* Ambient Golden Glow Ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-500/30 via-emerald-500/20 to-teal-500/30 blur-md opacity-80 animate-pulse" />
                
                {/* Circular Outer Ring */}
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-400 shadow-xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#040B15] bg-[#061426] flex items-center justify-center relative">
                    <img
                      src="/arth_emblem.jpg"
                      alt="ARTH AI Official Emblem"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-800 to-slate-900 pointer-events-none hidden">
                      <Sparkles className="w-8 h-8 text-amber-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Brand Slogan */}
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ARTH
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium tracking-wide mt-1">
                Assistant for Microentrepreneurs & Farmers
              </p>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STEP 1: MOBILE NUMBER ENTRY                                   */}
            {/* ------------------------------------------------------------- */}
            <AnimatePresence mode="wait">
              {step === 'phone' && (
                <motion.div
                  key="phone-step"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="text-center space-y-1">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      Enter your mobile number
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Use the SIH prototype demo account to log in
                    </p>
                  </div>

                  {/* Demo Mobile Quick Autofill Banner */}
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/80 border border-amber-500/20 text-xs text-slate-300 shadow-inner">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Demo: <strong className="text-amber-400 font-mono tracking-wider font-semibold">{DEMO_MOBILE}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileNumber(DEMO_MOBILE);
                        setPhoneError('');
                      }}
                      className="text-xs font-bold text-teal-400 hover:text-teal-300 hover:underline cursor-pointer transition-colors"
                    >
                      Fill Demo Number
                    </button>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="mobile-input"
                        className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                      >
                        Mobile Number
                      </label>
                      
                      {/* Phone Input Box with Country Code */}
                      <div className={`relative flex items-center rounded-2xl bg-slate-800/80 border transition-all duration-200 ${
                        phoneError 
                          ? 'border-rose-500/80 ring-2 ring-rose-500/20' 
                          : 'border-slate-700/80 hover:border-slate-600 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20'
                      }`}>
                        {/* Country Code Prefix */}
                        <div className="flex items-center gap-1.5 px-3 py-3 border-r border-slate-700/80 text-slate-300 font-bold text-sm select-none">
                          <span className="text-base" role="img" aria-label="India flag">🇮🇳</span>
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            aria-label="Select Country Dial Code"
                            className="bg-transparent text-slate-200 font-bold text-sm focus:outline-hidden cursor-pointer"
                          >
                            <option value="+91" className="bg-slate-900 text-white">+91</option>
                            <option value="+1" className="bg-slate-900 text-white">+1</option>
                            <option value="+44" className="bg-slate-900 text-white">+44</option>
                            <option value="+971" className="bg-slate-900 text-white">+971</option>
                          </select>
                        </div>

                        {/* Numeric Mobile Input */}
                        <input
                          id="mobile-input"
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={mobileNumber}
                          onChange={handlePhoneChange}
                          placeholder={DEMO_MOBILE}
                          autoFocus
                          maxLength={10}
                          className="w-full bg-transparent px-3.5 py-3 text-white text-sm sm:text-base font-semibold placeholder:text-slate-500 focus:outline-hidden tabular-nums tracking-wide"
                        />

                        {mobileNumber === DEMO_MOBILE && (
                          <div className="pr-3 text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Error Message */}
                      {phoneError && (
                        <p className="text-xs text-rose-400 font-medium mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{phoneError}</span>
                        </p>
                      )}
                    </div>

                    {/* Send OTP CTA Button */}
                    <button
                      type="submit"
                      id="btn-send-otp"
                      disabled={isSendingOtp || mobileNumber.length < 10}
                      className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Generating OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Send OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Supporting Terms & Privacy Line */}
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
                    SIH Prototype Evaluation Mode • Demo credentials pre-configured
                  </p>
                </motion.div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STEP 2: 6-DIGIT OTP VERIFICATION                             */}
              {/* ------------------------------------------------------------- */}
              {step === 'otp' && (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="text-center space-y-1">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      Enter the 6-digit OTP sent to {maskedMobileDisplay}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Enter the SIH prototype demo verification code
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('phone');
                        setOtpError('');
                      }}
                      className="text-[11px] text-teal-400 hover:text-teal-300 underline underline-offset-2 cursor-pointer mt-0.5 inline-block"
                    >
                      Change mobile number
                    </button>
                  </div>

                  {/* Demo OTP Quick Autofill Banner */}
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/80 border border-emerald-500/20 text-xs text-slate-300 shadow-inner">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Demo OTP: <strong className="text-emerald-400 font-mono tracking-wider font-semibold">{DEMO_OTP}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtp(['1', '2', '3', '4', '5', '6']);
                        setOtpError('');
                      }}
                      className="text-xs font-bold text-teal-400 hover:text-teal-300 hover:underline cursor-pointer transition-colors"
                    >
                      Auto-fill OTP
                    </button>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    {/* Six Separate OTP Input Boxes */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpInputRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={handleOtpPaste}
                          aria-label={`OTP Digit ${idx + 1}`}
                          className={`w-11 h-13 sm:w-13 sm:h-15 rounded-xl text-center text-xl sm:text-2xl font-black transition-all duration-200 border tabular-nums ${
                            otpError
                              ? 'border-rose-500/80 bg-rose-950/20 text-rose-300 ring-2 ring-rose-500/20'
                              : digit
                              ? 'border-amber-400/90 bg-slate-800/90 text-amber-300 shadow-xs ring-1 ring-amber-400/30'
                              : 'border-slate-700/80 bg-slate-800/60 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Resend Notice */}
                    {resendNotice && (
                      <p className="text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 rounded-xl py-1.5 px-3">
                        ✓ Demo OTP {DEMO_OTP} ready to verify
                      </p>
                    )}

                    {/* OTP Error Message */}
                    {otpError && (
                      <p className="text-xs text-rose-400 font-medium flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{otpError}</span>
                      </p>
                    )}

                    {/* Verify OTP CTA Button */}
                    <button
                      type="submit"
                      id="btn-verify-otp"
                      disabled={isVerifyingOtp || otp.join('').length < 6}
                      className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Resend OTP Section with Countdown */}
                    <div className="pt-2 text-center text-xs text-slate-400 space-y-1">
                      <p>Didn't enter code yet?</p>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold underline underline-offset-2 cursor-pointer"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Resend OTP</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 font-semibold tabular-nums">
                          Resend OTP in <span className="text-slate-300">{resendTimer}s</span>
                        </span>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STEP 3: SUCCESS ANIMATION & AUTO TRANSITION                  */}
              {/* ------------------------------------------------------------- */}
              {step === 'success' && (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="py-6 flex flex-col items-center justify-center space-y-4"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-30" />
                  </div>

                  <div className="space-y-1 text-center">
                    <h3 className="text-xl font-extrabold text-white">
                      Login successful
                    </h3>
                    <p className="text-xs text-slate-300">
                      Opening your ARTH AI workspace...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MINIMALIST FOOTER                                                      */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 ARTH AI — Ideas to Impact. All rights reserved.</p>
        <p className="flex items-center gap-3">
          <span>Toll-Free Helpline: 1800-180-2000</span>
          <span>•</span>
          <span className="text-emerald-400">Panchayat & Rural Advisory</span>
        </p>
      </footer>
    </div>
  );
};
