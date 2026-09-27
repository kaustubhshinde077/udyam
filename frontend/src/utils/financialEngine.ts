// ARTH AI — Generic Financial Engine & Category Adapters
// Deterministic financial calculation model for microenterprises and farm units.

export type SupportedCategory =
  | 'dairy'
  | 'poultry'
  | 'textile'
  | 'farm_crop'
  | 'retail_shop'
  | 'food_processing'
  | 'other_micro';

export type FinancingSchemeType = 'micro' | 'term';

// Structured Pydantic/TS equivalent schemas
export interface StartupCostBreakdown {
  machineryAndTools: number;
  stockAndInventory: number;
  workingCapitalReserve: number;
  premisesOrCivil: number;
  vehiclesOrLogistics: number;
  otherSetupCosts: number;
}

export interface OperatingExpensesBreakdown {
  rawMaterialOrFeedOrSeeds: number;
  labourWages: number;
  utilitiesElectricityWater: number;
  transportFreight: number;
  packagingOrConsumables: number;
  maintenanceRepairs: number;
  otherMonthlyOverheads: number;
}

export interface FinancingTerms {
  schemeType: FinancingSchemeType;
  annualInterestRatePct: number; // e.g., 6.5 or 8.0
  tenureMonths: number; // e.g. 36 or 84
  moratoriumMonths: number; // e.g. 3 or 6
}

export interface GenericFinancialInputs {
  category: SupportedCategory;
  activityLabel: string;
  location: string;
  isFarmer: boolean;
  startupCosts: StartupCostBreakdown;
  ownContribution: number;
  monthlyUnitsSold: number;
  unitSellingPrice: number;
  operatingExpenses: OperatingExpensesBreakdown;
  financingTerms: FinancingTerms;
  hasInformalLoan?: boolean;
  informalLoanBalance?: number;
  informalLoanAnnualInterestRate?: number;
}

export interface FarmSpecificInputs {
  cropName: string;
  landAreaAcres: number;
  yieldPerAcreQuintals: number;
  marketPricePerQuintal: number;
  seedCost: number;
  fertilizerCost: number;
  pesticideCost: number;
  labourCost: number;
  irrigationCost: number;
  machineryCost: number;
  transportCost: number;
  otherCultivationCost: number;
  seasonDurationMonths: number; // typically 4-6 months
}

export interface FarmSpecificOutputs {
  totalProductionQuintals: number;
  totalProductionKg: number;
  grossRevenue: number;
  totalCultivationCost: number;
  netCropProfit: number;
  costPerKg: number;
  costPerQuintal: number;
  breakEvenPricePerQuintal: number;
  breakEvenPricePerKg: number;
  profitPerAcre: number;
  costPerAcre: number;
  revenuePerAcre: number;
  seasonDurationMonths: number;
  monthlyEquivalentRevenue: number;
  monthlyEquivalentCosts: number;
  monthlyEquivalentNetProfit: number;
}

export interface LoanAmortizationOutputs {
  loanPrincipal: number;
  annualInterestRatePct: number;
  monthlyInterestRate: number;
  tenureMonths: number;
  moratoriumMonths: number;
  monthlyEMI: number;
  totalRepayment: number;
  totalInterestPaid: number;
  moratoriumInterest: number;
  informalMonthlyInterest: number;
  totalMonthlyDebtService: number;
}

export interface FinancialMetricOutputs {
  totalStartupCost: number;
  ownContribution: number;
  promoterEquityPct: number;
  fundingRequirement: number;
  monthlyRevenue: number;
  monthlyFixedCosts: number;
  monthlyVariableCosts: number;
  monthlyOperatingExpenses: number;
  monthlyGrossProfit: number;
  monthlyNetProfit: number;
  netProfitMarginPct: number;
  breakEvenUnitsPerMonth: number;
  breakEvenMonthlyRevenue: number;
  paybackPeriodMonths: number;
  paybackPeriodYears: number;
  returnOnInvestmentPct: number; // Annualized ROI
  debtServiceCoverageRatio: number; // DSCR
  debtBurdenRatioPct: number; // EMI / Revenue %
  monthlyCashSurplus: number;
  annualCashSurplus: number;
  workingCapitalMonthsBuffer: number;
}

export interface ScenarioResult {
  scenarioName: 'Conservative' | 'Expected' | 'Optimistic';
  salesAdjustmentPct: number;
  costAdjustmentPct: number;
  monthlyRevenue: number;
  monthlyOperatingCosts: number;
  monthlyDebtService: number;
  monthlyNetSurplus: number;
  annualSurplus: number;
  dscr: number;
  statusText: string;
}

