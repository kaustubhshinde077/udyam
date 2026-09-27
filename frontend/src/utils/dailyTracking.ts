import { DailyExpenseItem, DailyLogEntry, FinancialFeasibilityResult, Language, LoanTrackingData } from '../types';

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Raw material',
  'Labour',
  'Transport',
  'Electricity',
  'Rent',
  'Feed',
  'Packaging',
  'Maintenance',
  'Other',
] as const;

export const FARMER_EXPENSE_CATEGORIES = [
  'Labour',
  'Transport',
  'Seeds / Inputs',
  'Fertilizer',
  'Pesticide',
  'Irrigation / Electricity',
  'Machinery / Diesel',
  'Other',
] as const;

/**
 * Creates an initial 7-day tracking state seeded around the planned daily target
 */
export function createInitialDailyEntries(
  feasibility: FinancialFeasibilityResult,
  isFarmer: boolean = false
): DailyLogEntry[] {
  const targetDailySales = Math.round((feasibility?.monthlyRevenue || 90000) / 30);
  const targetDailyExpense = Math.max(
    500,
    Math.round(((feasibility?.monthlyCosts || 65000) - (feasibility?.monthlyEMI || 5000)) / 30)
  );

  const entries: DailyLogEntry[] = [];
  const today = new Date();

  // Multipliers for the last 7 days to simulate real variability
  const variances = [
    { dayOffset: 0, salesMult: 0.86, expMult: 1.08, label: 'Today', note: 'Regular delivery completed' },
    { dayOffset: 1, salesMult: 0.98, expMult: 0.95, label: 'Yesterday', note: 'Weekly haat sales' },
    { dayOffset: 2, salesMult: 1.05, expMult: 1.02, label: '2 days ago', note: 'High customer turnout' },
    { dayOffset: 3, salesMult: 0.92, expMult: 0.97, label: '3 days ago', note: 'Normal routine' },
    { dayOffset: 4, salesMult: 0.88, expMult: 1.15, label: '4 days ago', note: 'Machine maintenance done' },
    { dayOffset: 5, salesMult: 1.12, expMult: 1.00, label: '5 days ago', note: 'Bulk advance order delivered' },
    { dayOffset: 6, salesMult: 0.95, expMult: 0.96, label: '6 days ago', note: 'Steady morning collection' },
  ];

  for (const v of variances) {
    const d = new Date(today);
    d.setDate(today.getDate() - v.dayOffset);
    const dateStr = d.toISOString().split('T')[0];

    const sales = Math.round(targetDailySales * v.salesMult);
    const baseExpense = Math.round(targetDailyExpense * v.expMult);

    let expenseItems: DailyExpenseItem[] = [];
    if (isFarmer) {
      const labour = Math.round(baseExpense * 0.45);
      const transport = Math.round(baseExpense * 0.25);
      const inputs = Math.round(baseExpense * 0.2);
      const other = Math.max(100, baseExpense - (labour + transport + inputs));
      expenseItems = [
        { id: `${dateStr}-1`, name: 'Labour', amount: labour, note: 'Daily farm hands wages' },
        { id: `${dateStr}-2`, name: 'Transport', amount: transport, note: 'Trolley hire to local mandi' },
        { id: `${dateStr}-3`, name: 'Seeds / Inputs', amount: inputs, note: 'Fertilizer top-up' },
        { id: `${dateStr}-4`, name: 'Other', amount: other, note: 'Packing sacks & twine' },
      ];
    } else {
      const rawMat = Math.round(baseExpense * 0.55);
      const labour = Math.round(baseExpense * 0.2);
      const transport = Math.round(baseExpense * 0.15);
      const other = Math.max(100, baseExpense - (rawMat + labour + transport));
      expenseItems = [
        { id: `${dateStr}-1`, name: 'Raw material', amount: rawMat, note: 'Morning stock procurement' },
        { id: `${dateStr}-2`, name: 'Labour', amount: labour, note: 'Helper daily pay' },
        { id: `${dateStr}-3`, name: 'Transport', amount: transport, note: 'Delivery fuel / auto fare' },
        { id: `${dateStr}-4`, name: 'Other', amount: other, note: 'Packaging & tea' },
      ];
    }

    const totalExp = expenseItems.reduce((sum, item) => sum + item.amount, 0);

    entries.push({
      id: `entry-${dateStr}`,
      date: dateStr,
      dayLabel: v.label,
      sales,
      unitsSold: Math.round(sales / 45),
      quantitySold: isFarmer ? Math.round(sales / 25) : undefined,
      sellingPrice: isFarmer ? 25 : 45,
      expenses: expenseItems,
      totalExpenses: totalExp,
      netProfit: sales - totalExp,
      notes: v.note,
    });
  }

  return entries;
}

