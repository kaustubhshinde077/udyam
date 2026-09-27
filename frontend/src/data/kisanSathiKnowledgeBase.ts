/**
 * KISAN SATHI — Agricultural Knowledge Base
 * 
 * SOURCED STRICTLY FROM OFFICIAL & USER-PROVIDED KNOWLEDGE PACKS:
 * - ICAR-DOGR (Directorate of Onion and Garlic Research)
 * - ICAR-IIMR (Indian Institute of Maize Research)
 * - ICAR-NRC for Grapes
 * - ICAR-NRC on Pomegranate
 * - Indo-Israel Agricultural Project (IIAP) / Centres of Excellence (CoE)
 * - National Horticulture Board (NHB)
 * - Ministry of Agriculture & Farmers Welfare (Per Drop More Crop - PMKSY)
 * 
 * STRICT ZERO-HALLUCINATION POLICY:
 * - No fabricated chemical/pesticide dosage.
 * - Where data is not available, explicitly states:
 *   "Specific recommendation not available in the current knowledge base."
 */

export interface StageGuidance {
  id: string;
  stageName: string;
  stageNameLocal: { hi: string; mr: string };
  dayRange: [number, number]; // approximate days from sowing/pruning
  description: string;
  whatToDo: string[];
  whatToMonitor: string[];
  irrigationGuidance: string;
  israeliPrecisionPractice?: string;
  nutrientGuidance: string;
  potentialRisks: string[];
  warningSigns: string[];
  recommendedNextAction: string;
  sources: Array<{ title: string; url?: string }>;
}

export interface SeedVarietyInfo {
  name: string;
  suitableSeason: string;
  duration: string;
  keyCharacteristics: string;
  source: string;
}

export interface SeedSelectionData {
  title: { en: string; hi: string; mr: string };
  varieties: SeedVarietyInfo[];
  seedQualityChecklist: string[];
  seedTreatment: string;
  beforeYouBuy: string[];
  sources: Array<{ title: string; url?: string }>;
}

export interface ScientificPrinciple {
  topic: 'irrigation' | 'nutrient' | 'pest' | 'harvest';
  title: string;
  titleLocal: { hi: string; mr: string };
  why: string;
  whatToDo: string;
  when: string;
  whatToWatch: string;
}

export interface CropProfile {
  id: 'onion' | 'corn' | 'grapes' | 'pomegranate';
  name: { en: string; hi: string; mr: string };
  botanicalName: string;
  icon: string;
  image: string;
  durationDays: number;
  suitableSoil: string;
  seasons: string[];
  seedSelection: SeedSelectionData;
  scientificPrinciples: ScientificPrinciple[];
  stages: StageGuidance[];
  harvestAndMarket: {
    harvestIndicators: string[];
    curingAndDrying: string;
    gradingAndSorting: string;
    storageAdvice: string;
    sellingStrategy: string;
    sources: Array<{ title: string; url?: string }>;
  };
  israeliTechniques: Array<{
    title: string;
    details: string;
    source: string;
  }>;
}

export interface LearnLesson {
  id: string;
  icon: string;
  title: { en: string; hi: string; mr: string };
  summary: { en: string; hi: string; mr: string };
  keyPoints: string[];
  sourceBasis: string;
}

export interface PestDiagnosisItem {
  id: string;
  cropId: 'onion' | 'corn' | 'grapes' | 'pomegranate';
  symptomTitle: { en: string; hi: string; mr: string };
  possibleCauses: string[];
  whatToObserve: string[];
  safeNextSteps: string[];
  whenToContactExpert: string;
  sourceBasis: string;
}

