export type Language = 'en' | 'hi' | 'mr';

export type JourneyMode = 'business' | 'farmer';

export type Gender = 'Male' | 'Female' | 'Other';
export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'Other / EWS';
export type AreaType = 'Rural' | 'Semi-Urban';

export type BusinessStatusType =
  | 'new_business' // A. I want to start a new business
  | 'existing_business' // B. I already have a business
  | 'existing_with_loan' // C. I already have a business and an existing loan
  | 'existing_seeking_funding'; // D. I am already running a business and looking for additional/new funding

export type UserGoalType =
  | 'start_new'
  | 'grow_business'
  | 'increase_sales'
  | 'reduce_expenses'
  | 'find_loan'
  | 'find_schemes'
  | 'check_feasibility'
  | 'manage_daily_finances'
  | 'understand_profit'
  | 'manage_existing_loan'
  | 'find_new_funding'
  | 'get_advice';

export type FinancialHelpType =
  | 'manage_existing_loan'
  | 'need_new_loan'
  | 'need_additional_funding'
  | 'reduce_repayment_burden'
  | 'explore_schemes_subsidies'
  | 'not_sure_help_me_decide';

export interface ExistingLoanDetails {
  hasLoan: 'Yes' | 'No';
  providerName?: string; // Bank / NBFC / Society / MFI / Informal
  loanType?: string; // Mudra, KCC, Machinery, Term, Gold, SHG, Informal
  originalAmount?: number;
  outstandingAmount?: number; // "Loan amount left"
  monthlyEMI?: number; // "Monthly payment"
  interestRate?: number;
  interestRateUnknown?: boolean;
  startDate?: string;
  expectedEndDate?: string;
  emisPaid?: number;
  emisRemaining?: number;
  repaymentStatus?: 'normal' | 'struggling' | 'overdue' | 'unknown';
  overdueAmount?: number;
  loanPurpose?: string;
  notes?: string;
}

export interface ExistingBusinessDetails {
  businessName?: string;
  businessCategory?: BusinessCategory;
  businessActivity?: string;
  businessAgeYears?: number;
  businessAgeMonths?: number;
  ownershipType?: 'Sole Proprietorship' | 'Partnership' | 'Self Help Group (SHG)' | 'Family Run' | 'Informal / Unregistered';
  currentMonthlySales?: number; // "Money coming in"
  currentMonthlyExpenses?: number; // "Money spent"
  currentMonthlyProfit?: number; // "Your profit"
  numberOfWorkers?: number;
  keyAssets?: string[];
  currentChallenges?: string[];
  growthGoal?: string;
}

export type BusinessCategory =
  | 'Dairy Business'
  | 'Poultry'
  | 'Goat / Sheep Farming'
  | 'Grocery / General Store'
  | 'Food / Tiffin'
  | 'Tailoring / Garments / Textile'
  | 'Beauty / Salon'
  | 'Repair Service'
  | 'Mobile / Electronics'
  | 'Transport / Delivery'
  | 'Other';

export interface BasicInfoData {
  name: string;
  dob: string;
  gender: Gender;
  category: SocialCategory;
  mobile: string;
  state: string;
  district: string;
  village: string;
  pincode: string;
  areaType: AreaType;
  currentOccupation: string;
  workedInBusinessBefore: 'Yes' | 'No';
  experienceYears: number;
  reportLanguage: 'English' | 'Hindi' | 'Marathi';
  specialAssistance: 'No' | 'Yes';
  specialAssistanceType?: string;
  businessStatus?: BusinessStatusType;
  userGoals?: UserGoalType[];
}

export interface FarmerCropData {
  cropName: string;
  landAreaAcres: number;
  yieldPerAcreQuintals: number;
  seedCost: number;
  fertilizerCost: number;
  pesticideCost: number;
  labourCost: number;
  irrigationCost: number;
  machineryCost: number;
  transportCost: number;
  otherCultivationCost: number;
  marketPricePerQuintal: number;
  // Agricultural financing journey fields
  season?: 'Kharif' | 'Rabi' | 'Zaid / Summer' | 'Annual';
  irrigationStatus?: 'Irrigated (Canal/Borewell/Well)' | 'Drip / Sprinkler' | 'Rainfed (Dependent on Monsoon)' | 'Partially Irrigated';
  cultivationCostPerAcre?: number;
  hasCropInsurance?: 'Yes' | 'No' | 'Not Sure';
  insuranceSchemeName?: string;
  insuranceStatusText?: string;
}

