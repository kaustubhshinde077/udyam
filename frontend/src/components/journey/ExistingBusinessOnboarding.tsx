import React, { useState } from 'react';
import {
  Store,
  IndianRupee,
  Calendar,
  Briefcase,
  Users,
  Wrench,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Landmark,
  ShieldCheck,
  TrendingUp,
  Percent,
} from 'lucide-react';
import {
  ExistingBusinessDetails,
  ExistingLoanDetails,
  FinancialHelpType,
  BusinessCategory,
  Language,
} from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { formatIndianCurrency } from '../../utils/calculations';

interface ExistingBusinessOnboardingProps {
  initialBusiness?: ExistingBusinessDetails;
  initialLoan?: ExistingLoanDetails;
  initialHelpType?: FinancialHelpType;
  defaultHasLoan?: boolean;
  language: Language;
  onSaveAndContinue: (
    business: ExistingBusinessDetails,
    loan: ExistingLoanDetails,
    helpType: FinancialHelpType
  ) => void;
  onBack: () => void;
  onSkip?: () => void;
}

export const ExistingBusinessOnboarding: React.FC<ExistingBusinessOnboardingProps> = ({
  initialBusiness,
  initialLoan,
  initialHelpType = 'manage_existing_loan',
  defaultHasLoan = false,
  language,
  onSaveAndContinue,
  onBack,
  onSkip,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Step 1: About, Step 2: Sales, Step 3: Expenses, Step 4: Needs, Step 5: Loan & Funding
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [businessDetails, setBusinessDetails] = useState<ExistingBusinessDetails>({
    businessName: initialBusiness?.businessName || 'Patil Agro & Daily Store',
    businessCategory: initialBusiness?.businessCategory || 'Grocery / General Store',
    businessActivity: initialBusiness?.businessActivity || 'General retail and animal feed sales',
    businessAgeYears: initialBusiness?.businessAgeYears ?? 3,
    businessAgeMonths: initialBusiness?.businessAgeMonths ?? 6,
    ownershipType: initialBusiness?.ownershipType || 'Sole Proprietorship',
    currentMonthlySales: initialBusiness?.currentMonthlySales ?? 65000,
    currentMonthlyExpenses: initialBusiness?.currentMonthlyExpenses ?? 42000,
    currentMonthlyProfit: initialBusiness?.currentMonthlyProfit ?? 23000,
    numberOfWorkers: initialBusiness?.numberOfWorkers ?? 1,
    keyAssets: initialBusiness?.keyAssets || ['Display Racks', 'Refrigeration unit', 'Digital balance'],
    currentChallenges: initialBusiness?.currentChallenges || ['Working capital shortage', 'Credit to local buyers'],
    growthGoal: initialBusiness?.growthGoal || 'Expand stock inventory and add dairy packaging',
  });

  const [loanDetails, setLoanDetails] = useState<ExistingLoanDetails>({
    hasLoan: initialLoan?.hasLoan || (defaultHasLoan ? 'Yes' : 'No'),
    providerName: initialLoan?.providerName || 'Bank of Maharashtra',
    loanType: initialLoan?.loanType || 'Mudra Shishu / Kishore',
    originalAmount: initialLoan?.originalAmount ?? 80000,
    outstandingAmount: initialLoan?.outstandingAmount ?? 45000,
    monthlyEMI: initialLoan?.monthlyEMI ?? 2450,
    interestRate: initialLoan?.interestRate ?? 10.5,
    interestRateUnknown: initialLoan?.interestRateUnknown ?? false,
    startDate: initialLoan?.startDate || '2023-04-10',
    expectedEndDate: initialLoan?.expectedEndDate || '2026-04-10',
    emisPaid: initialLoan?.emisPaid ?? 18,
    emisRemaining: initialLoan?.emisRemaining ?? 18,
    repaymentStatus: initialLoan?.repaymentStatus || 'normal',
    overdueAmount: initialLoan?.overdueAmount ?? 0,
    loanPurpose: initialLoan?.loanPurpose || 'Inventory purchase and store renovation',
    notes: initialLoan?.notes || '',
  });

  const [financialHelpType, setFinancialHelpType] = useState<FinancialHelpType>(
    initialHelpType || (loanDetails.hasLoan === 'Yes' ? 'manage_existing_loan' : 'explore_schemes_subsidies')
  );

  const [newAssetInput, setNewAssetInput] = useState('');
  const [newChallengeInput, setNewChallengeInput] = useState('');

  // Auto calculate profit whenever sales or expenses change
  const handleSalesChange = (val: number) => {
    setBusinessDetails((prev) => {
      const profit = Math.max(0, val - (prev.currentMonthlyExpenses || 0));
      return { ...prev, currentMonthlySales: val, currentMonthlyProfit: profit };
    });
  };

  const handleExpensesChange = (val: number) => {
    setBusinessDetails((prev) => {
      const profit = Math.max(0, (prev.currentMonthlySales || 0) - val);
      return { ...prev, currentMonthlyExpenses: val, currentMonthlyProfit: profit };
    });
  };

  const handleAddAsset = () => {
    if (!newAssetInput.trim()) return;
    setBusinessDetails((prev) => ({
      ...prev,
      keyAssets: [...(prev.keyAssets || []), newAssetInput.trim()],
    }));
    setNewAssetInput('');
  };

  const handleRemoveAsset = (idx: number) => {
    setBusinessDetails((prev) => ({
      ...prev,
      keyAssets: prev.keyAssets?.filter((_, i) => i !== idx),
    }));
  };

  const handleAddChallenge = () => {
    if (!newChallengeInput.trim()) return;
    setBusinessDetails((prev) => ({
      ...prev,
      currentChallenges: [...(prev.currentChallenges || []), newChallengeInput.trim()],
    }));
    setNewChallengeInput('');
  };

  const handleRemoveChallenge = (idx: number) => {
    setBusinessDetails((prev) => ({
      ...prev,
      currentChallenges: prev.currentChallenges?.filter((_, i) => i !== idx),
    }));
  };

  const handleFinish = () => {
    onSaveAndContinue(businessDetails, loanDetails, financialHelpType);
  };

  const stepTitles = [
    { num: 1, label: language === 'hi' ? 'व्यवसाय परिचय' : language === 'mr' ? 'व्यवसाय परिचय' : 'About Business' },
    { num: 2, label: language === 'hi' ? 'आपकी बिक्री' : language === 'mr' ? 'तुमची विक्री' : 'Your Sales' },
    { num: 3, label: language === 'hi' ? 'खर्च व मुनाफा' : language === 'mr' ? 'खर्च व नफा' : 'Expenses & Profit' },
    { num: 4, label: language === 'hi' ? 'चुनौतियां व लक्ष्य' : language === 'mr' ? 'आव्हाने व उद्दिष्ट' : 'Needs & Goals' },
    { num: 5, label: language === 'hi' ? 'ऋण / वित्तीय मदद' : language === 'mr' ? 'कर्ज / आर्थिक मदत' : 'Loan & Support' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Step Header & Progress Bar */}
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
              <Store className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {language === 'hi'
                  ? 'मौजूदा व्यवसाय प्रोफाइल'
                  : language === 'mr'
                  ? 'चालू व्यवसाय माहिती'
                  : 'Existing Business Profile'}
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-slate-500">
              Step {currentStep} of 5
            </span>
          </div>

          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {stepTitles.map((st) => (
              <button
                key={st.num}
                type="button"
                onClick={() => setCurrentStep(st.num as any)}
                className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center truncate ${
                  st.num === currentStep
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : st.num < currentStep
                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                {st.num}. {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= STEP 1: ABOUT YOUR BUSINESS ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'hi' ? 'अपने व्यवसाय के बारे में बताएं' : language === 'mr' ? 'आपल्या व्यवसायाबद्दल सांगा' : 'About Your Business'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {language === 'hi'
                  ? 'मूल जानकारी दर्ज करें ताकि हम आपकी ज़मीनी स्थिति समझ सकें।'
                  : language === 'mr'
                  ? 'मूलभूत माहिती भरा जेणेकरून आम्ही तुमची प्रत्यक्ष स्थिती समजून घेऊ शकू.'
                  : 'Enter basic details to personalize your financial health check and advisor.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessDetails.businessName}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, businessName: e.target.value })}
                  placeholder="e.g. Patil Provision Store"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Business Category</label>
                <select
                  value={businessDetails.businessCategory}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, businessCategory: e.target.value as BusinessCategory })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Grocery / General Store">Grocery / General Store (किराना दुकान)</option>
                  <option value="Dairy Business">Dairy Business &amp; Livestock (दूध व पशुपालन)</option>
                  <option value="Food / Tiffin">Food / Tiffin / Agro Processing (अन्न प्रक्रिया / गिरणी)</option>
                  <option value="Tailoring / Garments / Textile">Tailoring / Garments / Textile (कापड व शिलाई)</option>
                  <option value="Beauty / Salon">Beauty Parlour / Salon (ब्यूटी व सलून)</option>
                  <option value="Repair Service">Repair Service / Workshop (दुरुस्ती व वर्कशॉप)</option>
                  <option value="Mobile / Electronics">Mobile / Electronics (इलेक्ट्रॉनिक्स)</option>
                  <option value="Transport / Delivery">Transport / Delivery (वाहतूक)</option>
                  <option value="Other">Other Microenterprise (इतर सूक्ष्म व्यवसाय)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Primary Activity Description</label>
                <input
                  type="text"
                  value={businessDetails.businessActivity}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, businessActivity: e.target.value })}
                  placeholder="e.g. Retail provisions, grains, packed dairy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">How long has this business been running?</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={businessDetails.businessAgeYears}
                      onChange={(e) => setBusinessDetails({ ...businessDetails, businessAgeYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-center font-mono"
                    />
                    <span className="text-slate-500 text-[11px]">Years</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={businessDetails.businessAgeMonths}
                      onChange={(e) => setBusinessDetails({ ...businessDetails, businessAgeMonths: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-center font-mono"
                    />
                    <span className="text-slate-500 text-[11px]">Months</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Ownership Type</label>
                <select
                  value={businessDetails.ownershipType}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, ownershipType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Sole Proprietorship">Individual / Sole Proprietor (एकल मालकी)</option>
                  <option value="Family Run">Family Run Joint Unit (कौटुंबिक व्यवसाय)</option>
                  <option value="Self Help Group (SHG)">Self Help Group (SHG / बचत गट)</option>
                  <option value="Partnership">Partnership (भागीदारी)</option>
                  <option value="Informal / Unregistered">Informal / Unregistered Micro Unit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Number of Helpers / Workers</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={businessDetails.numberOfWorkers}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, numberOfWorkers: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: YOUR SALES ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'hi' ? 'आपकी बिक्री (आवक)' : language === 'mr' ? 'तुमची विक्री (येणारे पैसे)' : 'Your Sales (Money Coming In)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {language === 'hi'
                  ? 'अनुमानित औसत मासिक बिक्री दर्ज करें।'
                  : language === 'mr'
                  ? 'अंदाजे सरासरी मासिक विक्री नोंदवा.'
                  : 'Enter your approximate monthly revenue / money coming in from customers.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-4">
              <label className="block font-bold text-slate-900 text-sm">
                Approximate Monthly Sales / Revenue (Money Coming In)
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">
                  ₹
                </span>
                <input
                  type="number"
                  step="1000"
                  value={businessDetails.currentMonthlySales}
                  onChange={(e) => handleSalesChange(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xl font-bold font-mono text-slate-900 bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs text-slate-500 self-center">Quick pick:</span>
                {[25000, 45000, 65000, 100000, 150000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSalesChange(amt)}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                  >
                    {formatIndianCurrency(amt)}
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-white border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Estimated Daily Average:</span>
                <span className="font-bold font-mono text-slate-900">
                  {formatIndianCurrency(Math.round((businessDetails.currentMonthlySales || 0) / 30))} / day
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: YOUR EXPENSES & PROFIT ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'hi' ? 'खर्च और मुनाफा' : language === 'mr' ? 'खर्च आणि नफा' : 'Expenses & Your Profit'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {language === 'hi'
                  ? 'सामग्री, बिजली, किराया और अन्य खर्च दर्ज करें ताकि आपका असली मुनाफा दिख सके।'
                  : language === 'mr'
                  ? 'माल, वीज, भाडे आणि इतर खर्च नोंदवा जेणेकरून तुमचा खरा नफा दिसेल.'
                  : 'Enter monthly operating costs to calculate your actual take-home profit.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
                <label className="block font-bold text-slate-900 text-sm">
                  Monthly Expenses (Money Spent)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="1000"
                    value={businessDetails.currentMonthlyExpenses}
                    onChange={(e) => handleExpensesChange(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xl font-bold font-mono text-slate-900 bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="text-[11px] text-slate-600 leading-tight">
                  Includes raw material / stock, rent, electricity, helper wages, and transport.
                </div>
              </div>

              {/* Calculated Monthly Profit Card */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Your Monthly Profit (Money Left Over)
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Take-Home
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono mt-2">
                    {formatIndianCurrency(businessDetails.currentMonthlyProfit || 0)}
                  </div>
                  <p className="text-xs text-emerald-800 mt-1">
                    Sales ({formatIndianCurrency(businessDetails.currentMonthlySales || 0)}) minus Expenses ({formatIndianCurrency(businessDetails.currentMonthlyExpenses || 0)})
                  </p>
                </div>

                <div className="text-[11px] text-emerald-700 font-medium">
                  {((businessDetails.currentMonthlyProfit || 0) / (businessDetails.currentMonthlySales || 1) * 100).toFixed(0)}% estimated operating margin.
                </div>
              </div>
            </div>

            {/* Key Existing Assets */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block font-bold text-slate-800 text-xs">
                Key Existing Equipment / Assets You Already Own
              </label>
              <div className="flex flex-wrap gap-2">
                {businessDetails.keyAssets?.map((asset, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                  >
                    <span>{asset}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAsset(idx)}
                      className="text-slate-400 hover:text-rose-600 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <input
                  type="text"
                  value={newAssetInput}
                  onChange={(e) => setNewAssetInput(e.target.value)}
                  placeholder="e.g. Weighing scale, Deep freezer, Sewing machine"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAsset();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddAsset}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer hover:bg-slate-800"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CURRENT NEEDS & CHALLENGES ================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'hi' ? 'आपकी वर्तमान ज़रूरतें और लक्ष्य' : language === 'mr' ? 'तुमच्या सध्याच्या गरजा आणि उद्दिष्ट' : 'Current Needs & Growth Goal'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {language === 'hi'
                  ? 'व्यवसाय को आगे बढ़ाने में क्या अड़चनें आ रही हैं?'
                  : language === 'mr'
                  ? 'व्यवसाय वाढवण्यात काय अडचणी येत आहेत?'
                  : 'Share your bottlenecks so ARTH AI can recommend practical solutions.'}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  What is your primary growth goal for the next 6–12 months?
                </label>
                <input
                  type="text"
                  value={businessDetails.growthGoal}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, growthGoal: e.target.value })}
                  placeholder="e.g. Increase monthly sales to ₹1,00,000 and purchase higher-capacity machine"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Current Challenges in Your Business
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {businessDetails.currentChallenges?.map((ch, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium"
                    >
                      <span>{ch}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChallenge(idx)}
                        className="text-rose-400 hover:text-rose-700 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newChallengeInput}
                    onChange={(e) => setNewChallengeInput(e.target.value)}
                    placeholder="e.g. Customer credit delay, High transport cost, Lack of working capital"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChallenge();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddChallenge}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer hover:bg-slate-800"
                  >
                    Add Challenge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 5: FUNDING & EXISTING LOAN INFORMATION ================= */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'hi' ? 'ऋण और वित्तीय स्थिति' : language === 'mr' ? 'कर्ज आणि आर्थिक स्थिती' : 'Loan & Financial Support Needs'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {language === 'hi'
                  ? 'क्या आपके व्यवसाय पर कोई मौजूदा बैंक या अन्य ऋण चल रहा है?'
                  : language === 'mr'
                  ? 'तुमच्या व्यवसायावर कोणतेही चालू बँक किंवा इतर कर्ज आहे का?'
                  : 'Tell us about your current loan or financial support needs. We never push unwanted loans.'}
              </p>
            </div>

            {/* Do you have an existing loan toggle */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-900 text-sm">
                Do you currently have an existing business loan?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLoanDetails({ ...loanDetails, hasLoan: 'Yes' })}
                  className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    loanDetails.hasLoan === 'Yes'
                      ? 'border-amber-500 bg-amber-50 text-slate-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-amber-600" />
                  <span>Yes, I have an active loan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoanDetails({ ...loanDetails, hasLoan: 'No' })}
                  className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    loanDetails.hasLoan === 'No'
                      ? 'border-emerald-500 bg-emerald-50 text-slate-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No, I do not have a loan</span>
                </button>
              </div>
            </div>

            {/* If has existing loan: detailed form with "I don't know" options */}
            {loanDetails.hasLoan === 'Yes' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/50 border border-amber-200/90 space-y-5">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-amber-700" />
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Tell us about your current loan
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Loan Provider / Bank / NBFC
                    </label>
                    <input
                      type="text"
                      value={loanDetails.providerName}
                      onChange={(e) => setLoanDetails({ ...loanDetails, providerName: e.target.value })}
                      placeholder="e.g. State Bank of India / MFI"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Loan Type</label>
                    <select
                      value={loanDetails.loanType}
                      onChange={(e) => setLoanDetails({ ...loanDetails, loanType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Mudra Shishu / Kishore">Mudra Loan (मुद्रा ऋण)</option>
                      <option value="Kisan Credit Card (KCC)">KCC / Agri Gold Loan</option>
                      <option value="Term Loan">Microenterprise Term Loan</option>
                      <option value="Machinery Loan">Machinery / Equipment Finance</option>
                      <option value="SHG Group Loan">Self Help Group (SHG) Loan</option>
                      <option value="Informal / Hand Loan">Informal / Hand Loan (निजी ऋण)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Original Loan Amount</label>
                    <input
                      type="number"
                      value={loanDetails.originalAmount}
                      onChange={(e) => setLoanDetails({ ...loanDetails, originalAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-800">
                        Loan Amount Left (Outstanding)
                      </label>
                      <button
                        type="button"
                        onClick={() => setLoanDetails({ ...loanDetails, outstandingAmount: undefined })}
                        className="text-[10px] text-amber-800 underline cursor-pointer"
                      >
                        I don't know
                      </button>
                    </div>
                    <input
                      type="number"
                      value={loanDetails.outstandingAmount ?? ''}
                      onChange={(e) => setLoanDetails({ ...loanDetails, outstandingAmount: Number(e.target.value) })}
                      placeholder="e.g. 45000"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-800">Monthly Payment (EMI)</label>
                      <button
                        type="button"
                        onClick={() => setLoanDetails({ ...loanDetails, monthlyEMI: undefined })}
                        className="text-[10px] text-amber-800 underline cursor-pointer"
                      >
                        I don't know
                      </button>
                    </div>
                    <input
                      type="number"
                      value={loanDetails.monthlyEMI ?? ''}
                      onChange={(e) => setLoanDetails({ ...loanDetails, monthlyEMI: Number(e.target.value) })}
                      placeholder="e.g. 2450"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-800">Interest Rate (%) if known</label>
                      <button
                        type="button"
                        onClick={() => setLoanDetails({ ...loanDetails, interestRateUnknown: true, interestRate: undefined })}
                        className="text-[10px] text-amber-800 underline cursor-pointer"
                      >
                        I don't know
                      </button>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      disabled={loanDetails.interestRateUnknown}
                      value={loanDetails.interestRateUnknown ? '' : loanDetails.interestRate ?? ''}
                      onChange={(e) => setLoanDetails({ ...loanDetails, interestRate: Number(e.target.value), interestRateUnknown: false })}
                      placeholder={loanDetails.interestRateUnknown ? "Don't know" : 'e.g. 10.5%'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Current Repayment Status</label>
                    <select
                      value={loanDetails.repaymentStatus}
                      onChange={(e) => setLoanDetails({ ...loanDetails, repaymentStatus: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      <option value="normal">Repaying normally on time (समय पर भुगतान)</option>
                      <option value="struggling">Struggling / Heavy burden (भुगतान में कठिनाई)</option>
                      <option value="overdue">Overdue / Missed payment (किश्त रुकी हुई है)</option>
                      <option value="unknown">Not sure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">EMIs Remaining (Approx)</label>
                    <input
                      type="number"
                      value={loanDetails.emisRemaining ?? 12}
                      onChange={(e) => setLoanDetails({ ...loanDetails, emisRemaining: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Clear Choice: What kind of financial help are you looking for? */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block font-bold text-slate-900 text-sm">
                What kind of financial help are you looking for?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'manage_existing_loan' as FinancialHelpType,
                    title: 'Manage my existing loan',
                    desc: 'Daily cash allocation, repayment planning & buffer',
                  },
                  {
                    id: 'need_new_loan' as FinancialHelpType,
                    title: 'I need a new loan',
                    desc: 'Formal bank loan under priority sector guidelines',
                  },
                  {
                    id: 'need_additional_funding' as FinancialHelpType,
                    title: 'I need additional funding for business',
                    desc: 'Working capital or machinery expansion funding',
                  },
                  {
                    id: 'reduce_repayment_burden' as FinancialHelpType,
                    title: 'Reduce / manage my repayment burden',
                    desc: 'Restructuring, lower interest or relief options',
                  },
                  {
                    id: 'explore_schemes_subsidies' as FinancialHelpType,
                    title: 'Explore government schemes & subsidies',
                    desc: 'PMEGP, Mudra, PMFME, State capital subsidies',
                  },
                  {
                    id: 'not_sure_help_me_decide' as FinancialHelpType,
                    title: "I'm not sure — help me decide",
                    desc: 'Let ARTH AI analyse cash flow and suggest best route',
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setFinancialHelpType(opt.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                      financialHelpType === opt.id
                        ? 'border-slate-900 bg-slate-50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{opt.title}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          financialHelpType === opt.id ? 'bg-amber-400 text-slate-950 font-black' : 'border border-slate-300'
                        }`}
                      >
                        {financialHelpType === opt.id && '✓'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Status</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Save &amp; Continue Later
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>Save Business Profile &amp; Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
