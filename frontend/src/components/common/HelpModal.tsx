import React, { useState } from 'react';
import { Volume2, VolumeX, X, HelpCircle, PhoneCall, Check, Play, Pause } from 'lucide-react';
import { AppStep, Language } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentStep: AppStep;
}

export const HelpModal: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  currentStep,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const getStepHelpText = () => {
    switch (currentStep) {
      case 'landing':
        return {
          title: 'How to use this service',
          simple:
            'This government portal helps you check if your business idea will work in your village or town, what it will cost, and what government loans or grants you can apply for.',
          points: [
            'Click "Start Business Plan" to begin answering simple questions.',
            'You do not need to calculate profit, tax, or loan numbers. The system does this for you.',
            'All your information remains confidential.',
          ],
        };
      case 'login':
        return {
          title: 'Signing in with your Mobile Number',
          simple:
            'Enter your 10-digit mobile number. You can log in using your 4-digit PIN or click "Login with OTP" to receive a direct SMS code on your phone.',
          points: [
            'Enter exactly 10 digits without typing +91 or 0 in front.',
            'Keep your phone nearby if choosing OTP verification.',
          ],
        };
      case 'basic_info':
        return {
          title: 'Basic Citizen Details',
          simple:
            'These questions help identify which state and district schemes apply to you, and whether you are eligible for special subsidies (such as women, SC/ST, or rural entrepreneur benefits).',
          points: [
            'Pick your State and District first so we can load local trade data.',
            'Answer honestly; previous experience is not mandatory.',
          ],
        };
      case 'business_setup':
        return {
          title: 'Choosing your Business Idea',
          simple:
            'Choose the category that matches what you want to do (such as Dairy, Tailoring, Grocery, or Poultry). Then pick the specific items you plan to sell.',
          points: [
            'Select only what you already own so we know what is still needed.',
            'If you already took a loan from a local moneylender, entering it helps us calculate a safe repayment capacity.',
          ],
        };
      case 'analysis_dashboard':
        return {
          title: 'Understanding Local Analysis',
          simple:
            'This screen shows information collected from government mandi reports, local cooperatives, and nearby villages.',
          points: [
            'Look at the "Demand Signal" badge. Positive means villagers frequently need this item.',
            'Check the "Data Trust" badge on every number to see where the information came from.',
          ],
        };
      case 'community_survey':
        return {
          title: 'Asking Village Community',
          simple:
            'Before investing all your money, asking 10 to 15 neighbors if they will buy from you saves you from costly mistakes.',
          points: [
            'You can show the QR code on your phone or share the link on WhatsApp.',
            'The survey has only 6 simple questions.',
          ],
        };
      case 'scheme_matching':
        return {
          title: 'Priority Sector Financing (PS 26091)',
          simple:
            'Evaluates suitable priority sector credit structures (Micro Finance Scheme vs Priority Term Loan) based on your project cost and equity.',
          points: [
            'Remember: This is a "Potential Scheme Match", not a final bank approval.',
            'Take this report to your nearest commercial bank or Regional Rural Bank (RRB) branch.',
          ],
        };
      default:
        return {
          title: 'Help & Voice Guide',
          simple:
            'You can go back at any time by clicking the "Back" button. Your entered answers are safely preserved.',
          points: [
            'Need verbal assistance? Call our toll-free rural helpline at 1800-180-2000.',
            'You can change the language anytime between English, Marathi, and Hindi at the top right.',
          ],
        };
    }
  };

  const helpContent = getStepHelpText();

  const handleSpeakToggle = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `${helpContent.title}. ${helpContent.simple}. ${helpContent.points.join('. ')}`
        );
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-[#0F284E]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#0F284E] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Audio &amp; Citizen Guidance</h2>
              <p className="text-xs text-amber-200">सरल भाषा में मार्गदर्शन • सोप्या भाषेत मदत</p>
            </div>
          </div>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setIsPlaying(false);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-blue-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Read Aloud Controller */}
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  isPlaying ? 'bg-emerald-600 animate-pulse' : 'bg-[#0F284E]'
                }`}
              >
                {isPlaying ? <Volume2 className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {isPlaying ? 'Reading aloud instructions...' : 'Listen to instructions'}
                </p>
                <p className="text-xs text-slate-600">
                  Click button to hear spoken instructions in simple words
                </p>
              </div>
            </div>

            <button
              onClick={handleSpeakToggle}
              className={`px-3 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-[#0F284E] hover:bg-blue-900 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Play Voice
                </>
              )}
            </button>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              {helpContent.title}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-200">
              {helpContent.simple}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Helpful Points for you:
            </h4>
            <ul className="space-y-2">
              {helpContent.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Toll Free Box */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              Toll-Free Helpline: <strong>1800-180-2000</strong>
            </span>
            <span className="text-slate-500">Free Government Service</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 flex justify-end">
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setIsPlaying(false);
              onClose();
            }}
            className="px-4 py-2 bg-[#0F284E] text-white rounded-md font-semibold text-sm hover:bg-blue-900 transition-colors"
          >
            I Understand / समझ आ गया
          </button>
        </div>
      </div>
    </div>
  );
};