export interface FarmerProfile {
  farmerName: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  cropName: string;
  season: 'Kharif' | 'Rabi' | 'Zaid / Summer' | 'Annual';
  landAreaAcres: number;
  irrigationStatus: 'Irrigated (Canal/Borewell/Well)' | 'Drip / Sprinkler' | 'Rainfed (Dependent on Monsoon)' | 'Partially Irrigated';
  expectedYieldPerAcreQuintals?: number | null;
  expectedPricePerQuintal?: number | null;
  cultivationCostPerAcre: number;
  ownContribution: number;
  hasExistingLoan: 'Yes' | 'No';
  existingLoan?: ExistingLoanDetails;
  hasCropInsurance: 'Yes' | 'No' | 'Not Sure';
}

export interface FarmerFinancialAssessment {
  cropName: string;
  landAreaAcres: number;
  season: string;
  irrigationStatus: string;
  cultivationCostPerAcre: number;
  totalCultivationCost: number;
  expectedYieldTotalQuintals?: number | null;
  expectedCropRevenue?: number | null;
  ownContribution: number;
  financingGap: number;
  suggestedLoanAmount: number;
  hasExistingLoan: boolean;
  existingLoanDetails?: {
    providerName?: string;
    loanType?: string;
    outstandingAmount?: number;
    monthlyEMI?: number;
    interestRate?: number;
    interestRateUnknown?: boolean;
    remainingTenure?: number | string;
    repaymentStatus?: string;
    annualRepaymentBurden?: number;
  };
  insuranceStatus: string;
}

export interface BusinessSetupData {
  entityType?: 'business' | 'farmer';
  businessCategory: BusinessCategory;
  subActivity: string;
  workLocation: 'Home' | 'Own Shop' | 'Rented Shop' | 'Own Land / Farm' | 'Market / Stall' | 'Other';
  alreadyHave: string[];
  needToStart: string[];
  sellLocation: string[];
  rawMaterialEase: 'Yes, nearby' | 'Yes, from nearby town' | 'Difficult to get' | 'Don\'t know';
  similarBusinessesNearby: 'None' | '1–2' | '3–5' | 'More than 5' | 'Don\'t know';
  ownStartingMoney: number;
  needFinancialSupport: 'Yes' | 'No' | 'Not Sure';
  financialSupportAmount?: number;
  hasInformalLoan: 'Yes' | 'No' | 'Don\'t Know';
  informalLoanRemaining?: number;
  informalLoanInterestRate?: number;
  farmerData?: FarmerCropData;
  businessStatus?: BusinessStatusType;
  userGoals?: UserGoalType[];
  financialHelpType?: FinancialHelpType;
  existingLoan?: ExistingLoanDetails;
  existingBusiness?: ExistingBusinessDetails;
}

export interface Phase2CostData {
  costItems: {
    category: string;
    description: string;
    amount: number;
    selected: boolean;
  }[];
  expectedPricePerUnit: number;
  expectedCustomersOrUnitsPerMonth: number;
  rawMaterialCostPerMonth: number;
  otherMonthlyExpenses: number;
}

export type DataTrustStatus =
  | 'Verified'
  | 'Estimated'
  | 'User Provided'
  | 'Community Provided'
  | 'AI Generated'
  | 'Official Source'
  | 'Unavailable'
  | 'Demo Data';

export interface LocalDataPoint<T = string> {
  value: T;
  status: DataTrustStatus;
  source: string;
  date: string;
  location: string;
}

export type DemandSignalType = 'Positive' | 'Mixed' | 'Limited' | 'Insufficient information';

export interface HyperLocalAnalysis {
  marketReach: LocalDataPoint;
  customerArea: LocalDataPoint;
  marketExplanation: string;
  nearbyBusinessesCount: LocalDataPoint;
  nearbyBusinessesExplanation: string;
  supplierAvailability: LocalDataPoint;
  supplierDistance: LocalDataPoint;
  priceRange: LocalDataPoint;
  demandSignal: DemandSignalType;
  demandExplanation: string;
  localOpportunity: string;
  localRisks: {
    competition: string;
    supply: string;
    seasonal: string;
    other: string;
  };
  swot: {
    strengths: string[];
    challenges: string[];
    opportunities: string[];
    risks: string[];
  };
  evidenceLevel?: EvidenceLevel;
}


export interface SurveyQuestionItem {
  id: number;
  questionText: string;
  options: string[];
}

export interface SurveySummary {
  surveyGenerated: boolean;
  totalResponses: number;
  signal: 'Positive' | 'Mixed' | 'Limited' | 'Not enough responses yet';
  summaryText: string;
  responses: {
    question: string;
    topAnswer: string;
    percentage: number;
  }[];
}

export type EvidenceLevel = 0 | 1 | 2;

