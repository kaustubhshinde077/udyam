import { BusinessCategory, HyperLocalAnalysis, SchemeMatch, SurveyQuestionItem } from '../types';

export const BUSINESS_ACTIVITIES: Record<BusinessCategory, string[]> = {
  'Dairy Business': [
    'Milk',
    'Curd',
    'Paneer',
    'Ghee',
    'Other Milk Products',
    'Milk + Milk Products',
  ],
  Poultry: [
    'Broiler Chicken',
    'Eggs',
    'Country Chicken',
    'Chicken + Eggs',
    'Poultry Chicks',
    'Other',
  ],
  'Goat / Sheep Farming': [
    'Goat Rearing',
    'Sheep Rearing',
    'Goat Milk',
    'Meat Production',
    'Breeding',
    'Goat / Sheep + Breeding',
  ],
  'Grocery / General Store': [
    'Grocery & Food Items',
    'Household Items',
    'Personal Care Items',
    'Snacks & Beverages',
    'General Store',
    'Grocery + Household Items',
  ],
  'Food / Tiffin': [
    'Tiffin',
    'Home Food',
    'Snacks',
    'Breakfast',
    'Meals',
    'Tea / Snacks',
    'Bakery Items',
    'Catering',
    'Other Food',
  ],
  'Tailoring / Garments / Textile': [
    'Tailoring',
    'Clothes Stitching',
    'Alteration',
    'School Uniforms',
    "Women's Clothing",
    "Men's Clothing",
    "Kids' Clothing",
    'Embroidery',
    'Garment Making',
    'Textile / Cloth Selling',
  ],
  'Beauty / Salon': [
    'Hair Cutting',
    'Hair & Beauty',
    'Beauty Parlour',
    'Makeup',
    'Mehendi',
    "Men's Salon",
    "Women's Salon",
    'Beauty Products',
  ],
  'Repair Service': [
    'Mobile Repair',
    'Electrical Repair',
    'Electronics Repair',
    'Two-Wheeler Repair',
    'Bicycle Repair',
    'Home Appliance Repair',
    'Plumbing',
    'Welding',
    'Other Repair',
  ],
  'Mobile / Electronics': [
    'Mobile Phones',
    'Mobile Accessories',
    'Electronics',
    'Chargers / Cables',
    'Computer Accessories',
    'Mobile + Accessories',
    'Electronics + Repair',
  ],
  'Transport / Delivery': [
    'Goods Transport',
    'Local Delivery',
    'Passenger Transport',
    'Auto / E-Rickshaw',
    'Two-Wheeler Delivery',
    'Small Vehicle Transport',
    'Other Transport',
  ],
  Other: [
    'Manufacturing',
    'Trading',
    'Service',
    'Farming-related Work',
    'Artisan Work',
    'Other',
  ],
};

import { ALL_INDIAN_STATES_AND_DISTRICTS } from './statesAndDistricts';
export const STATES_AND_DISTRICTS: Record<string, string[]> = ALL_INDIAN_STATES_AND_DISTRICTS;

export const WORK_LOCATION_OPTIONS = [
  'Home',
  'Own Shop',
  'Rented Shop',
  'Own Land / Farm',
  'Market / Stall',
  'Other',
] as const;

export const ASSET_ITEMS = [
  'Capital / Cash Savings',
  'Land / Space',
  'Shop',
  'Tools / Equipment',
  'Vehicle',
  'Livestock',
  'Storage',
  'Electricity',
  'Water',
  'Nothing',
];

export const NEED_ITEMS = [
  'Capital / Starting Loan',
  'Land / Space',
  'Shop',
  'Tools / Equipment',
  'Vehicle',
  'Livestock',
  'Raw Material',
  'Stock',
  'Storage',
  'Workers',
  'Other',
];

export const SELL_LOCATION_OPTIONS = [
  'My Village / Local Area',
  'Nearby Villages',
  'Nearby Town',
  'Local Shops',
  'Weekly Market',
  'Direct to Customers',
] as const;

export const RAW_MATERIAL_EASE_OPTIONS = [
  'Yes, nearby',
  'Yes, from nearby town',
  'Difficult to get',
  "Don't know",
] as const;

export const SIMILAR_BUSINESS_OPTIONS = [
  'None',
  '1–2',
  '3–5',
  'More than 5',
  "Don't know",
] as const;

export const OCCUPATION_OPTIONS = [
  'Farmer / Agricultural Laborer',
  'Daily Wage Worker',
  'Homemaker',
  'Shop Assistant / Helper',
  'Artisan / Craftsman',
  'Self Employed / Tiny Tradesman',
  'Unemployed / First-time Seeker',
  'Student / Youth',
  'Other',
];

