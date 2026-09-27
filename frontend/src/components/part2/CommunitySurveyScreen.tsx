import React, { useState } from 'react';
import { Language, SurveyQuestionItem, SurveySummary } from '../../types';
import { DEFAULT_SURVEY_QUESTIONS } from '../../data/mockLocalData';
import { UI_TRANSLATIONS } from '../../data/translations';
import {
  Users,
  QrCode,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface Props {
  subActivity: string;
  village: string;
  district: string;
  language: Language;
  onContinueToEvidence: () => void;
  onBack: () => void;
}

export const CommunitySurveyScreen: React.FC<Props> = ({
  subActivity,
  village,
  district,
  language,
  onContinueToEvidence,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];

  const [surveyGenerated, setSurveyGenerated] = useState<boolean>(true);
  const [responseCount, setResponseCount] = useState<number>(12);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const surveyUrl = `https://rural-business.gov.in/survey/${encodeURIComponent(
    village.toLowerCase().replace(/\s+/g, '-')
  )}/${encodeURIComponent(subActivity.toLowerCase().replace(/\s+/g, '-'))}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSimulateResponse = () => {
    setResponseCount((prev) => prev + 1);
  };

  // Signal rule: if < 5, "Not enough responses yet"
  const isSampleSmall = responseCount < 5;
  const communityInterestSignal = isSampleSmall
    ? 'Not enough responses yet'
    : responseCount >= 10
    ? 'Positive Interest'
    : 'Moderate Interest';

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F284E] bg-blue-100 px-2.5 py-1 rounded">
                Part 2 • Screen 3: Field Validation
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F284E] mt-1">
                Ask people in your area
              </h1>
              <p className="text-sm sm:text-base text-slate-700 mt-1">
                You can ask local people whether they would buy this product or service.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-900 border border-purple-300 rounded-lg">
                Maximum 6 Questions
              </span>
            </div>
          </div>

          {/* 7-Day Verification Roadmap Notice */}
          <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-400 rounded-xl flex items-start gap-3">
            <div className="mt-0.5 p-1.5 bg-amber-200 text-amber-900 rounded-lg shrink-0">
              <Sparkles className="w-4 h-4 text-amber-900" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                Notice: 1st Report will be visible after 7 days (अहवाल ७ दिवसांनंतर उपलब्ध होईल)
              </h4>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                Collecting grassroots community feedback is part of the 7-day field verification procedure. Upon submitting the responses below, your <strong>1st Field &amp; Market Feasibility Report</strong> will be compiled and ready to view and download.
              </p>
            </div>
          </div>

          {/* Action Bar: Generate, Share, QR Code, Copy Link */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-300 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSurveyGenerated(true)}
                className="px-4 py-2 bg-[#0F284E] text-white font-bold text-xs sm:text-sm rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Generate Survey</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="px-4 py-2 bg-white text-slate-800 font-bold text-xs sm:text-sm rounded-lg border-2 border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                <QrCode className="w-4 h-4 text-slate-700" />
                <span>QR Code</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 bg-white text-slate-800 font-bold text-xs sm:text-sm rounded-lg border-2 border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-700" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Community Survey for ${subActivity}`,
                    text: `Please share your quick opinion on starting ${subActivity} in ${village}`,
                    url: surveyUrl,
                  });
                } else {
                  handleCopyLink();
                }
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-lg flex items-center gap-1.5 min-h-[44px] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          {/* Response Count & Signal Display */}
          <div className="mt-6 p-5 bg-blue-50/70 border-2 border-blue-200 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Citizen Response Status
                </span>
                <h2 className="text-2xl font-extrabold text-[#0F284E] mt-0.5">
                  {responseCount} people have responded
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Surveys collected in {village} and surrounding agricultural fields.
                </p>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Assessment Metric
                </span>
                <div
                  className={`mt-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border-2 font-bold text-sm ${
                    isSampleSmall
                      ? 'bg-slate-200 text-slate-800 border-slate-400'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Community Interest Signal: {communityInterestSignal}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Do NOT call it &quot;Confirmed Demand&quot; — this is a{' '}
                  <strong>Community Interest Signal</strong>.
                </p>
              </div>
            </div>

            {/* Basic Summary */}
            <div className="mt-4 pt-4 border-t border-blue-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <span className="font-bold text-slate-900 block">Willingness to Buy:</span>
                <p className="text-emerald-700 font-bold text-sm mt-0.5">
                  83% said &quot;Definitely Yes&quot;
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <span className="font-bold text-slate-900 block">Top Customer Priority:</span>
                <p className="text-slate-800 font-semibold text-sm mt-0.5">
                  Fair Price &amp; Fresh Quality
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <span className="font-bold text-slate-900 block">Typical Monthly Spend:</span>
                <p className="text-slate-800 font-semibold text-sm mt-0.5">₹300 – ₹800 per home</p>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleSimulateResponse}
                className="text-xs font-bold text-blue-800 hover:text-blue-950 underline"
              >
                + Simulate Another Village Response (Demo)
              </button>
            </div>
          </div>
        </div>

        {/* The 6 Simple Survey Questions Preview */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F284E]">
              The 6 Simple Questions Asked to Villagers:
            </h2>
            <span className="text-xs text-slate-500">Short &amp; easily spoken in regional language</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_SURVEY_QUESTIONS.map((q) => (
              <div key={q.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-[#0F284E] block mb-1">
                  Question {q.id}: {q.questionText}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {q.options.map((opt, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-white rounded border border-slate-300 text-slate-700"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code Modal */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center border-2 border-[#0F284E]">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Village Survey QR Code</h3>
              <p className="text-xs text-slate-600 mb-4">
                Ask neighbors or customers at weekly haat to scan with any smartphone camera.
              </p>

              {/* QR Code Graphic */}
              <div className="w-48 h-48 mx-auto bg-slate-100 border-2 border-slate-800 p-3 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-white">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${
                        (i * 7 + 3) % 2 === 0 ? 'bg-slate-900' : 'bg-transparent'
                      } rounded-xs`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs font-mono text-slate-500 mt-3 truncate px-2">{surveyUrl}</p>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="mt-5 w-full py-2.5 bg-[#0F284E] text-white font-bold rounded-lg text-sm"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3.5 text-slate-800 font-bold text-base rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-100 min-h-[48px] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <button
            id="continue-to-report1-btn"
            type="button"
            onClick={onContinueToEvidence}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-lg shadow-sm min-h-[50px] flex items-center justify-center gap-3 transition-colors"
          >
            <span>Proceed to 1st Report (७-दिवसीय पडताळणी अहवाल)</span>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
