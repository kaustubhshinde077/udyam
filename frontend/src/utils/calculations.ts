import {
  BasicInfoData,
  BusinessCategory,
  BusinessSetupData,
  EvidenceTier,
  FinancialFeasibilityResult,
  HyperLocalAnalysis,
  Phase2CostData,
  RecommendationResult,
  RecommendationSummary,
  RecommendationType,
  RiskAssessmentItem,
  RiskEvaluationItem,
  SchemeMatch,
  SensitivityAnalysisResult,
  SensitivityCases,
  TwoGateDecision,
  FarmerProfile,
  FarmerFinancialAssessment,
} from '../types';
import { getSchemeMatch } from '../data/mockLocalData';


export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded).toString();

  let result = '';
  if (absVal.length <= 3) {
    result = absVal;
  } else {
    const lastThree = absVal.substring(absVal.length - 3);
    const otherNumbers = absVal.substring(0, absVal.length - 3);
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = formattedOther + ',' + lastThree;
  }

  return (isNegative ? '-₹' : '₹') + result;
}

export function calculateProjectCost(costData: Phase2CostData): number {
  return costData.costItems
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}

export function calculateFeasibility(
  costData: Phase2CostData,
  ownContribution: number,
  category: BusinessCategory,
  hasInformalLoan: string,
  informalLoanRemaining: number = 0,
  informalLoanInterestRate: number = 0,
  selectedScheme?: 'micro' | 'term'
): FinancialFeasibilityResult {
  const totalProjectCost = calculateProjectCost(costData);
  const potentialLoan = Math.max(0, totalProjectCost - ownContribution);

  const price = Number(costData.expectedPricePerUnit) || 100;
  const volume = Number(costData.expectedCustomersOrUnitsPerMonth) || 150;
  const rawMaterialCost = Number(costData.rawMaterialCostPerMonth) || 0;
  const otherMonthly = Number(costData.otherMonthlyExpenses) || 0;

  // Informal debt monthly burden if existing
  let informalMonthlyInterest = 0;
  if (hasInformalLoan === 'Yes' && informalLoanRemaining > 0) {
    // Informal rate in rural areas is usually 2% to 3% per month or annual %
    const monthlyRate = (informalLoanInterestRate || 24) / 100 / 12;
    informalMonthlyInterest = Math.round(informalLoanRemaining * monthlyRate);
  }

  // PS 26091 Prototype Loan parameters: Micro Finance (6.5%, 3 yrs) vs Term Loan (8.0%, 7 yrs)
  const chosenScheme: 'micro' | 'term' =
    selectedScheme || (totalProjectCost <= 140000 ? 'micro' : 'term');
  const annualInterestRate = chosenScheme === 'micro' ? 0.065 : 0.080;
  const tenureMonths = chosenScheme === 'micro' ? 36 : 84;
  const moratoriumMonths = chosenScheme === 'micro' ? 3 : 6;

  const monthlyRate = annualInterestRate / 12;
  const bankMonthlyEMI =
    potentialLoan > 0
      ? Math.round(
          (potentialLoan * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1)
        )
      : 0;

  const monthlyRevenue = Math.round(price * volume);
  const monthlyCosts = Math.round(
    rawMaterialCost + otherMonthly + informalMonthlyInterest + bankMonthlyEMI
  );
  const monthlySurplus = monthlyRevenue - monthlyCosts;

  // Break-even units
  const variableCostPerUnit = volume > 0 ? rawMaterialCost / volume : price * 0.5;
  const contributionMarginPerUnit = Math.max(1, price - variableCostPerUnit);
  const fixedMonthlyCosts = otherMonthly + informalMonthlyInterest + bankMonthlyEMI;
  const breakEvenUnitsPerMonth = Math.ceil(fixedMonthlyCosts / contributionMarginPerUnit);

  const breakEvenMonths =
    monthlySurplus > 0 ? Math.ceil(totalProjectCost / (monthlySurplus * 0.8)) : 99;

  return {
    ownContribution,
    potentialLoan,
    totalProjectCost,
    monthlyRevenue,
    monthlyCosts,
    monthlySurplus,
    breakEvenUnitsPerMonth,
    breakEvenMonths,
    annualSurplus: monthlySurplus * 12,
    selectedScheme: chosenScheme,
    interestRate: Number((annualInterestRate * 100).toFixed(1)),
    tenureMonths,
    moratoriumMonths,
    monthlyEMI: bankMonthlyEMI,
  };
}

