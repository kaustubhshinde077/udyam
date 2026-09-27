import React, { useState, useMemo } from 'react';
import {
  Calculator,
  IndianRupee,
  TrendingUp,
  Percent,
  Sliders,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Layers,
  Sprout,
  Store,
  Scissors,
  Egg,
  Milk,
  Building2,
  CheckCircle2,
  Calendar,
  CalendarDays,
  Plus,
  Trash2,
  Bot,
  Send,
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  BasicInfoData,
  BusinessSetupData,
  DailyExpenseItem,
  DailyLogEntry,
  FinancialFeasibilityResult,
  Language,
  Phase2CostData,
} from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import {
  runFinancialEngine,
  SupportedCategory,
  GenericFinancialInputs,
  FarmSpecificInputs,
  FinancingTerms,
  StartupCostBreakdown,
  OperatingExpensesBreakdown,
} from '../../utils/financialEngine';
import {
  DEFAULT_EXPENSE_CATEGORIES,
  FARMER_EXPENSE_CATEGORIES,
  createInitialDailyEntries,
  computeDailyComparison,
  computeWeeklyReview,
  computeLoanTracking,
} from '../../utils/dailyTracking';
import { UI_TRANSLATIONS } from '../../data/translations';
import { PremiumButton } from '../common/PremiumButton';

interface FinancialEngineScreenProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  phase2Cost: Phase2CostData;
  feasibility: FinancialFeasibilityResult;
  language: Language;
  onUpdateFinancials?: (newFeasibility: FinancialFeasibilityResult, newCostData: Phase2CostData) => void;
  onBack: () => void;
  onGoToPlan: () => void;
}