export const KISAN_SATHI_CROPS: Record<string, CropProfile> = {
  onion: {
    id: 'onion',
    name: {
      en: 'Onion',
      hi: 'प्याज (कांदा)',
      mr: 'कांदा (Onion)',
    },
    botanicalName: 'Allium cepa',
    icon: '🧅',
    image: '/assets/images/crop_rabi_onion_1789896010271.jpg',
    durationDays: 135,
    suitableSoil: 'Deep, friable, well-drained soils with adequate organic matter (pH 6.0–7.5). Highly sensitive to waterlogging.',
    seasons: ['Rabi (Major)', 'Kharif', 'Late Kharif'],
    seedSelection: {
      title: {
        en: 'Step 1: Choose Your Onion Seed',
        hi: 'चरण 1: अपने प्याज का बीज चुनें',
        mr: 'पायरी १: कांद्याचे योग्य बियाणे निवडा',
      },
      varieties: [
        {
          name: 'Bhima Shakti',
          suitableSeason: 'Late Kharif & Rabi',
          duration: '125–135 days after transplanting',
          keyCharacteristics: 'Dark red, globe-shaped bulbs with firm tunic scales and superior storage capability (up to 4–5 months). High marketable yield.',
          source: 'ICAR-DOGR (Directorate of Onion and Garlic Research)',
        },
        {
          name: 'Bhima Super',
          suitableSeason: 'Kharif & Late Kharif',
          duration: '100–105 days after transplanting',
          keyCharacteristics: 'Early maturing, bright red bulbs suitable for kharif window to capture post-monsoon price spikes; moderate storage.',
          source: 'ICAR-DOGR',
        },
        {
          name: 'Pusa Riddhi',
          suitableSeason: 'Rabi Season',
          duration: '130–140 days',
          keyCharacteristics: 'High yield potential, uniform bulb shape, excellent ring firmness and resistance to premature bolting under temperature drops.',
          source: 'ICAR-IARI Research Advisory',
        },
      ],
      seedQualityChecklist: [
        'Certified breeder/foundation tag (Blue/White certified tag from authorised seed corporations).',
        'Physical purity minimum 98% with verified germination count >= 70%.',
        'Fresh lot seeds from current crop season (onion seeds older than 1 year lose germination percentage rapidly).',
        'Seed free from weed contamination, cracked coats, and fungal mold dust.',
      ],
      seedTreatment:
        'Biological seed treatment using Trichoderma viride or official university-recommended protective coating to prevent damping-off in nursery beds.',
      beforeYouBuy: [
        '✓ Check certified source & authorised dealer license',
        '✓ Check variety suitability for your target season (Kharif vs Rabi)',
        '✓ Check seed germination percentage and packaging date',
        '✓ Check whether your market prefers dark red or light red bulbs',
        '✓ Verify nursery water availability before buying nursery seed quantity',
      ],
      sources: [
        { title: 'ICAR-DOGR Onion Varieties and Seed Production', url: 'https://www.icar.gov.in/' },
        { title: 'ICAR Rabi Agro-Advisory' },
      ],
    },
    scientificPrinciples: [
      {
        topic: 'irrigation',
        title: 'Precision Onion Irrigation',
        titleLocal: { hi: 'सटीक प्याज सिंचाई', mr: 'कांदा अचूक ठिबक सिंचन' },
        why: 'Onion has a shallow feeder root system (top 15–20 cm) and cannot tolerate moisture stress or standing surface water.',
        whatToDo: 'Provide frequent, light drip cycles maintaining root-zone moisture tension between 20–30 kPa.',
        when: 'Daily during early seedling strike, then every 2–3 days during vegetative and bulb development.',
        whatToWatch: 'Overwatering causing bulb rotting or waterlogging; sudden moisture shocks causing twin bulbs.',
      },
      {
        topic: 'nutrient',
        title: 'Split-Dose Fertigation',
        titleLocal: { hi: 'विभाजित पोषक तत्व प्रबंधन', mr: 'टप्प्याटप्प्याने खत व्यवस्थापन' },
        why: 'Heavy single doses wash past shallow roots and cause leaf tip burning.',
        whatToDo: 'Split nutrients through drip laterals: nitrogen during vegetative stage, shifting to potassium and sulphur during bulb swelling.',
        when: 'Vegetative growth through mid-bulb stage (stop nitrogen 30 days before harvest).',
        whatToWatch: 'Excess late nitrogen causing thick-necked spongy bulbs with poor shelf life.',
      },
      {
        topic: 'pest',
        title: 'Thrips & Purple Blotch Scouting',
        titleLocal: { hi: 'थ्रिप्स व बैंगनी धब्बा निगरानी', mr: 'फुलकिडे (थ्रिप्स) व करपा निरीक्षण' },
        why: 'Thrips suck leaf sap, curling leaves and creating entry wounds for purple blotch fungal spores.',
        whatToDo: 'Examine central leaf whorls early in the morning using a hand magnifying lens.',
        when: 'Weekly throughout vegetative and bulb formation periods.',
        whatToWatch: 'Silver speckling on inner leaf blades, twisted yellow tips.',
      },
      {
        topic: 'harvest',
        title: 'Neck Fall & Curing',
        titleLocal: { hi: 'गर्दन झुकना एवं सुखाई', mr: 'मान पडणे व वाळवणे' },
        why: 'Harvesting with wet green necks introduces fungal rotting and ruins storage capability.',
        whatToDo: 'Withhold irrigation 10–15 days before harvest; harvest only when 50–70% tops have fallen naturally.',
        when: 'Maturity stage (approx. 120–135 days).',
        whatToWatch: 'Harvesting prematurely or leaving bulbs exposed to scorching midday sun (sun-scald).',
      },
    ],
    stages: [
      {
        id: 'seed_selection',
        stageName: 'Seed Selection',
        stageNameLocal: { hi: 'बीज चयन', mr: 'बियाणे निवड' },
        dayRange: [-45, -30],
        description: 'Choosing certified varieties adapted to season and target storage/market requirements.',
        whatToDo: [
          'Choose season-appropriate variety: Bhima Super for Kharif, Bhima Shakti for Rabi.',
          'Verify authorized dealer license and blue/white certification tag on seed packets.',
          'Calculate seed requirement: approximately 3–4 kg certified seed per acre for nursery raising.',
          'Perform quick water floatation check to remove light non-viable chaff.',
        ],
        whatToMonitor: [
          'Packaging date on packet (avoid seeds older than 9 months).',
          'Germination percentage stated on tag (minimum 70%).',
        ],
        irrigationGuidance: 'Keep nursery seedbeds moist using micro-sprinklers or fine rose-can until germination.',
        israeliPrecisionPractice: 'Protected nursery raised beds under 50% shade-net to shield delicate seedlings from heavy rain splashes.',
        nutrientGuidance: 'Incorporate well-decomposed FYM/compost and bio-fertilizers into nursery bed soil.',
        potentialRisks: ['Uncertified spurious seed with poor germination or high mixture of bolting types.'],
        warningSigns: ['Dull wrinkled seed coat, dust in packets, missing certification tag.'],
        recommendedNextAction: 'Prepare raised nursery beds and sow seeds in shallow furrows.',
        sources: [
          { title: 'ICAR-DOGR Certified Seed Guidelines', url: 'https://www.icar.gov.in/' },
        ],
      },
      {
        id: 'land_prep',
        stageName: 'Land Preparation & Drip Layout',
        stageNameLocal: { hi: 'भूमि की तैयारी एवं ड्रिप', mr: 'जमीन मशागत व ठिबक' },
        dayRange: [-15, 0],
        description: 'Tillage, broad bed furrow (BBF) formation, FYM incorporation, and pre-planting drip lateral installation.',
        whatToDo: [
          'Plough field to fine tilth, remove previous crop stubble and weeds.',
          'Incorporate well-decomposed FYM or compost uniformly across beds.',
          'Prepare broad bed furrow (BBF) or raised beds (120 cm top width) to ensure free drainage.',
          'Install inline pressure-compensating drip laterals and flush lines before transplanting.',
        ],
        whatToMonitor: [
          'Soil tilth and absence of hard pan below 15–20 cm.',
          'Uniform drip line pressure gauge readings across main and lateral control valves.',
          'Soil pH range check (target: 6.0–7.5).',
        ],
        irrigationGuidance: 'Pre-irrigate raised beds thoroughly through drip to field capacity 24 hours prior to transplanting.',
        israeliPrecisionPractice: 'Pressure-compensating inline drip laterals with 30–40 cm emitter spacing; check line discharge uniformity before planting.',
        nutrientGuidance: 'Basal application of well-decomposed organic manure as recommended by local ICAR/state agricultural university.',
        potentialRisks: ['Waterlogging in heavy clay soils causing damping off or root asphyxiation.'],
        warningSigns: ['Uneven emitter drippage, localized pooling or dry patches along beds.'],
        recommendedNextAction: 'Check seedling vigor in nursery bed and schedule transplanting during evening hours.',
        sources: [
          { title: 'ICAR Rabi Agro-Advisory', url: 'https://icar.gov.in/' },
          { title: 'Indo-Israel Agricultural Project (IIAP) Technical Framework' },
        ],
      },
      {
        id: 'sowing',
        stageName: 'Transplanting / Sowing',
        stageNameLocal: { hi: 'रोपाई / बुवाई', mr: 'पुनर्लागवड / पेरणी' },
        dayRange: [1, 10],
        description: 'Transplanting 6–7 week old healthy nursery seedlings into moist raised beds.',
        whatToDo: [
          'Select stocky, healthy seedlings (15 cm tall with pencil-thick neck).',
          'Maintain recommended plant-to-plant spacing (10 cm x 10 cm or 15 cm x 10 cm on raised beds).',
          'Plant at shallow depth (2–3 cm) to prevent deep bulb burial.',
        ],
        whatToMonitor: [
          'Seedling stand establishment and transplant shock.',
          'Immediate root-zone moisture contact.',
          'Soil moisture saturation without standing surface water.',
        ],
        irrigationGuidance: 'Light, daily precision drip irrigation (1–2 hours depending on emitter discharge) for first 5 days to facilitate root strike.',
        israeliPrecisionPractice: 'Mulching with silver-black reflective film or organic residue can suppress weed germination and reduce surface evaporation by up to 50%.',
        nutrientGuidance: 'No heavy synthetic fertilizer during first 7 days until feeder roots establish.',
        potentialRisks: ['Transplant shock in hot afternoon sun; seedling mortality due to dry spots.'],
        warningSigns: ['Wilting seedlings, dry emitter zones, or clumping.'],
        recommendedNextAction: 'Inspect field stand at day 7 and perform gap-filling if needed.',
        sources: [
          { title: 'ICAR-DOGR Onion Production Guidelines', url: 'https://www.icar.gov.in/' },
        ],
      },
      {
        id: 'vegetative',
        stageName: 'Vegetative Growth',
        stageNameLocal: { hi: 'वानस्पतिक वृद्धि', mr: 'शाकीय वाढ' },
        dayRange: [11, 60],
        description: 'Rapid leaf development, tillering, canopy expansion, and root establishment.',
        whatToDo: [
          'Carry out regular shallow inter-cultivation or weeding before canopy closes.',
          'Maintain regular scheduled fertigation split doses through drip stream.',
          'Perform regular field scouting for early pest symptoms.',
        ],
        whatToMonitor: [
          'Thrips incidence (examine leaf whorls and silver speckling).',
          'Purple blotch / fungal leaf spot symptoms.',
          'Leaf count progress (target: 8–10 healthy leaves before bulb initiation).',
        ],
        irrigationGuidance: 'Schedule drip irrigation at 2–3 day intervals based on soil moisture and ambient temperature. Maintain consistent root-zone moisture.',
        israeliPrecisionPractice: 'Split-dose fertigation via venture injector or dosing pump; dissolve water-soluble grades into pressurized stream to prevent nutrient leaching.',
        nutrientGuidance: 'Split application of nitrogen and potash through fertigation stream during early to mid vegetative phase. (Consult official KVK advisory for exact localized dosages).',
        potentialRisks: ['Thrips infestation causing leaf curling, purple blotch flare-ups in humid cloudy conditions.'],
        warningSigns: ['Silvering of leaf blades, yellowing leaf tips, premature bolting.'],
        recommendedNextAction: 'Inspect crop whorls early morning; prepare for bulb initiation transition.',
        sources: [
          { title: 'ICAR-DOGR Onion IPM', url: 'https://www.icar.gov.in/' },
          { title: 'Centre of Excellence Operational Guidelines' },
        ],
      },
      {
        id: 'bulb_development',
        stageName: 'Bulb Initiation & Development',
        stageNameLocal: { hi: 'कंद निर्माण व विकास', mr: 'कांदा पोसणे' },
        dayRange: [61, 105],
        description: 'Swelling of leaf bases to form bulbs; critical water and potassium uptake window.',
        whatToDo: [
          'Maintain optimal moisture; avoid sudden wet-dry moisture shocks that cause bulb splitting.',
          'Support potassium-dominant fertigation to enhance bulb firmness and skin color.',
          'Scout for late thrips or downy mildew.',
        ],
        whatToMonitor: [
          'Bulb expansion diameter uniformity.',
          'Skin color development and scales integrity.',
          'Root-zone soil moisture; avoid water stress during peak bulb swelling.',
        ],
        irrigationGuidance: 'Critical moisture period: provide regular, measured drip cycles. Moisture stress at bulb enlargement causes split bulbs, doubles, or reduced size.',
        israeliPrecisionPractice: 'Tensiometer or soil-moisture sensor guidance: maintain root-zone soil tension between 20–30 kPa to maximize bulb expansion efficiency.',
        nutrientGuidance: 'Gradually phase out high nitrogen; focus on potassium and sulphur to strengthen tunic scales and storage quality.',
        potentialRisks: ['Water stress causing split bulbs or twin bulbs; excess late nitrogen causing thick necks.'],
        warningSigns: ['Cracked outer scales, thick spongy necks, premature bulb rot.'],
        recommendedNextAction: 'Monitor neck softening; begin planning irrigation withholding schedule 15 days before harvest.',
        sources: [
          { title: 'ICAR Rabi Agro-Advisory', url: 'https://icar.gov.in/' },
          { title: 'National Horticulture Board' },
        ],
      },
      {
        id: 'maturity_harvest',
        stageName: 'Maturity & Harvest',
        stageNameLocal: { hi: 'परिपक्वता व कटाई', mr: 'काढणी व परिपक्वता' },
        dayRange: [106, 125],
        description: 'Neck fall of foliage (50% tops fallen), outer skin drying, and manual harvesting.',
        whatToDo: [
          'Stop irrigation 10–15 days before scheduled harvest to allow neck drying.',
          'Harvest when 50% to 70% of plant tops have naturally lodged / fallen over.',
          'Uproot bulbs carefully without cutting or bruising the skin.',
          'Field-cure in windrows with foliage covering bulbs to prevent sun-scald.',
        ],
        whatToMonitor: [
          'Percentage of neck fall across the field.',
          'Weather forecast to avoid harvesting in sudden rain.',
          'Neck dryness to ensure no entry for neck rot fungi.',
        ],
        irrigationGuidance: 'Completely withdraw irrigation 10 to 15 days before harvest. Harvesting in wet soil severely damages storage life.',
        israeliPrecisionPractice: 'Regulated moisture dry-down to enhance dry matter percentage and post-harvest firmness.',
        nutrientGuidance: 'Zero fertilizer application during maturity phase.',
        potentialRisks: ['Harvesting prematurely with thick necks; sun-scald from direct midday sun exposure.'],
        warningSigns: ['Sunken wet necks, sun-bleached outer scales.'],
        recommendedNextAction: 'Transfer harvested bulbs to covered curing yard after 3–5 days of field drying.',
        sources: [
          { title: 'National Horticulture Board – Onion Post-Harvest', url: 'https://nhb.gov.in/' },
        ],
      },
      {
        id: 'post_harvest_market',
        stageName: 'Post-Harvest & Market Preparation',
        stageNameLocal: { hi: 'कटाई उपरांत व विपणन', mr: 'काढणीनंतर प्रतवारी व बाजार' },
        dayRange: [126, 135],
        description: 'Detopping, shade curing, grading, sorting, ventilated storage or mandi dispatch.',
        whatToDo: [
          'Detop foliage leaving 2.5 to 3.0 cm neck attached to bulb.',
          'Shade-cure bulbs in well-ventilated structures for 10–15 days to form tight dry scales.',
          'Grade into size categories (A-grade 45–60 mm, B-grade 35–45 mm, C-grade < 35 mm).',
          'Sort out thick-necked, twin, injured or rotten bulbs before storage or market loading.',
          'Bag in breathable mesh/leno bags (40–50 kg) for transport.',
        ],
        whatToMonitor: [
          'Storage shrinkage and physiological weight loss percentage.',
          'Sprouting and rotting rates in storage bins.',
          'Daily modal prices in Nashik / Lasalgaon APMC to time sales strategically.',
        ],
        irrigationGuidance: 'Not applicable (post-harvest).',
        israeliPrecisionPractice: 'Cold-chain handling and low-cost naturally ventilated curing structures to preserve outer skin layers and reduce post-harvest shrinkage.',
        nutrientGuidance: 'Not applicable.',
        potentialRisks: ['High humidity in storage causing black mold, soft rot, and premature sprouting.'],
        warningSigns: ['Soft bulbs, foul smell, fungal sporulation at neck.'],
        recommendedNextAction: 'Review APMC price floors; decide between immediate release vs. holding in ventilated storage.',
        sources: [
          { title: 'ICAR-DOGR Market Intelligence & Storage', url: 'https://www.icar.gov.in/' },
          { title: 'National Horticulture Board' },
        ],
      },
    ],
    harvestAndMarket: {
      harvestIndicators: [
        '50% to 70% of crop top leaves have naturally lodged (neck fall).',
        'Bulb neck softens and turns hollow.',
        'Outer skin develops characteristic red/pink color and tight dry scales.',
      ],
      curingAndDrying:
        'Windrow field-cure for 3–5 days followed by 10–15 days of shade curing in naturally ventilated structures to dry the neck completely.',
      gradingAndSorting:
        'Grade by diameter: Extra Large (>60mm), Medium (45-60mm), Small (35-45mm). Discard bolted, doubled, or bruised bulbs.',
      storageAdvice:
        'Store rabi crop in naturally ventilated double-row structures. Keep relative humidity at 65–70% and temperatures below 30°C to minimize sprouting and rotting.',
      sellingStrategy:
        'Rabi onions can be stored for 3–5 months to capture post-monsoon price appreciation (July–September), balancing storage loss against expected price spikes.',
      sources: [
        { title: 'ICAR – Onion Cold Storage & Storage Advisory', url: 'https://www.icar.gov.in/' },
        { title: 'Government of India Economic Survey – Onion Supply Management' },
      ],
    },
    israeliTechniques: [
      {
        title: 'Precision Drip Fertigation',
        details: 'Inline pressure-compensating drippers cut water consumption by 40-50% while feeding soluble nutrients directly into active root zones.',
        source: 'Indo-Israel Agricultural Project (IIAP)',
      },
      {
        title: 'UV-Stabilized Mulching',
        details: 'Suppresses soil moisture evaporation and arrests competitive weed proliferation, maintaining consistent rhizosphere moisture.',
        source: 'Indo-Israeli CoE Best Practices',
      },
      {
        title: 'Moisture Tension Monitoring',
        details: 'Managing irrigation according to tensiometer readings (20–30 kPa) to prevent bulb splitting from moisture fluctuations.',
        source: 'Netafim Agronomy Guidelines',
      },
    ],
  },

  corn: {
    id: 'corn',
    name: {
      en: 'Corn (Maize)',
      hi: 'मक्का (Corn)',
      mr: 'मका (Maize)',
    },
    botanicalName: 'Zea mays',
    icon: '🌽',
    image: '/assets/images/crop_soybean_1789896029042.jpg',
    durationDays: 110,
    suitableSoil: 'Well-drained deep loamy soils with good organic matter. Highly sensitive to waterlogging at early stages.',
    seasons: ['Kharif (Monsoon)', 'Rabi', 'Spring'],
    seedSelection: {
      title: {
        en: 'Step 1: Choose Your Maize Seed',
        hi: 'चरण 1: अपने मक्का का बीज चुनें',
        mr: 'पायरी १: मक्याचे योग्य बियाणे निवडा',
      },
      varieties: [
        {
          name: 'Deccan Bold (Single-Cross Hybrid)',
          suitableSeason: 'Kharif & Rabi',
          duration: '105–115 days',
          keyCharacteristics: 'Strong stalk lodging resistance, tight husk cover protecting grain from rain damage, high test weight preferred by poultry feed & starch mills.',
          source: 'ICAR-Indian Institute of Maize Research (IIMR)',
        },
        {
          name: 'Certified Single-Cross Drought Hybrids',
          suitableSeason: 'Kharif',
          duration: '95–105 days',
          keyCharacteristics: 'Shorter duration with synchronised flowering (Anthesis-Silking Interval < 3 days), adapted for rainfed semi-arid zones.',
          source: 'ICAR-IIMR',
        },
      ],
      seedQualityChecklist: [
        'Certified blue-tag packaging with lot seal intact.',
        'Germination count test >= 85% with physical purity >= 98%.',
        'Uniform bold kernel size ensuring even planter drop and emergence.',
      ],
      seedTreatment: 'Pre-treated certified seeds or biological protective coating against early soil-borne fungal pathogens as per IIMR guidelines.',
      beforeYouBuy: [
        '✓ Check certified hybrid tag & company authorization',
        '✓ Check intended market (grain for poultry feed vs green cob vs fodder)',
        '✓ Verify germination percentage test date',
        '✓ Check seed rate (typically 7–8 kg per acre for grain maize)',
      ],
      sources: [
        { title: 'ICAR-IIMR Guidelines', url: 'https://iimr.icar.gov.in/' },
      ],
    },
    scientificPrinciples: [
      {
        topic: 'irrigation',
        title: 'Critical Tasseling & Silking Moisture',
        titleLocal: { hi: 'मंजरी एवं भुट्टा बाल समय सिंचाई', mr: 'तुरा व कणसाचे केस बाहेर पडताना पाणी' },
        why: 'Moisture stress during pollen shed dries out silks and kills pollen, causing blank or half-filled cobs.',
        whatToDo: 'Ensure uninterrupted root-zone hydration from pre-tasseling through grain filling.',
        when: 'Days 45 to 75 after planting.',
        whatToWatch: 'Leaves rolling into tight needles at midday; delayed silk emergence.',
      },
      {
        topic: 'pest',
        title: 'Fall Armyworm (FAW) Management',
        titleLocal: { hi: 'फॉल आर्मीवर्म निगरानी', mr: 'लष्करी अळी (FAW) नियंत्रण' },
        why: 'Invasive caterpillar defoliates whorls rapidly and bores into developing cobs if unchecked.',
        whatToDo: 'Scout central whorls early in the morning. Pick and destroy egg masses; apply safe botanical/recommended bait.',
        when: 'Knee-high vegetative stage (Days 15 to 45).',
        whatToWatch: 'Sawdust-like frass and pinholes in expanding whorl leaves.',
      },
      {
        topic: 'nutrient',
        title: 'Split Nitrogen Application',
        titleLocal: { hi: 'विभाजित यूरिया/नाइट्रोजन', mr: 'टप्प्याटप्प्याने नत्र खत' },
        why: 'Maize is a heavy nitrogen feeder; applying all nitrogen upfront leads to massive leaching.',
        whatToDo: 'Apply nitrogen in 3 splits: basal, knee-high stage (Day 30), and pre-tasseling (Day 50).',
        when: 'Key vegetative milestones.',
        whatToWatch: 'V-shaped yellowing on older lower leaves (nitrogen hunger).',
      },
      {
        topic: 'harvest',
        title: 'Moisture Drying & Black Layer',
        titleLocal: { hi: 'दाना सुखाई एवं ब्लैक लेयर', mr: 'दाणे वाळवणे व काळा ठिपका' },
        why: 'Selling or storing maize above 14% moisture invites aflatoxin fungus and massive mandi price cuts.',
        whatToDo: 'Check black layer at kernel base; sun-dry shelled grain down to 13–14% moisture.',
        when: 'Harvesting & post-harvest drying.',
        whatToWatch: 'Damp grain with musty smell; kernel discolouration.',
      },
    ],
    stages: [
      {
        id: 'seed_selection',
        stageName: 'Seed Selection',
        stageNameLocal: { hi: 'बीज चयन', mr: 'बियाणे निवड' },
        dayRange: [-30, -15],
        description: 'Choosing certified high-yielding single-cross hybrids suited to regional rainfall and soil depth.',
        whatToDo: [
          'Choose hybrid seed (e.g. Deccan Bold) with proven lodging resistance.',
          'Verify certified blue tag and ensure seed rate of 7–8 kg per acre.',
          'Store bags in cool, dry rodent-free shed until sowing date.',
        ],
        whatToMonitor: [
          'Packaging date and certified germination test rating.',
        ],
        irrigationGuidance: 'Ensure irrigation source or monsoon onset is confirmed before opening seed bags.',
        israeliPrecisionPractice: 'Plan ridge-and-furrow or raised-bed layout before seed placement.',
        nutrientGuidance: 'Arrange basal compost and fertilizers in advance.',
        potentialRisks: ['Spurious uncertified grain sold as hybrid seed.'],
        warningSigns: ['Broken kernels, unsealed stitching on bags.'],
        recommendedNextAction: 'Proceed to field ploughing and raised bed preparation.',
        sources: [{ title: 'ICAR-IIMR Agro-Advisory', url: 'https://iimr.icar.gov.in/' }],
      },
      {
        id: 'land_prep',
        stageName: 'Land Preparation & Bed Formation',
        stageNameLocal: { hi: 'भूमि की तैयारी एवं मेड़ निर्माण', mr: 'जमीन मशागत व गादी वाफे' },
        dayRange: [-15, 0],
        description: 'Tillage, incorporation of manure, and formation of raised beds or ridges to prevent waterlogging.',
        whatToDo: [
          'Deep ploughing followed by 2 harrowing passes to create fine clod-free seedbed.',
          'Form raised beds or ridges (60 cm ridge-to-ridge spacing).',
          'Ensure drainage channels at field margins to evacuate excess monsoon runoff.',
        ],
        whatToMonitor: [
          'Seedbed firmness and drainage slope.',
          'Absence of standing water in low-lying furrow pockets.',
        ],
        irrigationGuidance: 'Pre-sowing irrigation to ensure adequate seedbed moisture for uniform germination.',
        israeliPrecisionPractice: 'Ridge-bed micro-irrigation lines delivering moisture at the crown while keeping the root zone aerated.',
        nutrientGuidance: 'Incorporate well-rotted FYM/compost during last ploughing; apply recommended basal fertilizer per local agricultural university guidelines.',
        potentialRisks: ['Water stagnation during heavy monsoon showers causing seedling death.'],
        warningSigns: ['Compacted clay, poor water infiltration.'],
        recommendedNextAction: 'Procure certified high-yielding hybrid seed and schedule sowing.',
        sources: [{ title: 'ICAR-IIMR Guidelines', url: 'https://iimr.icar.gov.in/' }],
      },
      {
        id: 'sowing',
        stageName: 'Sowing & Germination',
        stageNameLocal: { hi: 'बुवाई एवं अंकुरण', mr: 'पेरणी व उगवण' },
        dayRange: [1, 12],
        description: 'Precision seed placement at 4–5 cm depth on sides of ridges.',
        whatToDo: [
          'Sow certified hybrid seeds at 60 cm row-to-row and 20 cm plant-to-plant spacing.',
          'Maintain 4–5 cm seed depth to ensure good soil-seed contact without burying too deep.',
          'Ensure light irrigation to activate germination.',
        ],
        whatToMonitor: [
          'Emergence percentage at Day 5–7.',
          'Bird or rodent damage to newly emerged coleoptiles.',
        ],
        irrigationGuidance: 'Light moisture maintenance; do not flood seedbeds as crusting hinders coleoptile emergence.',
        israeliPrecisionPractice: 'Surface drip lateral lines positioned adjacent to seed rows for direct root hydration.',
        nutrientGuidance: 'Rely on basal incorporation; avoid foliar sprays at emergence stage.',
        potentialRisks: ['Soil crusting preventing seedling emergence; seed rotting if soil is waterlogged.'],
        warningSigns: ['Gaps in row emergence, yellow stunted coleoptiles.'],
        recommendedNextAction: 'Perform thinning at Day 12 to retain one vigorous seedling per hill.',
        sources: [{ title: 'ICAR-IIMR Agro-Advisory', url: 'https://iimr.icar.gov.in/' }],
      },
      {
        id: 'vegetative',
        stageName: 'Vegetative & Knee-High Stage',
        stageNameLocal: { hi: 'वानस्पतिक वृद्धि एवं घुटना ऊंचाई', mr: 'शाकीय वाढ व गुडघा उंची' },
        dayRange: [13, 45],
        description: 'Rapid leaf development, stem elongation, brace root formation.',
        whatToDo: [
          'Inter-cultivation and earthing up around Day 30–35 to support plants against lodging.',
          'Keep field weed-free during first 30 days of critical crop-weed competition.',
          'Perform regular whorl scouting for Fall Armyworm.',
        ],
        whatToMonitor: [
          'Fall Armyworm (Spodoptera frugiperda) windowing and frass in whorls.',
          'Stem borer damage.',
          'Nitrogen deficiency signs (V-shaped yellowing on older lower leaves).',
        ],
        irrigationGuidance: 'Irrigate at 7–10 day intervals in absence of rain. Avoid moisture stress as leaf area establishes.',
        israeliPrecisionPractice: 'Split fertigation through drip lines: delivering nitrogen in synchrony with rapid biomass expansion.',
        nutrientGuidance: 'Top dress nitrogen split at knee-high stage (approx Day 30–35) as per regional university advisory.',
        potentialRisks: ['Fall Armyworm defoliation rapidly stripping leaf whorls.'],
        warningSigns: ['Shot-holes in leaves, fresh sawdust-like excreta in central whorls.'],
        recommendedNextAction: 'Scout 20 plants across 5 spots; check whorls early morning.',
        sources: [{ title: 'ICAR-IIMR Pest Management Guidelines', url: 'https://iimr.icar.gov.in/' }],
      },
      {
        id: 'tasseling_silking',
        stageName: 'Tasseling & Silking (Critical Window)',
        stageNameLocal: { hi: 'मंजरी व भुट्टा बाल निकलना', mr: 'तुरा व कणसाचे केस बाहेर पडणे' },
        dayRange: [46, 75],
        description: 'Tassel emergence, pollen shed, silk emergence, and ovule fertilization.',
        whatToDo: [
          'Ensure absolute moisture availability: never allow moisture stress during pollen shed and silk receptive window.',
          'Scout for earhead caterpillars or late Fall Armyworm entering developing cobs.',
          'Protect brace roots with stable soil cover.',
        ],
        whatToMonitor: [
          'Tassel-silk synchrony (ASI: Anthesis-Silking Interval; should be under 3 days).',
          'Silk drying and moisture status.',
          'Soil moisture tension in root zone.',
        ],
        irrigationGuidance: 'MOST CRITICAL IRRIGATION STAGE: Moisture stress during tasseling/silking causes desiccation of silks and poor fertilization, causing severe kernel abortion.',
        israeliPrecisionPractice: 'Maintain soil moisture at 75–80% available water capacity through high-frequency drip cycles.',
        nutrientGuidance: 'Final split of nitrogen/potash at pre-tasseling stage to support cob sink capacity.',
        potentialRisks: ['Moisture stress causing blank or poorly filled cobs; high temperature (>38°C) desiccation of pollen.'],
        warningSigns: ['Delayed silk emergence, curled upper leaves during midday, dried tassel tips.'],
        recommendedNextAction: 'Monitor grain filling and dough progression.',
        sources: [{ title: 'ICAR-IIMR Critical Moisture Advisory', url: 'https://iimr.icar.gov.in/' }],
      },
      {
        id: 'grain_filling_maturity',
        stageName: 'Grain Filling & Maturity',
        stageNameLocal: { hi: 'दाना भराव एवं परिपक्वता', mr: 'दाणे भरणे व परिपक्वता' },
        dayRange: [76, 100],
        description: 'Milk stage to dough stage, denting, and black layer formation on kernels.',
        whatToDo: [
          'Maintain moderate moisture until dough stage; withdraw irrigation as husk leaves turn straw yellow.',
          'Check for physiological maturity: appearance of black layer at the base/tip of kernel.',
          'Inspect cob tightness against birds.',
        ],
        whatToMonitor: [
          'Husk leaf drying and browning.',
          'Black layer formation at kernel base indicating starch transfer completion.',
          'Grain moisture dropping below 25%.',
        ],
        irrigationGuidance: 'Taper off irrigation. Stop all irrigation once black layer appears on kernels.',
        israeliPrecisionPractice: 'Terminal deficit irrigation: stopping water supply as starch deposition finalizes.',
        nutrientGuidance: 'Zero fertilizer application during grain hardening.',
        potentialRisks: ['Unseasonal rains causing ear rots and lodging; bird damage to exposed cob tips.'],
        warningSigns: ['Loose husks, fungal mold on cob tip.'],
        recommendedNextAction: 'Prepare mechanical harvester or manual labor; arrange drying yard.',
        sources: [{ title: 'ICAR-IIMR Guidelines', url: 'https://iimr.icar.gov.in/' }],
      },
      {
        id: 'harvest_market',
        stageName: 'Harvesting, Drying & Selling',
        stageNameLocal: { hi: 'कटाई, सुखाई एवं विपणन', mr: 'काढणी, वाळवणे व बाजार' },
        dayRange: [101, 110],
        description: 'Cob harvesting, mechanical shelling, moisture reduction below 14%, and mandi sale.',
        whatToDo: [
          'Harvest cobs when husks are dry and papery.',
          'De-husk and sun-dry cobs on clean tarpaulin or drying floor for 3–5 days.',
          'Shell dried cobs mechanically; winnow to remove broken kernels and dust.',
          'Sun-dry grain until moisture content drops below 14% to prevent aflatoxin mold and avoid mandi price deductions.',
          'Store in clean, moisture-proof gunny/HDPE bags on wooden pallets.',
        ],
        whatToMonitor: [
          'Grain moisture percentage (must be <= 14% for storage/mandi sale).',
          'Presence of mold or weevils.',
          'Current poultry feed & starch mill procurement prices.',
        ],
        irrigationGuidance: 'Not applicable.',
        israeliPrecisionPractice: 'Moisture-controlled post-harvest drying protocols to prevent mycotoxin development.',
        nutrientGuidance: 'Not applicable.',
        potentialRisks: ['Aflatoxin contamination if stored at >14% moisture; steep APMC moisture discount penalties.'],
        warningSigns: ['Musty odor, fungal mycelium on kernels, high grain dampness.'],
        recommendedNextAction: 'Sell dry grain to poultry feed/industrial buyers or store safely for post-harvest price recovery.',
        sources: [
          { title: 'National Agricultural Cooperative Marketing Federation (NAFED)', url: 'https://nafed-india.com/' },
          { title: 'APMC Grain Market Standards' },
        ],
      },
    ],
    harvestAndMarket: {
      harvestIndicators: [
        'Husks turn straw-yellow, papery and dry.',
        'Grains become hard and glossy.',
        'Black layer develops at the base of the kernel where it attaches to the cob.',
      ],
      curingAndDrying: 'Sun dry cobs on tarpaulin for 3–5 days, then shell and sun dry grain until moisture is below 14%.',
      gradingAndSorting: 'Remove moldy, diseased, discolored, or broken kernels. Ensure grain is free from stones, dust, and chaff.',
      storageAdvice:
        'Store below 14% moisture in well-ventilated dry warehouses on wooden pallets away from walls. Check periodic moisture levels to prevent aflatoxin contamination.',
      sellingStrategy:
        'Avoid distress sales during peak Kharif harvest gluts (Oct–Nov); grain dried below 14% can be stored to sell during pre-monsoon price recovery (April–July) to poultry/starch feedmills.',
      sources: [
        { title: 'ICAR-IIMR Market Outlook', url: 'https://iimr.icar.gov.in/' },
        { title: 'Ministry of Agriculture Market Intelligence' },
      ],
    },
    israeliTechniques: [
      {
        title: 'Ridge-Bed Drip Micro-Irrigation',
        details: 'Aerates root zone while saving 45% water; prevents root suffocation and damping-off during early crop growth.',
        source: 'Indo-Israel Agricultural Project',
      },
      {
        title: 'Split-Dose Fertigation Scheduling',
        details: 'Aligns nitrogen injection with key physiological stages (knee-high, pre-tasseling) to reduce leaching losses.',
        source: 'Centre of Excellence Best Practices',
      },
    ],
  },

  grapes: {
    id: 'grapes',
    name: {
      en: 'Grapes',
      hi: 'अंगूर (द्राक्ष)',
      mr: 'द्राक्षे (Grapes)',
    },
    botanicalName: 'Vitis vinifera',
    icon: '🍇',
    image: '/assets/images/crop_rabi_onion_1789896010271.jpg',
    durationDays: 140,
    suitableSoil: 'Well-drained deep loamy/sandy loam soils. Sensitive to salinity, sodicity and poor drainage.',
    seasons: ['Foundation Pruning (Apr-May)', 'Fruit Pruning (Oct-Nov)'],
    seedSelection: {
      title: {
        en: 'Step 1: Choose Variety & Rootstock',
        hi: 'चरण 1: किस्म एवं रूटस्टॉक का चयन',
        mr: 'पायरी १: द्राक्ष वाण व रूटस्टॉक निवड',
      },
      varieties: [
        {
          name: 'Thompson Seedless & Tas-A-Ganesh (on Dogridge Rootstock)',
          suitableSeason: 'Fruit Pruning October–November',
          duration: '135–145 days from fruit pruning to harvest',
          keyCharacteristics: 'Premier export-grade table grape variety. Dogridge rootstock provides deep root foraging, drought tolerance, and salinity buffering in Maharashtra black soils.',
          source: 'ICAR-NRC for Grapes',
        },
      ],
      seedQualityChecklist: [
        'Certified disease-free cuttings or grafted saplings from ICAR-NRCG or recognized nurseries.',
        'Budwood free from leaf-roll virus, bacterial spot, and crown gall.',
        'Graft union fully healed with sturdy root architecture.',
      ],
      seedTreatment: 'Root-dip with Trichoderma and bio-antagonists prior to pit planting.',
      beforeYouBuy: [
        '✓ Verify rootstock authenticity (genuine Dogridge rootstock)',
        '✓ Inspect graft union firmness and root development',
        '✓ Confirm soil salinity and water chloride levels before establishment',
        '✓ Arrange trellis (bavadi / Y-trellis) infrastructure beforehand',
      ],
      sources: [
        { title: 'ICAR-NRC for Grapes Technical Guide', url: 'https://www.nrcgrapes.in/' },
      ],
    },
    scientificPrinciples: [
      {
        topic: 'irrigation',
        title: 'Regulated Deficit Irrigation (RDI)',
        titleLocal: { hi: 'विनियमित घाटा सिंचाई (RDI)', mr: 'नियमन केलेले तुटीचे सिंचन (RDI)' },
        why: 'Excess water during flowering or ripening promotes vegetative shoot runaway and cracks berries.',
        whatToDo: 'Deliberately restrict water during bloom and veraison to concentrate sugar and berry skin elasticity.',
        when: 'Bloom and veraison stages.',
        whatToWatch: 'Over-irrigation leading to watery fruit and split berries.',
      },
      {
        topic: 'pest',
        title: 'Downy Mildew & MRL Compliance',
        titleLocal: { hi: 'डाउनी मिल्ड्यू एवं एमआरएल', mr: 'डाऊनी मिल्ड्यू व एमआरएल नियम' },
        why: 'Unseasonal rain triggers downy mildew instantly. Over-spraying leads to international export rejection.',
        whatToDo: 'Scout canopy for yellow oil spots; observe pre-harvest safety intervals (PHI) strictly.',
        when: 'Humid cloudy periods and shoot development.',
        whatToWatch: 'White fungal down on leaf undersides; chemical residue limits.',
      },
      {
        topic: 'harvest',
        title: 'TSS (°Brix) Sugar Maturity',
        titleLocal: { hi: 'शर्करा परिपक्वता (°ब्रिक्स)', mr: 'साखर प्रमाण (°ब्रिक्स) काढणी' },
        why: 'Immature sour grapes ruin buyer trust and fail export criteria.',
        whatToDo: 'Measure sugar with a hand refractometer: harvest only when berries cross 16–18 °Brix.',
        when: '130–140 days after fruit pruning.',
        whatToWatch: 'Watery soft berries without natural waxy bloom.',
      },
    ],
    stages: [
      {
        id: 'seed_selection',
        stageName: 'Rootstock & Variety Selection',
        stageNameLocal: { hi: 'किस्म व रूटस्टॉक चयन', mr: 'वाण व रूटस्टॉक निवड' },
        dayRange: [-60, -30],
        description: 'Selecting authentic certified Dogridge rootstock grafted with Thompson Seedless or Tas-A-Ganesh.',
        whatToDo: [
          'Procure grafted saplings from authorized nursery.',
          'Verify true-to-type Dogridge rootstock.',
          'Plan trellis installation and drip laterals.',
        ],
        whatToMonitor: ['Graft union firmness and root health.'],
        irrigationGuidance: 'Establish deep soaking irrigation during pit preparation.',
        israeliPrecisionPractice: 'Soil-water budgeting to match vine spacing with pressure-compensating emitters.',
        nutrientGuidance: 'Basal trench enrichment with compost and bio-fertilizers.',
        potentialRisks: ['Substandard wild rootstock leading to poor bud fruitfulness.'],
        warningSigns: ['Weak graft union, stunted rootlet growth.'],
        recommendedNextAction: 'Proceed to orchard layout and pit preparation.',
        sources: [{ title: 'ICAR-NRC for Grapes', url: 'https://www.nrcgrapes.in/' }],
      },
      {
        id: 'fruit_pruning',
        stageName: 'Fruit Pruning (October)',
        stageNameLocal: { hi: 'फल छंटाई (अक्टूबर)', mr: 'गोड छाटणी (ऑक्टोबर)' },
        dayRange: [1, 15],
        description: 'Pruning canes to fruitful buds (usually 4–6 buds on Thompson Seedless) for crop initiation.',
        whatToDo: [
          'Prune mature canes to fruitful bud level based on cane thickness (8–10 mm).',
          'Apply hydrogen cyanamide paste to top 1–2 buds to achieve uniform bud break.',
          'Clean vine bark and sanitize pruning cuts.',
        ],
        whatToMonitor: [
          'Uniform bud break across the cordon.',
          'Sprouting percentage and cane vigor.',
        ],
        irrigationGuidance: 'Heavy soaking irrigation immediately after pruning to initiate sap flow and bud burst, followed by regulated deficit.',
        israeliPrecisionPractice: 'Pressure-compensating drip laterals along vine rows delivering uniform discharge across slopes.',
        nutrientGuidance: 'Basal application of organic manures and university-recommended fertilizers before pruning.',
        potentialRisks: ['Uneven bud burst due to fluctuating night temperatures.'],
        warningSigns: ['Blind buds, delayed sprouting on lower cane nodes.'],
        recommendedNextAction: 'Scout new shoots for flea beetle and early thrips.',
        sources: [{ title: 'ICAR-NRC for Grapes Guidelines', url: 'https://www.nrcgrapes.in/' }],
      },
      {
        id: 'shoot_flowering',
        stageName: 'Shoot Growth & Flowering',
        stageNameLocal: { hi: 'शाखा वृद्धि एवं पुष्पन', mr: 'शेंडा वाढ व फुलधारणा' },
        dayRange: [16, 45],
        description: 'Inflorescence emergence, shoot tipping, sub-cane management, and full bloom.',
        whatToDo: [
          'Pinch shoot tips above the bunch to direct assimilates to inflorescence.',
          'Canopy training: tuck shoots into trellis wires to maximize sunlight and air circulation.',
          'Scout for downy mildew and thrips.',
        ],
        whatToMonitor: [
          'Downy mildew "oil spots" on young leaves during humid weather.',
          'Inflorescence elongation and rachis stretch.',
          'Canopy microclimate and sunlight penetration.',
        ],
        irrigationGuidance: 'Moderate, steady drip irrigation. Avoid heavy watering during full bloom to prevent flower drop.',
        israeliPrecisionPractice: 'Regulated Deficit Irrigation (RDI): strategically limiting water supply during bloom to prevent excessive vegetative vigor and improve bunch architecture.',
        nutrientGuidance: 'Petiole-directed fertigation: apply balanced nutrients; incorporate boron/zinc where recommended for pollen tube viability.',
        potentialRisks: ['Downy mildew outbreak during cloudy rainy spells; flower drop from moisture stress or overcast skies.'],
        warningSigns: ['Oil spots with white downy growth on underside of leaves; blackened flower rachis.'],
        recommendedNextAction: 'Prepare for post-bloom berry set and manual thinning operations.',
        sources: [{ title: 'ICAR-NRC for Grapes / Israeli Agricultural Practices', url: 'https://www.nrcgrapes.in/' }],
      },
      {
        id: 'berry_set_development',
        stageName: 'Berry Set & Bunch Thinning',
        stageNameLocal: { hi: 'फल निर्धारण एवं गुच्छा छंटाई', mr: 'मणी धारणा व विरळणी' },
        dayRange: [46, 80],
        description: 'Berry set, manual berry thinning, bunch dip applications, and berry sizing.',
        whatToDo: [
          'Perform manual thinning to retain 80–100 uniform berries per bunch for export standards.',
          'Apply university-recommended plant growth regulators (PGRs) for rachis elongation and berry diameter.',
          'Wrap bunches or maintain protective canopy against sunburn.',
        ],
        whatToMonitor: [
          'Berry diameter progress (target: 16–18 mm for export-grade table grapes).',
          'Powdery mildew and thrips on young berries.',
          'Strict adherence to export Maximum Residue Limits (MRL).',
        ],
        irrigationGuidance: 'Provide adequate, uninterrupted drip irrigation to support cell division and cell enlargement.',
        israeliPrecisionPractice: 'Micro-climate monitoring: using shade nets and canopy ventilation to reduce bunch heat stress.',
        nutrientGuidance: 'High potassium and phosphorus fertigation to support rapid berry sizing and firm berry skin.',
        potentialRisks: ['Berry cracking from irregular moisture; powdery mildew scarring berry skins; chemical residue exceedance.'],
        warningSigns: ['Ashy white powdery spots on berries, split berries, uneven berry sizes.'],
        recommendedNextAction: 'Monitor veraison (onset of ripening and softening).',
        sources: [
          { title: 'ICAR-NRC for Grapes', url: 'https://www.nrcgrapes.in/' },
          { title: 'APEDA Export Standards', url: 'https://apeda.gov.in/' },
        ],
      },
      {
        id: 'veraison_ripening',
        stageName: 'Veraison & Sugar Accumulation',
        stageNameLocal: { hi: 'परिपक्वता एवं शर्करा संचय', mr: 'मणी मऊ होणे व साखर भरणे' },
        dayRange: [81, 120],
        description: 'Softening of berries, development of characteristic translucent amber-green color, sugar build-up.',
        whatToDo: [
          'Protect bunches from direct harsh sunlight (use bunch covers or leaf shade).',
          'Regularly test Total Soluble Solids (°Brix) using a hand refractometer.',
          'Comply strictly with Pre-Harvest Intervals (PHI) for all plant protection.',
        ],
        whatToMonitor: [
          'TSS (°Brix) levels (target: >= 16–18 °Brix for harvest readiness).',
          'Acidity levels and Sugar-Acid ratio.',
          'Pesticide Pre-Harvest Interval (PHI) compliance for export.',
        ],
        irrigationGuidance: 'Gradually reduce irrigation by 30–40% to encourage sugar accumulation and prevent berry cracking.',
        israeliPrecisionPractice: 'Regulated Deficit Irrigation (RDI) to boost soluble sugars and firm berry texture without loss of yield quality.',
        nutrientGuidance: 'Sulphate of potash fertigation; zero nitrogen application.',
        potentialRisks: ['Berry cracking if sudden unseasonal showers occur; bird or bat damage.'],
        warningSigns: ['Split berries at pedicel, leaking juice attracting fruit flies.'],
        recommendedNextAction: 'Schedule harvest labor and sanitize plastic harvest crates.',
        sources: [{ title: 'ICAR-NRC for Grapes', url: 'https://www.nrcgrapes.in/' }],
      },
      {
        id: 'harvest_export',
        stageName: 'Harvesting, Packing & Cold Chain',
        stageNameLocal: { hi: 'कटाई, पैकिंग व कोल्ड चेन', mr: 'काढणी, पॅकिंग व कोल्ड-चेन' },
        dayRange: [121, 140],
        description: 'Morning harvest, field trimming, pre-cooling, grading into corrugated cartons, and export dispatch.',
        whatToDo: [
          'Harvest bunches early morning when field heat is low (stop before 10 AM).',
          'Use sharp shears; hold bunches by pedicel without rubbing natural bloom off berries.',
          'Trim unblemished, loose, or under-sized berries in field packing shed.',
          'Shift to pre-cooling unit within 4–6 hours to pull temperature down to 0–2°C.',
          'Pack in 5 kg corrugated export boxes with SO2 grape guard pads and liner.',
        ],
        whatToMonitor: [
          'Total Soluble Solids (>= 18 °Brix) and berry size (>16 mm).',
          'Cold chain continuity (maintain 0–1°C and 90–95% RH).',
          'Daily European and domestic mandi price quotes.',
        ],
        irrigationGuidance: 'Stop irrigation 3–4 days before harvest to avoid water-turgid berries that crack during transport.',
        israeliPrecisionPractice: 'Cold-chain integration and protective moisture packing to maintain stem freshness and rachis greenness.',
        nutrientGuidance: 'Post-harvest restorative fertilizer after harvest recovery.',
        potentialRisks: ['Rachis browning, transit decay, rejection at export port due to MRL violations.'],
        warningSigns: ['Brown dry stems, berry shatter in boxes.'],
        recommendedNextAction: 'Transfer to refrigerated export reefer containers or sell to domestic premium retail.',
        sources: [
          { title: 'APEDA Market Intelligence', url: 'https://apeda.gov.in/' },
          { title: 'National Horticulture Board' },
        ],
      },
    ],
    harvestAndMarket: {
      harvestIndicators: [
        'Total Soluble Solids (TSS) reaches 16–18 °Brix on refractometer.',
        'Berries turn soft, translucent with characteristic amber shine.',
        'Seeds turn dark brown in seeded varieties; sugar-to-acid ratio reaches pleasant balance.',
      ],
      curingAndDrying: 'Immediate pre-cooling to 0–2°C within 4 hours of harvest; table grapes are not cured/dried unless converting to raisins.',
      gradingAndSorting:
        'Export grade requires uniform berry size (16–18+ mm), free of chemical stains, and intact natural bloom. Domestic grades (A, B) absorb smaller or lightly scarred bunches.',
      storageAdvice:
        'Cold storage at 0°C to 1°C with 90–95% relative humidity using grape guard sheets (metabisulphite) enables 6–8 weeks storage life.',
      sellingStrategy:
        'Export shipping windows (January–April) to Europe and Middle East fetch highest returns; surplus or weather-damaged batches can be converted into raisins to mitigate market price crashes.',
      sources: [
        { title: 'APEDA / ICAR-NRC for Grapes', url: 'https://apeda.gov.in/' },
        { title: 'National Horticulture Board' },
      ],
    },
    israeliTechniques: [
      {
        title: 'Regulated Deficit Irrigation (RDI)',
        details: 'Strategically limits irrigation water during cane maturation and veraison to concentrate sugar accumulation and berry skin firmness.',
        source: 'Indo-Israel Agricultural Cooperation / Netafim',
      },
      {
        title: 'Micro-Canopy Climate Optimization',
        details: 'Trellis training and targeted leaf removal ensure optimal solar radiation while preventing bunch sunburn in arid zones.',
        source: 'Indo-Israeli CoE Best Practices',
      },
    ],
  },

  pomegranate: {
    id: 'pomegranate',
    name: {
      en: 'Pomegranate',
      hi: 'अनार (डाळिंब)',
      mr: 'डाळिंब (Pomegranate)',
    },
    botanicalName: 'Punica granatum',
    icon: '🍎',
    image: '/assets/images/crop_rabi_onion_1789896010271.jpg',
    durationDays: 165,
    suitableSoil: 'Well-drained deep loamy soils, tolerant to light soils, sensitive to water stagnation and saline water.',
    seasons: ['Ambia Bahar (Jan-Feb flowering)', 'Mrig Bahar (Jun-Jul flowering)', 'Hasta Bahar (Sep-Oct flowering)'],
    seedSelection: {
      title: {
        en: 'Step 1: Choose Variety & Tissue Culture Plants',
        hi: 'चरण 1: किस्म एवं रोपण सामग्री चयन',
        mr: 'पायरी १: डाळिंब वाण व रोपे निवड',
      },
      varieties: [
        {
          name: 'Bhagwa (Kesar / Sindhuri)',
          suitableSeason: 'Mrig, Hasta, or Ambia Bahar',
          duration: '160–175 days from fruit set to harvest',
          keyCharacteristics: 'Leading commercial variety in India. Glossy saffron-red skin, soft seeds, deep red sweet arils, and superior international export acceptance.',
          source: 'ICAR-NRC on Pomegranate',
        },
        {
          name: 'Super Bhagwa & Ganesh',
          suitableSeason: 'Mrig / Hasta Bahar',
          duration: '150–165 days',
          keyCharacteristics: 'Vigorous bearing habit, high juice percentage, well-adapted to drought-prone semi-arid peninsular soils.',
          source: 'National Horticulture Board',
        },
      ],
      seedQualityChecklist: [
        'Procure tissue-cultured or air-layered saplings from ICAR-NRCP or accredited nursery.',
        'Saplings must be certified free from Bacterial Blight (nodal blight) and root-knot nematode.',
        'Sturdy root system with active white feeder roots in polybag.',
      ],
      seedTreatment: 'Root dip in biological beneficial bio-fungicides prior to transplanting in orchard pits.',
      beforeYouBuy: [
        '✓ Confirm source nursery disease-free certification',
        '✓ Inspect plants thoroughly for oily nodal leaf spots (blight check)',
        '✓ Verify irrigation water salinity and source reliability',
        '✓ Plan orchard spacing (usually 4.5m x 3m or 4m x 3m)',
      ],
      sources: [
        { title: 'ICAR-NRC on Pomegranate Research Guidelines', url: 'https://nrcpomegranate.icar.gov.in/' },
      ],
    },
    scientificPrinciples: [
      {
        topic: 'irrigation',
        title: 'Moisture Stability & Anti-Cracking',
        titleLocal: { hi: 'नमी स्थिरता व फल फटने से बचाव', mr: 'ओलावा स्थिरता व फळे तडकण्यापासून बचाव' },
        why: 'Erratic watering after a dry spell makes arils swell faster than the rind can stretch, causing violent fruit cracking.',
        whatToDo: 'Maintain uniform root-zone moisture through inline drip laterals; use plastic mulching to cut evaporation.',
        when: 'Throughout fruit enlargement (Days 45 to 130).',
        whatToWatch: 'Dry topsoil alternating with sudden heavy watering; split rind exposing arils.',
      },
      {
        topic: 'pest',
        title: 'Bacterial Blight & Borer Defense',
        titleLocal: { hi: 'तेल्या (बैक्टीरियल ब्लाइट) नियंत्रण', mr: 'तेल्या (बॅक्टेरियल ब्लाइट) व सुरवंट' },
        why: 'Bacterial blight (Xanthomonas) can wipe out entire orchards during humid monsoon spells.',
        whatToDo: 'Maintain strict orchard sanitation; bag fruits with non-woven polypropylene covers.',
        when: 'Post-pruning and humid weather.',
        whatToWatch: 'Oily water-soaked spots with yellow halos on leaves, star-shaped cracks on fruit.',
      },
      {
        topic: 'harvest',
        title: 'Metallic Ringing Sound & Color',
        titleLocal: { hi: 'रंग एवं धातु जैसी ध्वनि', mr: 'गडद रंग व खणखणीत आवाज' },
        why: 'Pomegranate does not ripen after picking; harvesting immature fruit yields pale, sour arils.',
        whatToDo: 'Tap fruit with finger to hear metallic sound; check flattening of basal calyx ridges.',
        when: '160–175 days after flowering.',
        whatToWatch: 'Pale green fruit with hollow thud sound.',
      },
    ],
    stages: [
      {
        id: 'seed_selection',
        stageName: 'Plant Material & Variety Selection',
        stageNameLocal: { hi: 'किस्म व रोपण सामग्री चयन', mr: 'वाण व रोपे निवड' },
        dayRange: [-90, -45],
        description: 'Choosing certified tissue-cultured Bhagwa saplings certified free of bacterial blight.',
        whatToDo: [
          'Select Bhagwa variety for premium domestic and export demand.',
          'Verify nursery accreditation and blight-free certificate.',
          'Prepare pits (60 x 60 x 60 cm) exposed to summer sun sterilization.',
        ],
        whatToMonitor: ['Absence of stem cankers or leaf spots.'],
        irrigationGuidance: 'Ensure reliable drip irrigation pipeline before planting saplings.',
        israeliPrecisionPractice: 'Inline pressure-compensating drippers placed 40 cm from plant base.',
        nutrientGuidance: 'Fill pits with topsoil, FYM, single super phosphate, and neem cake.',
        potentialRisks: ['Infected planting material introducing bacterial blight into clean fields.'],
        warningSigns: ['Oily spots on leaves, stunted root ball in polybag.'],
        recommendedNextAction: 'Proceed to orchard layout and pit transplanting.',
        sources: [{ title: 'ICAR-NRC on Pomegranate', url: 'https://nrcpomegranate.icar.gov.in/' }],
      },
      {
        id: 'bahar_treatment',
        stageName: 'Bahar Treatment & Water Stress',
        stageNameLocal: { hi: 'बहार प्रबंधन एवं जल तनाव', mr: 'बहार व्यवस्थापन व ताण' },
        dayRange: [-45, 0],
        description: 'Withholding irrigation for 35–45 days to induce dormancy, shed old leaves, and trigger flower bud formation.',
        whatToDo: [
          'Choose Bahar (Ambia, Mrig, or Hasta) based on water availability and target market pricing windows.',
          'Withhold irrigation completely for 30–45 days until 50–70% leaves shed.',
          'Perform light pruning of dead wood, water sprouts, and criss-cross branches.',
          'Apply copper-based paste to cut ends to prevent fungal infection.',
        ],
        whatToMonitor: [
          'Leaf shedding percentage (target: 60–70% drop).',
          'Orchard sanitation: collect and burn blighted fallen twigs and leaves.',
        ],
        irrigationGuidance: 'Strict water stress for 35–45 days. Resume irrigation with light watering followed by full drip cycle to break dormancy.',
        israeliPrecisionPractice: 'Scheduled water stress induction: precise timing of moisture withdrawal to trigger synchronous flowering.',
        nutrientGuidance: 'Apply FYM and basal fertilizers in a circular trench beneath the canopy before resuming water.',
        potentialRisks: ['Prolonged rain interrupting water stress; bacterial blight survival on infected wood.'],
        warningSigns: ['Failure of leaves to shed if rains occur; die-back of branches.'],
        recommendedNextAction: 'Resume drip irrigation gradually to trigger simultaneous flowering.',
        sources: [{ title: 'ICAR-NRC on Pomegranate Guidelines', url: 'https://nrcpomegranate.icar.gov.in/' }],
      },
      {
        id: 'flowering_fruit_set',
        stageName: 'Flowering & Fruit Set',
        stageNameLocal: { hi: 'पुष्पन एवं फल निर्धारण', mr: 'फुलधारणा व फळधारणा' },
        dayRange: [1, 45],
        description: 'Emergence of bisexual (hermaphrodite) flowers, insect pollination, and initial fruit set.',
        whatToDo: [
          'Encourage honeybee activity for cross-pollination; avoid toxic insecticide sprays during peak bloom.',
          'Thin out intermediate and male flowers to retain healthy bisexual flowers.',
          'Maintain clean weed-free tree basins.',
        ],
        whatToMonitor: [
          'Ratio of hermaphrodite (vase-shaped) to male (bell-shaped) flowers.',
          'Fruit borer (butterfly) egg laying on calyx.',
          'Bacterial blight oily water-soaked spots on leaves.',
        ],
        irrigationGuidance: 'Provide regular, uniform drip irrigation. Moisture fluctuations during bloom cause severe flower and young fruit drop.',
        israeliPrecisionPractice: 'Inline pressure-compensating drippers (2–4 LPH) positioned 30–50 cm away from tree trunk to keep bark dry and prevent collar rot.',
        nutrientGuidance: 'Split fertigation with balanced NPK and micro-nutrients (Boron, Zinc) as recommended by ICAR-NRCP.',
        potentialRisks: ['Flower drop from sudden over-irrigation or severe dryness; fruit borer attack.'],
        warningSigns: ['Water-soaked oily spots with yellow halo (bacterial blight alert); bored calyx.'],
        recommendedNextAction: 'Inspect young fruitlets; thin out multiple clusters leaving one fruit per spur.',
        sources: [{ title: 'ICAR-NRC on Pomegranate', url: 'https://nrcpomegranate.icar.gov.in/' }],
      },
      {
        id: 'fruit_development',
        stageName: 'Fruit Growth & Aril Development',
        stageNameLocal: { hi: 'फल विकास एवं दाना भराव', mr: 'फळांची वाढ व दाणे भरणे' },
        dayRange: [46, 120],
        description: 'Expansion of fruit rind, aril formation, and juice accumulation.',
        whatToDo: [
          'Bag fruits with non-woven polypropylene or paper bags to protect against sunburn, fruit borer and punctures.',
          'Continue regular fertigation with potassium and calcium to build thick, crack-resistant rinds.',
          'Maintain field sanitation.',
        ],
        whatToMonitor: [
          'Fruit cracking incidence (caused by soil moisture swings).',
          'Sunburn on fruit shoulders exposed to afternoon sun.',
          'Bacterial blight lesions on fruit skin.',
        ],
        irrigationGuidance: 'CRITICAL UNIFORMITY: Never allow soil to dry out between drip cycles. Erratic irrigation after dry spell triggers violent fruit rind cracking.',
        israeliPrecisionPractice: 'Mulching with UV-stabilized plastic film beneath canopy to reduce evaporation by up to 50% and stabilize root-zone moisture.',
        nutrientGuidance: 'High potassium and calcium nitrate fertigation to enhance rind elasticity and aril color.',
        potentialRisks: ['Fruit cracking destroying 30-50% crop; bacterial blight nodal lesions.'],
        warningSigns: ['Split rind exposing arils, deep brown oily star-shaped lesions on rind.'],
        recommendedNextAction: 'Inspect fruit bags; track skin color change from greenish-yellow to deep saffron-red.',
        sources: [
          { title: 'ICAR-NRC on Pomegranate', url: 'https://nrcpomegranate.icar.gov.in/' },
          { title: 'Indo-Israel Agricultural Project' },
        ],
      },
      {
        id: 'maturity_harvest',
        stageName: 'Maturity, Harvesting & Grading',
        stageNameLocal: { hi: 'परिपक्वता, कटाई एवं ग्रेडिंग', mr: 'परिपक्वता, काढणी व प्रतवारी' },
        dayRange: [121, 165],
        description: 'Color development, metallic ringing sound upon tapping, manual harvesting with shears, and grading.',
        whatToDo: [
          'Harvest when fruit rind turns characteristic dark red (Bhagwa variety) and base calyx flattens.',
          'Clip fruit with sharp secateurs close to stem without damaging the fruit crown.',
          'Place fruits gently into cushioned plastic crates; avoid stacking more than 2 layers.',
          'Grade by fruit weight into export, domestic premium, and processing grades.',
        ],
        whatToMonitor: [
          'Fruit weight (Grade Super: >400g, Grade 1: 300–400g, Grade 2: 200–300g).',
          'Skin blemishes, spots, and aril sweetness (TSS > 15 °Brix).',
          'Festival and export market pricing windows.',
        ],
        irrigationGuidance: 'Reduce irrigation frequency slightly 7–10 days before harvest to enhance fruit sugar concentration.',
        israeliPrecisionPractice: 'Cold-chain handling at 5–7°C and 90% RH to prevent rind desiccation and weight loss.',
        nutrientGuidance: 'Zero fertilizer during final ripening.',
        potentialRisks: ['Sun-scald on over-mature fruit; transit bruising.'],
        warningSigns: ['Dull skin, loose crown calyx, internal aril browning.'],
        recommendedNextAction: 'Pack in corrugated boxes for export or dispatch to high-demand festival markets.',
        sources: [
          { title: 'ICAR-NRC on Pomegranate', url: 'https://nrcpomegranate.icar.gov.in/' },
          { title: 'APEDA Market Reports' },
        ],
      },
    ],
    harvestAndMarket: {
      harvestIndicators: [
        'Rind turns rich deep saffron red (Bhagwa variety).',
        'Fruit produces metallic ringing sound when tapped with finger.',
        'The calyx at the fruit base curves inward and flattens; ridges become prominent.',
      ],
      curingAndDrying:
        'Shade cooling in packing shed for 24 hours to remove field heat; avoid washing with water unless treated with safe post-harvest sanitizers.',
      gradingAndSorting:
        'Graded strictly by weight and skin cleanliness: Super (>400g), King (350-400g), Queen (300-350g), Prince (250-300g). Blemished or cracked fruits must be sorted out.',
      storageAdvice:
        'Store at 5°C to 7°C with 90–95% relative humidity in ventilated carton boxes. Shelf life up to 2 months under proper cold chain.',
      sellingStrategy:
        'Synchronize Bahar harvest with festival windows (Diwali) or Middle East/European export windows to capture 30–40% premium rates over local market gluts.',
      sources: [
        { title: 'ICAR-NRC on Pomegranate Market Reports', url: 'https://nrcpomegranate.icar.gov.in/' },
        { title: 'APEDA Market Reports' },
      ],
    },
    israeliTechniques: [
      {
        title: 'Precision Micro-Irrigation & Mulching',
        details: 'Inline drip laterals delivering 2 to 4 LPH per tree with UV plastic mulching to eliminate soil moisture fluctuations, the primary trigger of catastrophic fruit cracking.',
        source: 'Indo-Israel Agricultural Project (IIAP) / Netafim',
      },
      {
        title: 'Bahar Water Stress Induction',
        details: 'Engineered moisture stress scheduling to force synchronous flowering and target high-priced festival market windows.',
        source: 'Indo-Israeli CoE Best Practices',
      },
    ],
  },
};