export function getLocalAnalysis(
  category: BusinessCategory,
  subActivity: string,
  district: string,
  village: string
): HyperLocalAnalysis {
  const loc = `${village || 'Gram Panchayat'}, ${district || 'District'}`;
  const today = 'August 2026';

  switch (category) {
    case 'Dairy Business':
      return {
        marketReach: {
          value: '3 nearby villages + daily local collection center',
          status: 'Community Provided',
          source: 'Local haat survey & cooperative collection observation (Demo)',
          date: today,
          location: loc,
        },
        customerArea: {
          value: '450–600 households within 4 km radius',
          status: 'Estimated',
          source: 'Local village habitations estimate (Demo)',
          date: today,
          location: loc,
        },
        marketExplanation:
          'Daily liquid milk and fresh curd enjoy steady household demand, especially during morning hours and weekly haat days.',
        nearbyBusinessesCount: {
          value: '2 small dairy farmers (household level)',
          status: 'Community Provided',
          source: 'Neighborhood observation (Demo)',
          date: today,
          location: loc,
        },
        nearbyBusinessesExplanation:
          'Current supply does not meet local wedding and festival demand; villagers often purchase packaged milk from the highway town.',
        supplierAvailability: {
          value: 'Fodder and cattle feed available nearby',
          status: 'Estimated',
          source: 'Local agri-input & feed dealer survey (Demo)',
          date: today,
          location: loc,
        },
        supplierDistance: {
          value: 'Feed center is within 3 km; veterinary dispensary 2 km',
          status: 'Estimated',
          source: 'Local distance inquiry (Demo)',
          date: today,
          location: loc,
        },
        priceRange: {
          value: '₹52 - ₹64 per litre for fresh cow/buffalo milk',
          status: 'Community Provided',
          source: 'Cooperative collection rate card & village price observation (Demo)',
          date: today,
          location: loc,
        },
        demandSignal: 'Positive',
        demandExplanation:
          'Strong household consumption and assured procurement at local primary dairy cooperative center.',
        localOpportunity:
          'Supplying fresh curd and paneer to nearby tea stalls and sweet makers yields higher margins than plain raw milk.',
        localRisks: {
          competition: 'Low to moderate; cooperative purchases all surplus milk.',
          supply: 'Dry fodder prices spike in peak summer months (April–June).',
          seasonal: 'Milk yield drops 15–20% during summer heat.',
          other: 'Animal health emergencies require prompt veterinary access.',
        },
        swot: {
          strengths: ['Immediate daily cash flow', 'Perishable staple consumed daily', 'Low marketing needed'],
          challenges: ['Requires daily early morning discipline', 'Cattle disease risk', 'Summer fodder storage'],
          opportunities: ['Value-added curd/ghee sales at weekly bazaar', 'Local subsidy or cooperative support on mini chilling equipment'],
          risks: ['Sudden veterinary costs', 'Dry spell impacting green fodder'],
        },
      };

    case 'Poultry':
      return {
        marketReach: {
          value: 'Local weekly market and 8 roadside food stalls',
          status: 'Community Provided',
          source: 'Weekly rural haat observation (Demo)',
          date: today,
          location: loc,
        },
        customerArea: {
          value: 'Village and 2 adjoining hamlets (approx 2,800 residents)',
          status: 'Estimated',
          source: 'Local habitation estimate (Demo)',
          date: today,
          location: loc,
        },
        marketExplanation:
          'Country chicken (desi) and fresh farm eggs sell at a 25% premium compared to town commercial broilers.',
        nearbyBusinessesCount: {
          value: '1 small commercial shed (1,000 birds)',
          status: 'Community Provided',
          source: 'Local field observation (Demo)',
          date: today,
          location: loc,
        },
        nearbyBusinessesExplanation:
          'Existing supplier focuses on frozen delivery to town; fresh farm gate retail is underserved.',
        supplierAvailability: {
          value: 'Day-old chicks and vaccine delivery available weekly',
          status: 'Estimated',
          source: 'Taluka hatchery logistics survey (Demo)',
          date: today,
          location: loc,
        },
        supplierDistance: {
          value: '14 km from sub-divisional town feed dealer',
          status: 'Estimated',
          source: 'Road distance estimate (Demo)',
          date: today,
          location: loc,
        },
        priceRange: {
          value: '₹140 - ₹180 per kg live bird; ₹7 - ₹9 per fresh egg',
          status: 'Community Provided',
          source: 'Weekly haat price observation (Demo)',
          date: today,
          location: loc,
        },
        demandSignal: 'Positive',
        demandExplanation:
          'Sunday and festive demand regularly outstrips village supply.',
        localOpportunity:
          'Raising indigenous Kadaknath or Desi birds requires lower commercial feed and commands premium village price.',
        localRisks: {
          competition: 'Medium; depends on town wholesale influx.',
          supply: 'Poultry feed price volatility.',
          seasonal: 'High temperature mortality risk during May-June.',
          other: 'Bird flu rumors during monsoon can temporarily reduce sales.',
        },
        swot: {
          strengths: ['Fast 40–50 day cash cycle', 'High protein demand in growing families'],
          challenges: ['High temperature management in sheds', 'Strict cleanliness required'],
          opportunities: ['Direct egg subscriptions with local schools / anganwadis'],
          risks: ['Disease outbreak risk without timely vaccination'],
        },
      };

    case 'Grocery / General Store':
      return {
        marketReach: {
          value: 'Main village crossroads and agricultural field workers',
          status: 'Community Provided',
          source: 'Crossroads footfall survey (Demo)',
          date: today,
          location: loc,
        },
        customerArea: {
          value: '350 homes within 10 minutes walking distance',
          status: 'Estimated',
          source: 'Village street layout estimate (Demo)',
          date: today,
          location: loc,
        },
        marketExplanation:
          'Small daily packs (₹5, ₹10, ₹20 sachets of oil, spices, soaps, biscuits) make up 70% of transactions.',
        nearbyBusinessesCount: {
          value: '2 existing kirana shops on the bus stand road',
          status: 'Community Provided',
          source: 'Ground inspection (Demo)',
          date: today,
          location: loc,
        },
        nearbyBusinessesExplanation:
          'Existing shops do not stock fresh snacks or mobile recharge/stationery items.',
        supplierAvailability: {
          value: 'Wholesale delivery van visits village every Tuesday & Friday',
          status: 'Estimated',
          source: 'Taluka distributor route schedule (Demo)',
          date: today,
          location: loc,
        },
        supplierDistance: {
          value: 'Town mandi wholesale is 11 km away',
          status: 'Estimated',
          source: 'Local transport route survey (Demo)',
          date: today,
          location: loc,
        },
        priceRange: {
          value: 'Standard MRP with 10% to 18% wholesale trade margin',
          status: 'Community Provided',
          source: 'Local shopkeepers trade survey (Demo)',
          date: today,
          location: loc,
        },
        demandSignal: 'Positive',
        demandExplanation:
          'Daily essentials are needed round the year irrespective of seasonal agriculture fluctuations.',
        localOpportunity:
          'Adding basic stationary, photocopy, mobile accessories, or farm tool spares creates a one-stop village store.',
        localRisks: {
          competition: 'High if opened directly adjacent to existing established shops.',
          supply: 'Low risk; regular distributor delivery trucks.',
          seasonal: 'Farmer credit requests peak during crop sowing season before harvest.',
          other: 'Uncontrolled informal credit (udhari) can lock up working capital.',
        },
        swot: {
          strengths: ['Year-round essential demand', 'Cash sales on small packs'],
          challenges: ['Managing customer requests for credit (udhari)', 'Inventory space'],
          opportunities: ['Partnering with dairy collection or village center'],
          risks: ['Slow inventory turnover if wrong products are purchased'],
        },
      };

    default:
      return {
        marketReach: {
          value: 'Village center and adjoining weekly haat market',
          status: 'Estimated',
          source: 'Rural market area survey (Demo)',
          date: today,
          location: loc,
        },
        customerArea: {
          value: 'Local village population (approx 2,200 residents)',
          status: 'Estimated',
          source: 'Habitation census estimate (Demo)',
          date: today,
          location: loc,
        },
        marketExplanation:
          'High demand for locally available services to avoid travel expenses to distant sub-divisional towns.',
        nearbyBusinessesCount: {
          value: '1 similar operator within 5 km',
          status: 'Community Provided',
          source: 'Ground inspection (Demo)',
          date: today,
          location: loc,
        },
        nearbyBusinessesExplanation:
          'Residents currently spend ₹40–60 on bus travel to town for these needs.',
        supplierAvailability: {
          value: 'Materials available in taluka headquarters town',
          status: 'Estimated',
          source: 'Taluka trade inquiry (Demo)',
          date: today,
          location: loc,
        },
        supplierDistance: {
          value: '8–15 km with regular bus and tempo transport',
          status: 'Estimated',
          source: 'Rural bus route guide (Demo)',
          date: today,
          location: loc,
        },
        priceRange: {
          value: 'Competitive village rates (15% below town center charges)',
          status: 'Estimated',
          source: 'Field consumer price survey (Demo)',
          date: today,
          location: loc,
        },
        demandSignal: 'Positive',
        demandExplanation:
          'Convenience of local service saves customers travel time and money.',
        localOpportunity:
          'Offering doorstep or weekend service creates strong local customer loyalty.',
        localRisks: {
          competition: 'Low locally, moderate from weekly town visits.',
          supply: 'Dependent on town transport for spare parts / supplies.',
          seasonal: 'Festival season surges; rainy season slower for outdoor transport.',
          other: 'Need to build personal trust with village elders and families.',
        },
        swot: {
          strengths: ['Saves villagers trip to distant town', 'Flexible working hours'],
          challenges: ['Initial machinery/equipment investment', 'Skill learning curve'],
          opportunities: ['Referrals through self-help groups (SHGs) and panchayat events'],
          risks: ['Power cuts if electrical tools are needed (solar backup recommended)'],
        },
      };
  }
}

