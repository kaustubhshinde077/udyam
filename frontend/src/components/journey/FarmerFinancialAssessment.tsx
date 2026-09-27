import React from 'react';
import {
  Sprout,
  LandPlot,
  Droplets,
  Calendar,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Scale,
  Edit3,
} from 'lucide-react';
import { BasicInfoData, BusinessSetupData } from '../../types';
import { calculateFarmerAssessment, formatIndianCurrency } from '../../utils/calculations';

interface FarmerFinancialAssessmentProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  onNext: () => void;
  onBack: () => void;
  onEditInputs: () => void;
}

export const FarmerFinancialAssessment: React.FC<FarmerFinancialAssessmentProps> = ({
  basicInfo,
  businessSetup,
  onNext,
  onBack,
  onEditInputs,
}) => {
  const fData = businessSetup.farmerData;
  const existingLoan = businessSetup.existingLoan;

  const assessment = calculateFarmerAssessment({
    farmerName: basicInfo.name || 'Farmer Citizen',
    mobile: basicInfo.mobile || '',
    village: basicInfo.village || '',
    district: basicInfo.district || '',
    state: basicInfo.state || '',
    cropName: fData?.cropName || 'Rabi Onion',
    season: fData?.season || 'Rabi',
    landAreaAcres: fData?.landAreaAcres || 2,
    irrigationStatus: fData?.irrigationStatus || 'Irrigated',
    expectedYieldPerAcreQuintals:
      fData?.yieldPerAcreQuintals !== undefined && fData.yieldPerAcreQuintals > 0
        ? fData.yieldPerAcreQuintals
        : null,
    expectedPricePerQuintal:
      fData?.marketPricePerQuintal !== undefined && fData.marketPricePerQuintal > 0
        ? fData.marketPricePerQuintal
        : null,
    cultivationCostPerAcre: fData?.cultivationCostPerAcre || 55000,
    ownContribution: businessSetup.ownStartingMoney || 0,
    hasExistingLoan: existingLoan?.hasLoan || 'No',
    existingLoan: existingLoan,
    hasCropInsurance: fData?.hasCropInsurance || 'Not Sure',
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn" id="farmer-assessment-container">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden" id="assessment-banner">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30 mb-3">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>FARM FINANCING ASSESSMENT</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
                Farm Financial Assessment
              </h1>
              <p className="text-sm text-slate-300">
                Seasonal credit evaluation for {assessment.cropName} cultivation ({assessment.landAreaAcres} Acres)
              </p>
            </div>
            <button
              onClick={onEditInputs}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors self-start sm:self-center"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Modify Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 CORE SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="assessment-grid">
        {/* 1. FARM DETAILS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4" id="card-farm-details">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sprout className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Farm Details</h2>
              <p className="text-xs text-slate-500">Agro-climatic and land profile</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Crop Selected</span>
              <span className="font-bold text-slate-900">{assessment.cropName}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Land Area</span>
              <span className="font-bold text-slate-900">{assessment.landAreaAcres} Acres</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Crop Season</span>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                {assessment.season} Season
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Irrigation Status</span>
              <span className="font-semibold text-slate-800 text-right">{assessment.irrigationStatus}</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 font-medium">Location</span>
              <span className="font-medium text-slate-700">
                {basicInfo.village ? `${basicInfo.village}, ` : ''}{basicInfo.district || 'Maharashtra'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. FARM ECONOMICS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4" id="card-farm-economics">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">2. Farm Economics</h2>
              <p className="text-xs text-slate-500">Cultivation budget, harvest & revenue estimates</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Cultivation Cost / Acre</span>
              <span className="font-bold text-slate-900">{formatIndianCurrency(assessment.cultivationCostPerAcre)}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Total Cultivation Cost</span>
              <span className="font-bold text-slate-900">{formatIndianCurrency(assessment.totalCultivationCost)}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Estimated Crop Output</span>
              <span className={`font-semibold ${assessment.expectedYieldTotalQuintals ? 'text-slate-900' : 'text-slate-400 italic text-xs'}`}>
                {assessment.expectedYieldTotalQuintals !== null && assessment.expectedYieldTotalQuintals !== undefined
                  ? `${assessment.expectedYieldTotalQuintals} Quintals (${assessment.expectedYieldTotalQuintals * 100} kg)`
                  : 'Not provided'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Estimated Crop Revenue</span>
              <span className={`font-bold ${assessment.expectedCropRevenue ? 'text-emerald-700' : 'text-slate-400 italic text-xs'}`}>
                {assessment.expectedCropRevenue !== null && assessment.expectedCropRevenue !== undefined
                  ? formatIndianCurrency(assessment.expectedCropRevenue)
                  : 'Not provided (subject to Mandi price)'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 font-medium">Farmer's Own Contribution</span>
              <span className="font-bold text-slate-900">{formatIndianCurrency(assessment.ownContribution)}</span>
            </div>
          </div>
        </div>

        {/* 3. CURRENT DEBT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4" id="card-debt-status">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Current Debt Obligations</h2>
              <p className="text-xs text-slate-500">Existing loan commitments and repayment burden</p>
            </div>
          </div>

          {!assessment.hasExistingLoan ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No existing loan reported.</span>
              </div>
              <p className="text-xs text-emerald-700">
                You are entering this cultivation season with zero prior debt obligations. Your entire crop revenue can be preserved without servicing pre-existing interest charges.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Lender / Provider</span>
                <span className="font-bold text-slate-900">
                  {assessment.existingLoanDetails?.providerName || 'Not provided'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Outstanding Loan</span>
                <span className="font-bold text-amber-700">
                  {assessment.existingLoanDetails?.outstandingAmount !== undefined
                    ? formatIndianCurrency(assessment.existingLoanDetails.outstandingAmount)
                    : 'Not provided'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Monthly EMI / Repayment</span>
                <span className="font-bold text-slate-900">
                  {assessment.existingLoanDetails?.monthlyEMI !== undefined
                    ? formatIndianCurrency(assessment.existingLoanDetails.monthlyEMI)
                    : 'Not provided'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Interest Rate</span>
                <span className="font-semibold text-slate-800">
                  {assessment.existingLoanDetails?.interestRate !== undefined
                    ? `${assessment.existingLoanDetails.interestRate}% p.a.`
                    : 'Not available'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Remaining Tenure</span>
                <span className="font-semibold text-slate-800">
                  {assessment.existingLoanDetails?.remainingTenure || 'Not available'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 font-medium">Repayment Status</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  assessment.existingLoanDetails?.repaymentStatus === 'normal'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {assessment.existingLoanDetails?.repaymentStatus || 'Normal'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4. FUNDING REQUIREMENT (Exact Math Card from Prompt Section 5) */}
        <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-sm space-y-4" id="card-funding-requirement">
          <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-300 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">4. Funding Requirement Calculation</h2>
              <p className="text-xs text-emerald-300">Clean seasonal cash flow equation</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-800/80 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-300">Estimated Farming Cost:</span>
              <span className="font-mono font-bold text-white text-base">
                {formatIndianCurrency(assessment.totalCultivationCost)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-300">- Farmer's Own Contribution:</span>
              <span className="font-mono font-bold text-emerald-400 text-base">
                {formatIndianCurrency(assessment.ownContribution)}
              </span>
            </div>

            <div className="h-px bg-emerald-800 my-1" />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-200">
                = Estimated Financing Requirement:
              </span>
              <span className="font-mono font-black text-2xl text-emerald-300">
                {formatIndianCurrency(assessment.financingGap)}
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-200/80 leading-relaxed">
            {assessment.financingGap > 0
              ? `Your available savings of ${formatIndianCurrency(assessment.ownContribution)} cover part of the ${formatIndianCurrency(assessment.totalCultivationCost)} budget. You have an estimated financing gap of ${formatIndianCurrency(assessment.financingGap)} for seasonal inputs.`
              : `Your available savings of ${formatIndianCurrency(assessment.ownContribution)} completely cover your estimated cultivation budget. You may not need a loan unless you wish to maintain an emergency cash buffer.`}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200" id="assessment-actions">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Farm Details</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-lg shadow-emerald-700/20 transition-all text-sm group"
        >
          <span>Proceed to Loan Status & Assistance</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
