import React, { useState } from 'react';
import {
  User,
  MapPin,
  CheckCircle2,
  Edit3,
  Save,
  X,
  ShieldCheck,
  Globe,
  Sun,
  Moon,
  Bell,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Sprout,
  Briefcase,
  IndianRupee,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  Award,
  Lock,
  Phone,
  Check,
  AlertCircle,
  Clock,
  LandPlot,
  Droplets,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import {
  BasicInfoData,
  BusinessSetupData,
  FinancialFeasibilityResult,
  Language,
  Phase2CostData,
  SocialCategory,
  Gender,
  JourneyMode,
} from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { JourneyStageId } from '../common/Header';

interface ProfilePageProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  phase2Cost?: Phase2CostData;
  feasibility?: FinancialFeasibilityResult;
  language: Language;
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  journeyMode: JourneyMode;
  onUpdateBasicInfo: (updated: BasicInfoData) => void;
  onLanguageChange: (lang: Language) => void;
  onToggleTheme: () => void;
  onNavigateToStage: (stage: JourneyStageId) => void;
  onLogout: () => void;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  basicInfo,
  businessSetup,
  phase2Cost,
  feasibility,
  language,
  theme,
  isAuthenticated,
  journeyMode,
  onUpdateBasicInfo,
  onLanguageChange,
  onToggleTheme,
  onNavigateToStage,
  onLogout,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Edit Mode state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  // Form inputs for Edit Profile
  const [formData, setFormData] = useState({
    name: basicInfo.name || 'Savita Patil',
    dob: basicInfo.dob || '1992-05-14',
    gender: basicInfo.gender || 'Female',
    category: basicInfo.category || 'OBC',
    mobile: basicInfo.mobile || '9822012345',
    state: basicInfo.state || 'Maharashtra',
    district: basicInfo.district || 'Ahmednagar',
    village: basicInfo.village || 'Loni Budruk',
    pincode: basicInfo.pincode || '413736',
    currentOccupation: basicInfo.currentOccupation || (businessSetup.entityType === 'farmer' ? 'Farming' : 'Micro-Enterprise'),
  });

  // Notification settings stored in localStorage
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('arth_notifications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      seasonalAdvisory: true,
      mandiPriceUpdates: true,
      schemeReminders: true,
      loanRepaymentAlerts: false,
    };
  });

  const isFarmer = businessSetup.entityType === 'farmer' || journeyMode === 'farmer';
  const displayName = basicInfo.name || 'Savita Patil';
  const displayMobile = basicInfo.mobile || '9822012345';
  const displayVillage = basicInfo.village || 'Loni Budruk';
  const displayDistrict = basicInfo.district || 'Ahmednagar';
  const displayState = basicInfo.state || 'Maharashtra';
  const userRole = isFarmer ? 'Farmer' : 'Micro-Entrepreneur';

  // Generate Initials
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'SP';
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BasicInfoData = {
      ...basicInfo,
      name: formData.name.trim(),
      dob: formData.dob,
      gender: formData.gender as Gender,
      category: formData.category as SocialCategory,
      mobile: formData.mobile.trim(),
      state: formData.state.trim(),
      district: formData.district.trim(),
      village: formData.village.trim(),
      pincode: formData.pincode.trim(),
      currentOccupation: formData.currentOccupation.trim(),
    };

    onUpdateBasicInfo(updated);
    setIsEditing(false);
    setEditSuccessMsg(true);
    setTimeout(() => setEditSuccessMsg(false), 3000);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: basicInfo.name || 'Savita Patil',
      dob: basicInfo.dob || '1992-05-14',
      gender: basicInfo.gender || 'Female',
      category: basicInfo.category || 'OBC',
      mobile: basicInfo.mobile || '9822012345',
      state: basicInfo.state || 'Maharashtra',
      district: basicInfo.district || 'Ahmednagar',
      village: basicInfo.village || 'Loni Budruk',
      pincode: basicInfo.pincode || '413736',
      currentOccupation: basicInfo.currentOccupation || (isFarmer ? 'Farming' : 'Micro-Enterprise'),
    });
    setIsEditing(false);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev: typeof notifications) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('arth_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Farmer specific details
  const cropName = businessSetup.farmerData?.cropName || 'Kharif Onion';
  const landArea = businessSetup.farmerData?.landAreaAcres || 2;
  const season = businessSetup.farmerData?.season || 'Kharif';
  const irrigation = businessSetup.farmerData?.irrigationStatus || 'Drip / Sprinkler';

  // Entrepreneur specific details
  const businessActivity = businessSetup.subActivity || businessSetup.businessCategory || 'Dairy Business';
  const ownMoney = businessSetup.ownStartingMoney || 50000;
  const requiredSupport = businessSetup.financialSupportAmount || 330000;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6 sm:space-y-8 transition-colors">
      
      {/* Top back navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1C2E] hover:bg-slate-50 dark:hover:bg-[#15273C] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to App</span>
        </button>

        <span className="text-[11px] font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800">
          User Account &amp; Preferences
        </span>
      </div>

      {/* Success notification banner */}
      {editSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-xs transition-all animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Profile information updated successfully. Changes are saved to your account.</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1 — PROFILE HEADER                                */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0C192A] border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
        {/* Ambient subtle gradient border background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-teal-500/10 dark:from-teal-500/20 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            
            {/* Initials Avatar */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md ring-4 ring-white dark:ring-[#0C192A] tracking-wider select-none">
                {getInitials(displayName)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0C192A] flex items-center justify-center text-white" title="Active Account">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {displayName}
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-mono uppercase">
                  {userRole}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{displayVillage}, {displayDistrict}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Mobile Verified ({displayMobile})</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Member of ARTH AI Financial Inclusion Network • Region: {displayState}
              </p>
            </div>
          </div>

          {/* Edit Profile button */}
          <div className="shrink-0">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#15273C] hover:bg-slate-200 dark:hover:bg-[#1C324D] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-800 text-xs font-semibold cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2 — PERSONAL INFORMATION (VIEW & EDIT MODES)      */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0C192A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              Personal Information
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            {isEditing ? 'Editing Mode' : 'KYC Baseline'}
          </span>
        </div>

        {/* EDIT PROFILE FORM */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[10px]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[10px]">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[10px]">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[10px]">
                  Social Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as SocialCategory })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Other / EWS">Other / EWS</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[10px]">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  maxLength={10}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[10px]">
                  Village / Locality
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[10px]">
                  District
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[10px]">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          /* READ-ONLY INFORMATION VIEW (2-column on desktop, 1-column on mobile) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                Full Name
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                {displayName}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                Date of Birth / Age
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                {basicInfo.dob || '14-05-1992 (32 yrs)'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                Gender &amp; Social Category
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                {basicInfo.gender || 'Female'} • {basicInfo.category || 'OBC'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                Mobile Number
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 font-mono">
                +91 {displayMobile}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                Location (Village &amp; District)
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                {displayVillage}, {displayDistrict}, {displayState}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                User Role &amp; Entity Type
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                {userRole} ({basicInfo.areaType || 'Rural'})
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 3 — MY ARTH AI (DYNAMIC PLAN & ASSISTANCE)        */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0C192A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            {isFarmer ? (
              <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            )}
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              My ARTH AI • {isFarmer ? 'Active Farm & Crop Plan' : 'Active Enterprise Plan'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isFarmer) {
                onNavigateToStage('farmer_details');
              } else {
                onNavigateToStage('local_check');
              }
            }}
            className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Resume Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FARMER SPECIFIC ACTIVITY CARD */}
        {isFarmer ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-800 dark:text-emerald-300 font-bold block">
                  Selected Crop &amp; Area
                </span>
                <p className="text-base font-black text-emerald-950 dark:text-emerald-200">
                  {cropName}
                </p>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  {landArea} Acres • {season} Season
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                  Irrigation System
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {irrigation}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  PMKSY Micro-irrigation eligible
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-800 dark:text-amber-300 font-bold block">
                  Existing Loan Status
                </span>
                <p className="text-base font-black text-amber-950 dark:text-amber-200">
                  {businessSetup.farmerData?.hasExistingLoan === 'Yes' ? 'Active KCC Loan' : 'No Overdue Debt'}
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  {businessSetup.farmerData?.hasExistingLoan === 'Yes'
                    ? 'Eligible for KCC renewal & interest subvention'
                    : 'Eligible for fresh institutional crop credit'}
                </p>
              </div>
            </div>

            {/* Matched Farmer Schemes */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white font-mono uppercase text-[11px] block">
                Matched Agricultural Government Schemes:
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-semibold text-[11px]">
                  ✓ PM Kisan Samman Nidhi (₹6,000 / yr)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800 font-semibold text-[11px]">
                  ✓ Kisan Credit Card (4% Concessional Interest)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-800 font-semibold text-[11px]">
                  ✓ Pradhan Mantri Fasal Bima Yojana (PMFBY)
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ENTREPRENEUR SPECIFIC ACTIVITY CARD */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-teal-800 dark:text-teal-300 font-bold block">
                  Proposed Enterprise
                </span>
                <p className="text-base font-black text-teal-950 dark:text-teal-200">
                  {businessActivity}
                </p>
                <p className="text-[11px] text-teal-800 dark:text-teal-300">
                  Location: {businessSetup.workLocation || 'Rented Shop'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                  Own Capital Contribution
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  ₹{ownMoney.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Seed investment ready
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-800 dark:text-amber-300 font-bold block">
                  Required Loan Support
                </span>
                <p className="text-base font-black text-amber-950 dark:text-amber-200">
                  ₹{requiredSupport.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Target scheme: Mudra Shishu / Kishore
                </p>
              </div>
            </div>

            {/* Matched Enterprise Schemes */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white font-mono uppercase text-[11px] block">
                Matched Micro-Enterprise Schemes:
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-semibold text-[11px]">
                  ✓ Pradhan Mantri Mudra Yojana (PMMY)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800 font-semibold text-[11px]">
                  ✓ Stand-Up India (Women &amp; OBC Category Priority)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-800 font-semibold text-[11px]">
                  ✓ PMEGP 25% Rural Capital Subsidy
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 4 — SAVED INFORMATION & VERIFIED RECORDS          */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0C192A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              My Saved Information &amp; Data
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            Encrypted Device Storage
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {[
            {
              title: 'Personal Demographic Profile',
              desc: `Full name: ${displayName}, mobile: ${displayMobile}, location: ${displayVillage}`,
              status: 'Completed',
              stage: 'details' as JourneyStageId,
            },
            {
              title: isFarmer ? 'Farm & Crop Details' : 'Business Idea & Infrastructure',
              desc: isFarmer ? `${cropName}, ${landArea} Acres, ${irrigation}` : `${businessActivity}, ${businessSetup.workLocation}`,
              status: 'Completed',
              stage: isFarmer ? ('farmer_details' as JourneyStageId) : ('idea' as JourneyStageId),
            },
            {
              title: isFarmer ? 'Mandi Price & Regional Yield Signal' : 'Local Check & Community Survey',
              desc: 'APMC modal price benchmarks & village demand assessment',
              status: 'Verified',
              stage: 'local_check' as JourneyStageId,
            },
            {
              title: isFarmer ? 'Farm Credit Assessment' : 'Break-Even & Feasibility Engine',
              desc: isFarmer ? 'Cost per acre & net realization calculation' : 'Cash flow, unit economics & DSCR score',
              status: 'Evaluated',
              stage: isFarmer ? ('farmer_assessment' as JourneyStageId) : ('feasibility' as JourneyStageId),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold shrink-0">
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                  {item.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToStage(item.stage)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#15273C] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1C324D] transition-colors shrink-0 cursor-pointer"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 5 — SETTINGS                                      */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0C192A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
            Application Settings
          </h2>
        </div>

        <div className="space-y-6 text-xs">
          
          {/* A. Appearance */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[11px] block">
              A. Appearance (Theme)
            </span>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') onToggleTheme();
                }}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  theme === 'light'
                    ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-200'
                    : 'bg-slate-50 dark:bg-[#112237] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') onToggleTheme();
                }}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  theme === 'dark'
                    ? 'bg-teal-950/60 border-teal-500 text-teal-200 font-bold ring-2 ring-teal-900'
                    : 'bg-slate-50 dark:bg-[#112237] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Moon className="w-4 h-4 text-amber-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* B. Language */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[11px] block">
              B. Interface Language
            </span>
            <div className="grid grid-cols-3 gap-2.5 max-w-md">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'mr', label: 'मराठी' },
              ].map((langItem) => (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => onLanguageChange(langItem.code as Language)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                    language === langItem.code
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 dark:border-teal-400 text-teal-950 dark:text-teal-200 font-bold ring-2 ring-teal-200 dark:ring-teal-900'
                      : 'bg-slate-50 dark:bg-[#112237] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {langItem.label}
                </button>
              ))}
            </div>
          </div>

          {/* C. Notifications */}
          <div className="space-y-3">
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[11px] block">
              C. Notifications &amp; Alerts
            </span>
            <div className="space-y-2 max-w-lg">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Seasonal Crop &amp; Market Advisory</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Receive proactive weather, sowing, and mandi price alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.seasonalAdvisory}
                  onChange={() => toggleNotification('seasonalAdvisory')}
                  className="accent-teal-600 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Scheme Deadline &amp; Subsidy Reminders</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Notifications when eligible farmer/MSME schemes open</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.schemeReminders}
                  onChange={() => toggleNotification('schemeReminders')}
                  className="accent-teal-600 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">KCC / Loan Repayment Due Dates</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Reminders 15 days before interest subvention deadline</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.loanRepaymentAlerts}
                  onChange={() => toggleNotification('loanRepaymentAlerts')}
                  className="accent-teal-600 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* D. Privacy Notice */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[11px] block">
              D. Privacy &amp; Data Security
            </span>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              <p>
                <strong>Local Device Privacy:</strong> All business inputs, farm acreage, financial estimates, and community surveys are processed and securely stored locally in your browser storage.
              </p>
              <p>
                Your personal details are never sold to commercial lead brokers or high-interest informal moneylenders. They are strictly utilized for computing objective credit feasibility and government scheme eligibility under the Two-Gate Model.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 6 — LOGOUT OPTION                                 */}
      {/* ======================================================== */}
      <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0C192A] border border-rose-200/70 dark:border-rose-950/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="space-y-0.5 text-center sm:text-left">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Log Out of ARTH AI
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You can securely log back in at any time with your verified mobile number.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* CONFIRMATION MODAL: LOG OUT                               */}
      {/* ======================================================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0C192A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-5 sm:p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Log out of ARTH AI?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You can sign in again anytime to access your saved information and financial plans.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
