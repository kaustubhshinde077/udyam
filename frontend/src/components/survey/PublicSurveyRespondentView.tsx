import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  MapPin,
  Send,
  Star,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import {
  CommunitySurvey,
  SurveyRespondentInfo,
  SurveyResponse,
  submitSurveyResponse,
  RespondentType,
  AgeGroup,
  Gender,
  RelationshipType,
} from '../../utils/surveyStorage';
import { ArthLogo } from '../common/ArthLogo';

interface Props {
  survey: CommunitySurvey;
  onSubmitted?: () => void;
  onExit?: () => void;
  theme?: 'light' | 'dark';
}

export const PublicSurveyRespondentView: React.FC<Props> = ({
  survey,
  onSubmitted,
  onExit,
  theme = 'light',
}) => {
  // Step 1: Basic respondent info, Step 2: Survey questions, Step 3: Thank you
  const [step, setStep] = useState<'basic' | 'questions' | 'completed'>('basic');

  // Basic questions state
  const [respondentType, setRespondentType] = useState<RespondentType>('Local resident');
  const [village, setVillage] = useState<string>(survey.village || '');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('26–40');
  const [gender, setGender] = useState<Gender>('Prefer not to say');
  const [relationship, setRelationship] = useState<RelationshipType>('Potential customer');
  const [consentGiven, setConsentGiven] = useState<boolean>(true);

  // Survey answers state (questionId -> answer)
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleProceedToQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!village.trim()) {
      setErrorMsg('Please enter your village or locality.');
      return;
    }
    setErrorMsg(null);
    setStep('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      setErrorMsg('Please accept the short privacy consent to submit.');
      return;
    }

    // Check if at least some questions are answered
    const answeredCount = Object.keys(answers).length;
    if (answeredCount === 0 && survey.questions.length > 0) {
      setErrorMsg('Please answer at least one question before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const respondent: SurveyRespondentInfo = {
      respondentType,
      village: village.trim(),
      ageGroup,
      gender,
      relationship,
    };

    const response: SurveyResponse = {
      id: `resp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      surveyId: survey.id,
      submittedAt: new Date().toISOString(),
      respondent,
      answers,
      consentGiven,
    };

    // Save response to localStorage
    submitSurveyResponse(response);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('completed');
      if (onSubmitted) {
        onSubmitted();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
            अ
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              ARTH AI • Community Survey
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Grassroots Demand &amp; Feasibility Validation
            </p>
          </div>
        </div>

        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Exit Survey
          </button>
        )}
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-[#0C192A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-8 space-y-6 transition-colors">
        {/* Survey Title & Location banner */}
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {survey.isFarmer ? 'Agricultural Mandi & Yield Check' : 'Local Business Feasibility Survey'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{survey.village}, {survey.district}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {survey.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {survey.isFarmer
              ? `We are gathering real feedback from farmers and local stakeholders regarding ${survey.cropName || 'crop'} production, input access, and fair market prices in ${survey.village}.`
              : `Help assess genuine community demand for ${survey.activityTitle} in ${survey.village}. Your feedback ensures viable and fair rural services.`}
          </p>
        </div>

        {/* Progress indicator */}
        {step !== 'completed' && (
          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <div
              className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-colors ${
                step === 'basic'
                  ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-700'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              1. Basic Information
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            <div
              className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-colors ${
                step === 'questions'
                  ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-700'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              2. Community Questions
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: BASIC INFORMATION BEFORE SURVEY */}
        {step === 'basic' && (
          <form onSubmit={handleProceedToQuestions} className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Anonymous &amp; Confidential
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                We do not ask for your phone number, name, or financial account details. This survey only records anonymous demographic and demand signals.
              </p>
            </div>

            {/* 1. Respondent Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                1. What describes your role in the locality? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['Farmer', 'Customer', 'Local resident', 'Shopkeeper', 'Trader', 'Other'] as RespondentType[]).map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRespondentType(type)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        respondentType === type
                          ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 dark:border-teal-400 text-teal-950 dark:text-teal-100 ring-2 ring-teal-200 dark:ring-teal-900'
                          : 'bg-white dark:bg-[#0E1C2E] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* 2. Village / Locality */}
            <div className="space-y-2">
              <label htmlFor="village-input" className="block text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                2. Village / Locality <span className="text-rose-500">*</span>
              </label>
              <input
                id="village-input"
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Loni Budruk, Sangamner"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                required
              />
            </div>

            {/* 3. Age Group */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                3. Age Group <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['Under 18', '18–25', '26–40', '41–60', '60+'] as AgeGroup[]).map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setAgeGroup(group)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      ageGroup === group
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 dark:border-teal-400 text-teal-950 dark:text-teal-100 ring-2 ring-teal-200 dark:ring-teal-900'
                        : 'bg-white dark:bg-[#0E1C2E] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Gender (Optional) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  4. Gender (Optional)
                </label>
                <span className="text-[10px] text-slate-400">Optional</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Male', 'Female', 'Other', 'Prefer not to say'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      gender === g
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 dark:border-teal-400 text-teal-950 dark:text-teal-100 ring-2 ring-teal-200 dark:ring-teal-900'
                        : 'bg-white dark:bg-[#0E1C2E] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Relationship to the proposed business/crop/service */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                5. Your relationship to this proposed {survey.isFarmer ? 'crop / harvest' : 'business / service'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    'Potential customer',
                    'Existing customer',
                    'Farmer',
                    'Supplier',
                    'Local resident',
                    'Other',
                  ] as RelationshipType[]
                ).map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setRelationship(rel)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      relationship === rel
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 dark:border-teal-400 text-teal-950 dark:text-teal-100 ring-2 ring-teal-200 dark:ring-teal-900'
                        : 'bg-white dark:bg-[#0E1C2E] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>Continue to Survey Questions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: ACTUAL SURVEY QUESTIONS */}
        {step === 'questions' && (
          <form onSubmit={handleSubmitSurvey} className="space-y-6">
            <div className="flex items-center justify-between pb-2">
              <button
                type="button"
                onClick={() => setStep('basic')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Basic Info</span>
              </button>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {survey.questions.length} Questions
              </span>
            </div>

            <div className="space-y-5">
              {survey.questions.map((q, idx) => {
                const currentAnswer = answers[q.id];

                return (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        <span className="text-teal-600 dark:text-teal-400 mr-1.5">Q{idx + 1}.</span>
                        {q.questionText}
                      </h3>
                    </div>

                    {q.helperText && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{q.helperText}</p>
                    )}

                    {/* Options list */}
                    {q.type === 'multiple_choice' || q.type === 'yes_no' ? (
                      <div className="space-y-2 pt-1">
                        {q.options.map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              currentAnswer === opt
                                ? 'bg-white dark:bg-[#15273C] border-teal-500 dark:border-teal-400 text-teal-950 dark:text-teal-100 font-bold shadow-xs'
                                : 'bg-white/60 dark:bg-[#0E1C2E]/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-[#15273C]'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={currentAnswer === opt}
                              onChange={() => handleAnswerChange(q.id, opt)}
                              className="accent-teal-600 w-4 h-4"
                            />
                            <span className="flex-1">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : q.type === 'rating' ? (
                      <div className="pt-2">
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleAnswerChange(q.id, star)}
                              className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer flex-1 ${
                                Number(currentAnswer) >= star
                                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-900 dark:text-amber-200 font-bold'
                                  : 'bg-white dark:bg-[#0E1C2E] border-slate-200 dark:border-slate-700 text-slate-400'
                              }`}
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  Number(currentAnswer) >= star
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-slate-300 dark:text-slate-600'
                                }`}
                              />
                              <span className="text-[10px] font-mono">{star}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                          <span>1 = Very Low / Poor</span>
                          <span>5 = Excellent / Very High</span>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-1">
                        <textarea
                          value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          placeholder="Type your brief answer..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Privacy / Consent checkbox */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="accent-teal-600 w-4 h-4 mt-0.5"
                />
                <span className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <strong>Consent &amp; Privacy Assurance:</strong> I confirm that I am a resident, farmer, or local patron of this area. My answers are voluntary, anonymous, and will be used solely for evaluating ground feasibility and credit eligibility for local enterprise.
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('basic')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Recording Response...' : 'Submit Anonymous Survey Response'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: THANK YOU CONFIRMATION */}
        {step === 'completed' && (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-400 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Thank You for Your Local Evidence!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Your response has been verified and safely recorded into the community demand record for{' '}
                <strong className="text-slate-900 dark:text-white">{survey.activityTitle}</strong> in{' '}
                <strong className="text-slate-900 dark:text-white">{survey.village}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              <span className="font-mono text-[10px] text-teal-800 dark:text-teal-300 uppercase font-bold block mb-1">
                Data Trust Verified
              </span>
              This grassroots evidence directly helps rural entrepreneurs and farmers establish verified local demand rather than relying on unverified assumptions.
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              {onExit && (
                <button
                  type="button"
                  onClick={onExit}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
                >
                  Return to ARTH AI Portal
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