export interface DailyComparison {
  todaySales: number;
  todayExpenses: number;
  todayProfit: number;
  targetSales: number;
  targetExpenses: number;
  targetProfit: number;
  salesDiff: number; // actual - target
  expenseDiff: number; // actual - target
  profitDiff: number; // actual - target
  salesStatusText: string;
  profitStatusText: string;
  shortExplanation: string;
  tomorrowSuggestions: string[];
}

export function computeDailyComparison(
  entry: DailyLogEntry,
  feasibility: FinancialFeasibilityResult,
  language: Language = 'en'
): DailyComparison {
  const targetSales = Math.round((feasibility?.monthlyRevenue || 90000) / 30);
  const targetExpenses = Math.max(
    500,
    Math.round(((feasibility?.monthlyCosts || 65000) - (feasibility?.monthlyEMI || 5000)) / 30)
  );
  const targetProfit = targetSales - targetExpenses;

  const todaySales = entry.sales || 0;
  const todayExpenses = entry.totalExpenses || 0;
  const todayProfit = todaySales - todayExpenses;

  const salesDiff = todaySales - targetSales;
  const expenseDiff = todayExpenses - targetExpenses;
  const profitDiff = todayProfit - targetProfit;

  // Simple status text
  let salesStatusText = '';
  let profitStatusText = '';
  let shortExplanation = '';
  const tomorrowSuggestions: string[] = [];

  if (language === 'mr') {
    if (salesDiff >= 0) {
      salesStatusText = `उद्दिष्टापेक्षा ₹${Math.abs(salesDiff).toLocaleString('en-IN')} जास्त`;
    } else {
      salesStatusText = `उद्दिष्टापेक्षा ₹${Math.abs(salesDiff).toLocaleString('en-IN')} कमी`;
    }

    if (profitDiff >= 0) {
      profitStatusText = `अपेक्षेपेक्षा ₹${Math.abs(profitDiff).toLocaleString('en-IN')} जास्त शिल्लक`;
    } else {
      profitStatusText = `अपेक्षेपेक्षा ₹${Math.abs(profitDiff).toLocaleString('en-IN')} कमी शिल्लक`;
    }

    if (salesDiff < 0 && expenseDiff > 0) {
      shortExplanation = 'आज विक्री नियोजनापेक्षा कमी झाली आणि खर्च थोडा जास्त झाला.';
    } else if (salesDiff >= 0 && expenseDiff <= 0) {
      shortExplanation = 'उत्कृष्ट! विक्री उद्दिष्टापेक्षा जास्त झाली आणि खर्च नियंत्रणात राहिला.';
    } else if (salesDiff < 0) {
      shortExplanation = 'आज विक्री उद्दिष्टापेक्षा कमी राहिली, उद्या विक्री वाढवण्यावर भर द्या.';
    } else {
      shortExplanation = 'आज खर्च थोडा वाढला आहे, उद्या अनावश्यक खर्च टाळा.';
    }

    // Practical suggestions
    if (salesDiff < 0) {
      tomorrowSuggestions.push('उद्या सकाळी लवकर मुख्य ग्राहकांशी संपर्क साधा किंवा नियमित दुकानांना आगाऊ पुरवठा करा.');
    } else {
      tomorrowSuggestions.push('नियमित ग्राहकांकडून आगाऊ मागणी नोंदवून ठेवा जेणेकरून विक्री कायम राहील.');
    }

    if (expenseDiff > 0) {
      tomorrowSuggestions.push('वाहतूक व कच्च्या मालाचा खर्च कमी करण्यासाठी उद्या दोन फेऱ्या एकत्र करा.');
    } else {
      tomorrowSuggestions.push('खर्च नियंत्रणात आहे. उरलेली रक्कम दररोज कर्ज परतफेडीसाठी सुरक्षित ठेवा.');
    }

    tomorrowSuggestions.push(`दैनिक बँक हप्ता सुरक्षित ठेवण्यासाठी उद्या किमान ₹${targetSales.toLocaleString('en-IN')} ची विक्री गाठा.`);
  } else if (language === 'hi') {
    if (salesDiff >= 0) {
      salesStatusText = `लक्ष्य से ₹${Math.abs(salesDiff).toLocaleString('en-IN')} अधिक`;
    } else {
      salesStatusText = `लक्ष्य से ₹${Math.abs(salesDiff).toLocaleString('en-IN')} कम`;
    }

    if (profitDiff >= 0) {
      profitStatusText = `अपेक्षा से ₹${Math.abs(profitDiff).toLocaleString('en-IN')} अधिक बचत`;
    } else {
      profitStatusText = `अपेक्षा से ₹${Math.abs(profitDiff).toLocaleString('en-IN')} कम बचत`;
    }

    if (salesDiff < 0 && expenseDiff > 0) {
      shortExplanation = 'आज बिक्री योजना से कम रही और खर्च थोड़ा अधिक हुआ।';
    } else if (salesDiff >= 0 && expenseDiff <= 0) {
      shortExplanation = 'शाबाश! बिक्री लक्ष्य से अधिक रही और खर्च पूरी तरह नियंत्रण में रहा।';
    } else if (salesDiff < 0) {
      shortExplanation = 'आज बिक्री लक्ष्य से कम रही, कल बिक्री बढ़ाने पर ध्यान दें।';
    } else {
      shortExplanation = 'आज खर्च थोड़ा बढ़ गया है, कल अनावश्यक खर्च से बचें।';
    }

    if (salesDiff < 0) {
      tomorrowSuggestions.push('कल सुबह मुख्य ग्राहकों या पास की दुकानों से संपर्क करके अतिरिक्त ऑर्डर लें।');
    } else {
      tomorrowSuggestions.push('अच्छी बिक्री बनाए रखने के लिए नियमित ग्राहकों से अग्रिम ऑर्डर नोट करें।');
    }

    if (expenseDiff > 0) {
      tomorrowSuggestions.push('परिवहन और कच्चे माल का खर्च घटाने के लिए कल की डिलीवरी एक साथ करें।');
    } else {
      tomorrowSuggestions.push('खर्च नियंत्रण में है। आज की बचत से बैंक किस्त के लिए अलग राशि रख लें।');
    }

    tomorrowSuggestions.push(`दैनिक ईएमआई सुरक्षित रखने के लिए कल कम से कम ₹${targetSales.toLocaleString('en-IN')} का बिक्री लक्ष्य पूरा करें।`);
  } else {
    // English
    if (salesDiff >= 0) {
      salesStatusText = `₹${Math.abs(salesDiff).toLocaleString('en-IN')} above target`;
    } else {
      salesStatusText = `₹${Math.abs(salesDiff).toLocaleString('en-IN')} below target`;
    }

    if (profitDiff >= 0) {
      profitStatusText = `₹${Math.abs(profitDiff).toLocaleString('en-IN')} above planned profit`;
    } else {
      profitStatusText = `₹${Math.abs(profitDiff).toLocaleString('en-IN')} below planned profit`;
    }

    if (salesDiff < 0 && expenseDiff > 0) {
      shortExplanation = 'You sold less than planned today and spent slightly more.';
    } else if (salesDiff >= 0 && expenseDiff <= 0) {
      shortExplanation = 'Great job! Sales exceeded target and expenses stayed comfortably inside limits.';
    } else if (salesDiff < 0) {
      shortExplanation = 'Sales fell below your planned daily target today.';
    } else {
      shortExplanation = 'Today expenses were slightly higher than your daily budget limit.';
    }

    if (salesDiff < 0) {
      tomorrowSuggestions.push('Follow up early with regular buyers or local shops to secure advance morning orders.');
    } else {
      tomorrowSuggestions.push('Lock in advance weekly orders with your top 3 local customers to maintain strong volume.');
    }

    if (expenseDiff > 0) {
      tomorrowSuggestions.push('Combine delivery trips or bulk buy packaging materials with neighbors to trim transport cost.');
    } else {
      tomorrowSuggestions.push('Expenses were controlled. Set aside today’s daily loan allocation into your escrow reserve.');
    }

    tomorrowSuggestions.push(`Aim for at least ₹${targetSales.toLocaleString('en-IN')} in sales tomorrow to keep your monthly loan repayment stress-free.`);
  }

  return {
    todaySales,
    todayExpenses,
    todayProfit,
    targetSales,
    targetExpenses,
    targetProfit,
    salesDiff,
    expenseDiff,
    profitDiff,
    salesStatusText,
    profitStatusText,
    shortExplanation,
    tomorrowSuggestions: tomorrowSuggestions.slice(0, 3),
  };
}

