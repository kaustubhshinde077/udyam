import React from 'react';
import { BasicInfoData, BusinessSetupData, Language } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { X, Printer, Download, CheckCircle2, Shield, Calendar, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  language: Language;
}

export const PreliminaryReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  basicInfo,
  businessSetup,
  language,
}) => {
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const refNumber = `ARTH-VRF-2026-${(basicInfo.pincode || '411001').slice(-3)}${Math.floor(
    100 + Math.random() * 900
  )}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Modal Controls Header (Hidden when printing) */}
        <div className="bg-[#0F284E] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-400 print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-bold text-white">
                Stage 1 Report: 7-Day Verification Dossier
              </h2>
              <p className="text-[11px] text-amber-200">
                Official preliminary registration record (७ दिवसांत क्षेत्रीय पडताळणी अहवाल)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-950" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-blue-900 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto print:p-0 space-y-6 text-slate-900 font-sans">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  National Micro-Enterprise Support &amp; Verification Framework
                </span>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 mt-0.5">
                  ARTH • ENTERPRISE ADVISORY DOSSIER
                </h1>
                <p className="text-xs font-semibold text-slate-700">
                  Preliminary Registration &amp; 7-Day Field Verification Schedule
                </p>
              </div>

              <div className="text-left sm:text-right text-xs">
                <div className="font-bold text-slate-900">
                  Ref: <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 tabular-nums">{refNumber}</span>
                </div>
                <div className="text-slate-500 text-[11px] mt-1 flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3 h-3" /> Date: {today}
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Status: Application Registered • 7-Day Field Verification Initiated</span>
              </div>
              <span className="text-emerald-800 text-[11px] font-semibold bg-white px-2 py-0.5 rounded border border-emerald-200">
                Panchayat ID Verified
              </span>
            </div>
          </div>

          {/* Section 1: Entrepreneur Profile */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1.5 rounded mb-3 border-l-4 border-slate-900">
              1. Citizen &amp; Demographic Profile (नागरिक माहिती)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
              <div>
                <span className="text-slate-500 block">Applicant Name:</span>
                <strong className="text-slate-900 text-sm">{basicInfo.name || 'Not provided'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Mobile Number:</span>
                <strong className="text-slate-900 tabular-nums font-semibold">+91 {basicInfo.mobile || '—'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Gender / Category:</span>
                <strong className="text-slate-900">{basicInfo.gender} • {basicInfo.category}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <strong className="text-slate-900">{basicInfo.village || 'Village'}, {basicInfo.district}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">State / Pincode:</span>
                <strong className="text-slate-900">{basicInfo.state} - {basicInfo.pincode}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Prior Experience:</span>
                <strong className="text-slate-900">
                  {basicInfo.workedInBusinessBefore === 'Yes'
                    ? `${basicInfo.experienceYears} Years`
                    : 'First-time Entrepreneur'}
                </strong>
              </div>
            </div>
          </div>

          {/* Section 2: Proposed Business */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1.5 rounded mb-3 border-l-4 border-slate-900">
              2. Proposed Enterprise Plan (व्यवसाय नियोजन)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
              <div>
                <span className="text-slate-500 block">Business Category:</span>
                <strong className="text-slate-900">{businessSetup.businessCategory}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Specific Activity:</span>
                <strong className="text-blue-900">{businessSetup.subActivity}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Work Location:</span>
                <strong className="text-slate-900">{businessSetup.workLocation}</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Main Selling Areas:</span>
                <strong className="text-slate-900">
                  {Array.isArray(businessSetup.sellLocation)
                    ? businessSetup.sellLocation.join(', ')
                    : businessSetup.sellLocation}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Material Ease:</span>
                <strong className="text-slate-900">{businessSetup.rawMaterialEase}</strong>
              </div>
            </div>
          </div>

          {/* Section 3: Capital & Financial Requirement */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1.5 rounded mb-3 border-l-4 border-slate-900">
              3. Financial &amp; Asset Status (भांडवल व संसाधने)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
              <div>
                <span className="text-slate-500 block">Own Starting Savings:</span>
                <strong className="text-emerald-800 text-sm font-bold tabular-nums">
                  {formatIndianCurrency(businessSetup.ownStartingMoney || 0)}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Requested Credit Support:</span>
                <strong className="text-blue-900 text-sm font-bold tabular-nums">
                  {businessSetup.needFinancialSupport === 'Yes'
                    ? formatIndianCurrency(businessSetup.financialSupportAmount || 0)
                    : 'Self-funded'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Informal Debt Exposure:</span>
                <strong className="text-slate-900">
                  {businessSetup.hasInformalLoan === 'Yes'
                    ? `${formatIndianCurrency(businessSetup.informalLoanRemaining || 0)}`
                    : 'Nil / None'}
                </strong>
              </div>
            </div>

            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <div>
                <span className="font-semibold text-slate-700">Assets Already Available: </span>
                <span className="text-slate-900">{businessSetup.alreadyHave?.join(', ') || 'None'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Identified Equipment Needs: </span>
                <span className="text-slate-900">{businessSetup.needToStart?.join(', ') || 'Standard toolkit'}</span>
              </div>
            </div>
          </div>

          {/* Section 4: 7-Day Field Verification Roadmap */}
          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-700" />
              7-Day Official Field Verification Schedule (७-दिवसीय पडताळणी वेळापत्रक)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="font-bold text-blue-900 block mb-0.5">Day 1 to 2: Database Match</span>
                <p className="text-slate-600">
                  Cross-validation with District Industry Centre (DIC), APMC Mandi database, and Gram Panchayat enterprise records.
                </p>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="font-bold text-blue-900 block mb-0.5">Day 3 to 5: Field Officer Visit</span>
                <p className="text-slate-600">
                  Designated Enterprise Facilitator / Panchayat Officer inspects premise and verifies equipment quotation.
                </p>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="font-bold text-blue-900 block mb-0.5">Day 6 to 7: Bankable Project Letter</span>
                <p className="text-slate-600">
                  Generation of ARTH AI Two-Gate clearance dossier for Lead District Bank / Regional Rural Bank credit manager.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Sign-off Block */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">ARTH AI • Assistant for Microentrepreneurs</p>
              <p>Certified digital transmission record under e-Governance guidelines.</p>
            </div>
            <div className="text-right">
              <div className="w-24 h-8 border border-dashed border-slate-400 rounded flex items-center justify-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                [Digital Stamp]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