export function calculateSensitivityCases(
  feasibility: FinancialFeasibilityResult
): SensitivityCases {
  const { monthlyRevenue, monthlyCosts } = feasibility;

  // Good case: 20% higher sales, 5% lower unit stress
  const goodRev = Math.round(monthlyRevenue * 1.2);
  const goodCosts = Math.round(monthlyCosts * 1.05); // minor increase in variable goods
  const goodSurplus = goodRev - goodCosts;

  // Normal case: as projected
  const normalRev = monthlyRevenue;
  const normalCosts = monthlyCosts;
  const normalSurplus = normalRev - normalCosts;

  // Difficult case: 25% lower sales, 10% higher raw material/operating costs
  const diffRev = Math.round(monthlyRevenue * 0.75);
  const diffCosts = Math.round(monthlyCosts * 1.08);
  const diffSurplus = diffRev - diffCosts;

  return {
    good: {
      label: 'Good Situation (बढ़िया बिक्री / उत्तम स्थिती)',
      salesChange: '+20% sales during festival or wedding season',
      monthlySales: goodRev,
      monthlySurplus: goodSurplus,
      explanation:
        'More customers visit. You easily pay all expenses and keep comfortable savings for family and business growth.',
    },
    normal: {
      label: 'Normal Situation (सामान्य परिस्थिति / नियमित स्थिती)',
      salesChange: 'Regular average month',
      monthlySales: normalRev,
      monthlySurplus: normalSurplus,
      explanation:
        'Standard everyday footfall. Revenue comfortably covers recurring costs and loan repayment.',
    },
    difficult: {
      label: 'Difficult Situation (मंदी या कठिन समय / कठीण स्थिती)',
      salesChange: '-25% sales during off-season or rain delays',
      monthlySales: diffRev,
      monthlySurplus: diffSurplus,
      explanation:
        diffSurplus >= 0
          ? 'Sales drop, but you still do not make a loss. You can sustain by cutting non-essential purchases.'
          : 'You will need emergency savings or family backup of about ' +
            formatIndianCurrency(Math.abs(diffSurplus)) +
            ' per month during poor months.',
    },
  };
}

export function evaluateRisks(
  category: BusinessCategory,
  similarBusinessesNearby: string,
  rawMaterialEase: string,
  hasInformalLoan: string,
  feasibility: FinancialFeasibilityResult
): RiskEvaluationItem[] {
  // Competition Risk
  let compRating: 'Low' | 'Medium' | 'High' = 'Low';
  let compExpl = 'Very few or no direct competitors in the immediate village.';
  if (similarBusinessesNearby === '3–5' || similarBusinessesNearby === 'More than 5') {
    compRating = 'High';
    compExpl = 'Multiple existing shops already serve this area; customer acquisition requires distinctive quality or pricing.';
  } else if (similarBusinessesNearby === '1–2') {
    compRating = 'Medium';
    compExpl = '1 to 2 similar businesses operate locally; sufficient room for another trusted provider.';
  }

  // Supply Risk
  let supplyRating: 'Low' | 'Medium' | 'High' = 'Low';
  let supplyExpl = 'Essential raw materials and inventory are readily obtainable nearby.';
  if (rawMaterialEase === 'Difficult to get') {
    supplyRating = 'High';
    supplyExpl = 'Required inputs are hard to obtain; transport delays could disrupt daily service.';
  } else if (rawMaterialEase === 'Yes, from nearby town') {
    supplyRating = 'Medium';
    supplyExpl = 'Must travel to nearby town for replenishment; requires planned weekly restocking.';
  }

  // Seasonality Risk
  let seasonRating: 'Low' | 'Medium' | 'High' = 'Medium';
  let seasonExpl = 'Sales vary moderately across agricultural harvest, marriages, and festive periods.';
  if (category === 'Dairy Business' || category === 'Grocery / General Store') {
    seasonRating = 'Low';
    seasonExpl = 'Staple daily necessity consumed steadily every single day across all seasons.';
  } else if (category === 'Tailoring / Garments / Textile' || category === 'Beauty / Salon') {
    seasonRating = 'High';
    seasonExpl = 'Heavy peaks during school reopening and Diwali/wedding season; lean during monsoon.';
  }

  // Money & Repayment Risk
  let moneyRating: 'Low' | 'Medium' | 'High' = 'Low';
  let moneyExpl = 'Own capital is healthy and debt commitments are manageable.';
  if (hasInformalLoan === 'Yes') {
    moneyRating = 'High';
    moneyExpl = 'High interest on informal local borrowing reduces your monthly cash surplus.';
  } else if (feasibility.potentialLoan > feasibility.ownContribution * 2) {
    moneyRating = 'Medium';
    moneyExpl = 'Bank loan forms a large portion of project cost; monthly repayments must be safeguarded.';
  }

  // Local Market Risk
  let marketRating: 'Low' | 'Medium' | 'High' = 'Low';
  let marketExpl = 'Locals currently spend money on this and show strong positive willingness to buy.';
  if (similarBusinessesNearby === 'Don\'t know' || rawMaterialEase === 'Don\'t know') {
    marketRating = 'Medium';
    marketExpl = 'Some local parameters are not yet verified with local shopkeepers or panchayat.';
  }

  return [
    { name: 'Competition (प्रतिस्पर्धा / स्पर्धा)', rating: compRating, explanation: compExpl },
    { name: 'Supply of Materials (कच्चा माल / पुरवठा)', rating: supplyRating, explanation: supplyExpl },
    { name: 'Seasonality (मौसमी बदलाव / हंगामाचा प्रभाव)', rating: seasonRating, explanation: seasonExpl },
    { name: 'Money & Repayment (ऋण भुगतान / कर्ज परतफेड)', rating: moneyRating, explanation: moneyExpl },
    { name: 'Local Market (स्थानीय बाजार / स्थानिक बाजारपेठ)', rating: marketRating, explanation: marketExpl },
  ];
}