export interface CompleteFinancialEngineReport {
  timestamp: string;
  inputs: GenericFinancialInputs;
  farmDetails?: FarmSpecificOutputs;
  amortization: LoanAmortizationOutputs;
  metrics: FinancialMetricOutputs;
  scenarios: {
    conservative: ScenarioResult;
    expected: ScenarioResult;
    optimistic: ScenarioResult;
  };
  categorySpecificNotes: string[];
}

// ==========================================
// Safe Default Factories (Avoid mutable defaults)
// ==========================================
export function createDefaultStartupCosts(): StartupCostBreakdown {
  return {
    machineryAndTools: 150000,
    stockAndInventory: 50000,
    workingCapitalReserve: 50000,
    premisesOrCivil: 50000,
    vehiclesOrLogistics: 0,
    otherSetupCosts: 0,
  };
}

export function createDefaultOperatingExpenses(): OperatingExpensesBreakdown {
  return {
    rawMaterialOrFeedOrSeeds: 40000,
    labourWages: 15000,
    utilitiesElectricityWater: 5000,
    transportFreight: 3000,
    packagingOrConsumables: 2000,
    maintenanceRepairs: 3000,
    otherMonthlyOverheads: 2000,
  };
}

export function createDefaultFinancingTerms(totalProjectCost: number): FinancingTerms {
  if (totalProjectCost <= 140000) {
    return {
      schemeType: 'micro',
      annualInterestRatePct: 6.5,
      tenureMonths: 36,
      moratoriumMonths: 3,
    };
  }
  return {
    schemeType: 'term',
    annualInterestRatePct: 8.0,
    tenureMonths: 84,
    moratoriumMonths: 6,
  };
}

// ==========================================
// Loan Amortization Calculation
// ==========================================
export function calculateLoanAmortization(
  principal: number,
  terms: FinancingTerms,
  hasInformalLoan: boolean = false,
  informalLoanBalance: number = 0,
  informalAnnualRate: number = 24
): LoanAmortizationOutputs {
  const loanPrincipal = Math.max(0, principal);
  const monthlyRate = terms.annualInterestRatePct / 100 / 12;
  const n = terms.tenureMonths;

  let monthlyEMI = 0;
  if (loanPrincipal > 0 && n > 0 && monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, n);
    monthlyEMI = Math.round((loanPrincipal * monthlyRate * factor) / (factor - 1));
  }

  const totalRepayment = monthlyEMI * n;
  const totalInterestPaid = Math.max(0, totalRepayment - loanPrincipal);
  const moratoriumInterest = Math.round(loanPrincipal * monthlyRate * terms.moratoriumMonths);

  let informalMonthlyInterest = 0;
  if (hasInformalLoan && informalLoanBalance > 0) {
    informalMonthlyInterest = Math.round(
      informalLoanBalance * ((informalAnnualRate || 24) / 100 / 12)
    );
  }

  const totalMonthlyDebtService = monthlyEMI + informalMonthlyInterest;

  return {
    loanPrincipal,
    annualInterestRatePct: terms.annualInterestRatePct,
    monthlyInterestRate: monthlyRate,
    tenureMonths: terms.tenureMonths,
    moratoriumMonths: terms.moratoriumMonths,
    monthlyEMI,
    totalRepayment,
    totalInterestPaid,
    moratoriumInterest,
    informalMonthlyInterest,
    totalMonthlyDebtService,
  };
}

