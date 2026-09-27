import React, { useState } from 'react';
import { BasicInfoData, Gender, Language, SocialCategory, AreaType } from '../../types';
import { STATES_AND_DISTRICTS, OCCUPATION_OPTIONS } from '../../data/mockLocalData';
import { UI_TRANSLATIONS } from '../../data/translations';
import { User, MapPin, Briefcase, ArrowRight, ArrowLeft, AlertCircle, HelpCircle } from 'lucide-react';

interface Props {
  initialData: BasicInfoData;
  language: Language;
  onSaveAndNext: (data: BasicInfoData) => void;
  onBack: () => void;
}

export const BasicInfoForm: React.FC<Props> = ({
  initialData,
  language,
  onSaveAndNext,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [formData, setFormData] = useState<BasicInfoData>(initialData);
  const [currentSubSection, setCurrentSubSection] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableDistricts = STATES_AND_DISTRICTS[formData.state] || [
    'District Central',
    'North Taluka',
    'South Taluka',
  ];

  const updateField = <K extends keyof BasicInfoData>(field: K, value: BasicInfoData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field as string];
        return copy;
      });
    }
  };

  // Form completion percentage calculation
  const totalQuestions = 15;
  const answeredQuestionsCount = [
    Boolean(formData.name && formData.name.trim().length > 0),
    Boolean(formData.dob),
    Boolean(formData.gender),
    Boolean(formData.category),
    Boolean(formData.mobile && formData.mobile.length === 10),
    Boolean(formData.state),
    Boolean(formData.district),
    Boolean(formData.village && formData.village.trim().length > 0),
    Boolean(formData.pincode && formData.pincode.length === 6),
    Boolean(formData.areaType),
    Boolean(formData.currentOccupation),
    Boolean(formData.workedInBusinessBefore),
    Boolean(formData.workedInBusinessBefore === 'No' || (formData.experienceYears !== undefined && formData.experienceYears >= 0)),
    Boolean(formData.reportLanguage),
    Boolean(formData.specialAssistance),
  ].filter(Boolean).length;
  const formProgressPercent = Math.min(100, Math.round((answeredQuestionsCount / totalQuestions) * 100));

  const validateSubSection1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }
    if (!formData.dob) {
      newErrors.dob = 'Please select your date of birth.';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please choose your gender.';
    }
    if (!formData.category) {
      newErrors.category = 'Please choose your social category.';
    }
    if (!formData.mobile || formData.mobile.length !== 10) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSubSection2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.state) {
      newErrors.state = 'Please select your state.';
    }
    if (!formData.district) {
      newErrors.district = 'Please select your district.';
    }
    if (!formData.village.trim()) {
      newErrors.village = 'Please enter your village or town name.';
    }
    if (!formData.pincode || formData.pincode.length !== 6) {
      newErrors.pincode = 'Please enter your 6-digit postal pincode.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSubSection3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.currentOccupation) {
      newErrors.currentOccupation = 'Please choose your current work or occupation.';
    }
    if (formData.workedInBusinessBefore === 'Yes' && formData.experienceYears < 0) {
      newErrors.experienceYears = 'Please enter how many years of business experience you have.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentSubSection === 1) {
      if (validateSubSection1()) setCurrentSubSection(2);
    } else if (currentSubSection === 2) {
      if (validateSubSection2()) setCurrentSubSection(3);
    } else if (currentSubSection === 3) {
      if (validateSubSection3()) {
        onSaveAndNext(formData);
      }
    }
  };

  const handlePrev = () => {
    if (currentSubSection === 3) setCurrentSubSection(2);
    else if (currentSubSection === 2) setCurrentSubSection(1);
    else onBack();
  };

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section Header & Sub-step tracker */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F284E] bg-blue-100 px-2.5 py-1 rounded">
                Basic Citizen Information (Part 1)
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {currentSubSection === 1 && '1. Personal Details (आपकी व्यक्तिगत जानकारी)'}
                {currentSubSection === 2 && '2. Location & Village (गांव और स्थान)'}
                {currentSubSection === 3 && '3. Work Background & Preferences (काम का अनुभव)'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                    currentSubSection === stepNum
                      ? 'bg-[#0F284E] text-white border-[#0F284E]'
                      : currentSubSection > stepNum
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  {currentSubSection > stepNum ? '✓' : stepNum}
                </div>
              ))}
              <span className="text-xs font-semibold text-slate-600">
                Step {currentSubSection} of 3
              </span>
            </div>
          </div>

          {/* Form Completion % Tracker */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-200/80 rounded-xl p-4 mb-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span className="text-sm font-bold text-[#0F284E]">
                  Form Progress: <span className="text-emerald-700 text-base font-extrabold">{formProgressPercent}%</span>
                </span>
                <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                  {answeredQuestionsCount} of {totalQuestions} Questions Answered
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {formProgressPercent === 100 ? '✓ Ready to Proceed' : `${100 - formProgressPercent}% Remaining`}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden border border-slate-300">
              <div
                className="bg-gradient-to-r from-[#0F284E] via-blue-700 to-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${formProgressPercent}%` }}
                role="progressbar"
                aria-valuenow={formProgressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          {/* SUB-SECTION 1: Personal Details */}
          {currentSubSection === 1 && (
            <div className="space-y-6">
              {/* Question 1: Name */}
              <div>
                <label
                  htmlFor="basic-name-input"
                  className="block text-base font-bold text-slate-900 mb-1.5"
                >
                  1. Full Name (पूरा नाम / पूर्ण नाव) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="basic-name-input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g. Ramesh Shankar Patil"
                  className={`w-full px-4 py-3 text-base rounded-lg border-2 bg-white text-slate-900 min-h-[48px] focus:outline-none ${
                    errors.name ? 'border-rose-500' : 'border-slate-300 focus:border-[#0F284E]'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Question 2: Date of Birth */}
              <div>
                <label
                  htmlFor="basic-dob-input"
                  className="block text-base font-bold text-slate-900 mb-1.5"
                >
                  2. Date of Birth (जन्म तिथि / जन्मतारीख) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="basic-dob-input"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateField('dob', e.target.value)}
                  className={`w-full px-4 py-3 text-base rounded-lg border-2 bg-white text-slate-900 min-h-[48px] focus:outline-none ${
                    errors.dob ? 'border-rose-500' : 'border-slate-300 focus:border-[#0F284E]'
                  }`}
                />
                <p className="text-xs text-slate-500 mt-1">Used to check age eligibility for government schemes.</p>
                {errors.dob && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.dob}
                  </p>
                )}
              </div>

              {/* Question 3: Gender */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  3. Gender (लिंग) <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Male', 'Female', 'Other'] as Gender[]).map((genderOption) => (
                    <button
                      key={genderOption}
                      type="button"
                      onClick={() => updateField('gender', genderOption)}
                      className={`p-3 text-sm font-semibold rounded-lg border-2 text-center min-h-[48px] transition-colors ${
                        formData.gender === genderOption
                          ? 'border-[#0F284E] bg-blue-50 text-[#0F284E] font-bold shadow-xs'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {genderOption}
                    </button>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.gender}
                  </p>
                )}
              </div>

              {/* Question 4: Category */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  4. Social Category (सामाजिक प्रवर्ग) <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(['General', 'OBC', 'SC', 'ST', 'Other / EWS'] as SocialCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => updateField('category', cat)}
                      className={`p-3 text-sm font-semibold rounded-lg border-2 text-center min-h-[48px] transition-colors ${
                        formData.category === cat
                          ? 'border-[#0F284E] bg-blue-50 text-[#0F284E] font-bold shadow-xs'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.category}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">Special categories (SC/ST/OBC/Women/Minority) are eligible for priority sector credit concessions and reduced promoter margin requirements under PS 26091 guidelines.</p>
              </div>

              {/* Question 5: Mobile Number */}
              <div>
                <label
                  htmlFor="basic-mobile-input"
                  className="block text-base font-bold text-slate-900 mb-1.5"
                >
                  5. Mobile Number (मोबाइल नंबर) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="basic-mobile-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => updateField('mobile', e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className={`w-full px-4 py-3 text-base tabular-nums rounded-lg border-2 bg-white text-slate-900 min-h-[48px] focus:outline-none ${
                    errors.mobile ? 'border-rose-500' : 'border-slate-300 focus:border-[#0F284E]'
                  }`}
                />
                {errors.mobile && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.mobile}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SUB-SECTION 2: Location Details */}
          {currentSubSection === 2 && (
            <div className="space-y-6">
              {/* Question 6: State */}
              <div>
                <label
                  htmlFor="state-select"
                  className="block text-base font-bold text-slate-900 mb-1.5"
                >
                  6. State (राज्य) <span className="text-rose-600">*</span>
                </label>
                <select
                  id="state-select"
                  value={formData.state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    const districts = STATES_AND_DISTRICTS[newState] || [];
                    updateField('state', newState);
                    updateField('district', districts[0] || '');
                  }}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 border-slate-300 bg-white text-slate-900 min-h-[48px] focus:outline-none focus:border-[#0F284E]"
                >
                  <option value="">-- Select State (राज्य निवडा) --</option>
                  {Object.keys(STATES_AND_DISTRICTS).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.state}
                  </p>
                )}
              </div>

              {/* Question 7: District */}
              <div>
                <label
                  htmlFor="district-select"
                  className="block text-base font-bold text-slate-900 mb-1.5"
                >
                  7. District (जिल्हा / ज़िला) <span className="text-rose-600">*</span>
                </label>
                <select
                  id="district-select"
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 border-slate-300 bg-white text-slate-900 min-h-[48px] focus:outline-none focus:border-[#0F284E]"
                >
                  <option value="">-- Select District (जिल्हा निवडा) --</option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.district}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">Local APMC Mandi rates and trade data will be loaded for this district.</p>
              </div>

              {/* Question 8: Village / Town */}
              <div>
                <label
                  htmlFor="village-input"
                  className="block text-base font-bold text-slate-900 mb-1.5"
                >
                  8. Village / Town Name (गांव / शहर का नाम) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="village-input"
                  type="text"
                  value={formData.village}
                  onChange={(e) => updateField('village', e.target.value)}
                  placeholder="e.g. Shirur, Baramati, or Malegaon"
                  className={`w-full px-4 py-3 text-base rounded-lg border-2 bg-white text-slate-900 min-h-[48px] focus:outline-none ${
                    errors.village ? 'border-rose-500' : 'border-slate-300 focus:border-[#0F284E]'
                  }`}
                />
                {errors.village && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.village}
                  </p>
                )}
              </div>

              {/* Question 9: Pincode */}
              <div>
                <label
                  htmlFor="pincode-input"
                  className="block text-base font-bold text-slate-900 mb-1.5"
                >
                  9. 6-Digit Postal Pincode (पिनकोड) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="pincode-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, ''))}
                  placeholder="412210"
                  className={`w-full px-4 py-3 text-base tabular-nums rounded-lg border-2 bg-white text-slate-900 min-h-[48px] focus:outline-none ${
                    errors.pincode ? 'border-rose-500' : 'border-slate-300 focus:border-[#0F284E]'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.pincode}
                  </p>
                )}
              </div>

              {/* Question 10: Area Type */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  10. Area Type (क्षेत्र का प्रकार)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(['Rural', 'Semi-Urban'] as AreaType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateField('areaType', type)}
                      className={`p-4 text-base font-bold rounded-lg border-2 text-center min-h-[50px] transition-colors ${
                        formData.areaType === type
                          ? 'border-[#0F284E] bg-blue-50 text-[#0F284E]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {type === 'Rural' ? 'Rural (ग्रामीण)' : 'Semi-Urban (अर्ध-शहरी)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-SECTION 3: Background & Preferences */}
          {currentSubSection === 3 && (
            <div className="space-y-6">
              {/* Question 11: Current Occupation */}
              <div>
                <label
                  htmlFor="occupation-select"
                  className="block text-base font-bold text-slate-900 mb-1.5"
                >
                  11. Current Occupation (वर्तमान व्यवसाय) <span className="text-rose-600">*</span>
                </label>
                <select
                  id="occupation-select"
                  value={formData.currentOccupation}
                  onChange={(e) => updateField('currentOccupation', e.target.value)}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 border-slate-300 bg-white text-slate-900 min-h-[48px] focus:outline-none focus:border-[#0F284E]"
                >
                  <option value="">-- Select Your Current Work --</option>
                  {OCCUPATION_OPTIONS.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
                {errors.currentOccupation && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.currentOccupation}
                  </p>
                )}
              </div>

              {/* Question 12: Worked in a business before? */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  12. Have you worked in a business before? (क्या पहले व्यापार का अनुभव है?)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(['Yes', 'No'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField('workedInBusinessBefore', opt)}
                      className={`p-3.5 text-base font-bold rounded-lg border-2 text-center min-h-[48px] transition-colors ${
                        formData.workedInBusinessBefore === opt
                          ? 'border-[#0F284E] bg-blue-50 text-[#0F284E]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt === 'Yes' ? 'Yes (हाँ / होय)' : 'No (नहीं / नाही)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 13: If yes, how many years? */}
              {formData.workedInBusinessBefore === 'Yes' && (
                <div>
                  <label
                    htmlFor="years-exp-input"
                    className="block text-base font-bold text-slate-900 mb-1.5"
                  >
                    13. If yes, how many years? (कितने वर्षों का अनुभव है?)
                  </label>
                  <input
                    id="years-exp-input"
                    type="number"
                    min={0}
                    max={50}
                    value={formData.experienceYears}
                    onChange={(e) => updateField('experienceYears', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 text-base rounded-lg border-2 border-slate-300 bg-white text-slate-900 min-h-[48px] focus:outline-none focus:border-[#0F284E]"
                  />
                </div>
              )}

              {/* Question 14: Report Language */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  14. Report Language Preference (अहवाल भाषा / रिपोर्ट भाषा)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Marathi', 'Hindi', 'English'] as const).map((langOpt) => (
                    <button
                      key={langOpt}
                      type="button"
                      onClick={() => updateField('reportLanguage', langOpt)}
                      className={`p-3 text-sm font-bold rounded-lg border-2 text-center min-h-[48px] transition-colors ${
                        formData.reportLanguage === langOpt
                          ? 'border-[#0F284E] bg-blue-50 text-[#0F284E]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {langOpt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 15: Special Assistance */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  15. Do you need any special assistance? (विशेष सहायता आवश्यकता)
                </label>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  {(['No', 'Yes'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField('specialAssistance', opt)}
                      className={`p-3 text-sm font-bold rounded-lg border-2 text-center min-h-[48px] transition-colors ${
                        formData.specialAssistance === opt
                          ? 'border-[#0F284E] bg-blue-50 text-[#0F284E]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt === 'No' ? 'No (नहीं)' : 'Yes – select type (हाँ)'}
                    </button>
                  ))}
                </div>

                {formData.specialAssistance === 'Yes' && (
                  <div>
                    <label
                      htmlFor="assistance-type-select"
                      className="block text-xs font-bold text-slate-700 mb-1"
                    >
                      Select Assistance Type
                    </label>
                    <select
                      id="assistance-type-select"
                      value={formData.specialAssistanceType || 'Voice read-aloud support'}
                      onChange={(e) => updateField('specialAssistanceType', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-slate-300 bg-white text-slate-900 min-h-[44px]"
                    >
                      <option value="Voice read-aloud support">Voice read-aloud support (बोलकर सुनाने की सहायता)</option>
                      <option value="Local language translation help">Regional translator assistance</option>
                      <option value="Physical disability priority">Divyangjan / Physical disability priority</option>
                      <option value="Panchayat facilitator visit">Request Gram Panchayat Mitra visit</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrev}
              className="px-6 py-3.5 text-slate-800 font-bold text-base rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-100 min-h-[48px] flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.back}</span>
            </button>

            <button
              id="basic-info-continue-btn"
              type="button"
              onClick={handleNext}
              className="px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base rounded-lg shadow-sm min-h-[48px] flex items-center gap-2 transition-colors"
            >
              <span>{currentSubSection === 3 ? 'Save & Continue to Business Setup' : t.continue}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