export function evaluateTwoGates(
  hyperLocal: HyperLocalAnalysis | undefined,
  businessSetup: BusinessSetupData,
  feasibility: FinancialFeasibilityResult,
  sensitivity: SensitivityCases
): TwoGateDecision {
  const demand = hyperLocal?.demandSignal || 'Positive';
  const evidenceTier: EvidenceTier =
    (hyperLocal as any)?.evidenceTier ||
    (businessSetup.similarBusinessesNearby !== "Don't know" && businessSetup.rawMaterialEase !== "Don't know"
      ? 'Tier 1'
      : 'Tier 0');

  // GATE 1: Local Market & Evidence Gate
  const gate1Reasons: string[] = [];
  let gate1Status: 'PASSED' | 'CONDITIONALLY PASSED' | 'FAILED' | 'INSUFFICIENT DATA' = 'PASSED';

  if (demand === 'Insufficient information') {
    gate1Status = 'INSUFFICIENT DATA';
    gate1Reasons.push('Local demand signal is unverified; ground inquiry needed before committing funds.');
  } else if (demand === 'Limited') {
    gate1Status = 'FAILED';
    gate1Reasons.push('Local demand signal is weak; customers purchase elsewhere or demand is saturated.');
  } else if (businessSetup.similarBusinessesNearby === 'More than 5') {
    gate1Status = 'CONDITIONALLY PASSED';
    gate1Reasons.push('Local market has over 5 similar businesses nearby; high competition density requires differentiation.');
  } else if (evidenceTier === 'Tier 0') {
    gate1Status = 'CONDITIONALLY PASSED';
    gate1Reasons.push('Evidence is based on initial assumption (Tier 0); ground customer validation recommended.');
  } else if (demand === 'Mixed') {
    gate1Status = 'CONDITIONALLY PASSED';
    gate1Reasons.push('Demand fluctuates significantly by season or day; pilot validation advised.');
  } else {
    gate1Status = 'PASSED';
    gate1Reasons.push('Local demand signal is positive with validated household purchase appetite.');
    gate1Reasons.push('Competitive presence is manageable and supply access is verified.');
  }

  // GATE 2: Financial Feasibility Gate
  const gate2Reasons: string[] = [];
  let gate2Status: 'PASSED' | 'MARGINAL' | 'RESIZE REQUIRED' | 'FAILED' = 'PASSED';

  const promoterEquityPct =
    feasibility.totalProjectCost > 0
      ? (feasibility.ownContribution / feasibility.totalProjectCost) * 100
      : 0;

  const operatingSurplusBeforeEMI =
    feasibility.monthlySurplus + (feasibility.monthlyEMI || 0);
  const emi = feasibility.monthlyEMI || 0;
  const dscr = emi > 0 ? Number((operatingSurplusBeforeEMI / emi).toFixed(2)) : 99;

  if (feasibility.totalProjectCost === 0) {
    gate2Status = 'FAILED';
    gate2Reasons.push('Project costs have not been configured.');
  } else if (feasibility.monthlySurplus <= 0) {
    gate2Status = 'FAILED';
    gate2Reasons.push('Monthly operating surplus is negative (operational loss under baseline projections).');
  } else if (promoterEquityPct < 9.5) {
    gate2Status = 'RESIZE REQUIRED';
    gate2Reasons.push(
      `Promoter contribution (${promoterEquityPct.toFixed(1)}%) is below the minimum 10% equity requirement.`
    );
  } else if (dscr < 1.15 && emi > 0) {
    gate2Status = 'RESIZE REQUIRED';
    gate2Reasons.push(
      `Debt service coverage ratio (DSCR: ${dscr}x) is below safe benchmark (1.25x). Reduce project scale or borrow less.`
    );
  } else if (sensitivity.difficult.monthlySurplus < 0) {
    gate2Status = 'MARGINAL';
    gate2Reasons.push(
      `Business experiences monthly deficit under stress test (-25% sales scenario: ${formatIndianCurrency(
        sensitivity.difficult.monthlySurplus
      )}).`
    );
  } else {
    gate2Status = 'PASSED';
    gate2Reasons.push(
      `Healthy operating profit with comfortable debt serviceability (DSCR: ${dscr >= 99 ? 'No debt' : dscr + 'x'}).`
    );
    gate2Reasons.push('Survives the -25% stress case with positive monthly cash surplus.');
  }

  // Two-Gate Decision Matrix
  let finalStatus: RecommendationResult = 'START';
  const combinedReasons: string[] = [];
  let guidance = '';

  if (gate1Status === 'INSUFFICIENT DATA' || feasibility.totalProjectCost === 0) {
    finalStatus = 'INSUFFICIENT INFORMATION';
    guidance = 'Complete local inquiries and cost items before making financial commitments.';
  } else if (gate1Status === 'FAILED' || gate2Status === 'FAILED') {
    finalStatus = 'DO NOT PROCEED';
    guidance = 'Expected monthly revenues do not cover costs or local demand is insufficient.';
  } else if (gate2Status === 'RESIZE REQUIRED') {
    finalStatus = 'RESIZE';
    guidance = 'Scale down starting equipment or inventory to align loan repayments with cash flow.';
  } else if (gate1Status === 'CONDITIONALLY PASSED' || gate2Status === 'MARGINAL') {
    finalStatus = 'PILOT FIRST';
    guidance = 'Start with a small home/haat trial to confirm customer purchase repeat rates before taking bank debt.';
  } else {
    finalStatus = 'START';
    guidance = 'Both local market demand and financial feasibility gates are passed. Proceed with structured planning.';
  }

  combinedReasons.push(...gate1Reasons.slice(0, 2), ...gate2Reasons.slice(0, 2));

  return {
    gate1: {
      status: gate1Status,
      label: `Gate 1: Market & Evidence (${gate1Status})`,
      evidenceTier,
      demandSignal: demand,
      reasons: gate1Reasons,
    },
    gate2: {
      status: gate2Status,
      label: `Gate 2: Financial Feasibility (${gate2Status})`,
      dscr,
      promoterEquityPct: Number(promoterEquityPct.toFixed(1)),
      reasons: gate2Reasons,
    },
    finalStatus,
    reasons: combinedReasons,
    guidance,
    disclaimer:
      'Decision support prototype (PS 26091). Not a guarantee of business success or loan sanction. Official approval rests with financial institutions.',
  };
}

