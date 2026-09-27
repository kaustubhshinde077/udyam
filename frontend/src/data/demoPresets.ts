import { BasicInfoData, BusinessSetupData, Phase2CostData } from '../types';

export type DemoPresetKey = 'dairy' | 'onion' | 'poultry' | 'textile';

export interface DemoPreset {
  id: DemoPresetKey;
  name: string;
  badge: string;
  tagline: string;
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  phase2Cost: Phase2CostData;
  marketEvidenceScore: number;
  financialHealthScore: number;
  evidenceTier: 'Tier 0' | 'Tier 1' | 'Tier 2';
}

export const DEMO_PRESETS: Record<DemoPresetKey, DemoPreset> = {
  dairy: {
    id: 'dairy',
    name: 'Dairy Unit (Pune, MH)',
    badge: 'DEFAULT SIH DEMO',
    tagline: '100 Litres/Day Village Collection & Processing Unit',
    marketEvidenceScore: 72,
    financialHealthScore: 81,
    evidenceTier: 'Tier 1',
    basicInfo: {
      name: 'Ramesh Pawar',
      dob: '1990-05-15',
      gender: 'Male',
      category: 'OBC',
      mobile: '9822012345',
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Baramati',
      pincode: '413102',
      areaType: 'Rural',
      currentOccupation: 'Farmer / Agricultural Laborer',
      workedInBusinessBefore: 'Yes',
      experienceYears: 3,
      reportLanguage: 'English',
      specialAssistance: 'No',
    },
    businessSetup: {
      entityType: 'business',
      businessCategory: 'Dairy Business',
      subActivity: 'Milk + Milk Products',
      workLocation: 'Own Land / Farm',
      alreadyHave: ['Land / Space', 'Water', 'Electricity'],
      needToStart: ['Tools / Equipment', 'Livestock', 'Vehicle'],
      sellLocation: ['My Village / Local Area', 'Nearby Villages', 'Local Shops'],
      rawMaterialEase: 'Yes, nearby',
      similarBusinessesNearby: '1–2',
      ownStartingMoney: 100000,
      needFinancialSupport: 'Yes',
      financialSupportAmount: 900000,
      hasInformalLoan: 'No',
    },
    phase2Cost: {
      costItems: [
        {
          category: 'Equipment / Tools',
          description: 'Automated milking machine, fat tester & chilling cans',
          amount: 300000,
          selected: true,
        },
        {
          category: 'Stock / Inventory',
          description: 'Initial cattle feed, mineral mixture & silage stock',
          amount: 100000,
          selected: true,
        },
        {
          category: 'Working Capital',
          description: 'Operating liquidity reserve & veterinary care fund',
          amount: 200000,
          selected: true,
        },
        {
          category: 'Other Setup / Animals',
          description: 'Cattle shed renovation, concrete flooring & 3 crossbred cows',
          amount: 400000,
          selected: true,
        },
      ],
      expectedPricePerUnit: 60, // ₹60/litre
      expectedCustomersOrUnitsPerMonth: 2600, // 100 litres/day * 26 days = 2,600 litres => ₹1,56,000 revenue
      rawMaterialCostPerMonth: 80000, // Monthly variable costs (green/dry fodder, cattle feed)
      otherMonthlyExpenses: 30000, // Monthly fixed costs (shed maintenance, power, labor, vet care)
    },
  },

  onion: {
    id: 'onion',
    name: 'Onion Farmer (Nashik, MH)',
    badge: 'FARMER MODE DEMO',
    tagline: '2-Acre Rabi Onion Production & APMC Mandi Economics',
    marketEvidenceScore: 74,
    financialHealthScore: 79,
    evidenceTier: 'Tier 1',
    basicInfo: {
      name: 'Sanjay Shinde',
      dob: '1987-09-12',
      gender: 'Male',
      category: 'General',
      mobile: '9823055678',
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Lasalgaon',
      pincode: '422306',
      areaType: 'Rural',
      currentOccupation: 'Farmer / Cultivator',
      workedInBusinessBefore: 'Yes',
      experienceYears: 6,
      reportLanguage: 'English',
      specialAssistance: 'No',
    },
    businessSetup: {
      entityType: 'farmer',
      businessCategory: 'Other',
      subActivity: 'Onion Cultivation (2 Acres)',
      workLocation: 'Own Land / Farm',
      alreadyHave: ['Land / Space', 'Water', 'Electricity'],
      needToStart: ['Tools / Equipment', 'Raw Material', 'Workers'],
      sellLocation: ['Mandi / APMC', 'Nearby Town', 'Local Traders'],
      rawMaterialEase: 'Yes, nearby',
      similarBusinessesNearby: '3–5',
      ownStartingMoney: 50000,
      needFinancialSupport: 'Yes',
      financialSupportAmount: 105000,
      hasInformalLoan: 'No',
      farmerData: {
        cropName: 'Onion (लाल कांदा)',
        landAreaAcres: 2,
        yieldPerAcreQuintals: 100, // 10,000 kg/acre = 100 quintals/acre => 20,000 kg total
        seedCost: 20000,
        fertilizerCost: 15000,
        pesticideCost: 10000,
        labourCost: 30000,
        irrigationCost: 10000,
        machineryCost: 5000,
        transportCost: 10000,
        otherCultivationCost: 5000,
        marketPricePerQuintal: 2500, // ₹25/kg => ₹2,500/quintal
      },
    },
    phase2Cost: {
      costItems: [
        {
          category: 'Seeds & Fertilizer',
          description: 'Certified seeds, basals & bio-fertilizer package',
          amount: 35000,
          selected: true,
        },
        {
          category: 'Labour & Sowing',
          description: 'Nursery transplanting, weeding and field bed preparation',
          amount: 30000,
          selected: true,
        },
        {
          category: 'Irrigation & Plant Protection',
          description: 'Drip upkeep, scheduled spraying & fungicides',
          amount: 20000,
          selected: true,
        },
        {
          category: 'Harvest & Transport',
          description: 'Curing, sorting, gunny bags & mandi transport',
          amount: 20000,
          selected: true,
        },
      ],
      expectedPricePerUnit: 25, // ₹25/kg
      expectedCustomersOrUnitsPerMonth: 20000, // 20,000 kg total yield season
      rawMaterialCostPerMonth: 45000,
      otherMonthlyExpenses: 60000,
    },
  },

  poultry: {
    id: 'poultry',
    name: 'Broiler Poultry (Sangli, MH)',
    badge: 'LIVESTOCK DEMO',
    tagline: '1,000 Bird Commercial Broiler Cycle with Contract Integration',
    marketEvidenceScore: 76,
    financialHealthScore: 82,
    evidenceTier: 'Tier 2',
    basicInfo: {
      name: 'Anand Kadam',
      dob: '1992-03-24',
      gender: 'Male',
      category: 'General',
      mobile: '9822554433',
      state: 'Maharashtra',
      district: 'Sangli',
      village: 'Walwa',
      pincode: '416313',
      areaType: 'Rural',
      currentOccupation: 'Farmer / Livestock Rearer',
      workedInBusinessBefore: 'Yes',
      experienceYears: 4,
      reportLanguage: 'English',
      specialAssistance: 'No',
    },
    businessSetup: {
      entityType: 'business',
      businessCategory: 'Poultry',
      subActivity: 'Broiler Chicken Farm',
      workLocation: 'Own Land / Farm',
      alreadyHave: ['Land / Space', 'Water', 'Electricity'],
      needToStart: ['Tools / Equipment', 'Livestock', 'Raw Material'],
      sellLocation: ['Local Shops', 'Nearby Town', 'Contract Integrator'],
      rawMaterialEase: 'Yes, nearby',
      similarBusinessesNearby: '1–2',
      ownStartingMoney: 80000,
      needFinancialSupport: 'Yes',
      financialSupportAmount: 420000,
      hasInformalLoan: 'No',
    },
    phase2Cost: {
      costItems: [
        {
          category: 'Shop / Place',
          description: 'Semi-open shed with curtain ventilation (1200 sq ft)',
          amount: 220000,
          selected: true,
        },
        {
          category: 'Equipment / Tools',
          description: 'Automatic bell drinkers, feeder pans, brooding lamps',
          amount: 80000,
          selected: true,
        },
        {
          category: 'Livestock',
          description: 'Day-old chicks (DOC) batch initial fund',
          amount: 60000,
          selected: true,
        },
        {
          category: 'Raw Material',
          description: 'Broiler pre-starter & starter mash feed stock',
          amount: 100000,
          selected: true,
        },
        {
          category: 'Other',
          description: 'Biosecurity sprayers, vaccines & wood shavings',
          amount: 40000,
          selected: true,
        },
      ],
      expectedPricePerUnit: 110, // ₹110/kg live bird
      expectedCustomersOrUnitsPerMonth: 1800, // 1800 kg per batch month => ₹1,98,000 revenue
      rawMaterialCostPerMonth: 115000, // feed + chicks
      otherMonthlyExpenses: 35000, // electricity + labor + medicine
    },
  },

  textile: {
    id: 'textile',
    name: 'Garment Unit (Kolhapur, MH)',
    badge: 'MSME CLUSTER DEMO',
    tagline: 'Semi-Industrial School Uniform & Readymade Apparel Unit',
    marketEvidenceScore: 78,
    financialHealthScore: 84,
    evidenceTier: 'Tier 2',
    basicInfo: {
      name: 'Pooja Patil',
      dob: '1995-11-20',
      gender: 'Female',
      category: 'OBC',
      mobile: '9821098765',
      state: 'Maharashtra',
      district: 'Kolhapur',
      village: 'Ichalkaranji',
      pincode: '416115',
      areaType: 'Semi-Urban',
      currentOccupation: 'Artisan / Craftsman',
      workedInBusinessBefore: 'Yes',
      experienceYears: 5,
      reportLanguage: 'English',
      specialAssistance: 'No',
    },
    businessSetup: {
      entityType: 'business',
      businessCategory: 'Tailoring / Garments / Textile',
      subActivity: 'Garment Making',
      workLocation: 'Rented Shop',
      alreadyHave: ['Tools / Equipment', 'Electricity'],
      needToStart: ['Tools / Equipment', 'Stock', 'Raw Material'],
      sellLocation: ['Local Shops', 'Nearby Town', 'Direct to Customers'],
      rawMaterialEase: 'Yes, nearby',
      similarBusinessesNearby: '3–5',
      ownStartingMoney: 150000,
      needFinancialSupport: 'Yes',
      financialSupportAmount: 450000,
      hasInformalLoan: 'No',
    },
    phase2Cost: {
      costItems: [
        {
          category: 'Shop / Place',
          description: 'Shop rental advance and cutting tables',
          amount: 100000,
          selected: true,
        },
        {
          category: 'Equipment / Tools',
          description: '3 High-speed direct-drive sewing & overlock machines',
          amount: 250000,
          selected: true,
        },
        {
          category: 'Raw Material',
          description: 'Bulk fabric rolls, threads, interlining & buttons',
          amount: 180000,
          selected: true,
        },
        {
          category: 'Other',
          description: 'Steam iron setup, signage and electrical points',
          amount: 70000,
          selected: true,
        },
      ],
      expectedPricePerUnit: 450,
      expectedCustomersOrUnitsPerMonth: 350,
      rawMaterialCostPerMonth: 68000,
      otherMonthlyExpenses: 28000,
    },
  },
};