export const DEFAULT_SURVEY_QUESTIONS: SurveyQuestionItem[] = [
  {
    id: 1,
    questionText: 'Do you currently buy this product or service regularly?',
    options: ['Yes, every week', 'Yes, once or twice a month', 'Only during festivals/special times', 'Rarely or Never'],
  },
  {
    id: 2,
    questionText: 'Where do you currently go to buy or get this service?',
    options: ['Nearby town/city (far)', 'Local village shop', 'Weekly market / Haat', 'Door-to-door vendor'],
  },
  {
    id: 3,
    questionText: 'If a reliable local person opened this in our village, would you buy from them?',
    options: ['Definitely Yes', 'Likely Yes, if quality is good', 'Only if price is cheaper', 'No'],
  },
  {
    id: 4,
    questionText: 'What is most important to you for this business?',
    options: ['Fair price', 'Fresh / high quality', 'Available at convenient time', 'Friendly trusted service'],
  },
  {
    id: 5,
    questionText: 'How much do you typically spend on this per month?',
    options: ['Under ₹300', '₹300 – ₹800', '₹800 – ₹2,000', 'More than ₹2,000'],
  },
  {
    id: 6,
    questionText: 'Would you recommend this new village business to your relatives and neighbors?',
    options: ['Yes, happily', 'Maybe later', 'Not sure'],
  },
];

