import React, { useState } from 'react';
import { Shield, KeyRound, Phone, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Language } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';

interface Props {
  language: Language;
  onSuccess: (mobile: string, name?: string) => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<Props> = ({ language, onSuccess, onBack }) => {
  const t = UI_TRANSLATIONS[language];

  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState<{ mobile?: string; pin?: string; otp?: string }>({});
  const [forgotPinMessage, setForgotPinMessage] = useState(false);

  // Strictly enforce numeric 10 digits
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // no alphabets
    if (val.length <= 10) {
      setMobile(val);
      if (errors.mobile) {
        setErrors((prev) => ({ ...prev, mobile: undefined }));
      }
    }
  };

  // Strictly enforce numeric PIN up to 6 digits
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 6) {
      setPin(val);
      if (errors.pin) {
        setErrors((prev) => ({ ...prev, pin: undefined }));
      }
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 4) {
      setOtpValue(val);
      if (errors.otp) {
        setErrors((prev) => ({ ...prev, otp: undefined }));
      }
    }
  };

  const validateMobile = (): boolean => {
    if (!mobile) {
      setErrors((prev) => ({ ...prev, mobile: 'Please enter your 10-digit mobile number.' }));
      return false;
    }
    if (mobile.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        mobile: `Mobile number has ${mobile.length} digits. Exactly 10 digits are required.`,
      }));
      return false;
    }
    // Indian mobile numbers start with 6, 7, 8, 9
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setErrors((prev) => ({
        ...prev,
        mobile: 'Indian mobile numbers must start with 6, 7, 8, or 9.',
      }));
      return false;
    }
    return true;
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isMobValid = validateMobile();
    let isPinValid = true;

    if (!pin) {
      setErrors((prev) => ({ ...prev, pin: 'Please enter your 4 to 6 digit security PIN.' }));
      isPinValid = false;
    } else if (pin.length < 4) {
      setErrors((prev) => ({ ...prev, pin: 'Security PIN must be at least 4 digits.' }));
      isPinValid = false;
    }

    if (isMobValid && isPinValid) {
      onSuccess(mobile, 'Ramesh Patil (Entrepreneur)');
    }
  };

  const handleSendOtp = () => {
    if (!validateMobile()) return;
    setOtpSent(true);
    setIsOtpMode(true);
    setOtpValue('7249'); // Preset simulated OTP for smooth demonstration
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue || otpValue.length !== 4) {
      setErrors((prev) => ({ ...prev, otp: 'Please enter the 4-digit verification code.' }));
      return;
    }
    onSuccess(mobile, 'Ramesh Patil (Entrepreneur)');
  };

  return (
    <div className="w-full bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-950 mb-4 p-1 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back} to Home</span>
        </button>

        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 sm:p-8 shadow-xs">
          {/* Header */}
          <div className="text-center pb-6 border-b border-slate-200">
            <div className="w-12 h-12 bg-blue-50 text-[#0F284E] rounded-full mx-auto flex items-center justify-center mb-3 border border-blue-200">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F284E]">{t.loginTitle}</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Log in to retrieve or continue your local business advisory report
            </p>
          </div>

          {!isOtpMode ? (
            /* PIN Based Login */
            <form onSubmit={handleStandardLogin} className="mt-6 space-y-5">
              {/* Mobile Field */}
              <div>
                <label
                  htmlFor="login-mobile-input"
                  className="block text-sm font-bold text-slate-900 mb-1"
                >
                  {t.mobileNumber} <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-semibold text-sm">
                    +91
                  </div>
                  <input
                    id="login-mobile-input"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="9876543210"
                    className={`w-full pl-14 pr-4 py-3 text-base tabular-nums rounded-lg border-2 bg-white text-slate-900 focus:outline-none focus:ring-2 min-h-[48px] ${
                      errors.mobile
                        ? 'border-rose-500 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-[#0F284E] focus:ring-blue-100'
                    }`}
                  />
                </div>
                {/* Formatted Example */}
                <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>Example: 98765 43210 (10 digits only)</span>
                  <span className="tabular-nums font-medium">{mobile.length}/10 digits</span>
                </p>
                {errors.mobile && (
                  <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* Password / PIN Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="login-pin-input"
                    className="block text-sm font-bold text-slate-900"
                  >
                    {t.pinLabel} <span className="text-rose-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPinMessage(true)}
                    className="text-xs text-blue-800 hover:underline font-semibold"
                  >
                    {t.forgotPin}
                  </button>
                </div>
                <input
                  id="login-pin-input"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="••••"
                  className={`w-full px-4 py-3 text-base tabular-nums tracking-wider rounded-lg border-2 bg-white text-slate-900 focus:outline-none focus:ring-2 min-h-[48px] ${
                    errors.pin
                      ? 'border-rose-500 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-[#0F284E] focus:ring-blue-100'
                  }`}
                />
                <p className="text-[11px] text-slate-500 mt-1">4 to 6 digit security PIN</p>
                {errors.pin && (
                  <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.pin}
                  </p>
                )}
              </div>

              {forgotPinMessage && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                  <p className="font-semibold">Reset PIN Assistance:</p>
                  <p className="mt-0.5">
                    Click &quot;Login with OTP&quot; below to receive a direct one-time passcode on
                    your mobile, or call helpline 1800-180-2000.
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  id="login-submit-btn"
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base rounded-lg shadow-sm min-h-[48px] flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{t.loginBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="login-with-otp-btn"
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-base rounded-lg border-2 border-emerald-600 min-h-[48px] flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>{t.loginOtpBtn}</span>
                </button>
              </div>
            </form>
          ) : (
            /* OTP Based Login */
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">OTP code sent successfully</p>
                  <p>
                    A 4-digit code was sent to <strong className="tabular-nums font-semibold">+91 {mobile}</strong>.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="otp-input-field"
                  className="block text-sm font-bold text-slate-900 mb-1"
                >
                  Enter 4-Digit OTP Code <span className="text-rose-600">*</span>
                </label>
                <input
                  id="otp-input-field"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={otpValue}
                  onChange={handleOtpChange}
                  placeholder="7249"
                  className="w-full px-4 py-3 text-xl font-bold tabular-nums text-center tracking-widest rounded-lg border-2 border-emerald-500 bg-white text-slate-900 focus:outline-none min-h-[48px]"
                />
                {errors.otp && (
                  <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.otp}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>Demo auto-filled: 7249</span>
                  <button
                    type="button"
                    onClick={() => setOtpValue('7249')}
                    className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend OTP
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  id="verify-otp-submit-btn"
                  type="submit"
                  className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base rounded-lg shadow-sm min-h-[48px] flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Verify OTP &amp; Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOtpMode(false)}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg border border-slate-300 min-h-[44px]"
                >
                  Back to Password / PIN Login
                </button>
              </div>
            </form>
          )}

          {/* Simple Security & Trust Note */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{t.trustNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
