import React, { useState, useMemo } from 'react';
import {
  BusinessCategory,
  BusinessSetupData,
  FarmerCropData,
  Language,
} from '../../types';
import {
  BUSINESS_ACTIVITIES,
  WORK_LOCATION_OPTIONS,
  ASSET_ITEMS,
  NEED_ITEMS,
  SELL_LOCATION_OPTIONS,
  RAW_MATERIAL_EASE_OPTIONS,
  SIMILAR_BUSINESS_OPTIONS,
} from '../../data/mockLocalData';
import { UI_TRANSLATIONS } from '../../data/translations';
import { formatIndianCurrency } from '../../utils/calculations';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  IndianRupee,
  HelpCircle,
  Store,
  Tractor,
  TrendingUp,
  Sprout,
  Shield,
  Layers,
} from 'lucide-react';

interface Props {
  initialData: BusinessSetupData;
  language: Language;
  onSaveAndNext: (data: BusinessSetupData) => void;
  onBack: () => void;
}

export const BusinessSetupForm: React.FC<Props> = ({
  initialData,
  language,
  onSaveAndNext,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [formData, setFormData] = useState<BusinessSetupData>(() => ({
    ...(initialData || {}),
    entityType: initialData?.entityType || 'business',
    farmerData: initialData?.farmerData || {
      cropName: 'Onion (कांदा / प्याज)',
      landAreaAcres: 2,
      yieldPerAcreQuintals: 80,
      seedCost: 24000,
      fertilizerCost: 28000,
      pesticideCost: 18000,
      labourCost: 42000,
      irrigationCost: 15000,
      machineryCost: 18000,
      transportCost: 12000,
      otherCultivationCost: 7000,
      marketPricePerQuintal: 1400,
    },
  }));

  const [subStep, setSubStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFarmer = formData.entityType === 'farmer';
  const farmerData = formData.farmerData!;

  // Live calculation for Farmer Mode economics
  const farmerEconomics = useMemo(() => {
    if (!isFarmer) return null;
    const land = Number(farmerData.landAreaAcres) || 1;
    const yieldPerAcre = Number(farmerData.yieldPerAcreQuintals) || 1;
    const totalProduction = land * yieldPerAcre;
    const totalCost =
      (Number(farmerData.seedCost) || 0) +
      (Number(farmerData.fertilizerCost) || 0) +
      (Number(farmerData.pesticideCost) || 0) +
      (Number(farmerData.labourCost) || 0) +
      (Number(farmerData.irrigationCost) || 0) +
      (Number(farmerData.machineryCost) || 0) +
      (Number(farmerData.transportCost) || 0) +
      (Number(farmerData.otherCultivationCost) || 0);

    const price = Number(farmerData.marketPricePerQuintal) || 1000;
    const expectedRevenue = totalProduction * price;
    const netProfit = expectedRevenue - totalCost;
    const costPerUnit = totalProduction > 0 ? Math.round(totalCost / totalProduction) : 0;
    const breakEvenPrice = costPerUnit;
    const profitPerAcre = land > 0 ? Math.round(netProfit / land) : 0;

    // Cases
    const bestCaseRevenue = totalProduction * (price * 1.28);
    const bestCaseProfit = bestCaseRevenue - totalCost;

    const worstCaseRevenue = totalProduction * (price * 0.68);
    const worstCaseProfit = worstCaseRevenue - totalCost;

    return {
      land,
      totalProduction,
      totalCost,
      expectedRevenue,
      netProfit,
      costPerUnit,
      breakEvenPrice,
      profitPerAcre,
      bestCaseRevenue,
      bestCaseProfit,
      worstCaseRevenue,
      worstCaseProfit,
    };
  }, [isFarmer, farmerData]);

  const availableActivities = BUSINESS_ACTIVITIES[formData.businessCategory] || ['General Activity'];

  const handleCategoryChange = (cat: BusinessCategory) => {
    const newActivities = BUSINESS_ACTIVITIES[cat] || ['General'];
    setFormData((prev) => ({
      ...prev,
      businessCategory: cat,
      subActivity: newActivities[0] || '',
    }));
    if (errors.businessCategory) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.businessCategory;
        return copy;
      });
    }
  };

  const updateFarmerField = (field: keyof FarmerCropData, val: any) => {
    setFormData((prev) => ({
      ...prev,
      farmerData: {
        ...prev.farmerData!,
        [field]: val,
      },
    }));
  };

  const toggleAlreadyHave = (item: string) => {
    setFormData((prev) => {
      let current = [...prev.alreadyHave];
      if (item === 'Nothing') {
        return { ...prev, alreadyHave: ['Nothing'] };
      }
      current = current.filter((x) => x !== 'Nothing');
      if (current.includes(item)) {
        current = current.filter((x) => x !== item);
      } else {
        current.push(item);
      }
      return { ...prev, alreadyHave: current.length === 0 ? [] : current };
    });
    if (errors.alreadyHave) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.alreadyHave;
        return copy;
      });
    }
  };

  const toggleNeedToStart = (item: string) => {
    setFormData((prev) => {
      const current = prev.needToStart.includes(item)
        ? prev.needToStart.filter((x) => x !== item)
        : [...prev.needToStart, item];
      return { ...prev, needToStart: current };
    });
    if (errors.needToStart) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.needToStart;
        return copy;
      });
    }
  };

  const toggleSellLocation = (item: string) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.sellLocation) ? [...prev.sellLocation] : [];
      const updated = current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item];
      return { ...prev, sellLocation: updated };
    });
    if (errors.sellLocation) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.sellLocation;
        return copy;
      });
    }
  };

  const validateSubStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!isFarmer) {
      if (!formData.businessCategory) {
        newErrors.businessCategory = 'Please choose a business category.';
      }
      if (!formData.subActivity) {
        newErrors.subActivity = 'Please choose what you want to sell or do.';
      }
    } else {
      if (!farmerData.cropName) {
        newErrors.cropName = 'Please select or enter crop name.';
      }
      if (!farmerData.landAreaAcres || farmerData.landAreaAcres <= 0) {
        newErrors.landAreaAcres = 'Please enter valid land area in acres.';
      }
    }
    if (!formData.workLocation) {
      newErrors.workLocation = 'Please select where you will do this work.';
    }
    if (!formData.alreadyHave || formData.alreadyHave.length === 0) {
      newErrors.alreadyHave = 'Please select at least one item or choose "Nothing".';
    }
    if (!formData.needToStart || formData.needToStart.length === 0) {
      newErrors.needToStart = 'Please select what you need to start.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSubStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.sellLocation || formData.sellLocation.length === 0) {
      newErrors.sellLocation = 'Please select where you will mainly sell (at least one location).';
    }
    if (formData.ownStartingMoney === undefined || formData.ownStartingMoney < 0) {
      newErrors.ownStartingMoney = 'Please enter how much money you have to start (₹).';
    }
    if (
      formData.needFinancialSupport === 'Yes' &&
      (!formData.financialSupportAmount || formData.financialSupportAmount <= 0)
    ) {
      newErrors.financialSupportAmount = 'Please enter how much financial support / loan you need.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (subStep === 1) {
      if (validateSubStep1()) setSubStep(2);
    } else {
      if (validateSubStep2()) {
        onSaveAndNext(formData);
      }
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 sm:p-8 shadow-xs mb-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                Setup &amp; Model Selection (Part 1)
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {subStep === 1
                  ? isFarmer
                    ? 'Farmer Mode: Crop Economics & Cultivation Plan'
                    : 'Phase 1: Business Activity & Resources (व्यवसाय निवड व संसाधने)'
                  : 'Phase 1: Local Market & Financial Details (स्थानिक बाजार व भांडवल)'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                    subStep === stepNum
                      ? 'bg-[#0F284E] text-white border-[#0F284E]'
                      : subStep > stepNum
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  {subStep > stepNum ? '✓' : stepNum}
                </div>
              ))}
              <span className="text-xs font-semibold text-slate-600">
                Step {subStep} of 2
              </span>
            </div>
          </div>

          {/* PRIMARY TOGGLE: BUSINESS vs FARMER MODE */}
          {subStep === 1 && (
            <div className="mb-6 p-4 bg-slate-50 border-2 border-slate-300 rounded-xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Select Your Category / Sector
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  id="select-mode-business-btn"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      entityType: 'business',
                      businessCategory:
                        prev.businessCategory === 'Other' ? 'Dairy Business' : prev.businessCategory,
                      subActivity:
                        prev.subActivity.includes('Cultivation') ? 'Milk + Milk Products' : prev.subActivity,
                    }))
                  }
                  className={`p-4 rounded-xl border-2 flex items-center gap-3.5 text-left transition-all ${
                    !isFarmer
                      ? 'border-blue-700 bg-blue-50/80 text-blue-950 shadow-xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      !isFarmer ? 'bg-[#0F284E] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Business / Micro-Enterprise
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Dairy, Poultry, Textile, Retail, Food, Services
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  id="select-mode-farmer-btn"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      entityType: 'farmer',
                      businessCategory: 'Other',
                      subActivity: 'Onion Cultivation (2 Acres)',
                      workLocation: 'Own Land / Farm',
                      alreadyHave: ['Land / Space', 'Water', 'Electricity'],
                    }))
                  }
                  className={`p-4 rounded-xl border-2 flex items-center gap-3.5 text-left transition-all ${
                    isFarmer
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isFarmer ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Tractor className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-slate-900">
                        Farmer / Crop Farming
                      </h3>
                      <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded">
                        Farmer Mode
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Onion, Vegetables, Cash Crops, Food Grains
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* SUB-STEP 1: Forms */}
          {subStep === 1 && !isFarmer && (
            <div className="space-y-6">
              {/* Business Category */}
              <div>
                <label
                  htmlFor="business-category-select"
                  className="block text-base font-bold text-slate-900 mb-1.5"
                >
                  1. What business do you want to start? (व्यवसाय निवडा) <span className="text-rose-600">*</span>
                </label>
                <select
                  id="business-category-select"
                  value={formData.businessCategory}
                  onChange={(e) => handleCategoryChange(e.target.value as BusinessCategory)}
                  className="w-full px-4 py-3.5 text-base rounded-lg border-2 border-slate-300 bg-white text-slate-900 min-h-[50px] font-semibold focus:outline-none focus:border-[#0F284E]"
                >
                  <option value="">-- Choose Business Category --</option>
                  {Object.keys(BUSINESS_ACTIVITIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.businessCategory && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.businessCategory}
                  </p>
                )}
              </div>

              {/* Dynamic Activity Dropdown */}
              <div>
                <label
                  htmlFor="sub-activity-select"
                  className="block text-base font-bold text-slate-900 mb-1.5"
                >
                  2. What do you want to sell or do? (विशिष्ट उत्पादन / सेवा) <span className="text-rose-600">*</span>
                </label>
                <select
                  id="sub-activity-select"
                  value={formData.subActivity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subActivity: e.target.value }))}
                  className="w-full px-4 py-3.5 text-base rounded-lg border-2 border-emerald-600 bg-emerald-50/40 text-slate-900 min-h-[50px] font-bold focus:outline-none"
                >
                  <option value="">-- Choose Specific Activity / Product --</option>
                  {availableActivities.map((act) => (
                    <option key={act} value={act}>
                      {act}
                    </option>
                  ))}
                </select>
                {errors.subActivity && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.subActivity}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  3. Where will you do this work? (काम कहाँ करेंगे?)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {WORK_LOCATION_OPTIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, workLocation: loc }))}
                      className={`p-3 text-sm font-bold rounded-lg border-2 text-center min-h-[48px] transition-colors ${
                        formData.workLocation === loc
                          ? 'border-[#0F284E] bg-blue-50 text-[#0F284E]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Already Have */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-1">
                  4. What do you already have? (उपलब्ध संसाधने)
                </label>
                <p className="text-xs text-slate-500 mb-2.5">Tap all items that apply</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ASSET_ITEMS.map((item) => {
                    const isSelected = formData.alreadyHave.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAlreadyHave(item)}
                        className={`p-3 text-sm font-semibold rounded-lg border-2 text-left flex items-center justify-between min-h-[48px] transition-colors ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item}</span>
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white border-slate-300 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Need to Start */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-1">
                  5. What do you need to start? (आवश्यक गोष्टी)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {NEED_ITEMS.map((item) => {
                    const isSelected = formData.needToStart.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleNeedToStart(item)}
                        className={`p-3 text-sm font-semibold rounded-lg border-2 text-left flex items-center justify-between min-h-[48px] transition-colors ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50 text-blue-950 font-bold'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item}</span>
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold border ${
                            isSelected
                              ? 'bg-[#0F284E] text-white border-[#0F284E]'
                              : 'bg-white border-slate-300 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SUB-STEP 1: FARMER MODE SPECIFIC FORM & CALCULATOR */}
          {subStep === 1 && isFarmer && farmerEconomics && (
            <div className="space-y-6">
              {/* Crop & Land Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">
                    Crop Name (पीक नाव)
                  </label>
                  <select
                    value={farmerData.cropName}
                    onChange={(e) => updateFarmerField('cropName', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border-2 border-emerald-600 bg-emerald-50 text-slate-900 font-bold"
                  >
                    <option value="Onion (कांदा / प्याज)">Onion (कांदा / प्याज)</option>
                    <option value="Tomato (टोमॅटो)">Tomato (टोमॅटो)</option>
                    <option value="Vegetables (भाजीपाला)">Mixed Vegetables (भाजीपाला)</option>
                    <option value="Soybean (सोयाबीन)">Soybean (सोयाबीन)</option>
                    <option value="Cotton (कापूस)">Cotton (कापूस)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">
                    Land Area (Acres / एकर)
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={farmerData.landAreaAcres}
                    onChange={(e) => updateFarmerField('landAreaAcres', parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-300 font-bold tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">
                    Expected Yield (Quintals/Acre)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={farmerData.yieldPerAcreQuintals}
                    onChange={(e) => updateFarmerField('yieldPerAcreQuintals', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-300 font-bold tabular-nums"
                  />
                </div>
              </div>

              {/* Cultivation Input Costs Breakdown */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    Cultivation Cost Breakdown (लागवड खर्च तपशील)
                  </h3>
                  <span className="text-xs font-bold text-slate-600">
                    Total: {formatIndianCurrency(farmerEconomics.totalCost)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Seed Cost (₹)</label>
                    <input
                      type="number"
                      value={farmerData.seedCost}
                      onChange={(e) => updateFarmerField('seedCost', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded font-bold tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Fertilizer (₹)</label>
                    <input
                      type="number"
                      value={farmerData.fertilizerCost}
                      onChange={(e) => updateFarmerField('fertilizerCost', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded font-bold tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Pesticides (₹)</label>
                    <input
                      type="number"
                      value={farmerData.pesticideCost}
                      onChange={(e) => updateFarmerField('pesticideCost', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded font-bold tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Labour (₹)</label>
                    <input
                      type="number"
                      value={farmerData.labourCost}
                      onChange={(e) => updateFarmerField('labourCost', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded font-bold tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Irrigation (₹)</label>
                    <input
                      type="number"
                      value={farmerData.irrigationCost}
                      onChange={(e) => updateFarmerField('irrigationCost', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded font-bold tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Machinery / Fuel (₹)</label>
                    <input
                      type="number"
                      value={farmerData.machineryCost}
                      onChange={(e) => updateFarmerField('machineryCost', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded font-bold tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Transport (₹)</label>
                    <input
                      type="number"
                      value={farmerData.transportCost}
                      onChange={(e) => updateFarmerField('transportCost', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded font-bold tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Other Costs (₹)</label>
                    <input
                      type="number"
                      value={farmerData.otherCultivationCost}
                      onChange={(e) => updateFarmerField('otherCultivationCost', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded font-bold tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Market Price & Real-Time Farmer Economics Result */}
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-300 pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded">
                      Section 24 • APMC Mandi Economics
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Cultivation Feasibility &amp; Break-Even Metrics
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                      APMC Price (₹/quintal):
                    </label>
                    <input
                      type="number"
                      step={50}
                      value={farmerData.marketPricePerQuintal}
                      onChange={(e) => updateFarmerField('marketPricePerQuintal', parseInt(e.target.value) || 1000)}
                      className="w-28 px-2 py-1.5 bg-white border-2 border-emerald-600 rounded font-bold tabular-nums text-sm text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                    <span className="text-[11px] font-semibold text-slate-500 block">Expected Harvest</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {farmerEconomics.totalProduction} Quintals
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                    <span className="text-[11px] font-semibold text-slate-500 block">Expected Revenue</span>
                    <span className="text-base font-extrabold text-emerald-800">
                      {formatIndianCurrency(farmerEconomics.expectedRevenue)}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                    <span className="text-[11px] font-semibold text-slate-500 block">Net Profit / Surplus</span>
                    <span
                      className={`text-base font-black ${
                        farmerEconomics.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {formatIndianCurrency(farmerEconomics.netProfit)}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                    <span className="text-[11px] font-semibold text-slate-500 block">Break-Even Price</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{farmerEconomics.breakEvenPrice} / qtl
                    </span>
                  </div>
                </div>

                {/* Scenarios / Price Sensitivity */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-emerald-200">
                  <div className="p-2 bg-emerald-100/70 rounded">
                    <span className="text-[10px] font-bold text-emerald-950 block">Best Case (+28%)</span>
                    <span className="font-bold text-emerald-900">
                      +{formatIndianCurrency(farmerEconomics.bestCaseProfit)}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded border border-emerald-300">
                    <span className="text-[10px] font-bold text-slate-700 block">Base Case (Expected)</span>
                    <span className="font-bold text-slate-900">
                      {formatIndianCurrency(farmerEconomics.netProfit)}
                    </span>
                  </div>
                  <div className="p-2 bg-rose-50 rounded border border-rose-200">
                    <span className="text-[10px] font-bold text-rose-950 block">Worst Case (-32%)</span>
                    <span className={`font-bold ${farmerEconomics.worstCaseProfit >= 0 ? 'text-slate-800' : 'text-rose-700'}`}>
                      {formatIndianCurrency(farmerEconomics.worstCaseProfit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-STEP 2: Market & Capital Details */}
          {subStep === 2 && (
            <div className="space-y-6">
              {/* Question 6: Selling Location */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-base font-bold text-slate-900">
                    6. Where will you mainly sell? (विक्री कुठे करणार?) <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    Multiple choice allowed
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SELL_LOCATION_OPTIONS.map((sellLoc) => {
                    const isSelected = Array.isArray(formData.sellLocation) && formData.sellLocation.includes(sellLoc);
                    return (
                      <button
                        key={sellLoc}
                        type="button"
                        onClick={() => toggleSellLocation(sellLoc)}
                        className={`p-3 text-sm font-semibold rounded-lg border-2 text-left flex items-center justify-between min-h-[48px] transition-colors ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50 text-blue-950 font-bold'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{sellLoc}</span>
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold border ${
                            isSelected
                              ? 'bg-[#0F284E] text-white border-[#0F284E]'
                              : 'bg-white border-slate-300 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 7: Raw materials */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  7. Are inputs/raw materials easily accessible? (कच्चा माल सहज उपलब्ध आहे का?)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {RAW_MATERIAL_EASE_OPTIONS.map((ease) => (
                    <button
                      key={ease}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, rawMaterialEase: ease }))}
                      className={`p-3 text-sm font-bold rounded-lg border-2 text-center min-h-[48px] transition-colors ${
                        formData.rawMaterialEase === ease
                          ? 'border-[#0F284E] bg-blue-50 text-[#0F284E]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {ease}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 8: Competition */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  8. Similar businesses/producers nearby (आसपासचे स्पर्धक)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {SIMILAR_BUSINESS_OPTIONS.map((sim) => (
                    <button
                      key={sim}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, similarBusinessesNearby: sim }))}
                      className={`p-3 text-sm font-bold rounded-lg border-2 text-center min-h-[48px] transition-colors ${
                        formData.similarBusinessesNearby === sim
                          ? 'border-[#0F284E] bg-blue-50 text-[#0F284E]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {sim}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 9: Starting Money */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-300">
                <label
                  htmlFor="starting-money-input"
                  className="block text-base font-bold text-slate-900 mb-1"
                >
                  9. Own Available Capital (स्वतःची उपलब्ध रक्कम / भांडवल) <span className="text-rose-600">*</span>
                </label>
                <p className="text-xs text-slate-600 mb-2">
                  This forms your promoter equity contribution.
                </p>
                <div className="relative max-w-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-700 font-bold">
                    ₹
                  </div>
                  <input
                    id="starting-money-input"
                    type="number"
                    min={0}
                    step={5000}
                    value={formData.ownStartingMoney || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ownStartingMoney: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="e.g. 100000"
                    className="w-full pl-9 pr-4 py-3 text-lg font-bold tabular-nums rounded-lg border-2 border-slate-300 bg-white text-slate-900 min-h-[48px] focus:outline-none focus:border-[#0F284E]"
                  />
                </div>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Formatted: {formatIndianCurrency(formData.ownStartingMoney)}
                </p>
              </div>

              {/* Question 10: Financial Support Needed? */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  10. Do you need bank financing / loan support? (कर्ज / आर्थिक सहाय्य आवश्यक आहे का?)
                </label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {(['Yes', 'No', 'Not Sure'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, needFinancialSupport: opt }))}
                      className={`p-3 text-base font-bold rounded-lg border-2 text-center min-h-[48px] transition-colors ${
                        formData.needFinancialSupport === opt
                          ? 'border-[#0F284E] bg-blue-50 text-[#0F284E]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {formData.needFinancialSupport === 'Yes' && (
                  <div className="pl-3 border-l-4 border-blue-500 mt-3">
                    <label
                      htmlFor="financial-support-amount-input"
                      className="block text-sm font-bold text-slate-900 mb-1"
                    >
                      Loan Amount Required (अपेक्षित कर्ज रक्कम)
                    </label>
                    <div className="relative max-w-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-700 font-bold">
                        ₹
                      </div>
                      <input
                        id="financial-support-amount-input"
                        type="number"
                        min={0}
                        step={10000}
                        value={formData.financialSupportAmount || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            financialSupportAmount: parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder="e.g. 900000"
                        className="w-full pl-9 pr-4 py-2.5 text-base font-bold tabular-nums rounded-lg border-2 border-slate-300 bg-white text-slate-900 min-h-[44px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                if (subStep === 2) setSubStep(1);
                else onBack();
              }}
              className="px-6 py-3.5 text-slate-800 font-bold text-base rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-100 min-h-[48px] flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.back}</span>
            </button>

            <button
              id="business-setup-continue-btn"
              type="button"
              onClick={handleNext}
              className="px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base rounded-lg shadow-sm min-h-[48px] flex items-center gap-2 transition-colors"
            >
              <span>{subStep === 2 ? 'Review & Submit' : t.continue}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