export interface SchemeMatch {
  schemeName: string;
  ministry: string;
  projectCost: number;
  userContribution: number;
  potentialLoan: number;
  potentialSubsidy?: number;
  fundingStructureSummary: string;
  eligibilityHighlights: string[];
  disclaimer: string;
}

export interface FinancialFeasibilityResult {
  ownContribution: number;
  potentialLoan: number;
  totalProjectCost: number;
  monthlyRevenue: number;
  monthlyCosts: number;
  monthlySurplus: number;
  breakEvenUnitsPerMonth: number;
  breakEvenMonths: number;
  annualSurplus: number;
  selectedScheme?: 'micro' | 'term';
  interestRate?: number;
  tenureMonths?: number;
  moratoriumMonths?: number;
  monthlyEMI?: number;
}

export interface SensitivityCases {
  good: {
    label: string;
    salesChange: string;
    monthlySales: number;
    monthlySurplus: number;
    explanation: string;
  };
  normal: {
    label: string;
    salesChange: string;
    monthlySales: number;
    monthlySurplus: number;
    explanation: string;
  };
  difficult: {
    label: string;
    salesChange: string;
    monthlySales: number;
    monthlySurplus: number;
    explanation: string;
  };
}

export type RiskLevelRating = 'Low' | 'Medium' | 'High';
export type RiskLevel = RiskLevelRating;

export interface RiskEvaluationItem {
  name: string;
  rating: RiskLevelRating;
  explanation: string;
}

export interface RiskAssessmentItem {
  category: string;
  level: RiskLevel;
  explanation: string;
}

export type SensitivityAnalysisResult = {
  good: {
    monthlyRevenue: number;
    monthlyCosts: number;
    monthlySurplus: number;
  };
  normal: {
    monthlyRevenue: number;
    monthlyCosts: number;
    monthlySurplus: number;
  };
  difficult: {
    monthlyRevenue: number;
    monthlyCosts: number;
    monthlySurplus: number;
  };
};

export type EvidenceTier = 'Tier 0' | 'Tier 1' | 'Tier 2' | 'Tier 3';

export type RecommendationResult =
  | 'START'
  | 'PILOT FIRST'
  | 'RESIZE'
  | 'INSUFFICIENT INFORMATION'
  | 'DO NOT PROCEED';

export type RecommendationType = RecommendationResult;

export interface TwoGateDecision {
  gate1: {
    status: 'PASSED' | 'CONDITIONALLY PASSED' | 'FAILED' | 'INSUFFICIENT DATA';
    label: string;
    evidenceTier: EvidenceTier;
    demandSignal: DemandSignalType;
    reasons: string[];
  };
  gate2: {
    status: 'PASSED' | 'MARGINAL' | 'RESIZE REQUIRED' | 'FAILED';
    label: string;
    dscr: number;
    promoterEquityPct: number;
    reasons: string[];
  };
  finalStatus: RecommendationResult;
  reasons: string[];
  guidance: string;
  disclaimer: string;
}

export interface RecommendationSummary {
  assessment: RecommendationResult;
  reasons: string[];
  disclaimer: string;
  twoGate?: TwoGateDecision;
}

export type AppStep =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'basic_info'
  | 'business_setup'
  | 'review'
  | 'analysis_start'
  | 'analysis_dashboard'
  | 'community_survey'
  | 'stage1_report'
  | 'evidence_level'
  | 'scheme_matching'
  | 'phase2_costs'
  | 'business_cost'
  | 'financial_structure'
  | 'business_feasibility'
  | 'scenario_cases'
  | 'scenario_analysis'
  | 'risk'
  | 'risk_assessment'
  | 'recommendation'
  | 'repayment_plan'
  | 'business_health'
  | 'ai_advisor'
  | 'final_report';

export interface DailyExpenseItem {
  id: string;
  name: string;
  amount: number;
  note?: string;
}

export interface DailyLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  dayLabel?: string; // e.g. "Today", "Yesterday", "Mon 14"
  sales: number;
  unitsSold?: number;
  unitPrice?: number;
  // Farmer specific inputs
  quantitySold?: number;
  sellingPrice?: number;
  expenses: DailyExpenseItem[];
  totalExpenses: number;
  netProfit: number; // sales - totalExpenses
  notes?: string;
}

export interface DailyTrackingState {
  entries: DailyLogEntry[];
  todayEntry: DailyLogEntry;
}

export interface LoanTrackingData {
  loanAmount: number;
  interestRate: number;
  totalInterest: number;
  monthlyPayment: number;
  totalAmountToRepay: number;
  amountPaid: number;
  amountRemaining: number;
  nextPaymentDueDate: string;
  paymentStatus: 'ON TRACK' | 'PAYMENT DUE' | 'NEEDS ATTENTION';
  isEstimate: boolean;
}