/**
 * Educational "Learn" Lessons for Farmers
 */
export const KISAN_LEARN_LESSONS: LearnLesson[] = [
  {
    id: 'seed_selection',
    icon: '🌱',
    title: {
      en: 'Seed Selection',
      hi: 'बीज चयन',
      mr: 'बियाणे निवड',
    },
    summary: {
      en: 'How to choose certified, high-yielding, climate-suited varieties.',
      hi: 'प्रमाणित, उच्च उपज और जलवायु-अनुकूल किस्मों का चयन कैसे करें।',
      mr: 'प्रमाणित, भरघोस उत्पादन देणारे व हवामानास अनुकूल वाण कसे निवडावे.',
    },
    keyPoints: [
      'Always look for official certification tags (blue or white tag).',
      'Match variety with sowing season (e.g. Rabi vs Kharif for onion).',
      'Check germination count test date (avoid seed lots older than 1 year).',
      'Choose disease-tolerant hybrids and rootstocks (like Dogridge for grapes).',
    ],
    sourceBasis: 'ICAR & National Seeds Corporation',
  },
  {
    id: 'smart_irrigation',
    icon: '💧',
    title: {
      en: 'Smart Irrigation',
      hi: 'स्मार्ट सिंचाई',
      mr: 'सूक्ष्म व ठिबक सिंचन',
    },
    summary: {
      en: 'Delivering precise water to roots without evaporative waste.',
      hi: 'बिना बर्बादी के सीधे जड़ों तक सटीक पानी पहुंचाना।',
      mr: 'पाण्याचा अपव्यय न करता थेट मुळांशी आवश्यक तेवढेच पाणी देणे.',
    },
    keyPoints: [
      'Pressure-compensating drip laterals save 40–60% water over flood irrigation.',
      'Prevents root asphyxiation and weed proliferation between rows.',
      'Critical windows: Tasseling in maize, bulb expansion in onion, bloom in grapes.',
      'Flush screen and disc filters weekly to prevent emitter clogging.',
    ],
    sourceBasis: 'Indo-Israel Agricultural Project (IIAP)',
  },
  {
    id: 'nutrient_management',
    icon: '🌿',
    title: {
      en: 'Nutrient Management',
      hi: 'पोषक तत्व प्रबंधन',
      mr: 'खत व पोषण व्यवस्थापन',
    },
    summary: {
      en: 'Split-dose fertigation to nourish plants at exact growth milestones.',
      hi: 'पौधों के विकास चरणों के अनुसार घुलनशील उर्वरक प्रबंधन।',
      mr: 'पिकाच्या वाढीच्या टप्प्यानुसार ठिबकद्वारे विद्राव्य खतांचे नियोजन.',
    },
    keyPoints: [
      'Dissolve water-soluble grades (19:19:19, 0:52:34) directly into drip flow.',
      'Split doses prevent nutrient leaching past shallow root zones.',
      'Stop excess nitrogen during bulb formation and fruit ripening.',
      'Always verify exact dosage with your local KVK or soil health card.',
    ],
    sourceBasis: 'Centre of Excellence (CoE) Guidelines',
  },
  {
    id: 'pest_monitoring',
    icon: '🐛',
    title: {
      en: 'Pest Monitoring',
      hi: 'कीट निगरानी',
      mr: 'कीड व रोग निरीक्षण',
    },
    summary: {
      en: 'Early scouting in whorls and leaf undersides before damage spreads.',
      hi: 'नुकसान फैलने से पहले पत्तियों के नीचे और भीतरी भागों की नियमित जांच।',
      mr: 'कीड वाढण्यापूर्वी पानांच्या मागील बाजूस व गाभ्यात नियमित पाहणी.',
    },
    keyPoints: [
      'Scout 20 plants across 5 spots in a zig-zag pattern early morning.',
      'Look for thrips on onion whorls, Fall Armyworm frass on maize.',
      'Inspect grape leaves for downy mildew oil spots after cloudy spells.',
      'Use yellow sticky traps and pheromone traps for early detection.',
    ],
    sourceBasis: 'ICAR Integrated Pest Management (IPM)',
  },
  {
    id: 'weather_risk',
    icon: '🌧',
    title: {
      en: 'Weather & Risk',
      hi: 'मौसम एवं जोखिम',
      mr: 'हवामान व धोका व्यवस्थापन',
    },
    summary: {
      en: 'Shielding crops against unseasonal showers and temperature shocks.',
      hi: 'बेमौसम बारिश और तापमान के उतार-चढ़ाव से फसलों की सुरक्षा।',
      mr: 'अवकाळी पाऊस, गारपीट व तापमानातील बदलांपासून पिकाचे संरक्षण.',
    },
    keyPoints: [
      'Never spray chemicals or apply heavy fertigation right before rain.',
      'Ensure free drainage channels at field margins to evacuate excess water.',
      'Check local IMD / Meghdoot agro-meteorology advisories weekly.',
      'Consider low-cost plastic mulching to buffer root-zone temperatures.',
    ],
    sourceBasis: 'Indian Meteorological Department & ICAR',
  },
  {
    id: 'harvesting',
    icon: '✂️',
    title: {
      en: 'Harvesting',
      hi: 'कटाई प्रबंधन',
      mr: 'काढणी तंत्रज्ञान',
    },
    summary: {
      en: 'Timing harvest at true physiological maturity for maximum market weight.',
      hi: 'सर्वोच्च बाजार मूल्य हेतु पूर्ण परिपक्वता पर सही समय पर कटाई।',
      mr: 'जास्तीत जास्त वजन व गुणवत्तेसाठी पिकाच्या योग्य परिपक्वतेवर काढणी.',
    },
    keyPoints: [
      'Onion: Harvest when 50–70% of tops naturally fall over (neck fall).',
      'Corn: Harvest when black layer appears at kernel base and husk is dry.',
      'Grapes: Test sugar with refractometer (harvest at 16–18 °Brix).',
      'Pomegranate: Tap fruit for metallic ringing sound; clip close to stem.',
    ],
    sourceBasis: 'National Horticulture Board (NHB)',
  },
  {
    id: 'post_harvest',
    icon: '📦',
    title: {
      en: 'Post-Harvest & Storage',
      hi: 'कटाई उपरांत व भंडारण',
      mr: 'काढणीनंतर हाताळणी व साठवणूक',
    },
    summary: {
      en: 'Curing, drying, and ventilated storage to avoid post-harvest rot.',
      hi: 'सुखाई, ग्रेडिंग और हवादार भंडारण द्वारा नुकसान से बचाव।',
      mr: 'योग्य वाळवण, प्रतवारी व हवेशीर साठवणूक करून नासाडी टाळणे.',
    },
    keyPoints: [
      'Dry corn grain below 14% moisture before bagging to stop aflatoxin.',
      'Shade-cure onions in ventilated double-row structures to dry necks.',
      'Pre-cool table grapes within 4 hours to preserve green rachis.',
      'Discard bruised or pest-damaged produce before storing.',
    ],
    sourceBasis: 'National Horticulture Board & NAFED',
  },
  {
    id: 'selling',
    icon: '💰',
    title: {
      en: 'Market Preparation & Selling',
      hi: 'बाजार तैयारी व विपणन',
      mr: 'बाजार नियोजन व विक्री',
    },
    summary: {
      en: 'Size grading, packing, and timing release to capture price premiums.',
      hi: 'ग्रेडिंग, पैकिंग और मौसमी तेजी के अनुसार बाजार में बिक्री।',
      mr: 'प्रतवारी, योग्य पॅकिंग व बाजारपेठेतील तेजी-मंदीनुसार विक्री नियोजन.',
    },
    keyPoints: [
      'Uniform grading (A, B, C size brackets) fetches 20–30% higher mandi rates.',
      'Avoid distress selling during peak harvest arrival gluts.',
      'Use breathable leno mesh bags for onions and clean crates for fruit.',
      'Check local Nashik APMC price prediction trends before dispatching loads.',
    ],
    sourceBasis: 'Ministry of Agriculture Market Intelligence',
  },
];

