import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppStep, Language } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';

interface StepMeta {
  index: number;
  title: { en: string; hi: string; mr: string };
  subtitle: { en: string; hi: string; mr: string };
}

const STEP_METADATA: Record<AppStep, StepMeta> = {
  landing: {
    index: 0,
    title: { en: 'Welcome', hi: 'स्वागत', mr: 'स्वागत' },
    subtitle: { en: 'Portal Overview', hi: 'पोर्टल परिचय', mr: 'पोर्टल माहिती' },
  },
  login: {
    index: 0,
    title: { en: 'Citizen Login', hi: 'नागरिक लॉगिन', mr: 'नागरिक लॉगिन' },
    subtitle: { en: 'Mobile Verification', hi: 'मोबाइल सत्यापन', mr: 'मोबाइल पडताळणी' },
  },
  basic_info: {
    index: 1,
    title: { en: 'Citizen Profile & Location', hi: 'नागरिक प्रोफाइल व स्थान', mr: 'नागरिक माहिती व पत्ता' },
    subtitle: { en: 'Personal & contact information', hi: 'व्यक्तिगत एवं संपर्क जानकारी', mr: 'वैयक्तिक व संपर्क माहिती' },
  },
  business_setup: {
    index: 2,
    title: { en: 'Business Concept & Resources', hi: 'व्यवसाय स्वरूप व साधन', mr: 'व्यवसाय स्वरूप व संसाधने' },
    subtitle: { en: 'Proposed business model & assets', hi: 'प्रस्तावित व्यवसाय और पूंजी', mr: 'प्रस्तावित व्यवसाय व आवश्यक साधने' },
  },
  review: {
    index: 3,
    title: { en: 'Review & Verification Notice', hi: 'सत्यापन व ७-दिवसीय सूचना', mr: 'माहिती पुनरावलोकन व ७ दिवसांची सूचना' },
    subtitle: { en: 'Verify details; 1st report visible after 7 days', hi: 'जानकारी जांचें, ७ दिनों में रिपोर्ट', mr: 'माहिती तपासा, ७ दिवसांनंतर अहवाल' },
  },
  analysis_start: {
    index: 4,
    title: { en: 'Local Market Opportunity', hi: 'स्थानिक बाजारपेठ विश्लेषण', mr: 'स्थानिक बाजारपेठ संधी' },
    subtitle: { en: 'Gram Panchayat demand signals', hi: 'स्थानीय मांग व संभावना', mr: 'ग्रामपंचायत मागणी संकेत' },
  },
  analysis_dashboard: {
    index: 5,
    title: { en: 'Panchayat & Market Insights', hi: 'बाजार अंतर्दृष्टि एवं मांग', mr: 'बाजारपेठ मागणी व पुरवठा' },
    subtitle: { en: 'Customer reach and pricing benchmark', hi: 'ग्राहक व मूल्य स्तर', mr: 'स्थानिक ग्राहक व पुरवठादार' },
  },
  community_survey: {
    index: 6,
    title: { en: 'Community Evidence & Survey', hi: 'सामुदायिक सर्वेक्षण व साक्ष्य', mr: 'ग्राम सर्वेक्षण व पुरावा' },
    subtitle: { en: 'Ground validation; 1st report visible after 7 days', hi: 'समुदाय प्रतिक्रिया, ७ दिवसांची पडताळणी', mr: 'नागरिकांचे अभिप्राय व ७ दिवसांची पडताळणी' },
  },
  stage1_report: {
    index: 7,
    title: { en: '1st Report: Field & Market Feasibility', hi: 'पहला अहवाल: क्षेत्र व बाजार व्यवहार्यता', mr: '१ला अहवाल: क्षेत्र व बाजारपेठ व्यवहार्यता' },
    subtitle: { en: '7-Day verification dossier and print export', hi: 'प्राथमिक सत्यापन रिपोर्ट डाउनलोड करें', mr: '७ दिवसांचा प्राथमिक पडताळणी अहवाल' },
  },
  evidence_level: {
    index: 8,
    title: { en: 'Data Reliability Rating', hi: 'डेटा विश्वसनीयता', mr: 'माहिती विश्वासार्हता' },
    subtitle: { en: 'Verified public data score', hi: 'सत्यापित डेटा स्कोर', mr: 'सत्यापित माहिती स्तर' },
  },
  scheme_matching: {
    index: 9,
    title: { en: 'Priority Sector Financing Schemes', hi: 'प्राथमिकता क्षेत्र ऋण योजनाएं', mr: 'प्राधान्य क्षेत्र कर्ज योजना' },
    subtitle: { en: 'PS 26091 Micro Finance vs Term Loan', hi: 'माइक्रो फाइनेंस बनाम टर्म लोन', mr: 'मायक्रो फायनान्स विरुद्ध मुदत कर्ज' },
  },
  phase2_costs: {
    index: 10,
    title: { en: 'Project Cost Estimation', hi: 'परियोजना लागत आकलन', mr: 'प्रकल्प खर्च अंदाज' },
    subtitle: { en: 'Equipment, premises, and machinery', hi: 'मशीनरी व कार्यशील पूंजी', mr: 'यंत्रसामग्री व भांडवली खर्च' },
  },
  business_cost: {
    index: 10,
    title: { en: 'Project Cost & Operational Unit Economics', hi: 'परियोजना व परिचालन लागत', mr: 'प्रकल्प व दैनिक उत्पादन खर्च' },
    subtitle: { en: 'Equipment costs and monthly volume', hi: 'उपकरण व अपेक्षित बिक्री दर', mr: 'साधने आणि अपेक्षित विक्री' },
  },
  financial_structure: {
    index: 11,
    title: { en: 'Capital Structure & Loan EMI', hi: 'पूंजी संरचना एवं ऋण ईएमआई', mr: 'भांडवल रचना व कर्ज हप्ता' },
    subtitle: { en: 'Own savings vs priority sector term credit', hi: 'अपनी बचत और प्राथमिकता क्षेत्र ऋण', mr: 'स्वतःचे भांडवल व प्राधान्य क्षेत्र मुदत कर्ज' },
  },
  business_feasibility: {
    index: 12,
    title: { en: 'Monthly Profit & Break-Even', hi: 'मासिक लाभ एवं ब्रेक-ईवन', mr: 'मासिक नफा आणि ब्रेक-ईव्हन' },
    subtitle: { en: 'Monthly revenue vs operating expenses', hi: 'अपेक्षित मासिक आय व खर्च', mr: 'अपेक्षित उत्पन्न व व्यवसाय खर्च' },
  },
  scenario_cases: {
    index: 13,
    title: { en: 'Market Scenarios & Stress Test', hi: 'परिदृश्य विश्लेषण (3 स्थितियां)', mr: 'परिस्थिती विश्लेषण (३ शक्यता)' },
    subtitle: { en: 'Good, normal, and difficult sales', hi: 'कम व अधिक बिक्री का प्रभाव', mr: 'चांगली, सामान्य व मंदीची परिस्थिती' },
  },
  scenario_analysis: {
    index: 13,
    title: { en: 'Market Scenarios & Stress Test', hi: 'परिदृश्य विश्लेषण (3 स्थितियां)', mr: 'परिस्थिती विश्लेषण (३ शक्यता)' },
    subtitle: { en: 'Good, normal, and difficult sales', hi: 'कम व अधिक बिक्री का प्रभाव', mr: 'चांगली, सामान्य व मंदीची परिस्थिती' },
  },
  risk: {
    index: 14,
    title: { en: 'Risk Mitigation & Safety Measures', hi: 'जोखिम एवं सुरक्षा उपाय', mr: 'जोखीम व सुरक्षा उपाय' },
    subtitle: { en: 'Operational safety & readiness score', hi: 'संभावित जोखिम और सुरक्षा उपाय', mr: 'व्यवसाय जोखीम व उपाययोजना' },
  },
  risk_assessment: {
    index: 14,
    title: { en: 'Risk Mitigation & Safety Measures', hi: 'जोखिम एवं सुरक्षा उपाय', mr: 'जोखीम व सुरक्षा उपाय' },
    subtitle: { en: 'Operational safety & readiness score', hi: 'संभावित जोखिम और सुरक्षा उपाय', mr: 'व्यवसाय जोखीम व उपाययोजना' },
  },
  recommendation: {
    index: 15,
    title: { en: 'Enterprise Readiness & Recommendation', hi: 'व्यवसाय तत्परता एवं शिफारिश', mr: 'व्यवसाय सज्जता व शिफारस' },
    subtitle: { en: 'Official advisory on starting or resizing', hi: 'शुरू करने पर आधिकारिक सलाह', mr: 'सल्लागार समितीची अंतिम शिफारस' },
  },
  final_report: {
    index: 16,
    title: { en: 'Comprehensive Feasibility Report', hi: 'संपूर्ण परियोजना रिपोर्ट', mr: 'सर्वसमावेशक प्रकल्प अहवाल' },
    subtitle: { en: 'Bankable business dossier and print export', hi: 'बैंक ऋण योग्य परियोजना विवरण', mr: 'बँकेसाठी आवश्यक प्रकल्प अहवाल' },
  },
  dashboard: {
    index: 0,
    title: { en: 'Executive Dashboard', hi: 'मुख्य डैशबोर्ड', mr: 'मुख्य डॅशबोर्ड' },
    subtitle: { en: 'Multi-business overview & KPI metrics', hi: 'व्यवसाय अवलोकन व संकेत', mr: 'व्यवसाय आढावा व मुख्य आकडेवारी' },
  },
  repayment_plan: {
    index: 11,
    title: { en: 'Loan Repayment & Daily Targets', hi: 'ऋण चुकौती व दैनिक लक्ष्य', mr: 'कर्ज परतफेड व दैनिक उद्दिष्ट' },
    subtitle: { en: 'EMI breakdown, daily volume, and amortization', hi: 'ईएमआई विवरण व दैनिक उत्पादन', mr: 'हप्ता विश्लेषण व दैनिक उद्दिष्ट' },
  },
  business_health: {
    index: 12,
    title: { en: 'Business Health & Monitoring', hi: 'व्यवसाय स्वास्थ्य व निरीक्षण', mr: 'व्यवसाय आरोग्य व दैनिक नोंद' },
    subtitle: { en: 'Operational status & daily milk logs', hi: 'दैनिक गतिविधि व स्वास्थ्य स्तर', mr: 'कार्यरत स्थिती व दैनंदिन नोंद' },
  },
  ai_advisor: {
    index: 15,
    title: { en: 'AI Business Advisory Agent', hi: 'एआई व्यापार सलाहकार', mr: 'एआय व्यवसाय सल्लागार' },
    subtitle: { en: 'Contextual queries & local guidance', hi: 'व्यापार मार्गदर्शन व प्रश्नोत्तरे', mr: 'स्थानिक मार्गदर्शन व शंका निरसन' },
  },
};