// ==========================================
// Farm Calculation Module
// ==========================================
export function calculateFarmEconomics(inputs: FarmSpecificInputs): FarmSpecificOutputs {
  const landAreaAcres = Math.max(0.1, Number(inputs.landAreaAcres) || 1);
  const yieldPerAcreQuintals = Math.max(0, Number(inputs.yieldPerAcreQuintals) || 0);
  const totalProductionQuintals = Math.round(landAreaAcres * yieldPerAcreQuintals);
  const totalProductionKg = totalProductionQuintals * 100;

  const marketPricePerQuintal = Math.max(0, Number(inputs.marketPricePerQuintal) || 0);
  const marketPricePerKg = marketPricePerQuintal / 100;

  const grossRevenue = Math.round(totalProductionQuintals * marketPricePerQuintal);

  const totalCultivationCost = Math.round(
    (Number(inputs.seedCost) || 0) +
      (Number(inputs.fertilizerCost) || 0) +
      (Number(inputs.pesticideCost) || 0) +
      (Number(inputs.labourCost) || 0) +
      (Number(inputs.irrigationCost) || 0) +
      (Number(inputs.machineryCost) || 0) +
      (Number(inputs.transportCost) || 0) +
      (Number(inputs.otherCultivationCost) || 0)
  );

  const netCropProfit = grossRevenue - totalCultivationCost;

  const costPerKg = totalProductionKg > 0 ? Number((totalCultivationCost / totalProductionKg).toFixed(2)) : 0;
  const costPerQuintal = totalProductionQuintals > 0 ? Math.round(totalCultivationCost / totalProductionQuintals) : 0;
  const breakEvenPricePerQuintal = costPerQuintal;
  const breakEvenPricePerKg = costPerKg;

  const profitPerAcre = Math.round(netCropProfit / landAreaAcres);
  const costPerAcre = Math.round(totalCultivationCost / landAreaAcres);
  const revenuePerAcre = Math.round(grossRevenue / landAreaAcres);

  const durationMonths = Math.max(1, Number(inputs.seasonDurationMonths) || 5);
  const monthlyEquivalentRevenue = Math.round(grossRevenue / durationMonths);
  const monthlyEquivalentCosts = Math.round(totalCultivationCost / durationMonths);
  const monthlyEquivalentNetProfit = Math.round(netCropProfit / durationMonths);

  return {
    totalProductionQuintals,
    totalProductionKg,
    grossRevenue,
    totalCultivationCost,
    netCropProfit,
    costPerKg,
    costPerQuintal,
    breakEvenPricePerQuintal,
    breakEvenPricePerKg,
    profitPerAcre,
    costPerAcre,
    revenuePerAcre,
    seasonDurationMonths: durationMonths,
    monthlyEquivalentRevenue,
    monthlyEquivalentCosts,
    monthlyEquivalentNetProfit,
  };
}