export function determineRecommendation(
  feasibility: FinancialFeasibilityResult,
  sensitivity: SensitivityCases,
  risks: RiskEvaluationItem[],
  hasInformalLoan: string,
  hyperLocal?: HyperLocalAnalysis,
  businessSetup?: BusinessSetupData
): RecommendationSummary {
  const fallbackSetup: BusinessSetupData = businessSetup || {
    businessCategory: 'Dairy Business',
    subActivity: '',
    workLocation: 'Own Land / Farm',
    alreadyHave: [],
    needToStart: [],
    sellLocation: [],
    rawMaterialEase: 'Yes, nearby',
    similarBusinessesNearby: '1–2',
    ownStartingMoney: feasibility.ownContribution,
    needFinancialSupport: 'Yes',
    hasInformalLoan: hasInformalLoan as any,
  };

  const twoGate = evaluateTwoGates(hyperLocal, fallbackSetup, feasibility, sensitivity);

  return {
    assessment: twoGate.finalStatus,
    reasons: twoGate.reasons,
    disclaimer: twoGate.disclaimer,
    twoGate,
  };
}

// Wrapper for financial feasibility calculation
export function calculateFinancialFeasibility(
  basicInfo: BasicInfoData,
  businessSetup: BusinessSetupData,
  phase2Cost: Phase2CostData,
  selectedScheme?: 'micro' | 'term'
): FinancialFeasibilityResult {
  return calculateFeasibility(
    phase2Cost,
    businessSetup.ownStartingMoney,
    businessSetup.businessCategory,
    businessSetup.hasInformalLoan,
    businessSetup.informalLoanRemaining || 0,
    businessSetup.informalLoanInterestRate || 0,
    selectedScheme
  );
}