export function getSchemeMatch(
  category: BusinessCategory,
  projectCost: number,
  userContribution: number
): SchemeMatch {
  const loanAmt = Math.max(0, projectCost - userContribution);
  const isMicro = projectCost <= 140000;

  if (isMicro) {
    return {
      schemeName: 'PS 26091 Prototype: Micro Finance Scheme',
      ministry: 'Priority Sector Rural Micro-Enterprise Lending Framework',
      projectCost,
      userContribution,
      potentialLoan: Math.min(loanAmt, 125000),
      fundingStructureSummary:
        'Up to 90% Institutional Funding (Max ₹1.25 Lakh) + Minimum 10% Promoter Contribution. 6.5% p.a. interest, 3-year tenure, 3-month setup moratorium.',
      eligibilityHighlights: [
        'Potentially suitable for micro-enterprises, village shops, artisans, and small scale units.',
        'Targeted for project costs up to ₹1.40 Lakh with maximum loan support up to ₹1.25 Lakh.',
        'Concessional interest rate of 6.5% per annum for priority rural tiny trades.',
        '3 months initial repayment moratorium during initial setup phase.',
      ],
      disclaimer:
        'Potentially suitable match based on PS 26091 prototype parameters. Final sanction, rate subvention, and disbursement depend on lending institution appraisal and official applicable rules.',
    };
  }

  return {
    schemeName: 'PS 26091 Prototype: Term Loan for Commercial & Expansion Units',
    ministry: 'Priority Sector Commercial Enterprise & Agro-Allied Credit Framework',
    projectCost,
    userContribution,
    potentialLoan: Math.min(loanAmt, 4500000),
    fundingStructureSummary:
      'Up to 90% Institutional Funding (Max ₹45 Lakh) + Minimum 10% Promoter Equity. 8.0% p.a. interest, 7-year tenure, 6-month setup moratorium.',
    eligibilityHighlights: [
      'Potentially suitable for commercial units, small enterprises, dairy & agro-allied ventures.',
      'Designed for project costs from ₹1.40 Lakh up to ₹50.00 Lakh (Maximum loan up to ₹45 Lakh).',
      'Structured interest rate of 8.0% per annum with extended 7-year (84 months) repayment tenure.',
      '6 months initial repayment moratorium (plantation / construction activities may receive specific moratorium treatment per official guidelines).',
    ],
    disclaimer:
      'Potentially suitable match based on PS 26091 prototype parameters. Final sanction, rate subvention, and disbursement depend on lending institution appraisal and official applicable rules.',
  };
}
