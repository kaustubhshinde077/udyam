import React from 'react';
import {
  Rocket,
  Store,
  Landmark,
  TrendingUp,
  Check,
  Info,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { BusinessStatusType, UserGoalType, Language } from '../../types';

interface BusinessStatusSelectionProps {
  selectedStatus?: BusinessStatusType;
  selectedGoals?: UserGoalType[];
  language: Language;
  onSelectStatus: (status: BusinessStatusType) => void;
  onToggleGoal?: (goal: UserGoalType) => void;
  onContinue: () => void;
  onBack?: () => void;
  isSettingsMode?: boolean;
}

export const BusinessStatusSelection: React.FC<BusinessStatusSelectionProps> = ({
  selectedStatus = 'new_business',
  selectedGoals = ['start_new', 'check_feasibility'],
  language,
  onSelectStatus,
  onToggleGoal,
  onContinue,
  onBack,
  isSettingsMode = false,
}) => {
  const statusCards = [
    {
      id: 'new_business' as BusinessStatusType,
      badge: 'ASPIRING ENTREPRENEUR',
      badgeHi: 'नया उद्यम',
      badgeMr: 'नवीन उद्योग',
      title: 'I want to start a new business',
      titleHi: 'मैं नया व्यवसाय शुरू करना चाहता हूँ',
      titleMr: 'मला नवीन व्यवसाय सुरू करायचा आहे',
      subtitle: 'Test your idea, check local demand, and build a practical startup plan.',
      subtitleHi: 'नया विचार परखें, स्थानीय बाज़ार समझें और शुरू करने की योजना बनाएं।',
      subtitleMr: 'नवीन कल्पना तपासा, स्थानिक बाजारपेठ समजून घ्या आणि सुरुवात करा.',
      icon: Rocket,
      iconTheme: 'emerald',
    },
    {
      id: 'existing_business' as BusinessStatusType,
      badge: 'EXISTING BUSINESS OWNER',
      badgeHi: 'चल रहा व्यवसाय',
      badgeMr: 'चालू व्यवसाय',
      title: 'I already have a business',
      titleHi: 'मेरा पहले से एक व्यवसाय है',
      titleMr: 'माझा आधीच एक व्यवसाय आहे',
      subtitle: 'Track daily sales and expenses, protect your cash, and grow your profit.',
      subtitleHi: 'दैनिक बिक्री और खर्च का हिसाब रखें, और अपनी आमदनी बढ़ाएं।',
      subtitleMr: 'दैनंदिन विक्री आणि खर्चाची नोंद ठेवा, आणि नफा वाढवा.',
      icon: Store,
      iconTheme: 'sky',
    },
    {
      id: 'existing_with_loan' as BusinessStatusType,
      badge: 'MANAGING EXISTING LOAN',
      badgeHi: 'व्यवसाय + ऋण',
      badgeMr: 'व्यवसाय + कर्ज',
      title: 'I already have a business and an existing loan',
      titleHi: 'मेरा व्यवसाय है और एक सक्रिय ऋण (लोन) भी है',
      titleMr: 'माझा व्यवसाय आहे आणि चालू कर्ज (लोन) देखील आहे',
      subtitle: 'Check your repayment burden, plan daily EMI allocation, and avoid cash stress.',
      subtitleHi: 'किश्त (ईएमआई) का बोझ समझें और समय पर पुनर्भुगतान सुरक्षित करें।',
      subtitleMr: 'हप्त्याचा (ईएमआय) ताण समजून घ्या आणि वेळेवर परतफेड सुरक्षित करा.',
      icon: Landmark,
      iconTheme: 'sky',
    },
    {
      id: 'existing_seeking_funding' as BusinessStatusType,
      badge: 'SEEKING GROWTH CAPITAL',
      badgeHi: 'विस्तार व पूंजी',
      badgeMr: 'विस्तार आणि भांडवल',
      title: 'I am running a business and looking for additional / new funding',
      titleHi: 'व्यवसाय चल रहा है और अतिरिक्त फंडिंग/पूंजी चाहिए',
      titleMr: 'व्यवसाय चालू आहे आणि नवीन भांडवल / कर्ज हवे आहे',
      subtitle: 'Explore government subsidies, expansion loans, and prepare your numbers.',
      subtitleHi: 'व्यवसाय विस्तार के लिए उपयुक्त सरकारी योजनाएं और बैंक ऋण देखें।',
      subtitleMr: 'व्यवसाय विस्तारासाठी योग्य सरकारी योजना आणि बँक कर्ज शोधा.',
      icon: TrendingUp,
      iconTheme: 'sky',
    },
  ];

  const getCardText = (card: typeof statusCards[0]) => {
    if (language === 'hi') {
      return { badge: card.badgeHi, title: card.titleHi, subtitle: card.subtitleHi };
    }
    if (language === 'mr') {
      return { badge: card.badgeMr, title: card.titleMr, subtitle: card.subtitleMr };
    }
    return { badge: card.badge, title: card.title, subtitle: card.subtitle };
  };

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="space-y-1.5 text-left">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi'
            ? 'आपकी स्थिति क्या है?'
            : language === 'mr'
            ? 'तुमची सद्यस्थिती काय आहे?'
            : 'What best describes you?'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          {language === 'hi'
            ? 'कृपया नीचे दिए गए विकल्पों में से एक चुनें। यह अर्थ (ARTH AI) को आपकी जरूरत के अनुसार सिफारिशें और योजना बनाने में मदद करता है।'
            : language === 'mr'
            ? 'कृपया खालील पर्यायांपैकी एक निवडा. हे अर्थ (ARTH AI) ला तुमच्या गरजेनुसार अचूक मार्गदर्शन करण्यास मदत करते.'
            : 'Select the option that matches your current situation. This helps ARTH AI tailor recommendations, calculations, and loan guidance for you.'}
        </p>
      </div>

      {/* 2x2 Grid of Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {statusCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedStatus === card.id;
          const { badge, title, subtitle } = getCardText(card);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectStatus(card.id)}
              className={`relative text-left p-5 sm:p-6 rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer flex flex-col justify-between group focus:outline-hidden ${
                isSelected
                  ? 'border-2 border-emerald-500 dark:border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/25 shadow-md shadow-emerald-500/10'
                  : 'border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {/* Top Row: Icon + Badge on left, Check indicator on right */}
              <div className="flex items-start justify-between gap-3 w-full mb-3">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  {/* Icon Box */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 shadow-xs'
                        : card.iconTheme === 'emerald'
                        ? 'bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                        : 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Badge */}
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-100'
                        : card.iconTheme === 'emerald'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                        : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60'
                    }`}
                  >
                    {badge}
                  </span>
                </div>

                {/* Selection Circle Top Right */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[#00695C] text-white shadow-xs'
                      : 'border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5 pr-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Reassurance Info Note */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
        <Info className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
        <span>
          {language === 'hi'
            ? 'आप इसे बाद में अपनी प्रोफ़ाइल से कभी भी बदल सकते हैं।'
            : language === 'mr'
            ? 'तुम्ही हे नंतर तुमच्या प्रोफाइलवरून कधीही बदलू शकता.'
            : 'You can change this anytime from your profile.'}
        </span>
      </div>

      {/* Bottom Actions Bar */}
      <div className="pt-6 border-t border-slate-200/90 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300/90 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {language === 'hi'
                ? 'मुख्य पृष्ठ पर वापस जाएं'
                : language === 'mr'
                ? 'मुख्य पृष्ठावर परत जा'
                : 'Back to Home'}
            </span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#F59E0B] hover:from-[#E5981B] hover:to-[#D97706] text-slate-950 font-black text-sm sm:text-base shadow-md shadow-amber-500/20 hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <span>
            {language === 'hi'
              ? 'सहेजें और विचार पर आगे बढ़ें'
              : language === 'mr'
              ? 'जतन करा आणि कल्पनेकडे पुढे जा'
              : 'Save & Continue to Your Idea'}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
