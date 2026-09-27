import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
  BarChart2,
  Database,
  ArrowUpRight,
  Info,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { Language } from '../../types';
import {
  NASHIK_CROPS_CONFIG,
  MONTH_NAMES,
  CropMarketPriceRecord,
} from '../../data/nashikCropMarketData';
import {
  getMonthlyCropMarketPrediction,
  MonthlyChartDataPoint,
} from '../../services/marketPricePredictorService';

interface Props {
  language: Language;
}

export const CropMarketPricePredictor: React.FC<Props> = ({ language }) => {
  // 1. Crop Selection (Onion, Corn, Grapes, Pomegranate)
  const [selectedCrop, setSelectedCrop] = useState<
    'Onion' | 'Corn' | 'Grapes' | 'Pomegranate'
  >('Onion');

  const currentCropConfig = useMemo(() => {
    return (
      NASHIK_CROPS_CONFIG.find((c) => c.id === selectedCrop) ||
      NASHIK_CROPS_CONFIG[0]
    );
  }, [selectedCrop]);

  // 2. Market Selection (Nashik local markets)
  const [selectedMarket, setSelectedMarket] = useState<string>(
    currentCropConfig.defaultMarket
  );

  const effectiveMarket = useMemo(() => {
    if (currentCropConfig.availableMarkets.includes(selectedMarket)) {
      return selectedMarket;
    }
    return currentCropConfig.defaultMarket;
  }, [currentCropConfig, selectedMarket]);

  // 3. Prediction Future Month & Year Selection (Defaults to October 2026 as per user brief)
  const [targetMonth, setTargetMonth] = useState<number>(10); // 10 = October
  const [targetYear, setTargetYear] = useState<number>(2026); // 2026

  // 4. Monthly Chart Timeframe Range (24 Months, 5 Years, 10 Years)
  const [chartTimeframe, setChartTimeframe] = useState<'24m' | '5yr' | '10yr'>('24m');

  // 5. Expandable RAG Context Inspector
  const [showRagContext, setShowRagContext] = useState<boolean>(false);

  // 6. Interactive Hover State for SVG Chart Tooltip
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyChartDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Run Isolated Seasonal Monthly Prediction Service
  const prediction = useMemo(() => {
    return getMonthlyCropMarketPrediction(
      selectedCrop,
      effectiveMarket,
      targetMonth,
      targetYear
    );
  }, [selectedCrop, effectiveMarket, targetMonth, targetYear]);

  // Filter historical points to display on chart based on selected timeframe
  const displayHistoricalPoints = useMemo(() => {
    const all = prediction.allHistoricalMonthlyPoints;
    if (chartTimeframe === '24m') {
      return all.slice(-24); // Last 24 months (e.g. Jan 2024 to Dec 2025)
    } else if (chartTimeframe === '5yr') {
      return all.slice(-60); // Last 5 years (60 months)
    }
    return all; // Full 10 years (120 months)
  }, [prediction.allHistoricalMonthlyPoints, chartTimeframe]);

  // Combined points for SVG rendering (historical slice + future predicted month)
  const combinedDisplayPoints = useMemo(() => {
    return [...displayHistoricalPoints, prediction.predictedPoint];
  }, [displayHistoricalPoints, prediction.predictedPoint]);

  // Text Localization dictionary
  const t = useMemo(() => {
    switch (language) {
      case 'hi':
        return {
          title: 'स्थानीय फसल मंडी मूल्य अनुमान',
          subtitle:
            'नासिक मंडी के ऐतिहासिक मासिक भाव देखें और आगामी महीनों के मौसमी रुझान का सटीक अनुमान लगाएं।',
          selectCrop: 'फसल चुनें:',
          selectMarket: 'नासिक स्थानीय मंडी:',
          predictionMonth: 'अनुमान माह व वर्ष:',
          chartTimeframe: 'चार्ट विस्तार:',
          span24m: 'पिछले 24 माह',
          span5yr: '5 वर्ष',
          span10yr: '10 वर्ष',
          estimatedPriceTitle: `अनुमानित ${prediction.targetMonthName.hi} ${prediction.targetYear} भाव`,
          expectedPriceTrend: 'अनुमानित मूल्य रुझान',
          historicalAverage: 'ऐतिहासिक औसत भाव',
          historicalDataUsed: 'ऐतिहासिक डेटा अवधि',
          historicalMonthlyData: 'ऐतिहासिक मासिक मंडी भाव',
          predictedMonthlyData: 'आगामी माह का अनुमान (Forecast)',
          disclaimer:
            'Estimated from historical market data and seasonal patterns. Actual market prices may vary.',
          disclaimerTitle: 'सूचना:',
          demoBadge: 'डेमो डेटासेट • RAG व ML रेडी',
          modalPrice: 'मॉडल भाव',
          market: 'मंडी',
          arrivals: 'मासिक आवक',
          quintal: 'क्विंटल',
          increasing: '↑ वृद्धि (Increasing)',
          stable: '→ स्थिर (Stable)',
          decreasing: '↓ गिरावट (Decreasing)',
          ragContextTitle: 'RAG मौसमी विश्लेषण व संदर्भ रिकॉर्ड्स',
          ragContextSubtitle:
            'सिस्टम ने पिछले 10 वर्षों के इसी कैलेंडर माह के ऐतिहासिक रिकॉर्ड और आवक के आधार पर विश्लेषण किया है।',
          sameMonthAvgLabel: `${prediction.targetMonthName.hi} का 10-वर्षीय औसत`,
          seasonalMultiplierLabel: 'मौसमी गुणक (Seasonal Index)',
          hideDetails: 'विवरण छुपाएं',
          viewDetails: 'RAG मौसमी विवरण देखें',
          quickPick: 'त्वरित माह चयन:',
        };
      case 'mr':
        return {
          title: 'स्थानिक पीक बाजार भाव अंदाज',
          subtitle:
            'नाशिक बाजार समितीचे ऐतिहासिक मासिक दर तपासा आणि आगामी महिन्यांचे हंगामी मूल्य कल जाणून घ्या.',
          selectCrop: 'पीक निवडा:',
          selectMarket: 'नाशिक स्थानिक बाजारपेठ:',
          predictionMonth: 'अंदाज महिना व वर्ष:',
          chartTimeframe: 'तक्ता कालावधी:',
          span24m: 'मागील २४ महिने',
          span5yr: '५ वर्षे',
          span10yr: '१० वर्षे',
          estimatedPriceTitle: `अपेक्षित ${prediction.targetMonthName.mr} ${prediction.targetYear} भाव`,
          expectedPriceTrend: 'अपेक्षित बाजार कल',
          historicalAverage: 'ऐतिहासिक सरासरी दर',
          historicalDataUsed: 'माहिती कालावधी',
          historicalMonthlyData: 'ऐतिहासिक मासिक बाजारभाव',
          predictedMonthlyData: 'आगामी महिन्याचा अंदाज (Forecast)',
          disclaimer:
            'Estimated from historical market data and seasonal patterns. Actual market prices may vary.',
          disclaimerTitle: 'सूचना:',
          demoBadge: 'डेमो डेटा • RAG व ML सुसंगत',
          modalPrice: 'सरासरी भाव',
          market: 'बाजार समिती',
          arrivals: 'मासिक आवक',
          quintal: 'क्विंटल',
          increasing: '↑ वाढ (Increasing)',
          stable: '→ स्थिर (Stable)',
          decreasing: '↓ घसरण (Decreasing)',
          ragContextTitle: 'RAG हंगामी विश्लेषण व संदर्भ नोंदी',
          ragContextSubtitle:
            'गेल्या १० वर्षांतील याच कॅलेंडर महिन्यातील नोंदी व हंगामावर आधारित विश्लेषण.',
          sameMonthAvgLabel: `${prediction.targetMonthName.mr} चा १० वर्षांची सरासरी`,
          seasonalMultiplierLabel: 'हंगामी घटक (Seasonal Index)',
          hideDetails: 'तपशील लपवा',
          viewDetails: 'RAG हंगामी तपशील पहा',
          quickPick: 'त्वरित महिना निवडा:',
        };
      default:
        return {
          title: 'Local Crop Market Price Predictor',
          subtitle:
            'Explore historical Nashik market prices and estimate upcoming price trends.',
          selectCrop: 'Select Crop:',
          selectMarket: 'Nashik Local Market:',
          predictionMonth: 'Prediction Month & Year:',
          chartTimeframe: 'Chart View:',
          span24m: 'Last 24 Months',
          span5yr: '5 Years',
          span10yr: '10 Years',
          estimatedPriceTitle: `Estimated ${prediction.targetMonthName.fullEn} ${prediction.targetYear} Price`,
          expectedPriceTrend: 'Expected Price Trend',
          historicalAverage: 'Historical Average',
          historicalDataUsed: 'Historical Data Used',
          historicalMonthlyData: 'Historical Monthly APMC Data',
          predictedMonthlyData: 'Estimated Future Month',
          disclaimer:
            'Estimated from historical market data and seasonal patterns. Actual market prices may vary.',
          disclaimerTitle: 'Notice:',
          demoBadge: 'Demo Dataset • RAG & ML Ready',
          modalPrice: 'Modal Price',
          market: 'Market',
          arrivals: 'Monthly Arrivals',
          quintal: 'Quintal',
          increasing: '↑ Increasing',
          stable: '→ Stable',
          decreasing: '↓ Decreasing',
          ragContextTitle: 'RAG Seasonal Retrieval & Historical Context',
          ragContextSubtitle:
            'RAG prioritizes same-crop, same-market, and same-calendar-month records from previous years to isolate seasonal factors.',
          sameMonthAvgLabel: `10-Yr ${prediction.targetMonthName.fullEn} Average`,
          seasonalMultiplierLabel: 'Seasonal Factor vs Annual Base',
          hideDetails: 'Hide RAG Context',
          viewDetails: 'Explore RAG Seasonal Records',
          quickPick: 'Quick Month Selection:',
        };
    }
  }, [language, prediction.targetMonthName, prediction.targetYear]);

  // Trend directional text display
  const trendDisplay = useMemo(() => {
    switch (prediction.trendCategory) {
      case 'Increasing':
        return {
          text: t.increasing,
          color: 'text-emerald-700 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800',
          icon: <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
        };
      case 'Decreasing':
        return {
          text: t.decreasing,
          color: 'text-rose-700 dark:text-rose-400',
          bg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800',
          icon: <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
        };
      default:
        return {
          text: t.stable,
          color: 'text-slate-700 dark:text-slate-300',
          bg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
          icon: <Minus className="w-4 h-4 text-slate-600 dark:text-slate-400" />,
        };
    }
  }, [prediction.trendCategory, t]);

  // Chart Dimensions & SVG Scaling
  const chartWidth = 780;
  const chartHeight = 270;
  const padding = { top: 32, right: 40, bottom: 48, left: 62 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Compute Min & Max for Y scale with 15% headroom
  const allPrices = combinedDisplayPoints.map((p) => p.price);
  const rawMin = Math.min(...allPrices);
  const rawMax = Math.max(...allPrices);
  const yMin = Math.max(0, Math.floor((rawMin * 0.85) / 200) * 200);
  const yMax = Math.ceil((rawMax * 1.15) / 200) * 200;
  const yRange = yMax - yMin || 1;

  // Helper coordinate functions
  const getX = (index: number) => {
    if (combinedDisplayPoints.length <= 1) return padding.left;
    return (
      padding.left +
      (index / (combinedDisplayPoints.length - 1)) * innerWidth
    );
  };

  const getY = (price: number) => {
    const normalized = (price - yMin) / yRange;
    return padding.top + innerHeight - normalized * innerHeight;
  };

  // Generate SVG path for Historical monthly points
  const historicalPath = useMemo(() => {
    if (displayHistoricalPoints.length === 0) return '';
    return displayHistoricalPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.price)}`)
      .join(' ');
  }, [displayHistoricalPoints, yMin, yRange]);

  // Generate SVG path connecting the last historical month to the predicted future month
  const predictedPath = useMemo(() => {
    if (combinedDisplayPoints.length < 2) return '';
    const lastHistIdx = combinedDisplayPoints.length - 2;
    const predIdx = combinedDisplayPoints.length - 1;
    const lastHist = combinedDisplayPoints[lastHistIdx];
    const pred = combinedDisplayPoints[predIdx];
    return `M ${getX(lastHistIdx)} ${getY(lastHist.price)} L ${getX(predIdx)} ${getY(
      pred.price
    )}`;
  }, [combinedDisplayPoints, yMin, yRange]);

  // Y-axis grid ticks (4 divisions)
  const yTicks = useMemo(() => {
    const ticks = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      ticks.push(Math.round(yMin + (yRange / steps) * i));
    }
    return ticks;
  }, [yMin, yRange]);

  // Label downsampling for X-axis labels to prevent clutter on mobile/tablet
  const shouldRenderXLabel = (index: number) => {
    const total = combinedDisplayPoints.length;
    // Always render the predicted point (last one)
    if (index === total - 1) return true;
    if (chartTimeframe === '24m') {
      // Show every 2nd or 3rd month
      return index % 2 === 0;
    } else if (chartTimeframe === '5yr') {
      // Show every 6th month (quarterly/biannual)
      return index % 6 === 0;
    }
    // 10yr: Show once a year
    return index % 12 === 0;
  };

  // Quick-pick Future Month Options
  const quickFutureMonths = [
    { label: 'Oct 2026 (Demo Default)', month: 10, year: 2026 },
    { label: 'Nov 2025', month: 11, year: 2025 },
    { label: 'Dec 2025', month: 12, year: 2025 },
    { label: 'Jan 2026', month: 1, year: 2026 },
    { label: 'Mar 2026', month: 3, year: 2026 },
    { label: 'May 2026', month: 5, year: 2026 },
    { label: 'Jul 2026', month: 7, year: 2026 },
    { label: 'Sep 2026', month: 9, year: 2026 },
    { label: 'Nov 2026', month: 11, year: 2026 },
    { label: 'Dec 2026', month: 12, year: 2026 },
  ];

  return (
    <div
      id="nashik-crop-market-predictor"
      className="mt-10 bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-all"
    >
      {/* 1. Section Header & Architecture Badges */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="space-y-1.5 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Nashik APMC Monthly Predictor</span>
            </span>

            {/* RAG-Ready Architecture Pill */}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-300 text-[11px] font-semibold"
              title="Modular RAG vector pipeline & ML time-series regression ready architecture"
            >
              <Database className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>{t.demoBadge}</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Chart View Timeframe Selector (24 Months, 5 Years, 10 Years) */}
        <div className="flex flex-col items-start md:items-end gap-1.5 self-start">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            {t.chartTimeframe}
          </span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setChartTimeframe('24m')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartTimeframe === '24m'
                  ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.span24m}
            </button>
            <button
              type="button"
              onClick={() => setChartTimeframe('5yr')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartTimeframe === '5yr'
                  ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.span5yr}
            </button>
            <button
              type="button"
              onClick={() => setChartTimeframe('10yr')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartTimeframe === '10yr'
                  ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.span10yr}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Controls: Crop, Market & Prediction Month */}
      <div className="mt-5 space-y-4">
        {/* Row A: Crop Selection Tabs (Onion, Corn, Grapes, Pomegranate) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0">
            {t.selectCrop}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {NASHIK_CROPS_CONFIG.map((c) => {
              const isSelected = selectedCrop === c.id;
              const cropName = c.name[language] || c.name.en;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCrop(c.id);
                    setSelectedMarket(c.defaultMarket);
                    setHoveredPoint(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  <span className="text-base shrink-0">{c.icon}</span>
                  <span className="truncate">{cropName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row B: Nashik Local Market Dropdown & Prediction Month Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Nashik Local Market Dropdown */}
          <div className="md:col-span-6 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider">
                {t.selectMarket}
              </label>
              <select
                aria-label={t.selectMarket}
                value={effectiveMarket}
                onChange={(e) => {
                  setSelectedMarket(e.target.value);
                  setHoveredPoint(null);
                }}
                className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer truncate"
              >
                {currentCropConfig.availableMarkets.map((m) => (
                  <option
                    key={m}
                    value={m}
                    className="bg-white dark:bg-[#0C192A] text-slate-900 dark:text-white"
                  >
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prediction Target Month & Year Selector */}
          <div className="md:col-span-6 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider">
                {t.predictionMonth}
              </label>
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                {/* Month Dropdown */}
                <select
                  aria-label="Target Prediction Month"
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                >
                  {MONTH_NAMES.map((m) => (
                    <option
                      key={m.num}
                      value={m.num}
                      className="bg-white dark:bg-[#0C192A] text-slate-900 dark:text-white"
                    >
                      {m.fullEn} ({m.hi})
                    </option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  aria-label="Target Prediction Year"
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                >
                  <option value={2025} className="bg-white dark:bg-[#0C192A] text-slate-900 dark:text-white">
                    2025
                  </option>
                  <option value={2026} className="bg-white dark:bg-[#0C192A] text-slate-900 dark:text-white">
                    2026 (Selected)
                  </option>
                  <option value={2027} className="bg-white dark:bg-[#0C192A] text-slate-900 dark:text-white">
                    2027
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Row C: Quick-pick Future Month Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-left pt-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
            {t.quickPick}
          </span>
          {quickFutureMonths.map((qm) => {
            const isCurrent = targetMonth === qm.month && targetYear === qm.year;
            return (
              <button
                key={`${qm.year}-${qm.month}`}
                type="button"
                onClick={() => {
                  setTargetMonth(qm.month);
                  setTargetYear(qm.year);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                }`}
              >
                {qm.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Prediction / Trend Metrics Panel (4 Required Metrics) */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Estimated Upcoming Price for the Selected Month */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-400/10 dark:via-slate-800/40 dark:to-slate-800/20 border border-amber-300/80 dark:border-amber-500/30 rounded-2xl p-4 text-left relative overflow-hidden">
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
            {prediction.targetMonthName.en} {prediction.targetYear}
          </div>
          <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {t.estimatedPriceTitle}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
              ₹{prediction.estimatedUpcomingPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              / Quintal
            </span>
          </div>
          <span className="mt-1 block text-[10px] text-amber-800 dark:text-amber-300 font-medium truncate">
            Seasonal Nashik APMC Projection
          </span>
        </div>

        {/* Metric 2: Expected Price Trend */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-left">
          <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
            {t.expectedPriceTrend}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${trendDisplay.bg}`}
            >
              {trendDisplay.icon}
            </div>
            <div>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white block leading-tight">
                {trendDisplay.text}
              </span>
              <span
                className={`text-[11px] font-bold ${
                  prediction.trendPercentage >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {prediction.trendPercentage >= 0 ? '+' : ''}
                {prediction.trendPercentage}% vs {prediction.targetMonthName.en} 2025
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Historical Average */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-left">
          <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
            {t.historicalAverage}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              ₹{prediction.historicalAverage.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              / Quintal
            </span>
          </div>
          <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400 truncate">
            {prediction.targetMonthName.en} Average (2016–2025)
          </span>
        </div>

        {/* Metric 4: Historical Data Used */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-left">
          <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
            {t.historicalDataUsed}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
              {prediction.dataPeriod}
            </span>
          </div>
          <span className="mt-1 block text-[10px] text-teal-700 dark:text-teal-400 font-semibold truncate">
            10-Year Monthly Records ({prediction.allHistoricalMonthlyPoints.length} Months)
          </span>
        </div>
      </div>

      {/* 4. Interactive SVG Monthly Line Chart */}
      <div className="mt-6 bg-slate-50/80 dark:bg-[#071324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 text-left relative">
        {/* Chart Header & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              {prediction.cropDisplayName[language] || prediction.cropDisplayName.en} — {effectiveMarket}
            </h4>
          </div>

          {/* Legend: Clear distinction between Historical Monthly and Predicted Monthly */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            {/* Historical Monthly Legend */}
            <div className="flex items-center gap-2">
              <span className="inline-block w-3.5 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 -ml-3" />
              <span className="text-slate-700 dark:text-slate-300">
                {t.historicalMonthlyData}
              </span>
            </div>

            {/* Predicted Month Legend */}
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-1 border-b-2 border-dashed border-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-300/80 -ml-3 animate-pulse" />
              <span className="text-amber-700 dark:text-amber-400 font-bold">
                {prediction.targetLabel} ({t.predictedMonthlyData})
              </span>
            </div>
          </div>
        </div>

        {/* Responsive SVG Monthly Chart */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[620px] select-none"
            aria-label="Monthly Crop Price Trend Line Chart"
          >
            <defs>
              {/* Historical Area Gradient */}
              <linearGradient id="monthlyHistoricalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
              </linearGradient>

              {/* Prediction Accent Glow */}
              <filter id="goldBeaconGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {yTicks.map((tickVal) => {
              const yPos = getY(tickVal);
              return (
                <g key={tickVal}>
                  <line
                    x1={padding.left}
                    y1={yPos}
                    x2={chartWidth - padding.right}
                    y2={yPos}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 10}
                    y={yPos + 4}
                    textAnchor="end"
                    className="text-[11px] font-medium fill-slate-500 dark:fill-slate-400"
                  >
                    ₹{tickVal.toLocaleString('en-IN')}
                  </text>
                </g>
              );
            })}

            {/* Area under historical monthly curve */}
            {displayHistoricalPoints.length > 1 && (
              <path
                d={`${historicalPath} L ${getX(
                  displayHistoricalPoints.length - 1
                )} ${padding.top + innerHeight} L ${getX(
                  0
                )} ${padding.top + innerHeight} Z`}
                fill="url(#monthlyHistoricalGradient)"
              />
            )}

            {/* Solid Historical Trend Line */}
            <path
              d={historicalPath}
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dashed Predicted Trend Line connecting last historical month to target predicted month */}
            <path
              d={predictedPath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />

            {/* Historical Average Guideline for the selected calendar month */}
            <line
              x1={padding.left}
              y1={getY(prediction.historicalAverage)}
              x2={chartWidth - padding.right}
              y2={getY(prediction.historicalAverage)}
              stroke="#64748B"
              strokeDasharray="2 3"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
            <text
              x={chartWidth - padding.right}
              y={getY(prediction.historicalAverage) - 4}
              textAnchor="end"
              className="text-[9px] font-bold fill-slate-400 select-none"
            >
              10-Yr {prediction.targetMonthName.en} Avg: ₹{prediction.historicalAverage}
            </text>

            {/* Monthly Data Point Nodes */}
            {combinedDisplayPoints.map((point, index) => {
              const cx = getX(index);
              const cy = getY(point.price);
              const isHovered = hoveredPoint?.id === point.id;

              if (point.isEstimate) {
                // Predicted Future Month Beacon Node
                return (
                  <g
                    key={point.id}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredPoint(point);
                      setTooltipPos({ x: cx, y: cy });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Pulsing Outer Halo */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 12 : 8}
                      fill="#F59E0B"
                      fillOpacity="0.3"
                      className="animate-ping"
                    />
                    {/* Ring Node */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 8 : 6}
                      fill="#F59E0B"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      filter="url(#goldBeaconGlow)"
                    />
                    {/* Value Badge above predicted node */}
                    <text
                      x={cx}
                      y={cy - 12}
                      textAnchor="middle"
                      className="text-[11px] font-extrabold fill-amber-700 dark:fill-amber-400 select-none"
                    >
                      ₹{point.price.toLocaleString('en-IN')}
                    </text>
                  </g>
                );
              }

              // Historical Monthly Point Node
              const isDense = combinedDisplayPoints.length > 40;
              const radius = isHovered ? 6 : isDense ? 2.5 : 3.5;

              return (
                <g
                  key={point.id}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredPoint(point);
                    setTooltipPos({ x: cx, y: cy });
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={isHovered ? '#047857' : '#10B981'}
                    stroke="#FFFFFF"
                    strokeWidth={isHovered ? '2' : '1'}
                    className="transition-all"
                  />
                  {/* Subtle price label on latest historical point */}
                  {index === displayHistoricalPoints.length - 1 && (
                    <text
                      x={cx}
                      y={cy - 8}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-slate-700 dark:fill-slate-300 select-none"
                    >
                      ₹{point.price}
                    </text>
                  )}
                </g>
              );
            })}

            {/* X-Axis Baseline */}
            <line
              x1={padding.left}
              y1={padding.top + innerHeight}
              x2={chartWidth - padding.right}
              y2={padding.top + innerHeight}
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-700"
              strokeWidth="1.5"
            />

            {/* X-Axis Monthly Labels */}
            {combinedDisplayPoints.map((point, index) => {
              if (!shouldRenderXLabel(index)) return null;
              const xPos = getX(index);
              const isPred = point.isEstimate;

              return (
                <text
                  key={point.id}
                  x={xPos}
                  y={padding.top + innerHeight + 18}
                  textAnchor="middle"
                  className={`text-[10px] select-none ${
                    isPred
                      ? 'font-black fill-amber-700 dark:fill-amber-400'
                      : 'font-semibold fill-slate-600 dark:fill-slate-400'
                  }`}
                >
                  {isPred ? `${point.label}*` : point.label}
                </text>
              );
            })}
          </svg>

          {/* Interactive Tooltip on Hover */}
          {hoveredPoint && tooltipPos && (
            <div
              className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
              style={{
                left: `${(tooltipPos.x / chartWidth) * 100}%`,
                top: `${(tooltipPos.y / chartHeight) * 100}%`,
              }}
            >
              <div className="bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl border border-slate-700 whitespace-nowrap min-w-[170px]">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1 mb-1">
                  <span className="font-extrabold text-amber-400">
                    {hoveredPoint.label}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      hoveredPoint.isEstimate
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {hoveredPoint.isEstimate ? 'Predicted Month' : 'APMC Monthly'}
                  </span>
                </div>
                <div className="space-y-0.5 text-[11px]">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-400">{t.modalPrice}:</span>
                    <strong className="text-white">
                      ₹{hoveredPoint.price.toLocaleString('en-IN')} / Quintal
                    </strong>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-400">{t.market}:</span>
                    <span className="text-slate-200 truncate max-w-[120px]">
                      {hoveredPoint.market}
                    </span>
                  </div>
                  {hoveredPoint.arrivalQuantityQuintals && (
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">{t.arrivals}:</span>
                      <span className="text-slate-200">
                        {hoveredPoint.arrivalQuantityQuintals.toLocaleString('en-IN')}{' '}
                        Qtl
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart Footnote Details */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-800/80 pt-2.5">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>
              * {prediction.targetLabel} estimate generated using 10-year same-calendar-month seasonal regression.
            </span>
          </div>
          <div className="font-medium text-slate-600 dark:text-slate-400">
            Source: Nashik APMC Historical Market Archive (Demo Data)
          </div>
        </div>
      </div>

      {/* 5. RAG Seasonal Pattern & Historical Retrieval Explorer (Collapsible) */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowRagContext(!showRagContext)}
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.ragContextTitle}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              {prediction.targetMonthName.fullEn} Records
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <span>{showRagContext ? t.hideDetails : t.viewDetails}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showRagContext ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {showRagContext && (
          <div className="mt-2 p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/80 text-left space-y-3 animate-fadeIn">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.ragContextSubtitle}
            </p>

            {/* Seasonal Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">
                  {t.sameMonthAvgLabel}
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  ₹{prediction.ragContext.sameMonthHistoricalAverage} / Qtl
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">
                  {t.seasonalMultiplierLabel}
                </span>
                <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
                  {prediction.ragContext.seasonalMultiplier}x vs Base
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">
                  10-Year Macro Base
                </span>
                <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                  ₹{prediction.ragContext.overallHistoricalAverage} / Qtl
                </span>
              </div>
            </div>

            {/* 10-Year Historical Records for Selected Month (Pills) */}
            <div className="pt-1">
              <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-2">
                10-Year Historical {prediction.targetMonthName.fullEn} Price Track (2016–2025):
              </span>
              <div className="flex flex-wrap gap-2">
                {prediction.ragContext.sameMonthHistoricalPrices.map((item) => (
                  <div
                    key={item.year}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <span className="text-[10px] text-slate-400 font-bold block">
                      {prediction.targetMonthName.en} {item.year}
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Pattern Description */}
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-300">
              <strong>Seasonal Dynamics ({selectedCrop}):</strong>{' '}
              {prediction.ragContext.seasonalPatternSummary[language] ||
                prediction.ragContext.seasonalPatternSummary.en}
            </div>
          </div>
        )}
      </div>

      {/* 6. Mandatory Disclaimer & Notice (As required by brief) */}
      <div className="mt-5 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-300/70 dark:border-amber-800/60 flex items-start gap-3 text-left">
        <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-amber-950 dark:text-amber-200 leading-relaxed">
            <strong className="font-black">{t.disclaimerTitle}</strong> {t.disclaimer}
          </p>
          <p className="text-[11px] text-amber-800/80 dark:text-amber-300/70 leading-relaxed">
            Current values utilize a standardized 10-year monthly demonstration dataset for Nashik local APMC mandis. This prediction service layer is isolated and ready for direct integration with live Agmarknet / APMC RAG retrieval pipelines and machine-learning time-series regression models.
          </p>
        </div>
      </div>
    </div>
  );
};