// Wrapper for scenario analysis
export function calculateSensitivity(
  feasibility: FinancialFeasibilityResult
): SensitivityAnalysisResult {
  const cases = calculateSensitivityCases(feasibility);
  return {
    good: {
      monthlyRevenue: cases.good.monthlySales,
      monthlyCosts: Math.round(cases.good.monthlySales - cases.good.monthlySurplus),
      monthlySurplus: cases.good.monthlySurplus,
    },
    normal: {
      monthlyRevenue: cases.normal.monthlySales,
      monthlyCosts: Math.round(cases.normal.monthlySales - cases.normal.monthlySurplus),
      monthlySurplus: cases.normal.monthlySurplus,
    },
    difficult: {
      monthlyRevenue: cases.difficult.monthlySales,
      monthlyCosts: Math.round(cases.difficult.monthlySales - cases.difficult.monthlySurplus),
      monthlySurplus: cases.difficult.monthlySurplus,
    },
  };
}

// Wrapper for risk evaluation
export function calculateRisks(
  basicInfo: BasicInfoData,
  businessSetup: BusinessSetupData,
  hyperLocal: HyperLocalAnalysis,
  feasibility: FinancialFeasibilityResult
): RiskAssessmentItem[] {
  const rawRisks = evaluateRisks(
    businessSetup.businessCategory,
    businessSetup.similarBusinessesNearby,
    businessSetup.rawMaterialEase,
    businessSetup.hasInformalLoan,
    feasibility
  );

  return rawRisks.map((r) => {
    let cat = 'Other';
    if (r.name.includes('Competition') || r.name.includes('स्पर्धा')) cat = 'Competition';
    else if (r.name.includes('Supply') || r.name.includes('पुरवठा')) cat = 'Supply';
    else if (r.name.includes('Season') || r.name.includes('हंगाम')) cat = 'Seasonality';
    else if (r.name.includes('Money') || r.name.includes('कर्ज')) cat = 'Money / Repayment';
    else if (r.name.includes('Market') || r.name.includes('बाजार')) cat = 'Local Market';

    return {
      category: cat,
      level: r.rating,
      explanation: r.explanation,
    };
  });
}

// Wrapper for matching government scheme
export function matchGovernmentScheme(
  basicInfo: BasicInfoData,
  businessSetup: BusinessSetupData,
  projectCost: number
): SchemeMatch {
  return getSchemeMatch(
    businessSetup.businessCategory,
    projectCost,
    businessSetup.ownStartingMoney
  );
}

// Wrapper for recommendation
export function calculateRecommendation(
  basicInfo: BasicInfoData,
  businessSetup: BusinessSetupData,
  hyperLocal: HyperLocalAnalysis,
  feasibility: FinancialFeasibilityResult,
  risks: RiskAssessmentItem[]
): {
  result: RecommendationType;
  reasons: string[];
  summary: string;
} {
  const cases = calculateSensitivityCases(feasibility);
  const evalRisks: RiskEvaluationItem[] = risks.map((r) => ({
    name: r.category,
    rating: r.level,
    explanation: r.explanation,
  }));

  const res = determineRecommendation(
    feasibility,
    cases,
    evalRisks,
    businessSetup.hasInformalLoan,
    hyperLocal,
    businessSetup
  );

  let summary = '';
  switch (res.assessment) {
    case 'START':
      summary =
        'Local market demand is favorable, required materials are accessible, and estimated monthly surplus is positive across all test cases.';
      break;
    case 'PILOT FIRST':
      summary =
        'Encouraging village interest, but starting with a smaller home or weekly haat pilot helps avoid unexpected debt stress during seasonal slowdowns.';
      break;
    case 'RESIZE':
      summary =
        'High upfront capital or existing informal debt obligations create financial pressure. Scale down initial equipment to maintain safety.';
      break;
    case 'INSUFFICIENT INFORMATION':
      summary =
        'More local price or customer information is required before making a financial commitment.';
      break;
    case 'DO NOT PROCEED':
    default:
      summary =
        'Monthly costs currently exceed expected sales revenues under current local price benchmarks.';
      break;
  }

  return {
    result: res.assessment,
    reasons: res.reasons,
    summary,
  };
}

