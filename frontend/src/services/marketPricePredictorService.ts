/**
 * Nashik Local Crop Market Price Prediction & Analytics Service (Monthly)
 * 
 * ARCHITECTURAL DESIGN:
 * This service abstracts monthly price prediction and seasonal trend estimation away from the UI.
 * 
 * Current Phase:
 * - Seasonal RAG Simulation: Retrieves same-crop, same-market, same-calendar-month historical
 *   records from previous years (2016–2025) alongside recent momentum records.
 * - Time-series seasonal decomposition & least-squares regression per calendar month.
 * - Clearly marked demonstration dataset and statistical seasonal forecast.
 * 
 * Future RAG Phase:
 * - Replace `ragRetrieveRelevantMonthlyRecords` with LangChain / Vector DB RAG pipeline retrieval:
 *   APMC documents -> Vector Store (Chroma/Pinecone) -> Hybrid Search -> RAG Service -> Prediction Service
 * 
 * Future ML Phase:
 * - Replace `computeSeasonalMonthlyPrediction` with a machine-learning regression model
 *   (e.g., LightGBM / XGBoost / Prophet / Seasonal ARIMA) via an API endpoint, returning the
 *   exact same `MonthlyMarketPredictionResult` schema without redesigning the UI component.
 */

import {
  CropMarketPriceRecord,
  NASHIK_HISTORICAL_MONTHLY_DATA,
  NASHIK_CROPS_CONFIG,
  MONTH_NAMES,
  getMonthlyCropRecords,
} from '../data/nashikCropMarketData';

export type TrendDirection = '↑ Increasing' | '→ Stable' | '↓ Decreasing';
export type TrendCategory = 'Increasing' | 'Stable' | 'Decreasing';

export interface MonthlyChartDataPoint {
  id: string;
  date: string; // "YYYY-MM-DD"
  month: number; // 1-12
  year: number;
  monthShort: string; // "Oct"
  monthFull: string; // "October"
  label: string; // "Oct 2025"
  price: number;
  isEstimate: boolean;
  market: string;
  source: string;
  arrivalQuantityQuintals?: number;
}

