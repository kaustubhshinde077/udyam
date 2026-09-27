import React, { useState } from 'react';
import { Store, Tractor, Milk, Scissors, ShoppingBag, Wrench, Sprout, ArrowRight, ArrowLeft, MapPin, IndianRupee, Sparkles, User, Phone } from 'lucide-react';
import { BasicInfoData, BusinessSetupData, Language } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { PremiumButton } from '../common/PremiumButton';

interface Stage01IdeaProps {
  basicInfo?: BasicInfoData;
  businessSetup?: BusinessSetupData;
  initialBasicInfo?: BasicInfoData;
  initialBusinessSetup?: BusinessSetupData;
  language: Language;
  onSaveAndNext: (updatedBasic: BasicInfoData, updatedSetup: BusinessSetupData) => void;
  onBack?: () => void;
  onBackToHome?: () => void;
}

export const Stage01Idea: React.FC<Stage01IdeaProps> = ({
  basicInfo,
  businessSetup,
  initialBasicInfo,
  initialBusinessSetup,
  language,
  onSaveAndNext,
  onBack,
  onBackToHome,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const currentBasic: BasicInfoData = basicInfo || initialBasicInfo || {
    name: '',
    mobile: '',
    village: 'Sangamner',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    businessStatus: 'New Business',
    reportLanguage: 'English',
  };

  const currentSetup: BusinessSetupData = businessSetup || initialBusinessSetup || {
    entityType: 'business',
    businessCategory: 'Dairy Business',
    subActivity: 'Dairy Business',
    workLocation: 'Home',
    alreadyHave: [],
    needToStart: [],
    sellLocation: [],
    rawMaterialEase: 'Yes, nearby',
    similarBusinessesNearby: '1–2',
    ownStartingMoney: 50000,
    needFinancialSupport: 'Yes',
    hasInformalLoan: 'No',
  };

  // Local state initialized with current data
  const [planningType, setPlanningType] = useState<'business' | 'farmer'>(
    currentSetup?.entityType || 'business'
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentSetup?.businessCategory || 'Dairy Business'
  );

  const [selectedCrop, setSelectedCrop] = useState<string>(
    currentSetup?.farmerData?.cropName || 'Rabi Onion'
  );

  const [name, setName] = useState(currentBasic?.name || '');
  const [mobile, setMobile] = useState(currentBasic?.mobile || '');
  const [village, setVillage] = useState(currentBasic?.village || 'Sangamner');
  const [district, setDistrict] = useState(currentBasic?.district || 'Ahmednagar');
  const [state, setState] = useState(currentBasic?.state || 'Maharashtra');
  const [ownSavings, setOwnSavings] = useState<number>(
    currentSetup?.ownStartingMoney || 50000
  );

  const handleBack = onBack || onBackToHome || (() => {});

  const businessCategories = [
    { id: 'Dairy Business', label: 'Dairy & Livestock', icon: Milk, hint: 'Milk production & chilling' },
    { id: 'Tailoring / Garments / Textile', label: 'Textile & Garments', icon: Scissors, hint: 'Weaving & apparel' },
    { id: 'Grocery / General Store', label: 'Retail & Kirana', icon: ShoppingBag, hint: 'Village provisions store' },
    { id: 'Food / Tiffin', label: 'Food Processing / Agro Mill', icon: Wrench, hint: 'Flour mill, spices & snacks' },
    { id: 'Other', label: 'Other Micro Business', icon: Store, hint: 'Rural service or workshop' },
  ];

  const cropsList = [
    { id: 'Rabi Onion', label: 'Rabi Onion (कांदा / प्याज)', yield: '70 Qtl / acre', market: 'APMC Mandi' },
    { id: 'Soybean', label: 'Soybean (सोयाबीन)', yield: '9 Qtl / acre', market: 'Oilseed Mandi' },
    { id: 'Turmeric', label: 'Turmeric (हळद / हल्दी)', yield: '25 Qtl / acre', market: 'Spice Terminal' },
    { id: 'Other Crop', label: 'Other Grain / Vegetable', yield: 'Regional average', market: 'Local Market' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBasic: BasicInfoData = {
      ...currentBasic,
      name: name.trim() || 'Citizen Entrepreneur',
      mobile: mobile.trim() || '9876543210',
      village: village.trim() || 'Sangamner',
      district: district.trim() || 'Ahmednagar',
      state: state.trim() || 'Maharashtra',
    };

    const updatedSetup: BusinessSetupData = {
      ...currentSetup,
      entityType: planningType,
      businessCategory: (planningType === 'farmer' ? 'Other' : selectedCategory) as any,
      subActivity: planningType === 'farmer' ? selectedCrop : selectedCategory,
      ownStartingMoney: Number(ownSavings) || 0,
      farmerData:
        planningType === 'farmer'
          ? {
              cropName: selectedCrop,
              landAreaAcres: 2.0,
              yieldPerAcreQuintals: 70,
              seedCost: 24000,
              fertilizerCost: 18000,
              pesticideCost: 12000,
              labourCost: 18000,
              irrigationCost: 6000,
              machineryCost: 4000,
              transportCost: 2000,
              otherCultivationCost: 0,
              marketPricePerQuintal: 1650,
            }
          : undefined,
    };

    onSaveAndNext(updatedBasic, updatedSetup);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8 transition-colors">
        {/* Header Badge & Title */}
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
              Step 02 of 07 • Your Idea
            </span>
            <button
              type="button"
              onClick={handleBack}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
            >
              Back to Details
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Tell us about your idea.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Select what you are planning to build, your location, and available starting savings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question: What are you planning? (Two Large Cards) */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
              What are you planning?
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Build a Business */}
              <div
                onClick={() => setPlanningType('business')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  planningType === 'business'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 shadow-sm ring-1 ring-amber-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                role="button"
                tabIndex={0}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  planningType === 'business' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <Store className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Build a Business
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Dairy livestock, textile, rural retail store, agro processing mill, or repair service.
                  </p>
                </div>
              </div>

              {/* Option B: Farm / Grow a Crop */}
              <div
                onClick={() => setPlanningType('farmer')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  planningType === 'farmer'
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-sm ring-1 ring-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                role="button"
                tabIndex={0}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  planningType === 'farmer' ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <Tractor className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Farm / Grow a Crop
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Crop planning, input costs per acre, APMC Mandi prices, and break-even safety yield.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Selection based on planning type */}
          {planningType === 'business' ? (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
                Select Your Business Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {businessCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1C2E] hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400 dark:text-slate-500'}`} />
                      <div>
                        <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">{cat.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{cat.hint}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
                Select Your Crop
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cropsList.map((cr) => {
                  const isSelected = selectedCrop === cr.id;
                  return (
                    <div
                      key={cr.id}
                      onClick={() => setSelectedCrop(cr.id)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1C2E] hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Sprout className={`w-5 h-5 shrink-0 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <div>
                        <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">{cr.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Yield: {cr.yield} • Market: {cr.market}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Location & Starting Capital Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Village / Town */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Village / Town &amp; District</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Village / Town"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-[#112235] text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#152a42] focus:border-amber-500 focus:outline-hidden transition-colors"
                  required
                />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-[#112235] text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#152a42] focus:border-amber-500 focus:outline-hidden transition-colors"
                  required
                />
              </div>
            </div>

            {/* Available Savings / Starting Capital */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                <span>Available Savings / Starting Capital (₹)</span>
              </label>
              <input
                type="number"
                value={ownSavings}
                onChange={(e) => setOwnSavings(Number(e.target.value))}
                placeholder="e.g. 50000"
                min={0}
                step={5000}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-[#112235] text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#152a42] focus:border-amber-500 focus:outline-hidden font-mono transition-colors"
                required
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Banks recommend providing at least 10–15% of the total project cost.
              </span>
            </div>
          </div>

          {/* Simple Citizen Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Your Name (Entrepreneur / Farmer)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-[#112235] text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#152a42] focus:border-amber-500 focus:outline-hidden transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Mobile Number (For saving your plan)</span>
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile"
                maxLength={10}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-[#112235] text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#152a42] focus:border-amber-500 focus:outline-hidden font-mono transition-colors"
              />
            </div>
          </div>

          {/* Navigation Action Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel &amp; Return Home</span>
            </button>

            <PremiumButton
              type="submit"
              variant={planningType === 'farmer' ? 'emerald' : 'gold'}
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {planningType === 'farmer'
                ? 'Continue to Farm Details'
                : 'Continue to Local Check'}
            </PremiumButton>
          </div>
        </form>
      </div>
    </div>
  );
};
