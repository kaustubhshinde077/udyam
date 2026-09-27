import { ExistingLoanDetails } from '../types';

export interface CropBenchmark {
  id: string;
  name: string;
  marathiHindiLabel: string;
  season: 'Kharif' | 'Rabi' | 'Zaid / Summer' | 'Annual';
  typicalCostPerAcre: number;
  typicalYieldPerAcreQuintals: number;
  typicalPricePerQuintal: number;
  typicalIrrigation: 'Irrigated (Canal/Borewell/Well)' | 'Drip / Sprinkler' | 'Rainfed (Dependent on Monsoon)' | 'Partially Irrigated';
  costBreakdown: {
    seeds: number;
    fertilizers: number;
    pesticides: number;
    labour: number;
    irrigation: number;
    machinery: number;
    transport: number;
    other: number;
  };
  harvestCycleMonths: number;
  marketChannel: string;
}

export const CROP_BENCHMARKS: Record<string, CropBenchmark> = {
  'Rabi Onion': {
    id: 'Rabi Onion',
    name: 'Rabi Onion',
    marathiHindiLabel: 'कांदा / प्याज',
    season: 'Rabi',
    typicalCostPerAcre: 55000,
    typicalYieldPerAcreQuintals: 90,
    typicalPricePerQuintal: 2200,
    typicalIrrigation: 'Drip / Sprinkler',
    costBreakdown: {
      seeds: 14000,
      fertilizers: 11000,
      pesticides: 8000,
      labour: 14000,
      irrigation: 4000,
      machinery: 3000,
      transport: 1000,
      other: 0,
    },
    harvestCycleMonths: 4,
    marketChannel: 'APMC Lasalgaon / Regional Mandi',
  },
  'Soybean': {
    id: 'Soybean',
    name: 'Soybean',
    marathiHindiLabel: 'सोयाबीन',
    season: 'Kharif',
    typicalCostPerAcre: 22000,
    typicalYieldPerAcreQuintals: 9,
    typicalPricePerQuintal: 4600,
    typicalIrrigation: 'Rainfed (Dependent on Monsoon)',
    costBreakdown: {
      seeds: 6000,
      fertilizers: 5000,
      pesticides: 3500,
      labour: 4500,
      irrigation: 1000,
      machinery: 1500,
      transport: 500,
      other: 0,
    },
    harvestCycleMonths: 3,
    marketChannel: 'Oilseed Processing Mandi / Direct Procurement',
  },
  'Turmeric': {
    id: 'Turmeric',
    name: 'Turmeric',
    marathiHindiLabel: 'हळद / हल्दी',
    season: 'Annual',
    typicalCostPerAcre: 75000,
    typicalYieldPerAcreQuintals: 24,
    typicalPricePerQuintal: 7800,
    typicalIrrigation: 'Drip / Sprinkler',
    costBreakdown: {
      seeds: 25000,
      fertilizers: 16000,
      pesticides: 8000,
      labour: 16000,
      irrigation: 5000,
      machinery: 3500,
      transport: 1500,
      other: 0,
    },
    harvestCycleMonths: 9,
    marketChannel: 'Sangli / Hingoli Spice APMC Terminal',
  },
  'Cotton': {
    id: 'Cotton',
    name: 'Cotton',
    marathiHindiLabel: 'कापूस / कपास',
    season: 'Kharif',
    typicalCostPerAcre: 32000,
    typicalYieldPerAcreQuintals: 10,
    typicalPricePerQuintal: 6800,
    typicalIrrigation: 'Partially Irrigated',
    costBreakdown: {
      seeds: 5500,
      fertilizers: 8000,
      pesticides: 7500,
      labour: 7000,
      irrigation: 2000,
      machinery: 1500,
      transport: 500,
      other: 0,
    },
    harvestCycleMonths: 5,
    marketChannel: 'CCI Ginning Center / APMC Cotton Market',
  },
  'Wheat': {
    id: 'Wheat',
    name: 'Wheat',
    marathiHindiLabel: 'गहू / गेहूं',
    season: 'Rabi',
    typicalCostPerAcre: 21000,
    typicalYieldPerAcreQuintals: 20,
    typicalPricePerQuintal: 2425,
    typicalIrrigation: 'Irrigated (Canal/Borewell/Well)',
    costBreakdown: {
      seeds: 4500,
      fertilizers: 6000,
      pesticides: 2500,
      labour: 4500,
      irrigation: 2000,
      machinery: 1000,
      transport: 500,
      other: 0,
    },
    harvestCycleMonths: 4,
    marketChannel: 'Food Corporation / Local APMC Grain Market',
  },
  'Sugarcane': {
    id: 'Sugarcane',
    name: 'Sugarcane',
    marathiHindiLabel: 'ऊस / गन्ना',
    season: 'Annual',
    typicalCostPerAcre: 68000,
    typicalYieldPerAcreQuintals: 420, // 42 tonnes/acre
    typicalPricePerQuintal: 330, // ₹3,300/tonne FRP reference
    typicalIrrigation: 'Irrigated (Canal/Borewell/Well)',
    costBreakdown: {
      seeds: 18000,
      fertilizers: 18000,
      pesticides: 6000,
      labour: 16000,
      irrigation: 6000,
      machinery: 3000,
      transport: 1000,
      other: 0,
    },
    harvestCycleMonths: 12,
    marketChannel: 'Cooperative / Private Sugar Mill Factory',
  },
  'Gram / Chana': {
    id: 'Gram / Chana',
    name: 'Gram / Chana',
    marathiHindiLabel: 'हरभरा / चना',
    season: 'Rabi',
    typicalCostPerAcre: 18000,
    typicalYieldPerAcreQuintals: 8,
    typicalPricePerQuintal: 5400,
    typicalIrrigation: 'Partially Irrigated',
    costBreakdown: {
      seeds: 4000,
      fertilizers: 4500,
      pesticides: 3000,
      labour: 4000,
      irrigation: 1500,
      machinery: 800,
      transport: 200,
      other: 0,
    },
    harvestCycleMonths: 3,
    marketChannel: 'Pulses APMC Yard / NAFED Procurement',
  },
  'Paddy / Rice': {
    id: 'Paddy / Rice',
    name: 'Paddy / Rice',
    marathiHindiLabel: 'भात / धान',
    season: 'Kharif',
    typicalCostPerAcre: 26000,
    typicalYieldPerAcreQuintals: 22,
    typicalPricePerQuintal: 2300,
    typicalIrrigation: 'Irrigated (Canal/Borewell/Well)',
    costBreakdown: {
      seeds: 5000,
      fertilizers: 7000,
      pesticides: 3500,
      labour: 6500,
      irrigation: 2500,
      machinery: 1200,
      transport: 300,
      other: 0,
    },
    harvestCycleMonths: 4,
    marketChannel: 'Government MSP Procurement Center / Local Rice Mill',
  },
};

