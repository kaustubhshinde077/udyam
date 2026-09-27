/**
 * Nashik Local Crop Market Price Historical Monthly Dataset (2016 – 2025)
 * 
 * RAG-Ready & ML-Ready Data Structure:
 * Supports multiple historical monthly records across 10 years (120 months)
 * for Nashik local APMC markets.
 * 
 * Clean replaceable data source formatted for:
 * 1. Vector Database / RAG retrieval by crop, market, and calendar month.
 * 2. Feature engineering for Time-Series / Regression Machine Learning models.
 * 
 * IMPORTANT: Clearly designated as DEMO / MOCK DATASET for UI prototyping.
 */

export interface CropMarketPriceRecord {
  id: string;
  crop: 'Onion' | 'Corn' | 'Grapes' | 'Pomegranate';
  market: string;
  date: string; // e.g. "2025-10-01"
  month: number; // 1 to 12
  year: number; // 2016 to 2025
  price: number; // Modal Price in ₹ / Quintal
  unit: string; // "₹/quintal"
  source: string;
  arrivalQuantityQuintals?: number;
}

export interface NashikCropConfig {
  id: 'Onion' | 'Corn' | 'Grapes' | 'Pomegranate';
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  icon: string;
  unit: string;
  defaultMarket: string;
  availableMarkets: string[];
  seasonalPeakMonths: {
    en: string;
    hi: string;
    mr: string;
  };
  seasonalPatternNotes: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const NASHIK_CROPS_CONFIG: NashikCropConfig[] = [
  {
    id: 'Onion',
    name: {
      en: 'Onion',
      hi: 'प्याज (कांदा)',
      mr: 'कांदा (Onion)',
    },
    icon: '🧅',
    unit: '₹/quintal',
    defaultMarket: 'Lasalgaon APMC (Nashik)',
    availableMarkets: [
      'Lasalgaon APMC (Nashik)',
      'Pimpalgaon Baswant APMC',
      'Nashik Main APMC',
      'Yeola APMC',
    ],
    seasonalPeakMonths: {
      en: 'September – November (Pre-Diwali Kharif gap)',
      hi: 'सितंबर – नवंबर (दिवाली पूर्व आवक कमी)',
      mr: 'सप्टेंबर – नोव्हेंबर (दिवाळी पूर्व टंचाई काळ)',
    },
    seasonalPatternNotes: {
      en: 'Seasonal low in Apr–May during peak Rabi harvest; sharp surge in Sep–Nov during storage depletion and festive demand.',
      hi: 'अप्रैल-मई में रबी आवक के समय भाव न्यूनतम रहते हैं; सितंबर-नवंबर में भंडारण समाप्ति व त्योहारी मांग से भाव उछलते हैं।',
      mr: 'एप्रिल-मे मध्ये रब्बी कांदा आवक वाढल्याने दर कमी; सप्टेंबर-नोव्हेंबरमध्ये साठवणूक संपल्याने व सणासुदीमुळे दरात मोठी वाढ.',
    },
  },
  {
    id: 'Corn',
    name: {
      en: 'Corn (Maize)',
      hi: 'मक्का (Corn)',
      mr: 'मका (Maize)',
    },
    icon: '🌽',
    unit: '₹/quintal',
    defaultMarket: 'Yeola APMC (Nashik)',
    availableMarkets: [
      'Yeola APMC (Nashik)',
      'Malegaon APMC',
      'Nashik Main APMC',
      'Satana APMC',
    ],
    seasonalPeakMonths: {
      en: 'May – August (Pre-Monsoon Feed Sourcing)',
      hi: 'मई – अगस्त (मानसून पूर्व पोल्ट्री मांग)',
      mr: 'मे – ऑगस्ट (पावसाळा पूर्व पोल्ट्री व स्टार्च मागणी)',
    },
    seasonalPatternNotes: {
      en: 'Seasonal softening in Oct–Jan following Kharif arrivals; steady escalation in May–Aug driven by poultry and starch processor restocking.',
      hi: 'खरीफ मक्का आवक के चलते अक्टूबर-जनवरी में दरें नरम रहती हैं; मई-अगस्त में औद्योगिक मांग के कारण दरें बढ़ती हैं।',
      mr: 'खरीप मका काढणीनंतर ऑक्टोबर-जानेवारीमध्ये दर नरम; मे-ऑगस्टमध्ये पोल्ट्री व प्रक्रिया उद्योगांच्या खरेदीमुळे दरवाढ.',
    },
  },
  {
    id: 'Grapes',
    name: {
      en: 'Grapes',
      hi: 'अंगूर (द्राक्ष)',
      mr: 'द्राक्षे (Grapes)',
    },
    icon: '🍇',
    unit: '₹/quintal',
    defaultMarket: 'Pimpalgaon Baswant APMC',
    availableMarkets: [
      'Pimpalgaon Baswant APMC',
      'Dindori APMC',
      'Nashik Main APMC',
      'Niphad APMC',
    ],
    seasonalPeakMonths: {
      en: 'January – April (Peak Export & Fresh Harvest)',
      hi: 'जनवरी – अप्रैल (शीर्ष निर्यात व ताजा कटाई)',
      mr: 'जानेवारी – एप्रिल (मुख्य निर्यात व हंगामी काढणी)',
    },
    seasonalPatternNotes: {
      en: 'Premium export trade commands high value Jan–Apr; off-season vine pruning in monsoon drops mandi arrivals with residual raisin trade.',
      hi: 'जनवरी-अप्रैल में यूरोपीय निर्यात गुणवत्ता के कारण सर्वोच्च मूल्य; मानसून में छंटाई के दौरान आवक सीमित रहती है।',
      mr: 'जानेवारी-एप्रिल दरम्यान युरोपियन निर्यातीमुळे उच्चांकी दर; पावसाळ्यात छाटणीच्या काळात मर्यादित आवक व बेदाणा व्यापार.',
    },
  },
  {
    id: 'Pomegranate',
    name: {
      en: 'Pomegranate',
      hi: 'अनार (डाळिंब)',
      mr: 'डाळिंब (Pomegranate)',
    },
    icon: '🍎',
    unit: '₹/quintal',
    defaultMarket: 'Deola APMC (Nashik)',
    availableMarkets: [
      'Deola APMC (Nashik)',
      'Kalwan APMC',
      'Satana APMC',
      'Nashik Main APMC',
    ],
    seasonalPeakMonths: {
      en: 'September – November & February – March (Bahar Cycles)',
      hi: 'सितंबर – नवंबर एवं फरवरी – मार्च (बहार चक्र)',
      mr: 'सप्टेंबर – नोव्हेंबर व फेब्रुवारी – मार्च (बहार हंगाम)',
    },
    seasonalPatternNotes: {
      en: 'Dual harvest peaks (Mrig & Hasth bahar) drive domestic and Middle-East export procurement at Deola and Kalwan mandis.',
      hi: 'मृग व हस्त बहार के कारण सितंबर-नवंबर व फरवरी में आवक और खाड़ी देशों को निर्यात मांग चरम पर रहती है।',
      mr: 'मृग व हस्त बहार हंगामात स्थानिक व आखाती देशांतील निर्यातीमुळे देवळा व कळवण बाजारात दर्जेदार फळांना चढा दर.',
    },
  },
];

export const MONTH_NAMES = [
  { num: 1, en: 'Jan', fullEn: 'January', hi: 'जनवरी', mr: 'जानेवारी' },
  { num: 2, en: 'Feb', fullEn: 'February', hi: 'फरवरी', mr: 'फेब्रुवारी' },
  { num: 3, en: 'Mar', fullEn: 'March', hi: 'मार्च', mr: 'मार्च' },
  { num: 4, en: 'Apr', fullEn: 'April', hi: 'अप्रैल', mr: 'एप्रिल' },
  { num: 5, en: 'May', fullEn: 'May', hi: 'मई', mr: 'मे' },
  { num: 6, en: 'Jun', fullEn: 'June', hi: 'जून', mr: 'जून' },
  { num: 7, en: 'Jul', fullEn: 'July', hi: 'जुलाई', mr: 'जुलै' },
  { num: 8, en: 'Aug', fullEn: 'August', hi: 'अगस्त', mr: 'ऑगस्ट' },
  { num: 9, en: 'Sep', fullEn: 'September', hi: 'सितंबर', mr: 'सप्टेंबर' },
  { num: 10, en: 'Oct', fullEn: 'October', hi: 'अक्टूबर', mr: 'ऑक्टोबर' },
  { num: 11, en: 'Nov', fullEn: 'November', hi: 'नवंबर', mr: 'नोव्हेंबर' },
  { num: 12, en: 'Dec', fullEn: 'December', hi: 'दिसंबर', mr: 'डिसेंबर' },
];

/**
 * Seasonal Multipliers & Base Trajectories for Nashik Local Crops
 * Used to populate the 10-year monthly historical dataset (2016-2025)
 */
interface CropSeasonalityProfile {
  basePrice2016: number;
  annualGrowthRate: number;
  // Multiplier for each month 1..12
  monthFactors: number[];
  baseArrivals: number;
}

const CROP_PROFILES: Record<string, CropSeasonalityProfile> = {
  Onion: {
    basePrice2016: 1200,
    annualGrowthRate: 0.082,
    // Jan to Dec seasonal factors for Nashik APMC
    // Rabi harvest bottom in Apr-May (0.75-0.70), Kharif spike in Sep-Nov (1.45-1.75)
    monthFactors: [1.05, 0.85, 0.78, 0.72, 0.76, 0.92, 1.08, 1.25, 1.52, 1.76, 1.62, 1.20],
    baseArrivals: 24000,
  },
  Corn: {
    basePrice2016: 1350,
    annualGrowthRate: 0.068,
    // Jan to Dec: soft in Nov-Jan post-kharif (0.88-0.92), firm in May-Aug (1.12-1.18)
    monthFactors: [0.92, 0.94, 0.98, 1.04, 1.12, 1.16, 1.18, 1.14, 1.02, 0.94, 0.88, 0.90],
    baseArrivals: 18000,
  },
  Grapes: {
    basePrice2016: 4200,
    annualGrowthRate: 0.054,
    // Jan to Dec: peak harvest Jan-Apr (1.18-1.28), off season May-Sep (0.80-0.90), early Dec (1.05)
    monthFactors: [1.22, 1.28, 1.24, 1.14, 0.88, 0.82, 0.78, 0.80, 0.85, 0.95, 1.05, 1.15],
    baseArrivals: 14000,
  },
  Pomegranate: {
    basePrice2016: 5200,
    annualGrowthRate: 0.062,
    // Mrig Bahar (Sep-Nov: 1.15-1.22), Hasth Bahar (Jan-Mar: 1.18-1.25), Ambe Bahar (Jun-Aug: 0.85-0.92)
    monthFactors: [1.14, 1.22, 1.20, 1.05, 0.92, 0.86, 0.88, 0.94, 1.16, 1.24, 1.18, 1.08],
    baseArrivals: 11000,
  },
};

// Market specific price adjustments (slight differential between Mandis)
const MARKET_FACTORS: Record<string, number> = {
  'Lasalgaon APMC (Nashik)': 1.0,
  'Pimpalgaon Baswant APMC': 1.03,
  'Nashik Main APMC': 1.05,
  'Yeola APMC': 0.98,
  'Malegaon APMC': 0.97,
  'Satana APMC': 0.99,
  'Dindori APMC': 1.02,
  'Niphad APMC': 1.01,
  'Deola APMC (Nashik)': 1.0,
  'Kalwan APMC': 0.99,
};

// Known historical weather / supply disturbance multipliers by year (e.g. 2019 unseasonal rains, 2023 dry spell)
const YEAR_DISTURBANCE_FACTORS: Record<number, number> = {
  2016: 0.98,
  2017: 0.96,
  2018: 1.02,
  2019: 1.28, // Heavy unseasonal rains in Maharashtra
  2020: 1.06, // Post-lockdown supply chain disruption
  2021: 1.04,
  2022: 0.98,
  2023: 1.18, // El Niño dry spells
  2024: 1.12,
  2025: 1.08,
};

/**
 * Deterministically build the complete 10-year monthly historical records (2016 to 2025 = 120 months)
 * across all crops and local markets.
 */
function buildNashikHistoricalMonthlyDataset(): CropMarketPriceRecord[] {
  const records: CropMarketPriceRecord[] = [];
  const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const crops: Array<'Onion' | 'Corn' | 'Grapes' | 'Pomegranate'> = [
    'Onion',
    'Corn',
    'Grapes',
    'Pomegranate',
  ];

  crops.forEach((crop) => {
    const config = NASHIK_CROPS_CONFIG.find((c) => c.id === crop)!;
    const profile = CROP_PROFILES[crop];

    config.availableMarkets.forEach((market) => {
      const marketMultiplier = MARKET_FACTORS[market] || 1.0;

      years.forEach((year, yIdx) => {
        const yearGrowth = Math.pow(1 + profile.annualGrowthRate, yIdx);
        const yearDisturbance = YEAR_DISTURBANCE_FACTORS[year] || 1.0;

        for (let month = 1; month <= 12; month++) {
          const monthFactor = profile.monthFactors[month - 1];
          // Deterministic minor monthly micro-variation using year and month hash
          const microVariation = 1.0 + ((((year * 13 + month * 19) % 23) - 11) / 450);

          const rawPrice =
            profile.basePrice2016 *
            yearGrowth *
            monthFactor *
            yearDisturbance *
            marketMultiplier *
            microVariation;

          // Round to nearest 10 for realistic mandi quote
          const price = Math.round(rawPrice / 10) * 10;

          // Inverse arrivals correlation with price
          const arrivalVariance = (2.0 - monthFactor) * (0.9 + ((year + month) % 5) * 0.05);
          const arrivalQty = Math.round((profile.baseArrivals * arrivalVariance) / 100) * 100;

          const monthStr = month.toString().padStart(2, '0');
          const dateStr = `${year}-${monthStr}-01`;
          const id = `${crop.toLowerCase()}_${year}_m${monthStr}_${market.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;

          records.push({
            id,
            crop,
            market,
            date: dateStr,
            month,
            year,
            price,
            unit: '₹/quintal',
            source: 'Nashik APMC Historical Market Archive (Demo Data)',
            arrivalQuantityQuintals: arrivalQty,
          });
        }
      });
    });
  });

  return records;
}

/**
 * 10-Year Historical Nashik Monthly Crop Market Price Dataset (2016 – 2025)
 * Conforms to:
 * {
 *   crop: "Onion",
 *   market: "Lasalgaon APMC (Nashik)",
 *   date: "2025-10-01",
 *   month: 10,
 *   year: 2025,
 *   price: 4250,
 *   unit: "₹/quintal",
 *   source: "Nashik APMC Historical Market Archive (Demo Data)"
 * }
 */
export const NASHIK_HISTORICAL_MONTHLY_DATA: CropMarketPriceRecord[] =
  buildNashikHistoricalMonthlyDataset();

/**
 * Retrieve monthly historical records filtered by crop and optional market
 */
export function getMonthlyCropRecords(
  crop: 'Onion' | 'Corn' | 'Grapes' | 'Pomegranate',
  market?: string,
  records: CropMarketPriceRecord[] = NASHIK_HISTORICAL_MONTHLY_DATA
): CropMarketPriceRecord[] {
  let filtered = records.filter((r) => r.crop === crop);
  if (market) {
    const marketFiltered = filtered.filter((r) => r.market === market);
    if (marketFiltered.length > 0) {
      filtered = marketFiltered;
    }
  }
  return filtered.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
}