interface Props {
  currentStep?: AppStep;
  currentStepIndex?: number;
  totalSteps?: number;
  stepTitle?: string;
  stepSubtitle?: string;
  onBack?: () => void;
  canGoBack?: boolean;
  language?: Language;
  onStepClick?: (step: AppStep) => void;
}

export const StepProgress: React.FC<Props> = ({
  currentStep,
  currentStepIndex: propIndex,
  totalSteps: propTotal,
  stepTitle: propTitle,
  stepSubtitle: propSubtitle,
  onBack,
  canGoBack = true,
  language = 'en',
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en'];

  // Resolve metadata cleanly
  const meta = currentStep && STEP_METADATA[currentStep] ? STEP_METADATA[currentStep] : null;

  const total = propTotal && propTotal > 0 ? propTotal : 16;
  const current =
    propIndex && propIndex > 0
      ? propIndex
      : meta
      ? Math.max(1, meta.index)
      : 1;

  const title = propTitle || (meta ? meta.title[language] || meta.title.en : 'Enterprise Assessment');
  const subtitle = propSubtitle || (meta ? meta.subtitle[language] || meta.subtitle.en : '');

  // Progress percentage is mathematically guaranteed to be a valid number between 0 and 100
  const progressPercent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  const stepText = (t.stepOf || 'Step {current} of {total}')
    .replace('{current}', String(current))
    .replace('{total}', String(total));

  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 px-4 sm:px-6 shadow-2xs">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {canGoBack && onBack && (
            <button
              id="global-back-btn"
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span>{t.back || 'Back'}</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                {stepText}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {progressPercent}% Completed
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F284E] leading-tight mt-0.5">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500 hidden md:block">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Progress bar with percentage readout */}
        <div className="w-full sm:w-56 flex flex-col gap-1 shrink-0">
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-600">
            <span>Overall Progress</span>
            <span className="text-emerald-700 font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-[#0F284E] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