/**
 * "Check My Crop" Pest & Symptom Diagnosis Database
 */
export const PEST_DIAGNOSIS_DATABASE: PestDiagnosisItem[] = [
  {
    id: 'onion_yellowing',
    cropId: 'onion',
    symptomTitle: {
      en: 'Onion leaves turning yellow or drying from tips',
      hi: 'प्याज की पत्तियां पीली पड़ना या नोक से सूखना',
      mr: 'कांद्याची पाने पिवळी पडणे किंवा शेंड्याकडून सुकणे',
    },
    possibleCauses: [
      'Thrips infestation (sucking sap inside leaf whorls)',
      'Purple blotch / Stemphyllium fungal leaf blight',
      'Root-zone moisture stress or excessive waterlogging in heavy soil',
      'Nitrogen deficiency if older lower leaves show uniform yellowing',
    ],
    whatToObserve: [
      'Part the central leaf whorl: look for tiny yellowish/brown thrips moving inside.',
      'Check leaf surface for silver speckles or oval purple/brown spots.',
      'Inspect root system: check if feeder roots are white and healthy or brown/rotting.',
    ],
    safeNextSteps: [
      'Avoid over-irrigation; allow topsoil to breathe between drip cycles.',
      'Install blue/yellow sticky traps (15–20 per acre) at crop canopy level.',
      'Do not apply random chemical cocktails that scorch leaf tissue.',
    ],
    whenToContactExpert:
      'If yellowing spreads across more than 20% of plants within 3 days, bring a fresh leaf sample to your nearest Krishi Vigyan Kendra (KVK) or government agricultural officer.',
    sourceBasis: 'ICAR-DOGR Integrated Pest & Disease Advisory',
  },
  {
    id: 'corn_shot_holes',
    cropId: 'corn',
    symptomTitle: {
      en: 'Shot holes and sawdust-like frass in maize whorls',
      hi: 'मक्का के पत्तों में छेद एवं बुरादे जैसा मल',
      mr: 'मक्याच्या पानांवर छिद्रे व गाभ्यात लाकडाच्या भुशासारखी विष्ठा',
    },
    possibleCauses: [
      'Fall Armyworm (Spodoptera frugiperda) caterpillar feeding',
      'Maize stem borer (Chilo partellus)',
    ],
    whatToObserve: [
      'Look into central leaf whorl early in morning for live dark caterpillars with distinct Y-shaped mark on head.',
      'Examine underside of upper leaves for fluffy cream-colored egg masses.',
    ],
    safeNextSteps: [
      'Hand-pick and destroy visible egg masses and caterpillars in small plots.',
      'Drop sand mixed with neem cake into central whorls to create physical barrier.',
      'Follow official ICAR-IIMR IPM schedule before caterpillar enters cob.',
    ],
    whenToContactExpert:
      'When more than 10% of plants show active whorl feeding during knee-high stage.',
    sourceBasis: 'ICAR-IIMR Fall Armyworm Management Guidelines',
  },
  {
    id: 'grapes_oil_spots',
    cropId: 'grapes',
    symptomTitle: {
      en: 'Yellow translucent oil spots on upper grape leaves',
      hi: 'अंगूर के पत्तों पर तेल जैसे धब्बे एवं सफेद फफूंद',
      mr: 'द्राक्षाच्या पानांवर तेलासारखे ठिपके व पाठीमागे पांढरी बुरशी',
    },
    possibleCauses: [
      'Downy Mildew (Plasmopara viticola) fungal outbreak triggered by humid cloudy weather',
    ],
    whatToObserve: [
      'Turn leaf over: look for delicate white downy fungal growth directly beneath the oil spot.',
      'Check young flower clusters or tender berry bunches for browning or curvature.',
    ],
    safeNextSteps: [
      'Open vine canopy by tucking shoots and removing dense non-essential leaves to increase sunlight and ventilation.',
      'Avoid overhead sprinkling; rely strictly on ground drip laterals.',
      'Observe strict Pre-Harvest Intervals (PHI) for all plant protection.',
    ],
    whenToContactExpert:
      'Downy mildew spreads within 24 hours of warm rain; consult NRC Grapes advisory immediately.',
    sourceBasis: 'ICAR-NRC for Grapes IPM Protocol',
  },
  {
    id: 'pomegranate_cracking',
    cropId: 'pomegranate',
    symptomTitle: {
      en: 'Pomegranate fruit cracking and splitting open',
      hi: 'अनार के फल फटना एवं दाने बाहर दिखना',
      mr: 'डाळिंबाची फळे तडकणे व दाणे बाहेर पडणे',
    },
    possibleCauses: [
      'Erratic soil moisture swings (heavy watering after prolonged dry spell)',
      'Boron or calcium deficiency causing brittle fruit rinds',
      'Day/night temperature shocks and high sun exposure on fruit shoulders',
    ],
    whatToObserve: [
      'Check whether cracks are longitudinal or star-shaped.',
      'Inspect soil moisture beneath drip lines for uneven wet-dry cycles.',
    ],
    safeNextSteps: [
      'Maintain continuous, uniform drip irrigation; never let the root zone dry out completely during fruit enlargement.',
      'Bag fruits with non-woven polypropylene covers to stabilize skin temperature.',
      'Apply UV plastic mulching to preserve consistent moisture tension.',
    ],
    whenToContactExpert:
      'If cracking occurs alongside oily black spots on rind (indicates bacterial blight co-infection), consult ICAR-NRCP agronomist.',
    sourceBasis: 'ICAR-NRC on Pomegranate Technical Advisory',
  },
];