export interface RagRetrievedContext {
  targetCrop: string;
  targetMarket: string;
  targetMonth: number;
  targetYear: number;
  targetMonthName: string;
  sameMonthHistoricalPrices: Array<{
    year: number;
    month: number;
    price: number;
    arrivalQuantityQuintals?: number;
  }>;
  sameMonthHistoricalAverage: number;
  overallHistoricalAverage: number;
  seasonalMultiplier: number;
  recentHistoricalPrices: Array<{
    date: string;
    label: string;
    price: number;
  }>;
  seasonalPatternSummary: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface MonthlyMarketPredictionResult {
  crop: 'Onion' | 'Corn' | 'Grapes' | 'Pomegranate';
  cropDisplayName: {
    en: string;
    hi: string;
    mr: string;
  };
  cropIcon: string;
  market: string;
  availableMarkets: string[];
  unit: string;

  // Selected Target Prediction Month & Year
  targetMonth: number; // 1-12
  targetYear: number; // e.g. 2026
  targetMonthName: {
    en: string;
    fullEn: string;
    hi: string;
    mr: string;
  };
  targetLabel: string; // e.g. "October 2026"

  // 4 Required Display Metrics
  estimatedUpcomingPrice: number; // ₹ / Quintal
  expectedPriceTrend: TrendDirection;
  trendCategory: TrendCategory;
  trendPercentage: number; // % change vs same month in previous historical year
  historicalAverage: number; // ₹ / Quintal (Average for this calendar month over 2016-2025)
  overall10YrAverage: number;
  dataPeriod: string; // "2016–2025"
  totalHistoricalYears: number; // 10

  // Seasonal & RAG Context
  ragContext: RagRetrievedContext;

  // Chart Points
  allHistoricalMonthlyPoints: MonthlyChartDataPoint[];
  predictedPoint: MonthlyChartDataPoint;
  latestHistoricalPoint: MonthlyChartDataPoint;

  // Metadata
  methodology: string;
  isDemoData: boolean;
  disclaimer: string;
}

/**
 * RAG Retrieval Hook:
 * Simulates vector / structured retrieval prioritizing:
 * 1. Same crop
 * 2. Same market
 * 3. Same calendar month from previous years (2016–2025)
 * 4. Recent historical records (last 12 months)
 * 5. Seasonal price patterns
 */
export function ragRetrieveRelevantMonthlyRecords(
  crop: 'Onion' | 'Corn' | 'Grapes' | 'Pomegranate',
  market: string,
  targetMonth: number,
  targetYear: number,
  allRecords: CropMarketPriceRecord[] = NASHIK_HISTORICAL_MONTHLY_DATA
): RagRetrievedContext {
  const cropRecords = getMonthlyCropRecords(crop, market, allRecords);
  const cropConfig = NASHIK_CROPS_CONFIG.find((c) => c.id === crop)!;
  const monthMeta = MONTH_NAMES.find((m) => m.num === targetMonth) || MONTH_NAMES[9]; // default Oct

  // 1. Same calendar month across historical years (2016-2025)
  const sameMonthRecords = cropRecords.filter((r) => r.month === targetMonth);
  const sameMonthPrices = sameMonthRecords.map((r) => ({
    year: r.year,
    month: r.month,
    price: r.price,
    arrivalQuantityQuintals: r.arrivalQuantityQuintals,
  }));

  const sameMonthSum = sameMonthPrices.reduce((acc, curr) => acc + curr.price, 0);
  const sameMonthHistoricalAverage =
    sameMonthPrices.length > 0 ? Math.round(sameMonthSum / sameMonthPrices.length) : 2000;

  // 2. Overall 10-year average across all months
  const totalSum = cropRecords.reduce((acc, curr) => acc + curr.price, 0);
  const overallHistoricalAverage =
    cropRecords.length > 0 ? Math.round(totalSum / cropRecords.length) : 1800;

  // 3. Seasonal Multiplier
  const seasonalMultiplier =
    overallHistoricalAverage > 0
      ? Number((sameMonthHistoricalAverage / overallHistoricalAverage).toFixed(2))
      : 1.0;

  // 4. Recent historical records (last 12 records)
  const recentRecords = cropRecords.slice(-12).map((r) => {
    const m = MONTH_NAMES.find((nm) => nm.num === r.month);
    return {
      date: r.date,
      label: `${m?.en || 'M'} ${r.year}`,
      price: r.price,
    };
  });

  return {
    targetCrop: crop,
    targetMarket: market,
    targetMonth,
    targetYear,
    targetMonthName: monthMeta.fullEn,
    sameMonthHistoricalPrices: sameMonthPrices,
    sameMonthHistoricalAverage,
    overallHistoricalAverage,
    seasonalMultiplier,
    recentHistoricalPrices: recentRecords,
    seasonalPatternSummary: cropConfig.seasonalPatternNotes,
  };
}

/**
 * Seasonal Regression & Trend Calculation
 * Computes the future monthly price for a specific crop, market, and future month/year.
 */
export function getMonthlyCropMarketPrediction(
  cropId: 'Onion' | 'Corn' | 'Grapes' | 'Pomegranate',
  selectedMarket?: string,
  targetMonth: number = 10, // Default to October
  targetYear: number = 2026, // Default to 2026 as per user prompt example
  customRecords?: CropMarketPriceRecord[]
): MonthlyMarketPredictionResult {
  const cropConfig =
    NASHIK_CROPS_CONFIG.find((c) => c.id === cropId) || NASHIK_CROPS_CONFIG[0];
  const market = selectedMarket || cropConfig.defaultMarket;

  // Retrieve records
  const allRecords = getMonthlyCropRecords(cropId, market, customRecords);
  const ragContext = ragRetrieveRelevantMonthlyRecords(
    cropId,
    market,
    targetMonth,
    targetYear,
    allRecords
  );

  const monthMeta = MONTH_NAMES.find((m) => m.num === targetMonth) || MONTH_NAMES[9];

  // Convert historical records to chart data points
  const allHistoricalMonthlyPoints: MonthlyChartDataPoint[] = allRecords.map((r) => {
    const m = MONTH_NAMES.find((item) => item.num === r.month) || MONTH_NAMES[0];
    return {
      id: r.id,
      date: r.date,
      month: r.month,
      year: r.year,
      monthShort: m.en,
      monthFull: m.fullEn,
      label: `${m.en} ${r.year}`,
      price: r.price,
      isEstimate: false,
      market: r.market,
      source: r.source,
      arrivalQuantityQuintals: r.arrivalQuantityQuintals,
    };
  });

  const latestHistorical =
    allHistoricalMonthlyPoints[allHistoricalMonthlyPoints.length - 1] || {
      id: 'fallback_latest',
      date: '2025-12-01',
      month: 12,
      year: 2025,
      monthShort: 'Dec',
      monthFull: 'December',
      label: 'Dec 2025',
      price: 2400,
      isEstimate: false,
      market,
      source: 'APMC Demo Archive',
      arrivalQuantityQuintals: 18000,
    };

  // --- STATISTICAL / SEASONAL PREDICTION ENGINE ---
  // Fit least-squares regression specifically across the same calendar month over historical years (2016-2025)
  const sameMonthPoints = ragContext.sameMonthHistoricalPrices;
  const n = sameMonthPoints.length;

  let estimatedUpcomingPrice = ragContext.sameMonthHistoricalAverage;

  if (n >= 2) {
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    sameMonthPoints.forEach((p) => {
      const x = p.year;
      const y = p.price;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
    const intercept = (sumY - slope * sumX) / n;

    // Regressed price for targetYear & targetMonth
    const regressedPrice = slope * targetYear + intercept;

    // Dampen extremes and incorporate recent momentum
    const lastSameMonth = sameMonthPoints[sameMonthPoints.length - 1];
    const yearsDiff = targetYear - (lastSameMonth?.year || 2025);
    const momentumAdjusted = (lastSameMonth?.price || regressedPrice) * Math.pow(1.045, Math.max(0, yearsDiff));

    const blended = 0.70 * regressedPrice + 0.30 * momentumAdjusted;
    estimatedUpcomingPrice = Math.round(Math.max(400, blended) / 10) * 10;
  }

  // Find same month in latest historical year (2025) for direct comparison
  const latestSameMonthRecord = sameMonthPoints.find((p) => p.year === 2025) || sameMonthPoints[sameMonthPoints.length - 1];
  const comparisonBasePrice = latestSameMonthRecord?.price || latestHistorical.price;

  const priceDiff = estimatedUpcomingPrice - comparisonBasePrice;
  const trendPercentage = Math.round((priceDiff / comparisonBasePrice) * 100);

  let expectedPriceTrend: TrendDirection = '→ Stable';
  let trendCategory: TrendCategory = 'Stable';

  if (trendPercentage >= 3) {
    expectedPriceTrend = '↑ Increasing';
    trendCategory = 'Increasing';
  } else if (trendPercentage <= -3) {
    expectedPriceTrend = '↓ Decreasing';
    trendCategory = 'Decreasing';
  } else {
    expectedPriceTrend = '→ Stable';
    trendCategory = 'Stable';
  }

  const targetDateStr = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-01`;
  const predictedPoint: MonthlyChartDataPoint = {
    id: `pred_${cropId.toLowerCase()}_${targetYear}_m${targetMonth}`,
    date: targetDateStr,
    month: targetMonth,
    year: targetYear,
    monthShort: monthMeta.en,
    monthFull: monthMeta.fullEn,
    label: `${monthMeta.en} ${targetYear}`,
    price: estimatedUpcomingPrice,
    isEstimate: true,
    market,
    source: 'ARTH AI Seasonal Regression Model (Estimate)',
    arrivalQuantityQuintals: undefined,
  };

  return {
    crop: cropId,
    cropDisplayName: cropConfig.name,
    cropIcon: cropConfig.icon,
    market,
    availableMarkets: cropConfig.availableMarkets,
    unit: cropConfig.unit,
    targetMonth,
    targetYear,
    targetMonthName: {
      en: monthMeta.en,
      fullEn: monthMeta.fullEn,
      hi: monthMeta.hi,
      mr: monthMeta.mr,
    },
    targetLabel: `${monthMeta.fullEn} ${targetYear}`,
    estimatedUpcomingPrice,
    expectedPriceTrend,
    trendCategory,
    trendPercentage,
    historicalAverage: ragContext.sameMonthHistoricalAverage,
    overall10YrAverage: ragContext.overallHistoricalAverage,
    dataPeriod: '2016–2025',
    totalHistoricalYears: 10,
    ragContext,
    allHistoricalMonthlyPoints,
    predictedPoint,
    latestHistoricalPoint: latestHistorical,
    methodology:
      'Seasonal month-specific least squares regression decomposed across 10-year APMC records with RAG seasonal factor prioritization.',
    isDemoData: true,
    disclaimer:
      'Estimated from historical market data and seasonal patterns. Actual market prices may vary.',
  };
}