// ==========================================
// FARMER-SPECIFIC FINANCIAL CALCULATIONS
// ==========================================

export function calculateFarmerAssessment(
  profile: FarmerProfile
): FarmerFinancialAssessment {
  const landArea = Math.max(0.1, Number(profile.landAreaAcres) || 1.0);
  const costPerAcre = Math.max(0, Number(profile.cultivationCostPerAcre) || 0);
  const totalCultivationCost = Math.round(landArea * costPerAcre);

  // Crop Output calculation (Quintals)
  let expectedYieldTotalQuintals: number | null = null;
  if (
    profile.expectedYieldPerAcreQuintals !== undefined &&
    profile.expectedYieldPerAcreQuintals !== null &&
    !isNaN(Number(profile.expectedYieldPerAcreQuintals)) &&
    Number(profile.expectedYieldPerAcreQuintals) > 0
  ) {
    expectedYieldTotalQuintals = Number(
      (landArea * Number(profile.expectedYieldPerAcreQuintals)).toFixed(1)
    );
  }

  // Crop Revenue calculation (₹)
  let expectedCropRevenue: number | null = null;
  if (
    expectedYieldTotalQuintals !== null &&
    profile.expectedPricePerQuintal !== undefined &&
    profile.expectedPricePerQuintal !== null &&
    !isNaN(Number(profile.expectedPricePerQuintal)) &&
    Number(profile.expectedPricePerQuintal) > 0
  ) {
    expectedCropRevenue = Math.round(
      expectedYieldTotalQuintals * Number(profile.expectedPricePerQuintal)
    );
  }

  const ownContribution = Math.max(0, Number(profile.ownContribution) || 0);
  const financingGap = Math.max(0, totalCultivationCost - ownContribution);
  const suggestedLoanAmount = financingGap;

  const hasExistingLoan = profile.hasExistingLoan === 'Yes';
  let existingLoanDetails: FarmerFinancialAssessment['existingLoanDetails'] = undefined;

  if (hasExistingLoan && profile.existingLoan) {
    const l = profile.existingLoan;
    const monthlyEMI = Number(l.monthlyEMI) || 0;
    existingLoanDetails = {
      providerName: l.providerName?.trim() || 'Bank / Lending Institution',
      loanType: l.loanType?.trim() || 'Crop Loan / Agricultural Credit',
      outstandingAmount: Number(l.outstandingAmount) || 0,
      monthlyEMI,
      interestRate: l.interestRateUnknown ? undefined : (l.interestRate !== undefined ? Number(l.interestRate) : undefined),
      interestRateUnknown: l.interestRateUnknown,
      remainingTenure: l.emisRemaining !== undefined ? `${l.emisRemaining} months` : undefined,
      repaymentStatus: l.repaymentStatus || 'normal',
      annualRepaymentBurden: monthlyEMI * 12,
    };
  }

  const insuranceStatus =
    profile.hasCropInsurance === 'Yes'
      ? 'Covered under Crop Insurance'
      : profile.hasCropInsurance === 'No'
      ? 'Not Covered'
      : 'Coverage Status Pending / Inquire';

  return {
    cropName: profile.cropName || 'Crop Cultivation',
    landAreaAcres: landArea,
    season: profile.season || 'Rabi',
    irrigationStatus: profile.irrigationStatus || 'Irrigated',
    cultivationCostPerAcre: costPerAcre,
    totalCultivationCost,
    expectedYieldTotalQuintals,
    expectedCropRevenue,
    ownContribution,
    financingGap,
    suggestedLoanAmount,
    hasExistingLoan,
    existingLoanDetails,
    insuranceStatus,
  };
}