export interface FarmerSchemeItem {
  id: string;
  schemeName: string;
  category: 'Crop Loan / Working Capital' | 'Interest Subvention' | 'Crop Insurance' | 'Infrastructure' | 'Direct Support';
  authority: string;
  whatItHelpsWith: string;
  whoItIsFor: string;
  potentialSupport: string;
  keyDocuments: string[];
  eligibilityConditions: string[];
  applicationAction: string;
  disclaimer: string;
}

export const VERIFIED_FARMER_SCHEMES: FarmerSchemeItem[] = [
  {
    id: 'kcc_crop_loan',
    schemeName: 'Kisan Credit Card (KCC) Crop Loan',
    category: 'Crop Loan / Working Capital',
    authority: 'Ministry of Agriculture & RBI / NABARD Framework',
    whatItHelpsWith:
      'Provides revolving credit to meet seasonal crop cultivation expenses, seed/fertilizer purchases, post-harvest costs, and farm maintenance.',
    whoItIsFor:
      'Individual owner-cultivators, tenant farmers, oral lessees, sharecroppers, and Self Help Groups (SHGs) of farmers.',
    potentialSupport:
      'Credit limit determined by District Level Technical Committee (DLTC) scale of finance multiplied by cultivated acreage, plus 10% for post-harvest / household consumption and 20% for farm asset repairs.',
    keyDocuments: [
      'Land revenue record: 7/12 extract (सातबारा) and 8-A khatedar certificate (or tenancy agreement for leased land)',
      'Crop sowing declaration / e-Pik Pahani entry',
      'Identity Proof: Aadhaar Card & PAN / Voter ID',
      'Bank savings account passbook linked with Aadhaar',
      'Passport size photographs',
      'No-Dues or declaration if required by lending branch',
    ],
    eligibilityConditions: [
      'Must be actively cultivating agricultural land (owned or documented lease).',
      'Land must be situated within the operational territory of the financing bank branch or Primary Agricultural Credit Society (PACS).',
      'Repayment is synchronized with crop harvest schedule (single bullet repayment or post-harvest cycle) rather than monthly commercial EMIs.',
    ],
    applicationAction:
      'Submit the simplified one-page KCC application form at your local Gramin Bank, District Central Cooperative Bank (DCCB), or Public Sector Bank branch.',
    disclaimer:
      'Scale of finance, credit limit, and disbursement are strictly determined by the lending institution after verification of land records and field appraisal.',
  },
  {
    id: 'modified_interest_subvention',
    schemeName: 'Modified Interest Subvention Scheme (MISS)',
    category: 'Interest Subvention',
    authority: 'Department of Agriculture & Farmers Welfare, Govt of India',
    whatItHelpsWith:
      'Reduces the effective cost of short-term crop loans up to ₹3,00,000 to an affordable concessional interest rate of 4% per annum for prompt repayers.',
    whoItIsFor:
      'Farmers availing short-term crop loans through Kisan Credit Card (KCC) up to ₹3.00 Lakh.',
    potentialSupport:
      'Benchmark interest rate is 7% per annum (with 1.5% subvention to banks). Farmers who repay their crop loan within the specified due date (normally 1 year) receive an additional 3% Prompt Repayment Incentive (PRI), bringing the effective interest down to 4% p.a.',
    keyDocuments: [
      'KCC Loan Account statement showing timely repayment',
      'Aadhaar number linked with loan account (mandatory for subvention credit)',
      'Proof of crop cultivation during the sanctioned season',
    ],
    eligibilityConditions: [
      'Applies exclusively to short-term production credit up to ₹3 Lakh per farmer.',
      'Repayment must be completed on or before the due date specified by the bank (usually aligned to post-harvest).',
    ],
    applicationAction:
      'Interest subvention is credited directly through your lending bank; no separate application is needed if KCC repayment is completed on time.',
    disclaimer:
      'Interest subvention rates are notified by the Central Government periodically and apply strictly upon prompt repayment before the bank-stipulated due date.',
  },
  {
    id: 'pmfby_crop_insurance',
    schemeName: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Crop Insurance',
    authority: 'Ministry of Agriculture & Farmers Welfare / State Agri Dept',
    whatItHelpsWith:
      'Comprehensive insurance protection against yield loss caused by non-preventable natural perils: drought, dry spells, flood, pest & disease outbreak, landslide, and unseasonal post-harvest rains.',
    whoItIsFor:
      'All farmers cultivating notified crops in notified insurance units (Gram Panchayat or Taluka). Both loanee and non-loanee farmers are eligible.',
    potentialSupport:
      'Actuarial risk premium is heavily subsidized: Farmers pay only 2% of sum insured for Kharif food/oilseed crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops. Balance premium is borne equally by Central & State governments.',
    keyDocuments: [
      '7/12 Land Revenue record / Record of Rights (RoR)',
      'Crop Sowing Certificate issued by Talathi / Gram Sevak or self-declaration through e-Pik Pahani',
      'Bank passbook copy with clear IFSC and Account number',
      'Aadhaar Card',
    ],
    eligibilityConditions: [
      'Crop and area must be notified by State Government for that season.',
      'Application must be submitted before the seasonal cut-off date (e.g., July 31 for Kharif; December 15 for Rabi).',
    ],
    applicationAction:
      'Enroll through your bank branch, Common Service Center (CSC), or directly on National Crop Insurance Portal (ncip.gov.in). Loanee farmers can opt-in/opt-out through their lending branch.',
    disclaimer:
      'Sum insured, threshold yield, loss assessment, and claim disbursement depend strictly on State Crop Cutting Experiments (CCEs) and designated insurance company guidelines.',
  },
  {
    id: 'agri_infra_fund',
    schemeName: 'Agriculture Infrastructure Fund (AIF)',
    category: 'Infrastructure',
    authority: 'Department of Agriculture & Farmers Welfare / NABARD',
    whatItHelpsWith:
      'Medium-to-long term debt financing for creating post-harvest management infrastructure such as on-farm storage, sorting/grading units, drying yards, solar pumps, and primary processing.',
    whoItIsFor:
      'Individual farmers, Farmer Producer Organizations (FPOs), Primary Agricultural Credit Societies (PACS), and rural Agri-entrepreneurs.',
    potentialSupport:
      '3% interest subvention per annum on loans up to ₹2 Crore for a maximum tenure of 7 years, along with credit guarantee coverage under CGTMSE.',
    keyDocuments: [
      'Simple Detailed Project Report (DPR) of proposed farm equipment/storage',
      'Land possession documents / title deeds',
      'Bank KYC documentation (Aadhaar, PAN)',
      'Estimated quotation from authorized equipment manufacturers',
    ],
    eligibilityConditions: [
      'Project must create post-harvest management or community farming asset.',
      'Financing must be availed through eligible participating lending institutions.',
    ],
    applicationAction:
      'Register your project proposal online on the AIF Portal (agriinfra.dac.gov.in) and select your preferred lending bank branch.',
    disclaimer:
      'Sanction of loan and disbursement of interest subvention are subject to bank technical-economic feasibility approval and Central AIF verification.',
  },
  {
    id: 'pm_kisan_samman',
    schemeName: 'PM-Kisan Samman Nidhi (Direct Input Support)',
    category: 'Direct Support',
    authority: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    whatItHelpsWith:
      'Direct income support to augment financial resources of farmer families for procuring agriculture and allied inputs as well as domestic needs.',
    whoItIsFor:
      'All landholding farmer families who have cultivable landholding in state land records.',
    potentialSupport:
      'Financial benefit of ₹6,000 per year transferred directly to bank accounts in three equal installments of ₹2,000 every four months.',
    keyDocuments: [
      'Aadhaar card linked with bank account (e-KYC completed)',
      'Landholding record (land record number / 7-12 extract)',
      'Bank account details with NPCI direct benefit transfer (DBT) enablement',
    ],
    eligibilityConditions: [
      'Name must be updated in State land records.',
      'Mandatory Aadhaar e-KYC must be verified on pmkisan.gov.in portal.',
      'Institutional landholders and income-tax paying households are excluded under scheme criteria.',
    ],
    applicationAction:
      'Check status or enroll online via the Farmers Corner on pmkisan.gov.in or visit the nearest CSC / Village Revenue Office.',
    disclaimer:
      'Verification and disbursement are administered directly by the State Revenue Department and Ministry of Agriculture via DBT.',
  },
];