export interface WeeklyReviewSummary {
  totalSales: number;
  totalExpenses: number;
  totalProfit: number;
  avgDailySales: number;
  avgDailyExpenses: number;
  avgDailyProfit: number;
  targetWeeklySales: number;
  targetWeeklyExpenses: number;
  targetWeeklyProfit: number;
  salesVsTargetPct: number;
}

export function computeWeeklyReview(
  entries: DailyLogEntry[],
  feasibility: FinancialFeasibilityResult
): WeeklyReviewSummary {
  const last7 = entries.slice(0, 7);
  const count = last7.length || 1;

  const totalSales = last7.reduce((sum, e) => sum + (e.sales || 0), 0);
  const totalExpenses = last7.reduce((sum, e) => sum + (e.totalExpenses || 0), 0);
  const totalProfit = totalSales - totalExpenses;

  const avgDailySales = Math.round(totalSales / count);
  const avgDailyExpenses = Math.round(totalExpenses / count);
  const avgDailyProfit = Math.round(totalProfit / count);

  const targetDailySales = Math.round((feasibility?.monthlyRevenue || 90000) / 30);
  const targetDailyExpenses = Math.max(
    500,
    Math.round(((feasibility?.monthlyCosts || 65000) - (feasibility?.monthlyEMI || 5000)) / 30)
  );
  const targetWeeklySales = targetDailySales * 7;
  const targetWeeklyExpenses = targetDailyExpenses * 7;
  const targetWeeklyProfit = targetWeeklySales - targetWeeklyExpenses;

  const salesVsTargetPct = Math.round((totalSales / (targetWeeklySales || 1)) * 100);

  return {
    totalSales,
    totalExpenses,
    totalProfit,
    avgDailySales,
    avgDailyExpenses,
    avgDailyProfit,
    targetWeeklySales,
    targetWeeklyExpenses,
    targetWeeklyProfit,
    salesVsTargetPct,
  };
}

