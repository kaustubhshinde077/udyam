import React from 'react';
import {
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Info,
  Calendar,
  IndianRupee,
  Sprout,
  HelpCircle,
  TrendingDown,
  Building,
} from 'lucide-react';
import { BasicInfoData, BusinessSetupData } from '../../types';
import { calculateFarmerAssessment, formatIndianCurrency } from '../../utils/calculations';

interface FarmerAssistanceProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  onNext: () => void;
  onBack: () => void;
}

export const FarmerAssistance: React.FC<FarmerAssistanceProps> = ({
  basicInfo,
  businessSetup,
  onNext,
  onBack,
}) => {
  const fData = businessSetup.farmerData;
  const loan = businessSetup.existingLoan;
  const hasLoan = loan?.hasLoan === 'Yes';

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
    expectedYieldPerAcreQuintals: fData?.yieldPerAcreQuintals,
    expectedPricePerQuintal: fData?.marketPricePerQuintal,
    cultivationCostPerAcre: fData?.cultivationCostPerAcre || 55000,
    ownContribution: businessSetup.ownStartingMoney || 0,
    hasExistingLoan: hasLoan ? 'Yes' : 'No',
    existingLoan: loan,
    hasCropInsurance: fData?.hasCropInsurance || 'Not Sure',
  });

  const monthlyEMI = loan?.monthlyEMI || 0;
  const annualRepaymentBurden = monthlyEMI * 12;
  const outstandingAmount = loan?.outstandingAmount || 0;
  const remainingTenure = loan?.emisRemaining !== undefined ? `${loan.emisRemaining} months` : 'Not available';
  const interestRateText = loan?.interestRateUnknown
    ? 'Not available (unknown)'
    : loan?.interestRate !== undefined
    ? `${loan.interestRate}% p.a.`
    : 'Not available';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn" id="farmer-assistance-container">
      {hasLoan ? (
        /* ============================================================ */
        /* BRANCH A: EXISTING LOAN ASSISTANCE (Section 6)               */
        /* ============================================================ */
        <div className="space-y-6" id="existing-loan-assistance-view">
          {/* Header Banner */}
          <div className="bg-amber-950 text-white rounded-2xl p-6 sm:p-8 border border-amber-800 shadow-xl relative overflow-hidden" id="existing-loan-banner">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide border border-amber-400/30 mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>EXISTING LOAN ASSISTANCE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Existing Loan Assistance & Debt Assessment
              </h1>
              <p className="text-sm text-amber-100 leading-relaxed max-w-3xl">
                Because you already have an active loan obligation, ARTH AI does not automatically recommend taking more debt. Our priority is evaluating your current repayment burden against your upcoming seasonal crop expenses.
              </p>
            </div>
          </div>

          {/* Action-Oriented Explanation Card (Prompt Section 6 mandate) */}
          <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-950 space-y-3" id="existing-loan-warning">
            <div className="flex items-center gap-2.5 font-bold text-base text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
              <span>Debt Caution & Repayment Advisory</span>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              Your existing loan from <span className="font-bold">{loan?.providerName || 'your lender'}</span> is already creating an estimated monthly repayment obligation of{' '}
              <span className="font-bold underline decoration-amber-500">{formatIndianCurrency(monthlyEMI)}</span> (~{formatIndianCurrency(annualRepaymentBurden)} per year). Before taking additional credit, review your repayment capacity and available own contribution.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="existing-loan-metrics">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Current Outstanding Balance</span>
              <span className="text-2xl font-black text-amber-700">{formatIndianCurrency(outstandingAmount)}</span>
              <span className="text-xs text-slate-500 block mt-1">Lender: {loan?.providerName || 'Not specified'}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Monthly Repayment Obligation</span>
              <span className="text-2xl font-black text-slate-900">{formatIndianCurrency(monthlyEMI)}</span>
              <span className="text-xs text-slate-500 block mt-1">Annual burden: {formatIndianCurrency(annualRepaymentBurden)}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Interest Rate</span>
              <span className="text-2xl font-black text-slate-900">{interestRateText}</span>
              <span className="text-xs text-slate-500 block mt-1">Remaining tenure: {remainingTenure}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Repayment Status</span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                loan?.repaymentStatus === 'normal'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {loan?.repaymentStatus === 'normal' ? 'Normal / On-Time' : loan?.repaymentStatus || 'Facing Strain'}
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                {loan?.repaymentStatus === 'normal' ? 'Eligible for prompt repayment incentive' : 'Higher debt risk'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Estimated Farming Cash Requirement</span>
              <span className="text-2xl font-black text-emerald-700">{formatIndianCurrency(assessment.totalCultivationCost)}</span>
              <span className="text-xs text-slate-500 block mt-1">For {assessment.landAreaAcres} acres {assessment.cropName}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Estimated Net Financing Gap</span>
              <span className="text-2xl font-black text-slate-900">{formatIndianCurrency(assessment.financingGap)}</span>
              <span className="text-xs text-slate-500 block mt-1">
                After farmer own cash: {formatIndianCurrency(assessment.ownContribution)}
              </span>
            </div>
          </div>

          {/* Repayment Burden Analysis Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4" id="debt-burden-analysis">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600" />
              <span>Would Additional Borrowing Increase Your Repayment Burden?</span>
            </h2>

            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed space-y-2">
              <p>
                <strong>Yes, taking a new fresh loan will compound your debt load.</strong> If you take a fresh loan for the full financing gap of {formatIndianCurrency(assessment.financingGap)}, you will have to service both your current {formatIndianCurrency(monthlyEMI)}/month loan and the new credit.
              </p>
              <p>
                In agriculture, yields and APMC market prices fluctuate with monsoon weather and supply gluts. Having multiple active debt obligations substantially raises the risk of cash stress if harvest prices drop.
              </p>
            </div>

            <h3 className="text-sm font-bold text-slate-900 pt-2">Recommended Prudent Actions Before Fresh Borrowing:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950 block mb-1">1. Seek KCC Renewal / Limit Enhancement</span>
                <span className="text-slate-700">
                  Instead of a separate loan, ask your existing bank to renew your Kisan Credit Card based on official District Level Technical Committee (DLTC) scale of finance.
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950 block mb-1">2. Avail 3% Prompt Repayment Incentive</span>
                <span className="text-slate-700">
                  If your crop loan is repaid before the bank due date, the effective interest drops to 4% p.a. under the Modified Interest Subvention Scheme.
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950 block mb-1">3. Maximize Own Contribution</span>
                <span className="text-slate-700">
                  Invest your available {formatIndianCurrency(assessment.ownContribution)} directly into high-yield seeds and basal fertilizers to minimize reliance on high-cost borrowings.
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950 block mb-1">4. Secure PMFBY Crop Protection</span>
                <span className="text-slate-700">
                  Ensure crop insurance coverage is active to protect against crop failure, so you are not forced into unmanageable debt if rainfall or pests cause yield losses.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* BRANCH B: NEW FARM LOAN ASSISTANCE (Section 7)               */
        /* ============================================================ */
        <div className="space-y-6" id="new-loan-assistance-view">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-800/40 shadow-xl" id="new-loan-banner">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>NEW FARM LOAN ASSISTANCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              New Farm Loan & Working Capital Assistance
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              You currently have no existing debt burden. Based strictly on your land area and crop cultivation budget, here is your calculated seasonal financing requirement and suggested credit limit.
            </p>
          </div>

          {/* 4 Core Calculation Values (Prompt Section 7 mandate) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="new-loan-calc-grid">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Estimated Cultivation Cost</span>
              <span className="text-2xl font-black text-slate-900">{formatIndianCurrency(assessment.totalCultivationCost)}</span>
              <span className="text-xs text-slate-500 block mt-1">
                {assessment.landAreaAcres} Acres × {formatIndianCurrency(assessment.cultivationCostPerAcre)}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Your Own Contribution</span>
              <span className="text-2xl font-black text-emerald-700">{formatIndianCurrency(assessment.ownContribution)}</span>
              <span className="text-xs text-slate-500 block mt-1">Committed from personal savings</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Estimated Financing Gap</span>
              <span className="text-2xl font-black text-amber-600">{formatIndianCurrency(assessment.financingGap)}</span>
              <span className="text-xs text-slate-500 block mt-1">Cultivation Cost − Own Contribution</span>
            </div>

            <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-md border border-emerald-800">
              <span className="text-xs text-emerald-300 font-semibold block mb-1">Suggested Loan Amount</span>
              <span className="text-2xl font-black text-white">{formatIndianCurrency(assessment.suggestedLoanAmount)}</span>
              <span className="text-xs text-emerald-300 block mt-1">Based strictly on application math</span>
            </div>
          </div>

          {/* Seasonal Repayment vs Commercial Shop Note */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4" id="farm-loan-structure-card">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">How Agricultural Credit Differs from a Business Loan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-950 text-sm block">Farm Loan (KCC Structure)</span>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  <li><strong>Repayment aligned to harvest:</strong> Single bullet repayment or post-harvest cycle (after APMC sale).</li>
                  <li><strong>No forced monthly EMIs:</strong> You are not pressured to pay monthly installments while crops are growing.</li>
                  <li><strong>Concessional Interest:</strong> 7% benchmark, dropping to 4% p.a. upon prompt repayment before due date.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 text-sm block">What to Avoid</span>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  <li><strong>Commercial business loans:</strong> High monthly EMI mandates that drain farmer cash before crop harvest.</li>
                  <li><strong>Informal moneylenders:</strong> 24%–36% annual interest rates that lead to chronic debt distress.</li>
                  <li><strong>Borrowing above actual cultivation need:</strong> Keep credit aligned to the {formatIndianCurrency(assessment.financingGap)} gap.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200" id="assistance-actions">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Loan Status</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-lg shadow-emerald-700/20 transition-all text-sm group"
        >
          <span>View Farmer Schemes & Support</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
