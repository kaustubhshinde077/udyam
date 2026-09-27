import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Info,
  ShieldCheck,
  Building,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { BusinessSetupData, ExistingLoanDetails } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';

interface FarmerLoanStatusProps {
  businessSetup: BusinessSetupData;
  onSaveLoanStatus: (updatedSetup: BusinessSetupData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FarmerLoanStatus: React.FC<FarmerLoanStatusProps> = ({
  businessSetup,
  onSaveLoanStatus,
  onNext,
  onBack,
}) => {
  const currentLoan = businessSetup.existingLoan;

  const [hasLoan, setHasLoan] = useState<'Yes' | 'No'>(
    currentLoan?.hasLoan || 'No'
  );

  const [providerName, setProviderName] = useState(
    currentLoan?.providerName || 'Primary Agricultural Credit Society (PACS)'
  );
  const [loanType, setLoanType] = useState(
    currentLoan?.loanType || 'Kisan Credit Card (KCC) Crop Loan'
  );
  const [outstandingAmount, setOutstandingAmount] = useState<number>(
    currentLoan?.outstandingAmount || 50000
  );
  const [monthlyEMI, setMonthlyEMI] = useState<number>(
    currentLoan?.monthlyEMI || 3500
  );
  const [interestRate, setInterestRate] = useState<number | undefined>(
    currentLoan?.interestRate ?? 7
  );
  const [interestRateUnknown, setInterestRateUnknown] = useState<boolean>(
    currentLoan?.interestRateUnknown ?? false
  );
  const [remainingMonths, setRemainingMonths] = useState<string>(
    currentLoan?.emisRemaining ? String(currentLoan.emisRemaining) : '12'
  );
  const [repaymentStatus, setRepaymentStatus] = useState<'normal' | 'struggling' | 'overdue'>(
    currentLoan?.repaymentStatus === 'struggling' || currentLoan?.repaymentStatus === 'overdue'
      ? currentLoan.repaymentStatus
      : 'normal'
  );

  const handleProceed = () => {
    const updatedLoan: ExistingLoanDetails = {
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

    const updatedSetup: BusinessSetupData = {
      ...businessSetup,
      existingLoan: updatedLoan,
    };

    onSaveLoanStatus(updatedSetup);
    onNext();
  };

  const annualBurden = (Number(monthlyEMI) || 0) * 12;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn" id="farmer-loan-status-container">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl" id="loan-status-banner">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30 mb-3">
          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
          <span>STAGE 03 · LOAN STATUS VERIFICATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Do you currently have an active farm or personal loan?
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          ARTH AI assesses your borrowing readiness based on whether you already have debt. If you already have a loan, our primary objective is protecting you from over-indebtedness before recommending any new borrowing.
        </p>
      </div>

      {/* Main Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="loan-choice-cards">
        {/* Option 1: NO Loan */}
        <div
          onClick={() => setHasLoan('No')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
            hasLoan === 'No'
              ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          id="choice-no-loan"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              hasLoan === 'No' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              hasLoan === 'No' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
            }`}>
              {hasLoan === 'No' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900 mb-1">
            NO, I do not have an existing loan
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Starting fresh with a clean slate. You do not currently owe money to a bank, cooperative society (PACS), microfinance group, or moneylender.
          </p>

          <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <span className="font-bold block">What happens next:</span>
            <span>We evaluate your seasonal working capital gap and guide you on applying for institutional credit like the Kisan Credit Card (KCC) at concessional rates.</span>
          </div>
        </div>

        {/* Option 2: YES Loan */}
        <div
          onClick={() => setHasLoan('Yes')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
            hasLoan === 'Yes'
              ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          id="choice-yes-loan"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              hasLoan === 'Yes' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              hasLoan === 'Yes' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
            }`}>
              {hasLoan === 'Yes' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900 mb-1">
            YES, I already have an existing loan
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            You have an active crop loan, term loan, gold loan, equipment loan, or informal debt that requires monthly or seasonal repayment.
          </p>

          <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">What happens next:</span>
            <span>We prioritize an <strong>Existing Loan Assistance</strong> assessment to ensure additional borrowing does not overwhelm your seasonal crop cash flow.</span>
          </div>
        </div>
      </div>

      {/* If YES: Details Form */}
      {hasLoan === 'Yes' && (
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-5 animate-fadeIn" id="existing-loan-form">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Current Loan Details</h2>
              <p className="text-xs text-slate-500">Verify your current numbers for the debt sustainability check</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="status-lender-input">
                Lender / Provider Name
              </label>
              <input
                id="status-lender-input"
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g. PACS, Gramin Bank, SBI, Moneylender"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="status-type-input">
                Loan Category
              </label>
              <input
                id="status-type-input"
                type="text"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                placeholder="e.g. KCC Crop Loan, Tractor Loan, Gold Loan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="status-balance-input">
                Current Outstanding Balance (₹)
              </label>
              <input
                id="status-balance-input"
                type="number"
                value={outstandingAmount}
                onChange={(e) => setOutstandingAmount(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="status-emi-input">
                Monthly EMI / Repayment Amount (₹)
              </label>
              <input
                id="status-emi-input"
                type="number"
                value={monthlyEMI}
                onChange={(e) => setMonthlyEMI(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-500">Annual commitment: ~{formatIndianCurrency(annualBurden)}/year</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="status-rate-input">
                Interest Rate (% p.a.)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="status-rate-input"
                  type="number"
                  step="0.1"
                  disabled={interestRateUnknown}
                  value={interestRate ?? ''}
                  onChange={(e) => setInterestRate(e.target.value !== '' ? Number(e.target.value) : undefined)}
                  className="w-28 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium disabled:bg-slate-100"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="status-repayment-select">
                Repayment Track Record
              </label>
              <select
                id="status-repayment-select"
                value={repaymentStatus}
                onChange={(e) => setRepaymentStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
              >
                <option value="normal">Normal / Regular on-time payments</option>
                <option value="struggling">Facing difficulty / Crop loss strain</option>
                <option value="overdue">Overdue / Missed installment</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200" id="loan-status-actions">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Farm Assessment</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-lg shadow-emerald-700/20 transition-all text-sm group"
        >
          <span>
            {hasLoan === 'Yes'
              ? 'Continue to Existing Loan Assistance'
              : 'Continue to New Farm Loan Assistance'}
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