export function computeLoanTracking(
  feasibility: FinancialFeasibilityResult
): LoanTrackingData {
  const loanAmount = feasibility?.potentialLoan || 200000;
  const rate = feasibility?.interestRate || 8.0;
  const tenureMonths = feasibility?.tenureMonths || 84;
  const monthlyPayment = feasibility?.monthlyEMI || Math.round((loanAmount * 1.35) / tenureMonths);

  // Total interest calculation (deterministic approximate)
  const totalAmountToRepay = monthlyPayment * tenureMonths;
  const totalInterest = Math.max(0, totalAmountToRepay - loanAmount);

  // Simulated 3 months paid for demonstration tracking
  const monthsPaid = 3;
  const amountPaid = Math.min(totalAmountToRepay, monthlyPayment * monthsPaid);
  const amountRemaining = Math.max(0, totalAmountToRepay - amountPaid);

  // Payment status
  const paymentStatus: 'ON TRACK' | 'PAYMENT DUE' | 'NEEDS ATTENTION' = 'ON TRACK';

  // Next payment 10th of next month
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 10);
  const nextPaymentDueDate = nextMonth.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return {
    loanAmount,
    interestRate: rate,
    totalInterest,
    monthlyPayment,
    totalAmountToRepay,
    amountPaid,
    amountRemaining,
    nextPaymentDueDate,
    paymentStatus,
    isEstimate: true,
  };
}