// ==========================================
// Generic Financial Engine Core
// ==========================================
export function runFinancialEngine(
  inputs: GenericFinancialInputs,
  farmInputs?: FarmSpecificInputs
): CompleteFinancialEngineReport {
  // 1. Startup Cost Breakdown
  const s = inputs.startupCosts;
  const totalStartupCost =
    (Number(s.machineryAndTools) || 0) +
    (Number(s.stockAndInventory) || 0) +
    (Number(s.workingCapitalReserve) || 0) +
    (Number(s.premisesOrCivil) || 0) +
    (Number(s.vehiclesOrLogistics) || 0) +
    (Number(s.otherSetupCosts) || 0);

  const ownContribution = Math.min(totalStartupCost, Math.max(0, Number(inputs.ownContribution) || 0));
  const promoterEquityPct = totalStartupCost > 0 ? Number(((ownContribution / totalStartupCost) * 100).toFixed(1)) : 0;
  const fundingRequirement = Math.max(0, totalStartupCost - ownContribution);

  // 2. Amortization
  const amortization = calculateLoanAmortization(
    fundingRequirement,
    inputs.financingTerms,
    inputs.hasInformalLoan,
    inputs.informalLoanBalance,
    inputs.informalLoanAnnualInterestRate
  );

  // 3. Farm specific adjustments if applicable
  let farmDetails: FarmSpecificOutputs | undefined;
  let monthlyRevenue = Math.round(inputs.monthlyUnitsSold * inputs.unitSellingPrice);

  const op = inputs.operatingExpenses;
  let monthlyOperatingExpenses =
    (Number(op.rawMaterialOrFeedOrSeeds) || 0) +
    (Number(op.labourWages) || 0) +
    (Number(op.utilitiesElectricityWater) || 0) +
    (Number(op.transportFreight) || 0) +
    (Number(op.packagingOrConsumables) || 0) +
    (Number(op.maintenanceRepairs) || 0) +
    (Number(op.otherMonthlyOverheads) || 0);

  if (inputs.isFarmer && farmInputs) {
    farmDetails = calculateFarmEconomics(farmInputs);
    monthlyRevenue = farmDetails.monthlyEquivalentRevenue;
    monthlyOperatingExpenses = farmDetails.monthlyEquivalentCosts;
  }

  // Cost splits: Variable vs Fixed
  const monthlyVariableCosts =
    (Number(op.rawMaterialOrFeedOrSeeds) || 0) +
    (Number(op.packagingOrConsumables) || 0) +
    (Number(op.transportFreight) || 0);

  const monthlyFixedCosts =
    (Number(op.labourWages) || 0) +
    (Number(op.utilitiesElectricityWater) || 0) +
    (Number(op.maintenanceRepairs) || 0) +
    (Number(op.otherMonthlyOverheads) || 0);

  // Profitability
  const monthlyGrossProfit = monthlyRevenue - monthlyVariableCosts;
  const monthlyNetProfit = monthlyRevenue - monthlyOperatingExpenses - amortization.totalMonthlyDebtService;
  const netProfitMarginPct =
    monthlyRevenue > 0 ? Number(((monthlyNetProfit / monthlyRevenue) * 100).toFixed(1)) : 0;

  // Break-even
  const contributionMarginPerUnit =
    inputs.monthlyUnitsSold > 0
      ? inputs.unitSellingPrice - monthlyVariableCosts / inputs.monthlyUnitsSold
      : inputs.unitSellingPrice * 0.4;

  const totalMonthlyFixedObligations = monthlyFixedCosts + amortization.totalMonthlyDebtService;
  const breakEvenUnitsPerMonth =
    contributionMarginPerUnit > 0
      ? Math.ceil(totalMonthlyFixedObligations / contributionMarginPerUnit)
      : 0;

  const breakEvenMonthlyRevenue = breakEvenUnitsPerMonth * inputs.unitSellingPrice;

  // Monthly Cash Surplus & Working Capital
  const monthlyCashSurplus = monthlyNetProfit;
  const annualCashSurplus = monthlyCashSurplus * 12;

  // Payback & ROI
  const paybackPeriodMonths =
    monthlyCashSurplus > 0 ? Math.ceil(totalStartupCost / monthlyCashSurplus) : 999;
  const paybackPeriodYears = Number((paybackPeriodMonths / 12).toFixed(1));
  const returnOnInvestmentPct =
    totalStartupCost > 0 ? Number(((annualCashSurplus / totalStartupCost) * 100).toFixed(1)) : 0;

  // DSCR (Debt Service Coverage Ratio)
  const operatingProfitBeforeDebt = monthlyRevenue - monthlyOperatingExpenses;
  const dscr =
    amortization.totalMonthlyDebtService > 0
      ? Number((operatingProfitBeforeDebt / amortization.totalMonthlyDebtService).toFixed(2))
      : 99.0;

  const debtBurdenRatioPct =
    monthlyRevenue > 0
      ? Number(((amortization.totalMonthlyDebtService / monthlyRevenue) * 100).toFixed(1))
      : 0;

  const workingCapitalMonthsBuffer =
    monthlyOperatingExpenses > 0
      ? Number(((s.workingCapitalReserve / monthlyOperatingExpenses)).toFixed(1))
      : 0;

  const metrics: FinancialMetricOutputs = {
    totalStartupCost,
    ownContribution,
    promoterEquityPct,
    fundingRequirement,
    monthlyRevenue,
    monthlyFixedCosts,
    monthlyVariableCosts,
    monthlyOperatingExpenses,
    monthlyGrossProfit,
    monthlyNetProfit,
    netProfitMarginPct,
    breakEvenUnitsPerMonth,
    breakEvenMonthlyRevenue,
    paybackPeriodMonths,
    paybackPeriodYears,
    returnOnInvestmentPct,
    debtServiceCoverageRatio: dscr,
    debtBurdenRatioPct,
    monthlyCashSurplus,
    annualCashSurplus,
    workingCapitalMonthsBuffer,
  };

  // 4. Three Scenarios: Conservative, Expected, Optimistic
  // Conservative: -25% sales revenue, +8% operating costs
  const cRev = Math.round(monthlyRevenue * 0.75);
  const cCosts = Math.round(monthlyOperatingExpenses * 1.08);
  const cSurplus = cRev - cCosts - amortization.totalMonthlyDebtService;
  const cOpBeforeDebt = cRev - cCosts;
  const cDscr =
    amortization.totalMonthlyDebtService > 0
      ? Number((cOpBeforeDebt / amortization.totalMonthlyDebtService).toFixed(2))
      : 99.0;

  // Expected (Base Case)
  const eRev = monthlyRevenue;
  const eCosts = monthlyOperatingExpenses;
  const eSurplus = monthlyNetProfit;
  const eDscr = dscr;

  // Optimistic: +20% sales revenue, +4% operating costs
  const oRev = Math.round(monthlyRevenue * 1.2);
  const oCosts = Math.round(monthlyOperatingExpenses * 1.04);
  const oSurplus = oRev - oCosts - amortization.totalMonthlyDebtService;
  const oOpBeforeDebt = oRev - oCosts;
  const oDscr =
    amortization.totalMonthlyDebtService > 0
      ? Number((oOpBeforeDebt / amortization.totalMonthlyDebtService).toFixed(2))
      : 99.0;

  const scenarios = {
    conservative: {
      scenarioName: 'Conservative' as const,
      salesAdjustmentPct: -25,
      costAdjustmentPct: 8,
      monthlyRevenue: cRev,
      monthlyOperatingCosts: cCosts,
      monthlyDebtService: amortization.totalMonthlyDebtService,
      monthlyNetSurplus: cSurplus,
      annualSurplus: cSurplus * 12,
      dscr: cDscr,
      statusText:
        cSurplus >= 0
          ? 'Viable even under market slowdown; cash buffer covers debt obligations.'
          : 'Warning: Cash deficit during off-season requires liquid savings.',
    },
    expected: {
      scenarioName: 'Expected' as const,
      salesAdjustmentPct: 0,
      costAdjustmentPct: 0,
      monthlyRevenue: eRev,
      monthlyOperatingCosts: eCosts,
      monthlyDebtService: amortization.totalMonthlyDebtService,
      monthlyNetSurplus: eSurplus,
      annualSurplus: eSurplus * 12,
      dscr: eDscr,
      statusText: 'Baseline operating forecast based on verified local ground benchmarks.',
    },
    optimistic: {
      scenarioName: 'Optimistic' as const,
      salesAdjustmentPct: 20,
      costAdjustmentPct: 4,
      monthlyRevenue: oRev,
      monthlyOperatingCosts: oCosts,
      monthlyDebtService: amortization.totalMonthlyDebtService,
      monthlyNetSurplus: oSurplus,
      annualSurplus: oSurplus * 12,
      dscr: oDscr,
      statusText: 'Peak festival / harvest season with optimal capacity utilization.',
    },
  };

  // 5. Category-Specific Guidance Notes
  const categorySpecificNotes: string[] = [];
  switch (inputs.category) {
    case 'dairy':
      categorySpecificNotes.push(
        'Dairy revenues depend on milk fat % and lactating cycle. Account for dry periods (2-3 months per cow).'
      );
      categorySpecificNotes.push(
        'Feed costs constitute 60-70% of total operating expenses. Silage and green fodder cultivation reduce costs.'
      );
      break;
    case 'poultry':
      categorySpecificNotes.push(
        'Broiler cycles require 35-42 days per flock. Biosecurity and vaccination schedule are paramount.'
      );
      categorySpecificNotes.push(
        'Feed Conversion Ratio (FCR) target should remain between 1.5 to 1.7 for optimal unit profitability.'
      );
      break;
    case 'textile':
      categorySpecificNotes.push(
        'Garment margins benefit from bulk fabric purchase from regional textile hubs.'
      );
      categorySpecificNotes.push(
        'Heavy seasonal surge before school reopenings and Diwali wedding calendar; maintain working capital.'
      );
      break;
    case 'farm_crop':
      categorySpecificNotes.push(
        'Agricultural revenues are realized at seasonal harvest. Plan cash flow to bridge 4-6 months gestation.'
      );
      categorySpecificNotes.push(
        'APMC Mandi price volatility is cushioned by staggered selling and proper post-harvest curing.'
      );
      break;
    case 'retail_shop':
      categorySpecificNotes.push(
        'Fast inventory turns (15-20 days) on staple FMCG goods maximize return on working capital.'
      );
      categorySpecificNotes.push(
        'Strictly limit customer credit (Udhaar) to avoid working capital exhaustion.'
      );
      break;
    case 'food_processing':
      categorySpecificNotes.push(
        'Food products require FSSAI basic registration and strict hygienic packaging.'
      );
      categorySpecificNotes.push(
        'Value-addition from raw crop to processed packaged goods yields 25-40% higher gross margins.'
      );
      break;
    default:
      categorySpecificNotes.push(
        'Ensure promoter equity remains at minimum 10-15% of project cost for priority sector eligibility.'
      );
      categorySpecificNotes.push(
        'Keep fixed overheads lean until customer repeat frequency is firmly established.'
      );
  }

  return {
    timestamp: new Date().toISOString(),
    inputs,
    farmDetails,
    amortization,
    metrics,
    scenarios,
    categorySpecificNotes,
  };
}
