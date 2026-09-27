import React, { useState, useEffect } from 'react';
import {
  Sprout,
  LandPlot,
  Droplets,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  HelpCircle,
} from 'lucide-react';
import { BasicInfoData, BusinessSetupData, ExistingLoanDetails } from '../../types';
import { CROP_BENCHMARKS, CropBenchmark } from '../../data/farmerData';
import { formatIndianCurrency } from '../../utils/calculations';

interface FarmerDetailsProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  onSaveAndNext: (updatedBasic: BasicInfoData, updatedSetup: BusinessSetupData) => void;
  onBack: () => void;
}

export const FarmerDetails: React.FC<FarmerDetailsProps> = ({
  basicInfo,
  businessSetup,
  onSaveAndNext,
  onBack,
}) => {
  // Farmer basic details
  const [farmerName, setFarmerName] = useState(basicInfo.name || '');
  const [mobile, setMobile] = useState(basicInfo.mobile || '');
  const [village, setVillage] = useState(basicInfo.village || '');
  const [district, setDistrict] = useState(basicInfo.district || 'Nashik');
  const [stateName, setStateName] = useState(basicInfo.state || 'Maharashtra');

  // Farm details
  const initialCrop = businessSetup.farmerData?.cropName || 'Rabi Onion';
  const [selectedCrop, setSelectedCrop] = useState<string>(initialCrop);
  const [customCropName, setCustomCropName] = useState<string>('');
  const [isCustomCrop, setIsCustomCrop] = useState<boolean>(
    !Object.keys(CROP_BENCHMARKS).includes(initialCrop) && initialCrop !== ''
  );

  const matchedBenchmark: CropBenchmark | undefined = CROP_BENCHMARKS[selectedCrop];

  const [season, setSeason] = useState<'Kharif' | 'Rabi' | 'Zaid / Summer' | 'Annual'>(
    businessSetup.farmerData?.season || matchedBenchmark?.season || 'Rabi'
  );

  const [landArea, setLandArea] = useState<number>(
    businessSetup.farmerData?.landAreaAcres || 2
  );

  const [irrigation, setIrrigation] = useState<
    'Irrigated (Canal/Borewell/Well)' | 'Drip / Sprinkler' | 'Rainfed (Dependent on Monsoon)' | 'Partially Irrigated'
  >(
    businessSetup.farmerData?.irrigationStatus ||
      matchedBenchmark?.typicalIrrigation ||
      'Drip / Sprinkler'
  );

  const [costPerAcre, setCostPerAcre] = useState<number>(
    businessSetup.farmerData?.cultivationCostPerAcre ||
      matchedBenchmark?.typicalCostPerAcre ||
      55000
  );

  const [expectedYield, setExpectedYield] = useState<string>(
    businessSetup.farmerData?.yieldPerAcreQuintals
      ? String(businessSetup.farmerData.yieldPerAcreQuintals)
      : matchedBenchmark
      ? String(matchedBenchmark.typicalYieldPerAcreQuintals)
      : ''
  );

  const [expectedPrice, setExpectedPrice] = useState<string>(
    businessSetup.farmerData?.marketPricePerQuintal
      ? String(businessSetup.farmerData.marketPricePerQuintal)
      : matchedBenchmark
      ? String(matchedBenchmark.typicalPricePerQuintal)
      : ''
  );

  const [ownContribution, setOwnContribution] = useState<number>(
    businessSetup.ownStartingMoney || 40000
  );

  // Existing loan status
  const [hasLoan, setHasLoan] = useState<'Yes' | 'No'>(
    businessSetup.existingLoan?.hasLoan || 'No'
  );

  const [providerName, setProviderName] = useState(
    businessSetup.existingLoan?.providerName || 'Primary Agricultural Credit Society (PACS)'
  );
  const [loanType, setLoanType] = useState(
    businessSetup.existingLoan?.loanType || 'Kisan Credit Card (KCC) Crop Loan'
  );
  const [outstandingAmount, setOutstandingAmount] = useState<number>(
    businessSetup.existingLoan?.outstandingAmount || 50000
  );
  const [monthlyEMI, setMonthlyEMI] = useState<number>(
    businessSetup.existingLoan?.monthlyEMI || 3500
  );
  const [interestRate, setInterestRate] = useState<number | undefined>(
    businessSetup.existingLoan?.interestRate ?? 7
  );
  const [interestRateUnknown, setInterestRateUnknown] = useState<boolean>(
    businessSetup.existingLoan?.interestRateUnknown ?? false
  );
  const [remainingMonths, setRemainingMonths] = useState<string>(
    businessSetup.existingLoan?.emisRemaining ? String(businessSetup.existingLoan.emisRemaining) : '12'
  );
  const [repaymentStatus, setRepaymentStatus] = useState<'normal' | 'struggling' | 'overdue'>(
    businessSetup.existingLoan?.repaymentStatus === 'struggling' ||
      businessSetup.existingLoan?.repaymentStatus === 'overdue'
      ? businessSetup.existingLoan.repaymentStatus
      : 'normal'
  );

  // Insurance status
  const [hasInsurance, setHasInsurance] = useState<'Yes' | 'No' | 'Not Sure'>(
    businessSetup.farmerData?.hasCropInsurance || 'Yes'
  );

  // When crop selection changes, update cost/yield/price defaults if benchmark available
  const handleCropChange = (cropKey: string) => {
    if (cropKey === 'custom') {
      setIsCustomCrop(true);
      setSelectedCrop('Custom Crop');
    } else {
      setIsCustomCrop(false);
      setSelectedCrop(cropKey);
      const b = CROP_BENCHMARKS[cropKey];
      if (b) {
        setSeason(b.season);
        setCostPerAcre(b.typicalCostPerAcre);
        setExpectedYield(String(b.typicalYieldPerAcreQuintals));
        setExpectedPrice(String(b.typicalPricePerQuintal));
        setIrrigation(b.typicalIrrigation);
      }
    }
  };

  const finalCropName = isCustomCrop
    ? customCropName.trim() || 'Custom Crop'
    : selectedCrop;

  const totalCultivationCost = Math.round((Number(landArea) || 0) * (Number(costPerAcre) || 0));
  const financingGap = Math.max(0, totalCultivationCost - (Number(ownContribution) || 0));

  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedYield = expectedYield.trim() !== '' ? Number(expectedYield) : 0;
    const parsedPrice = expectedPrice.trim() !== '' ? Number(expectedPrice) : 0;

    const existingLoanObj: ExistingLoanDetails = {
      hasLoan,
      providerName: hasLoan === 'Yes' ? providerName : undefined,
      loanType: hasLoan === 'Yes' ? loanType : undefined,
      outstandingAmount: hasLoan === 'Yes' ? Number(outstandingAmount) || 0 : 0,
      monthlyEMI: hasLoan === 'Yes' ? Number(monthlyEMI) || 0 : 0,
      interestRate: hasLoan === 'Yes' && !interestRateUnknown ? Number(interestRate) : undefined,
      interestRateUnknown: hasLoan === 'Yes' ? interestRateUnknown : false,
      emisRemaining: hasLoan === 'Yes' && remainingMonths.trim() !== '' ? Number(remainingMonths) : undefined,
      repaymentStatus: hasLoan === 'Yes' ? repaymentStatus : 'normal',
    };

    const updatedBasic: BasicInfoData = {
      ...basicInfo,
      name: farmerName.trim() || 'Farmer Citizen',
      mobile: mobile.trim() || basicInfo.mobile,
      village: village.trim() || basicInfo.village,
      district: district.trim() || basicInfo.district,
      state: stateName.trim() || basicInfo.state,
      currentOccupation: 'Farmer / Cultivator',
    };

    const updatedSetup: BusinessSetupData = {
      ...businessSetup,
      entityType: 'farmer',
      businessCategory: 'Other',
      subActivity: `${finalCropName} Cultivation (${landArea} Acres)`,
      workLocation: 'Own Land / Farm',
      ownStartingMoney: Number(ownContribution) || 0,
      needFinancialSupport: financingGap > 0 ? 'Yes' : 'No',
      financialSupportAmount: financingGap,
      existingLoan: existingLoanObj,
      farmerData: {
        cropName: finalCropName,
        landAreaAcres: Number(landArea) || 1,
        yieldPerAcreQuintals: parsedYield,
        seedCost: Math.round(totalCultivationCost * 0.25),
        fertilizerCost: Math.round(totalCultivationCost * 0.22),
        pesticideCost: Math.round(totalCultivationCost * 0.15),
        labourCost: Math.round(totalCultivationCost * 0.25),
        irrigationCost: Math.round(totalCultivationCost * 0.08),
        machineryCost: Math.round(totalCultivationCost * 0.05),
        transportCost: 0,
        otherCultivationCost: 0,
        marketPricePerQuintal: parsedPrice,
        season,
        irrigationStatus: irrigation,
        cultivationCostPerAcre: Number(costPerAcre) || 0,
        hasCropInsurance: hasInsurance,
        insuranceSchemeName: hasInsurance === 'Yes' ? 'Pradhan Mantri Fasal Bima Yojana (PMFBY)' : undefined,
      },
    };

    onSaveAndNext(updatedBasic, updatedSetup);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn" id="farmer-details-container">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden" id="farmer-banner">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30 mb-3">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>FARMER FINANCING TRACK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Let's understand your farm and financing needs.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Agricultural credit follows natural seasonal crop cycles, not commercial shop footfalls. Share your crop and land information below to evaluate your cultivation budget, verify existing loan obligations, and discover applicable agricultural schemes.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none flex items-center justify-center">
          <Sprout className="w-64 h-64 text-emerald-300" />
        </div>
      </div>

      <form onSubmit={handleSaveAndContinue} className="space-y-8" id="farmer-form">
        {/* SECTION 1: Farmer & Location */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6" id="farmer-profile-card">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Farmer & Location Information</h2>
              <p className="text-xs text-slate-500">Your official details for agricultural credit and scheme applications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="farmer-name-input">
                Farmer Full Name
              </label>
              <input
                id="farmer-name-input"
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder="e.g. Sanjay Shinde"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="farmer-mobile-input">
                Mobile Number (Aadhaar / Bank Linked)
              </label>
              <input
                id="farmer-mobile-input"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="farmer-village-input">
                Village / Town
              </label>
              <input
                id="farmer-village-input"
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Lasalgaon"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="farmer-district-input">
                District
              </label>
              <input
                id="farmer-district-input"
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Nashik"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="farmer-state-input">
                State
              </label>
              <input
                id="farmer-state-input"
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Crop & Farm Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6" id="farm-crop-card">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Crop, Land & Cultivation Parameters</h2>
              <p className="text-xs text-slate-500">Inputs used to calculate your seasonal production budget and financing requirement</p>
            </div>
          </div>

          {/* Popular Crop Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-2.5">
              Select Your Crop
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-3">
              {Object.keys(CROP_BENCHMARKS).map((cropKey) => {
                const b = CROP_BENCHMARKS[cropKey];
                const isSelected = !isCustomCrop && selectedCrop === cropKey;
                return (
                  <button
                    type="button"
                    key={cropKey}
                    onClick={() => handleCropChange(cropKey)}
                    className={`text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold shadow-sm ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-emerald-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 mb-0.5">{b.name}</div>
                    <div className="text-[11px] text-slate-500">{b.marathiHindiLabel}</div>
                    <div className="text-[10px] text-emerald-700 mt-1.5 font-medium">{b.season} Crop</div>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handleCropChange('custom')}
                className={`text-left p-3 rounded-xl border transition-all text-xs ${
                  isCustomCrop
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold shadow-sm ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-emerald-300 bg-white text-slate-700'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 mb-0.5">Other / Custom</div>
                <div className="text-[11px] text-slate-500">इतर पीक</div>
                <div className="text-[10px] text-slate-500 mt-1.5">Enter details manually</div>
              </button>
            </div>

            {isCustomCrop && (
              <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5" htmlFor="custom-crop-input">
                  Specify Crop Name
                </label>
                <input
                  id="custom-crop-input"
                  type="text"
                  value={customCropName}
                  onChange={(e) => setCustomCropName(e.target.value)}
                  placeholder="e.g. Tomato, Pomegranate, Groundnut"
                  className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="land-area-input">
                <span className="flex items-center gap-1.5">
                  <LandPlot className="w-3.5 h-3.5 text-emerald-600" />
                  Cultivable Land Area (Acres)
                </span>
              </label>
              <input
                id="land-area-input"
                type="number"
                step="0.25"
                min="0.25"
                max="100"
                required
                value={landArea}
                onChange={(e) => setLandArea(Math.max(0.1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">As per land revenue record (7/12 extract)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="season-select">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Crop Season
                </span>
              </label>
              <select
                id="season-select"
                value={season}
                onChange={(e) => setSeason(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Rabi">Rabi (Winter: Oct - Mar)</option>
                <option value="Kharif">Kharif (Monsoon: Jun - Oct)</option>
                <option value="Zaid / Summer">Zaid / Summer (Mar - Jun)</option>
                <option value="Annual">Annual / Perennial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="irrigation-select">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                  Irrigation Availability
                </span>
              </label>
              <select
                id="irrigation-select"
                value={irrigation}
                onChange={(e) => setIrrigation(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Drip / Sprinkler">Drip / Sprinkler Micro-irrigation</option>
                <option value="Irrigated (Canal/Borewell/Well)">Canal / Borewell / Well Irrigated</option>
                <option value="Partially Irrigated">Partially Irrigated</option>
                <option value="Rainfed (Dependent on Monsoon)">Rainfed (Dependent on Monsoon)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="cost-per-acre-input">
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  Estimated Cultivation Cost per Acre (₹)
                </span>
              </label>
              <input
                id="cost-per-acre-input"
                type="number"
                step="500"
                min="1000"
                required
                value={costPerAcre}
                onChange={(e) => setCostPerAcre(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Seeds, fertilizer, pesticides, labour & fuel</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="expected-yield-input">
                Expected Yield per Acre (Quintals) <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="expected-yield-input"
                type="number"
                step="0.5"
                placeholder="e.g. 80 Quintals (Leave blank if not known)"
                value={expectedYield}
                onChange={(e) => setExpectedYield(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">1 Quintal = 100 kg. Displayed as 'Not provided' if blank.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5" htmlFor="expected-price-input">
                Expected Mandi Price per Quintal (₹) <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="expected-price-input"
                type="number"
                step="50"
                placeholder="e.g. ₹2,200/Quintal (Leave blank if not known)"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Based on APMC Mandi trends or MSP benchmarks</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Available Own Savings & Cultivation Budget Summary */}
        <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-6 space-y-4" id="farmer-budget-card">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Farmer Own Contribution & Financing Gap</h2>
              <p className="text-xs text-slate-600">Your available cash savings committed to this crop season</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            <div className="bg-white p-4 rounded-xl border border-emerald-200">
              <span className="text-xs text-slate-500 font-medium block mb-1">Total Estimated Cultivation Cost</span>
              <span className="text-2xl font-black text-slate-900">{formatIndianCurrency(totalCultivationCost)}</span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {landArea} acres × {formatIndianCurrency(costPerAcre)}/acre
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200">
              <label className="block text-xs text-slate-600 font-semibold mb-1" htmlFor="own-contribution-input">
                Your Available Savings / Own Cash (₹)
              </label>
              <input
                id="own-contribution-input"
                type="number"
                step="1000"
                min="0"
                value={ownContribution}
                onChange={(e) => setOwnContribution(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-lg font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">Cash you can invest without borrowing</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200">
              <span className="text-xs text-slate-500 font-medium block mb-1">Estimated Seasonal Financing Gap</span>
              <span className="text-2xl font-black text-emerald-800">{formatIndianCurrency(financingGap)}</span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {financingGap > 0
                  ? 'Net crop working capital required'
                  : 'Self-sufficient from own savings'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Existing Loan Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5" id="farmer-loan-check">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Existing Loan Status</h2>
              <p className="text-xs text-slate-500">Do you currently have an active loan from a bank, cooperative (PACS), or other lender?</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <label
              className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                hasLoan === 'No'
                  ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="hasExistingLoan"
                value="No"
                checked={hasLoan === 'No'}
                onChange={() => setHasLoan('No')}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div className="font-bold text-sm">NO, I do not have an existing loan</div>
                <div className="text-xs text-slate-500 font-normal">Starting fresh this crop cycle with zero existing loan obligation</div>
              </div>
            </label>

            <label
              className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                hasLoan === 'Yes'
                  ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-bold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="hasExistingLoan"
                value="Yes"
                checked={hasLoan === 'Yes'}
                onChange={() => setHasLoan('Yes')}
                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <div className="font-bold text-sm">YES, I already have an existing loan</div>
                <div className="text-xs text-slate-500 font-normal">Have an active KCC, crop loan, tractor loan, or personal loan</div>
              </div>
            </label>
          </div>

          {hasLoan === 'Yes' && (
            <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs uppercase tracking-wide">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Existing Loan Details (Used for Debt Burden & Repayment Assessment)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="lender-provider-input">
                    Lender / Financial Institution
                  </label>
                  <input
                    id="lender-provider-input"
                    type="text"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    placeholder="e.g. PACS, Gramin Bank, SBI, Moneylender"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="loan-type-input">
                    Loan Type
                  </label>
                  <input
                    id="loan-type-input"
                    type="text"
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                    placeholder="e.g. KCC Crop Loan, Tractor Loan, Gold Loan"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="loan-outstanding-input">
                    Current Outstanding Balance (₹)
                  </label>
                  <input
                    id="loan-outstanding-input"
                    type="number"
                    value={outstandingAmount}
                    onChange={(e) => setOutstandingAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="loan-emi-input">
                    Monthly EMI / Repayment Amount (₹)
                  </label>
                  <input
                    id="loan-emi-input"
                    type="number"
                    value={monthlyEMI}
                    onChange={(e) => setMonthlyEMI(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500">If annual bullet repayment, divide by 12</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="loan-interest-input">
                    Interest Rate (% p.a.)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="loan-interest-input"
                      type="number"
                      step="0.1"
                      disabled={interestRateUnknown}
                      value={interestRate ?? ''}
                      onChange={(e) => setInterestRate(e.target.value !== '' ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 7"
                      className="w-28 px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium disabled:bg-slate-100"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interestRateUnknown}
                        onChange={(e) => setInterestRateUnknown(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Rate unknown</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="repayment-status-select">
                    Current Repayment Status
                  </label>
                  <select
                    id="repayment-status-select"
                    value={repaymentStatus}
                    onChange={(e) => setRepaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white"
                  >
                    <option value="normal">Normal / Regular on-time repayment</option>
                    <option value="struggling">Facing difficulty / Tight cash flow</option>
                    <option value="overdue">Overdue / Missed installment</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: Crop Insurance / Protection Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4" id="farmer-insurance-check">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              5
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Crop Insurance Coverage (PMFBY / RWBCIS)</h2>
              <p className="text-xs text-slate-500">Protection against weather shocks, unseasonal rain, dry spells, and pest damage</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Yes', label: 'Yes, Crop is Insured', desc: 'Covered under PMFBY or weather insurance' },
              { id: 'No', label: 'No, Not Insured', desc: 'No active crop insurance policy for this season' },
              { id: 'Not Sure', label: 'Not Sure / Needs Check', desc: 'Need guidance on notification and enrollment' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                  hasInsurance === opt.id
                    ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="hasCropInsurance"
                  value={opt.id}
                  checked={hasInsurance === opt.id}
                  onChange={() => setHasInsurance(opt.id as any)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">{opt.label}</div>
                  <div className="text-xs text-slate-500 font-normal mt-0.5">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation / Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200" id="farmer-form-actions">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Idea</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-lg shadow-emerald-700/20 transition-all text-sm group"
          >
            <span>Save & Continue to Farm Assessment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