export const FinancialEngineScreen: React.FC<FinancialEngineScreenProps> = ({
  basicInfo,
  businessSetup,
  phase2Cost,
  feasibility,
  language,
  onUpdateFinancials,
  onBack,
  onGoToPlan,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Main Mode Toggle: 'plan' | 'track' | 'loan'
  const [mainMode, setMainMode] = useState<'plan' | 'track' | 'loan'>('plan');

  // Determine initial category
  const initialCategory: SupportedCategory = useMemo(() => {
    if (businessSetup.entityType === 'farmer') return 'farm_crop';
    const cat = businessSetup.businessCategory;
    if (cat === 'Dairy Business') return 'dairy';
    if (cat === 'Poultry') return 'poultry';
    if (cat === 'Tailoring / Garments / Textile') return 'textile';
    if (cat === 'Grocery / General Store') return 'retail_shop';
    if (cat === 'Food / Tiffin') return 'food_processing';
    return 'other_micro';
  }, [businessSetup]);

  const [selectedCategory, setSelectedCategory] = useState<SupportedCategory>(initialCategory);
  const isFarmer = selectedCategory === 'farm_crop' || businessSetup.entityType === 'farmer';

  // Startup Cost state
  const [startupCosts, setStartupCosts] = useState<StartupCostBreakdown>(() => {
    const totalCost = feasibility.totalProjectCost || 500000;
    return {
      machineryAndTools: Math.round(totalCost * 0.5),
      stockAndInventory: Math.round(totalCost * 0.2),
      workingCapitalReserve: Math.round(totalCost * 0.15),
      premisesOrCivil: Math.round(totalCost * 0.15),
      vehiclesOrLogistics: 0,
      otherSetupCosts: 0,
    };
  });

  const totalCalculatedStartup =
    startupCosts.machineryAndTools +
    startupCosts.stockAndInventory +
    startupCosts.workingCapitalReserve +
    startupCosts.premisesOrCivil +
    startupCosts.vehiclesOrLogistics +
    startupCosts.otherSetupCosts;

  // Own contribution
  const [ownContribution, setOwnContribution] = useState<number>(
    businessSetup.ownStartingMoney || Math.round(totalCalculatedStartup * 0.2)
  );

  // Business revenue drivers
  const [monthlyUnitsSold, setMonthlyUnitsSold] = useState<number>(
    phase2Cost.expectedCustomersOrUnitsPerMonth || (selectedCategory === 'dairy' ? 2600 : 350)
  );
  const [unitSellingPrice, setUnitSellingPrice] = useState<number>(
    phase2Cost.expectedPricePerUnit || (selectedCategory === 'dairy' ? 60 : 450)
  );

  // Farm specific state
  const [farmInputs, setFarmInputs] = useState<FarmSpecificInputs>(() => {
    const f = businessSetup.farmerData;
    return {
      cropName: f?.cropName || 'Onion (कांदा)',
      landAreaAcres: f?.landAreaAcres || 2,
      yieldPerAcreQuintals: f?.yieldPerAcreQuintals || 100,
      marketPricePerQuintal: f?.marketPricePerQuintal || 2500,
      seedCost: f?.seedCost || 20000,
      fertilizerCost: f?.fertilizerCost || 15000,
      pesticideCost: f?.pesticideCost || 10000,
      labourCost: f?.labourCost || 30000,
      irrigationCost: f?.irrigationCost || 10000,
      machineryCost: f?.machineryCost || 5000,
      transportCost: f?.transportCost || 10000,
      otherCultivationCost: f?.otherCultivationCost || 5000,
      seasonDurationMonths: 5,
    };
  });

  // Operating Expenses state
  const [operatingExpenses, setOperatingExpenses] = useState<OperatingExpensesBreakdown>(() => {
    return {
      rawMaterialOrFeedOrSeeds: phase2Cost.rawMaterialCostPerMonth || 45000,
      labourWages: Math.round(phase2Cost.otherMonthlyExpenses * 0.45) || 12000,
      utilitiesElectricityWater: Math.round(phase2Cost.otherMonthlyExpenses * 0.2) || 5000,
      transportFreight: Math.round(phase2Cost.otherMonthlyExpenses * 0.15) || 4000,
      packagingOrConsumables: Math.round(phase2Cost.otherMonthlyExpenses * 0.1) || 3000,
      maintenanceRepairs: Math.round(phase2Cost.otherMonthlyExpenses * 0.1) || 2000,
      otherMonthlyOverheads: 2000,
    };
  });

  // Financing terms
  const [schemeChoice, setSchemeChoice] = useState<'micro' | 'term'>(
    totalCalculatedStartup <= 140000 ? 'micro' : 'term'
  );

  const financingTerms: FinancingTerms = useMemo(() => {
    if (schemeChoice === 'micro') {
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
  }, [schemeChoice]);

  // Execute deterministic engine calculation
  const engineReport = useMemo(() => {
    const inputs: GenericFinancialInputs = {
      category: selectedCategory,
      activityLabel: isFarmer
        ? `${farmInputs.cropName} Cultivation`
        : businessSetup.subActivity || businessSetup.businessCategory,
      location: `${basicInfo.village || 'Village'}, ${basicInfo.district || 'District'}`,
      isFarmer,
      startupCosts,
      ownContribution,
      monthlyUnitsSold,
      unitSellingPrice,
      operatingExpenses,
      financingTerms,
      hasInformalLoan: businessSetup.hasInformalLoan === 'Yes',
      informalLoanBalance: businessSetup.informalLoanRemaining || 0,
      informalLoanAnnualInterestRate: businessSetup.informalLoanInterestRate || 24,
    };

    return runFinancialEngine(inputs, isFarmer ? farmInputs : undefined);
  }, [
    selectedCategory,
    isFarmer,
    farmInputs,
    businessSetup,
    basicInfo,
    startupCosts,
    ownContribution,
    monthlyUnitsSold,
    unitSellingPrice,
    operatingExpenses,
    financingTerms,
  ]);

  const [appliedSyncSuccess, setAppliedSyncSuccess] = useState<boolean>(false);

  const handleApplyToPlan = () => {
    if (onUpdateFinancials) {
      const updatedFeasibility: FinancialFeasibilityResult = {
        totalProjectCost: engineReport.metrics.totalStartupCost,
        ownContribution: engineReport.metrics.ownContribution,
        potentialLoan: engineReport.metrics.fundingRequirement,
        monthlyRevenue: engineReport.metrics.monthlyRevenue,
        monthlyCosts:
          engineReport.metrics.monthlyOperatingExpenses + engineReport.amortization.monthlyEMI,
        monthlySurplus: engineReport.metrics.monthlyNetProfit,
        breakEvenUnitsPerMonth: engineReport.metrics.breakEvenUnitsPerMonth,
        breakEvenMonths: engineReport.metrics.paybackPeriodMonths,
        annualSurplus: engineReport.metrics.annualCashSurplus,
        selectedScheme: schemeChoice,
        interestRate: financingTerms.annualInterestRatePct,
        tenureMonths: financingTerms.tenureMonths,
        moratoriumMonths: financingTerms.moratoriumMonths,
        monthlyEMI: engineReport.amortization.monthlyEMI,
      };

      const updatedCostData: Phase2CostData = {
        costItems: [
          {
            category: 'Machinery / Tools',
            description: 'Core machinery, automated equipment & tools',
            amount: startupCosts.machineryAndTools,
            selected: true,
          },
          {
            category: 'Stock / Inventory',
            description: 'Starting inventory, raw stock or seeds',
            amount: startupCosts.stockAndInventory,
            selected: true,
          },
          {
            category: 'Working Capital Reserve',
            description: 'Liquidity buffer for utilities and initial operations',
            amount: startupCosts.workingCapitalReserve,
            selected: true,
          },
          {
            category: 'Civil Works / Shed / Shop',
            description: 'Premises renovation, shed setup or security advance',
            amount: startupCosts.premisesOrCivil,
            selected: true,
          },
        ],
        expectedPricePerUnit: unitSellingPrice,
        expectedCustomersOrUnitsPerMonth: monthlyUnitsSold,
        rawMaterialCostPerMonth: operatingExpenses.rawMaterialOrFeedOrSeeds,
        otherMonthlyExpenses:
          operatingExpenses.labourWages +
          operatingExpenses.utilitiesElectricityWater +
          operatingExpenses.transportFreight +
          operatingExpenses.packagingOrConsumables +
          operatingExpenses.maintenanceRepairs +
          operatingExpenses.otherMonthlyOverheads,
      };

      onUpdateFinancials(updatedFeasibility, updatedCostData);
    }
    setAppliedSyncSuccess(true);
    setTimeout(() => setAppliedSyncSuccess(false), 3500);
  };

  // ==========================================================
  // DAILY MONEY TRACK STATE
  // ==========================================================
  const [dailyEntries, setDailyEntries] = useState<DailyLogEntry[]>(() =>
    createInitialDailyEntries(feasibility, isFarmer)
  );

  const [selectedHistoryFilter, setSelectedHistoryFilter] = useState<
    'today' | 'yesterday' | 'week' | 'month'
  >('today');

  // Currently inspected day (defaults to Today - entry 0)
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const activeDayEntry = dailyEntries[currentDayIndex] || dailyEntries[0];

  // New Expense form state
  const [newExpName, setNewExpName] = useState<string>('Raw material');
  const [newExpAmount, setNewExpAmount] = useState<string>('500');
  const [newExpNote, setNewExpNote] = useState<string>('');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpAmount) || 0;
    if (amt <= 0) return;

    const newItem: DailyExpenseItem = {
      id: `exp-${Date.now()}`,
      name: newExpName.trim() || 'Expense',
      amount: amt,
      note: newExpNote.trim(),
    };

    setDailyEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[currentDayIndex] };
      const newExpenses = [...entry.expenses, newItem];
      const newTotal = newExpenses.reduce((sum, item) => sum + item.amount, 0);
      entry.expenses = newExpenses;
      entry.totalExpenses = newTotal;
      entry.netProfit = entry.sales - newTotal;
      updated[currentDayIndex] = entry;
      return updated;
    });

    setNewExpAmount('');
    setNewExpNote('');
  };

  const handleRemoveExpense = (itemId: string) => {
    setDailyEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[currentDayIndex] };
      const newExpenses = entry.expenses.filter((x) => x.id !== itemId);
      const newTotal = newExpenses.reduce((sum, item) => sum + item.amount, 0);
      entry.expenses = newExpenses;
      entry.totalExpenses = newTotal;
      entry.netProfit = entry.sales - newTotal;
      updated[currentDayIndex] = entry;
      return updated;
    });
  };

  const handleUpdateSales = (newSalesVal: number) => {
    setDailyEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[currentDayIndex] };
      entry.sales = Math.max(0, newSalesVal);
      entry.netProfit = entry.sales - entry.totalExpenses;
      if (isFarmer) {
        entry.quantitySold = Math.round(entry.sales / (entry.sellingPrice || 25));
      } else {
        entry.unitsSold = Math.round(entry.sales / 45);
      }
      updated[currentDayIndex] = entry;
      return updated;
    });
  };

  // Computations
  const comparison = useMemo(() => {
    return computeDailyComparison(activeDayEntry, feasibility, language);
  }, [activeDayEntry, feasibility, language]);

  const weeklyReview = useMemo(() => {
    return computeWeeklyReview(dailyEntries, feasibility);
  }, [dailyEntries, feasibility]);

  const loanTracking = useMemo(() => {
    return computeLoanTracking(feasibility);
  }, [feasibility]);

  // ==========================================================
  // CONVERSATIONAL ADVISOR STATE
  // ==========================================================
  const [advisorChatInput, setAdvisorChatInput] = useState<string>('');
  const [advisorResponses, setAdvisorResponses] = useState<
    { sender: 'user' | 'ai'; text: string }[]
  >([
    {
      sender: 'ai',
      text:
        language === 'mr'
          ? `नमस्कार! मी तुमचा अर्थ एआय व्यावसायिक सल्लागार आहे. आजची विक्री ₹${activeDayEntry.sales.toLocaleString(
              'en-IN'
            )} आणि खर्च ₹${activeDayEntry.totalExpenses.toLocaleString(
              'en-IN'
            )} नोंदवला गेला आहे. तुमच्या व्यवसायाविषयी काय प्रश्न आहे?`
          : language === 'hi'
          ? `नमस्ते! मैं आपका अर्थ एआई सलाहकार हूँ। आज की बिक्री ₹${activeDayEntry.sales.toLocaleString(
              'en-IN'
            )} और खर्च ₹${activeDayEntry.totalExpenses.toLocaleString(
              'en-IN'
            )} दर्ज है। आपके व्यवसाय के संबंध में मैं क्या मदद कर सकता हूँ?`
          : `Hello! I am your ARTH AI Business Advisor. Today’s actual sales are logged at ₹${activeDayEntry.sales.toLocaleString(
              'en-IN'
            )} with ₹${activeDayEntry.totalExpenses.toLocaleString(
              'en-IN'
            )} in expenses. What is happening in your business today?`,
    },
  ]);

  const handleAskAdvisor = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setAdvisorResponses((prev) => [...prev, { sender: 'user', text: q }]);
    setAdvisorChatInput('');

    // Generate response using available data
    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      const targetSales = comparison.targetSales;
      const targetExpenses = comparison.targetExpenses;
      const emi = feasibility.monthlyEMI || 5000;
      const dailySales = activeDayEntry.sales;
      const dailyExp = activeDayEntry.totalExpenses;

      if (lower.includes('sales') || lower.includes('विक्री') || lower.includes('बिक्री') || lower.includes('customer')) {
        if (language === 'mr') {
          reply = `तुमचे दैनिक विक्री उद्दिष्ट ₹${targetSales.toLocaleString('en-IN')} आहे. आज तुमची विक्री ₹${dailySales.toLocaleString('en-IN')} झाली आहे. विक्री वाढवण्यासाठी उद्या सकाळी मुख्य नियमित ग्राहकांना थेट भेट द्या किंवा आगाऊ मागणी नोंदवून घ्या.`;
        } else if (language === 'hi') {
          reply = `आपका दैनिक बिक्री लक्ष्य ₹${targetSales.toLocaleString('en-IN')} है। आज आपकी वास्तविक बिक्री ₹${dailySales.toLocaleString('en-IN')} रही है। बिक्री बढ़ाने के लिए कल सुबह नियमित खरीदारों से संपर्क करके अतिरिक्त ऑर्डर बुक करें।`;
        } else {
          reply = `Your planned daily sales target is ₹${targetSales.toLocaleString('en-IN')}. Today you achieved ₹${dailySales.toLocaleString('en-IN')}. To expand sales tomorrow, follow up directly with regular buyers and secure 70% of orders before noon.`;
        }
      } else if (lower.includes('transport') || lower.includes('expense') || lower.includes('खर्च') || lower.includes('खर्चा')) {
        if (language === 'mr') {
          reply = `तुमची दैनिक खर्च मर्यादा ₹${targetExpenses.toLocaleString('en-IN')} आहे. आज एकूण ₹${dailyExp.toLocaleString('en-IN')} खर्च झाला. वाहतूक खर्च कमी करण्यासाठी फेऱ्या एकत्र करा किंवा शेजारील दुकानदारांसोबत एकत्र माल मागवा.`;
        } else if (language === 'hi') {
          reply = `आपकी दैनिक खर्च सीमा ₹${targetExpenses.toLocaleString('en-IN')} है। आज का खर्च ₹${dailyExp.toLocaleString('en-IN')} हुआ। परिवहन खर्च घटाने के लिए पास के व्यापारियों के साथ मिलकर संयुक्त डिलीवरी करें।`;
        } else {
          reply = `Your planned daily expense limit is ₹${targetExpenses.toLocaleString('en-IN')}. Today expenses were ₹${dailyExp.toLocaleString('en-IN')}. To reduce logistics cost, consolidate travel into single bulk morning trips.`;
        }
      } else if (lower.includes('loan') || lower.includes('कर्ज') || lower.includes('हप्ता') || lower.includes('emi') || lower.includes('किस्त')) {
        const dailyEmiReserve = Math.round(emi / 30);
        if (language === 'mr') {
          reply = `तुमचा मासिक बँक हप्ता ₹${emi.toLocaleString('en-IN')} (अंदाजे ₹${dailyEmiReserve}/दिवस) आहे. दैनिक नफ्यातून दररोज ही रक्कम बाजूला ठेवली तर महिन्याच्या शेवटी कोणताही ताण येणार नाही.`;
        } else if (language === 'hi') {
          reply = `आपकी मासिक ऋण किस्त ₹${emi.toLocaleString('en-IN')} (लगभग ₹${dailyEmiReserve}/दिन) है। दैनिक कमाई से प्रतिदिन यह राशि अलग बैंक खाते में रखें ताकि अंतिम तारीख पर कोई परेशानी न हो।`;
        } else {
          reply = `Your estimated monthly loan repayment is ₹${emi.toLocaleString('en-IN')} (about ₹${dailyEmiReserve}/day). Setting aside this daily debt allocation every evening keeps your repayment stress-free.`;
        }
      } else {
        if (language === 'mr') {
          reply = `तुमच्या नोंदीनुसार: आजची विक्री ₹${dailySales.toLocaleString('en-IN')}, खर्च ₹${dailyExp.toLocaleString('en-IN')} आणि शिल्लक ₹${(dailySales - dailyExp).toLocaleString('en-IN')} आहे. उद्दिष्ट गाठण्यासाठी दररोज ₹${targetSales.toLocaleString('en-IN')} विक्री आवश्यक आहे.`;
        } else if (language === 'hi') {
          reply = `आपके आंकड़ों के अनुसार: आज की बिक्री ₹${dailySales.toLocaleString('en-IN')}, खर्च ₹${dailyExp.toLocaleString('en-IN')} और बचत ₹${(dailySales - dailyExp).toLocaleString('en-IN')} है। योजना अनुसार दैनिक ₹${targetSales.toLocaleString('en-IN')} का लक्ष्य बनाए रखें।`;
        } else {
          reply = `Based on your stored data: Today's sales are ₹${dailySales.toLocaleString('en-IN')}, expenses are ₹${dailyExp.toLocaleString('en-IN')}, leaving ₹${(dailySales - dailyExp).toLocaleString('en-IN')}. To stay on track, maintain at least ₹${targetSales.toLocaleString('en-IN')} daily revenue.`;
        }
      }

      setAdvisorResponses((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  // Top Universal Summary Numbers
  const topMoneyIn = engineReport.metrics.monthlyRevenue;
  const topExpenses = engineReport.metrics.monthlyOperatingExpenses;
  const topMoneyLeft = topMoneyIn - topExpenses;
  const topLoanPayment = engineReport.amortization.monthlyEMI;
  const topMoneyLeftAfterLoan = topMoneyLeft - topLoanPayment;

  return (
    <div id="financial-engine-screen" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-900">
      {/* 1. UNIVERSAL TOP SUMMARY: YOUR BUSINESS MONEY */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-2">
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.portalTitle} • {t.financialEngine}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              {t.yourBusinessMoney}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {t.knowTheGround}
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
            <button
              type="button"
              onClick={() => setMainMode('plan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainMode === 'plan'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.financialPlan}
            </button>
            <button
              type="button"
              onClick={() => setMainMode('track')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainMode === 'track'
                  ? 'bg-teal-500 text-white shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.dailyMoneyTrack}
            </button>
            <button
              type="button"
              onClick={() => setMainMode('loan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainMode === 'loan'
                  ? 'bg-indigo-500 text-white shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.loanProgress}
            </button>
          </div>
        </div>

        {/* The 5 Key Figures Requested in Spec */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
              {t.moneyComingIn}
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block font-mono">
              ₹{Math.round(topMoneyIn).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{t.monthlyRevenue}</span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
              {t.businessExpenses}
            </span>
            <span className="text-xl sm:text-2xl font-black text-rose-300 mt-1 block font-mono">
              ₹{Math.round(topExpenses).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{t.monthlyExpenses}</span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
              {t.moneyLeft}
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 mt-1 block font-mono">
              ₹{Math.round(topMoneyLeft).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{t.operatingProfitSub}</span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
              {t.loanPayment}
            </span>
            <span className="text-xl sm:text-2xl font-black text-sky-300 mt-1 block font-mono">
              ₹{Math.round(topLoanPayment).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{t.monthlyPayment}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-amber-400/10 border border-amber-400/40 rounded-2xl p-4">
            <span className="text-[11px] font-mono uppercase text-amber-300 block font-bold">
              {t.moneyLeftAfterLoanPayment}
            </span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block font-mono">
              ₹{Math.round(topMoneyLeftAfterLoan).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-amber-200 mt-0.5 block">{t.moneyLeftAfterExpenses}</span>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyToPlan}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.applyToPlan}</span>
            </button>
            <button
              type="button"
              onClick={onGoToPlan}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer"
            >
              <span>{t.view7YearPlan}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {appliedSyncSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Synchronized with your Feasibility & 7-Year Plan</span>
            </span>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. SECTION A: FINANCIAL PLAN (PLANNING) */}
      {/* ========================================================== */}
      {mainMode === 'plan' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Sector Engine Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Select Business / Farm Sector Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-calibrates unit prices, raw materials, seasonal cycles, and capital requirements.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {[
                { id: 'dairy', label: 'Dairy Unit', icon: Milk },
                { id: 'poultry', label: 'Poultry Farm', icon: Egg },
                { id: 'textile', label: 'Textile / Garment', icon: Scissors },
                { id: 'farm_crop', label: 'Farm / Crop', icon: Sprout },
                { id: 'retail_shop', label: 'Retail / Shop', icon: Store },
                { id: 'food_processing', label: 'Food Processing', icon: Building2 },
                { id: 'other_micro', label: 'Other Micro', icon: Layers },
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as SupportedCategory)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span className="text-xs text-center font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Parameters Form (Startup & Operating) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Startup Costs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span>{t.projectCost}</span>
                </h3>
                <span className="text-sm font-black font-mono text-slate-900">
                  ₹{totalCalculatedStartup.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Machinery & Tools</span>
                    <span className="font-mono">₹{startupCosts.machineryAndTools.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="800000"
                    step="10000"
                    value={startupCosts.machineryAndTools}
                    onChange={(e) =>
                      setStartupCosts((prev) => ({ ...prev, machineryAndTools: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Stock / Inventory</span>
                    <span className="font-mono">₹{startupCosts.stockAndInventory.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="400000"
                    step="5000"
                    value={startupCosts.stockAndInventory}
                    onChange={(e) =>
                      setStartupCosts((prev) => ({ ...prev, stockAndInventory: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Working Capital Reserve</span>
                    <span className="font-mono">₹{startupCosts.workingCapitalReserve.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="300000"
                    step="5000"
                    value={startupCosts.workingCapitalReserve}
                    onChange={(e) =>
                      setStartupCosts((prev) => ({ ...prev, workingCapitalReserve: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Premises / Civil Shed Work</span>
                    <span className="font-mono">₹{startupCosts.premisesOrCivil.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="400000"
                    step="5000"
                    value={startupCosts.premisesOrCivil}
                    onChange={(e) =>
                      setStartupCosts((prev) => ({ ...prev, premisesOrCivil: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold text-slate-900 mb-1">
                    <span>{t.ownCapital}</span>
                    <span className="font-mono text-emerald-700">₹{ownContribution.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max={Math.max(10000, totalCalculatedStartup)}
                    step="5000"
                    value={ownContribution}
                    onChange={(e) => setOwnContribution(parseInt(e.target.value) || 0)}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                    <span>Required Bank Debt:</span>
                    <span className="font-bold text-slate-900">
                      ₹{Math.max(0, totalCalculatedStartup - ownContribution).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Revenue & Operating Expenses */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span>{t.expectedMoneyPlan}</span>
                </h3>
                <span className="text-sm font-black font-mono text-slate-900">
                  ₹{Math.round(topMoneyIn).toLocaleString('en-IN')}/mo
                </span>
              </div>

              <div className="space-y-4">
                {isFarmer ? (
                  <>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>{t.cropName}</span>
                        <span className="font-bold text-slate-900">{farmInputs.cropName}</span>
                      </div>
                      <input
                        type="text"
                        value={farmInputs.cropName}
                        onChange={(e) => setFarmInputs((prev) => ({ ...prev, cropName: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-700 block mb-1">Land (Acres)</span>
                        <input
                          type="number"
                          value={farmInputs.landAreaAcres}
                          onChange={(e) =>
                            setFarmInputs((prev) => ({ ...prev, landAreaAcres: parseFloat(e.target.value) || 1 }))
                          }
                          className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-700 block mb-1">Yield / Acre (Qtl)</span>
                        <input
                          type="number"
                          value={farmInputs.yieldPerAcreQuintals}
                          onChange={(e) =>
                            setFarmInputs((prev) => ({
                              ...prev,
                              yieldPerAcreQuintals: parseFloat(e.target.value) || 10,
                            }))
                          }
                          className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-700 block mb-1">
                        Market Price / Quintal (₹)
                      </span>
                      <input
                        type="number"
                        value={farmInputs.marketPricePerQuintal}
                        onChange={(e) =>
                          setFarmInputs((prev) => ({
                            ...prev,
                            marketPricePerQuintal: parseFloat(e.target.value) || 1000,
                          }))
                        }
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Monthly Sales Volume (Units / Orders)</span>
                        <span className="font-mono">{monthlyUnitsSold} units</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="8000"
                        step="20"
                        value={monthlyUnitsSold}
                        onChange={(e) => setMonthlyUnitsSold(parseInt(e.target.value) || 0)}
                        className="w-full accent-teal-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Average Selling Price per Unit</span>
                        <span className="font-mono">₹{unitSellingPrice}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="2500"
                        step="5"
                        value={unitSellingPrice}
                        onChange={(e) => setUnitSellingPrice(parseInt(e.target.value) || 0)}
                        className="w-full accent-teal-600 cursor-pointer"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Raw Materials & Stock (Monthly)</span>
                        <span className="font-mono">
                          ₹{operatingExpenses.rawMaterialOrFeedOrSeeds.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="300000"
                        step="2000"
                        value={operatingExpenses.rawMaterialOrFeedOrSeeds}
                        onChange={(e) =>
                          setOperatingExpenses((prev) => ({
                            ...prev,
                            rawMaterialOrFeedOrSeeds: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-full accent-teal-600 cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 3-Scenario Stress Testing */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{t.differentPossibleSituations}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-900 block">{t.goodCase}</span>
                <span className="text-xl font-black font-mono text-emerald-950 block">
                  ₹{Math.round(engineReport.metrics.monthlyNetProfit * 1.2).toLocaleString('en-IN')}/mo
                </span>
                <p className="text-[11px] text-emerald-800">
                  Higher consumer demand; easily accommodates all loan repayments and builds cash reserve.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-xs font-bold text-blue-900 block">{t.normalCase}</span>
                <span className="text-xl font-black font-mono text-blue-950 block">
                  ₹{Math.round(engineReport.metrics.monthlyNetProfit).toLocaleString('en-IN')}/mo
                </span>
                <p className="text-[11px] text-blue-800">
                  Standard expected operations meeting all financial targets on time.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                <span className="text-xs font-bold text-rose-900 block">{t.difficultCase}</span>
                <span className="text-xl font-black font-mono text-rose-950 block">
                  ₹{Math.max(0, Math.round(engineReport.metrics.monthlyNetProfit * 0.45)).toLocaleString('en-IN')}/mo
                </span>
                <p className="text-[11px] text-rose-800">
                  Off-season slump or price drops; business still survives by trimming overheads.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. SECTION B: DAILY MONEY TRACK (ACTUAL TRACKING) */}
      {/* ========================================================== */}
      {mainMode === 'track' && (
        <div className="space-y-6 animate-in fade-in">
          {/* TODAY'S MONEY REVIEW CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                  {activeDayEntry.dayLabel || activeDayEntry.date} • {t.todayMoneyReview}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.todayMoneyReview}
                </h2>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    comparison.salesDiff >= 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  {comparison.salesStatusText}
                </span>
              </div>
            </div>

            {/* Daily Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.salesToday}
                </span>
                <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
                  ₹{activeDayEntry.sales.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Target: ₹{comparison.targetSales.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.expensesToday}
                </span>
                <span className="text-xl font-black font-mono text-rose-700 mt-1 block">
                  ₹{activeDayEntry.totalExpenses.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Limit: ₹{comparison.targetExpenses.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-mono text-emerald-800 uppercase block font-bold">
                  {t.moneyLeftToday}
                </span>
                <span className="text-xl font-black font-mono text-emerald-950 mt-1 block">
                  ₹{activeDayEntry.netProfit.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-700 mt-0.5 block">
                  Sales - Expenses
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.salesTarget}
                </span>
                <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
                  ₹{comparison.targetSales.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Daily Benchmark</span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[11px] font-mono text-amber-800 uppercase block font-bold">
                  {t.differenceFromTarget}
                </span>
                <span className="text-xl font-black font-mono text-amber-950 mt-1 block">
                  {comparison.salesDiff >= 0 ? '+' : ''}₹{comparison.salesDiff.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-amber-800 mt-0.5 block">
                  {comparison.salesDiff >= 0 ? 'Surplus' : 'Deficit'}
                </span>
              </div>
            </div>

            {/* TODAY'S ADVICE (1 TO 3 PRACTICAL SUGGESTIONS) */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 font-mono">
                  {t.todayAdvice} • {t.whatYouCanDoTomorrow}
                </h4>
              </div>

              <p className="text-xs font-medium text-amber-900">
                {comparison.shortExplanation}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {comparison.tomorrowSuggestions.map((sugg, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs font-medium text-slate-800 flex items-start gap-2 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{sugg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DAILY ENTRY SECTION (Sales & Multiple Expenses) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Today's Sales Entry */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>{t.salesToday}</span>
                </h3>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {activeDayEntry.date}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.salesMoneyEarned} (₹)
                  </label>
                  <input
                    type="number"
                    value={activeDayEntry.sales}
                    onChange={(e) => handleUpdateSales(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 text-lg font-black font-mono border border-slate-300 rounded-2xl focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {isFarmer ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        {t.quantitySold}
                      </label>
                      <input
                        type="number"
                        value={activeDayEntry.quantitySold || 10}
                        onChange={(e) => {
                          const q = parseFloat(e.target.value) || 0;
                          const price = activeDayEntry.sellingPrice || 25;
                          handleUpdateSales(q * price);
                        }}
                        className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        {t.sellingPrice}
                      </label>
                      <input
                        type="number"
                        value={activeDayEntry.sellingPrice || 25}
                        onChange={(e) => {
                          const p = parseFloat(e.target.value) || 0;
                          const q = activeDayEntry.quantitySold || 10;
                          handleUpdateSales(q * p);
                        }}
                        className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs text-slate-500">
                      Approx {activeDayEntry.unitsSold || 25} customers/units served today.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Today's Expenses Entry (+ ADD EXPENSE) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-rose-600" />
                  <span>{t.expensesToday}</span>
                </h3>
                <span className="text-xs font-mono font-bold text-rose-700">
                  Total: ₹{activeDayEntry.totalExpenses.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Existing Expense Items List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeDayEntry.expenses.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                      {item.note && (
                        <span className="text-slate-500 text-[11px] block">{item.note}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-700">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExpense(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Expense Form */}
              <form onSubmit={handleAddExpense} className="pt-3 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  {t.addExpense}
                </span>

                {/* Quick Expense Category Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {(isFarmer ? FARMER_EXPENSE_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewExpName(cat)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                        newExpName === cat
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder={t.expenseName}
                    value={newExpName}
                    onChange={(e) => setNewExpName(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                  <input
                    type="number"
                    placeholder={t.amount}
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    className="px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder={t.optionalNote}
                    value={newExpNote}
                    onChange={(e) => setNewExpNote(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {t.addExpense}
                </button>
              </form>
            </div>
          </div>

          {/* 7-DAY REVIEW & WEEKLY TARGET */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.sevenDayReview}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.comparedWithWeeklyTarget}: {weeklyReview.salesVsTargetPct}% of weekly goal achieved.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.totalSales}
                </span>
                <span className="text-lg font-black font-mono text-slate-900 mt-1 block">
                  ₹{weeklyReview.totalSales.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.totalExpenses}
                </span>
                <span className="text-lg font-black font-mono text-rose-700 mt-1 block">
                  ₹{weeklyReview.totalExpenses.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-mono text-emerald-800 uppercase block font-bold">
                  {t.totalProfit}
                </span>
                <span className="text-lg font-black font-mono text-emerald-950 mt-1 block">
                  ₹{weeklyReview.totalProfit.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.avgDailySales}
                </span>
                <span className="text-lg font-black font-mono text-slate-900 mt-1 block">
                  ₹{weeklyReview.avgDailySales.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.avgDailyExpenses}
                </span>
                <span className="text-lg font-black font-mono text-slate-700 mt-1 block">
                  ₹{weeklyReview.avgDailyExpenses.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.avgDailyProfit}
                </span>
                <span className="text-lg font-black font-mono text-emerald-700 mt-1 block">
                  ₹{weeklyReview.avgDailyProfit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* DAILY TRACKING HISTORY TABS (Today, Yesterday, This Week, This Month) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Daily Tracking History
              </h3>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {(['today', 'yesterday', 'week', 'month'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => {
                      setSelectedHistoryFilter(filterKey);
                      if (filterKey === 'today') setCurrentDayIndex(0);
                      if (filterKey === 'yesterday') setCurrentDayIndex(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedHistoryFilter === filterKey
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filterKey === 'today'
                      ? t.viewToday
                      : filterKey === 'yesterday'
                      ? t.viewYesterday
                      : filterKey === 'week'
                      ? t.viewThisWeek
                      : t.viewThisMonth}
                  </button>
                ))}
              </div>
            </div>

            {/* Days Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold">Date / Day</th>
                    <th className="py-2.5 px-3 font-semibold font-mono">{t.salesMoneyEarned}</th>
                    <th className="py-2.5 px-3 font-semibold font-mono">{t.businessExpenses}</th>
                    <th className="py-2.5 px-3 font-semibold font-mono">{t.moneyLeftAfterExpenses}</th>
                    <th className="py-2.5 px-3 font-semibold">Details / Notes</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {dailyEntries.map((entry, idx) => {
                    const isCurrent = idx === currentDayIndex;
                    return (
                      <tr
                        key={entry.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isCurrent ? 'bg-amber-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-sans font-medium text-slate-900">
                          {entry.dayLabel || entry.date}
                          {isCurrent && (
                            <span className="ml-1.5 text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-sm font-bold">
                              ACTIVE
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          ₹{entry.sales.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-rose-700">
                          ₹{entry.totalExpenses.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-700">
                          ₹{entry.netProfit.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-600 truncate max-w-xs">
                          {entry.notes || 'Normal routine'}
                        </td>
                        <td className="py-3 px-3 text-right font-sans">
                          <button
                            type="button"
                            onClick={() => setCurrentDayIndex(idx)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-teal-800 hover:bg-teal-50 cursor-pointer"
                          >
                            Open Day
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* PLAN VS ACTUAL DIRECT COMPARISON */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-teal-600" />
              <span>{t.planVsActual}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Daily Sales</span>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{t.plannedDailySales}:</span>
                  <span className="font-mono font-bold">₹{comparison.targetSales.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{t.actualDailySales}:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{activeDayEntry.sales.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-1 border-t border-slate-200 text-xs font-bold text-amber-700">
                  {comparison.salesStatusText}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Daily Expenses</span>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{t.plannedDailyExpense}:</span>
                  <span className="font-mono font-bold">₹{comparison.targetExpenses.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{t.actualDailyExpense}:</span>
                  <span className="font-mono font-bold text-rose-700">
                    ₹{activeDayEntry.totalExpenses.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-1 border-t border-slate-200 text-xs font-bold text-slate-700">
                  Diff: {comparison.expenseDiff >= 0 ? '+' : ''}₹{comparison.expenseDiff.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-950 block">Daily Money Left</span>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-800">{t.plannedDailyProfit}:</span>
                  <span className="font-mono font-bold">₹{comparison.targetProfit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-800">{t.actualDailyProfit}:</span>
                  <span className="font-mono font-bold text-emerald-950">
                    ₹{activeDayEntry.netProfit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-1 border-t border-emerald-200 text-xs font-bold text-emerald-900">
                  {comparison.profitStatusText}
                </div>
              </div>
            </div>
          </div>

          {/* ASK YOUR BUSINESS ADVISOR (CONVERSATIONAL INTERFACE) */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-black uppercase tracking-wider text-white">
                {t.askYourBusinessAdvisor}
              </h3>
            </div>

            {/* Suggested Question Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                t.qLowerSales,
                t.qHighTransport,
                t.qLoanTrouble,
                t.qCustomersNotBuying,
                t.qIncreaseSales,
                t.qLessProfit,
                t.qReduceExpenses,
                t.qRepayLoanDaily,
              ].map((pillText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAskAdvisor(pillText)}
                  className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  {pillText}
                </button>
              ))}
            </div>

            {/* Chat History Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 max-h-60 overflow-y-auto space-y-3">
              {advisorResponses.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                      A
                    </div>
                  )}
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-amber-400 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 leading-relaxed'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAdvisor(advisorChatInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={t.tellArthAi}
                value={advisorChatInput}
                onChange={(e) => setAdvisorChatInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.send}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 4. SECTION C: LOAN REPAYMENT TRACKING */}
      {/* ========================================================== */}
      {mainMode === 'loan' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t.loanProgress}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{t.estimateNotice}</p>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-300">
                  {t.onTrack}
                </span>
              </div>
            </div>

            {/* Simplified Loan Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.loanAmount}
                </span>
                <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
                  ₹{loanTracking.loanAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Interest Rate: {loanTracking.interestRate}% p.a.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.interest}
                </span>
                <span className="text-xl font-black font-mono text-rose-700 mt-1 block">
                  ₹{loanTracking.totalInterest.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Total borrowing charge</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.monthlyPayment}
                </span>
                <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
                  ₹{loanTracking.monthlyPayment.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Daily Share: ₹{Math.round(loanTracking.monthlyPayment / 30).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.totalAmountToRepay}
                </span>
                <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
                  ₹{loanTracking.totalAmountToRepay.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Principal + Interest</span>
              </div>
            </div>

            {/* Repayment Progress Bar */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">
                  {t.amountPaid}: <span className="font-mono text-emerald-700">₹{loanTracking.amountPaid.toLocaleString('en-IN')}</span>
                </span>
                <span className="text-slate-700">
                  {t.amountRemaining}: <span className="font-mono text-slate-900">₹{loanTracking.amountRemaining.toLocaleString('en-IN')}</span>
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${Math.round(
                      (loanTracking.amountPaid / (loanTracking.totalAmountToRepay || 1)) * 100
                    )}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{t.nextPayment}: {loanTracking.nextPaymentDueDate}</span>
                <span>{t.paymentStatus}: {t.onTrack}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
