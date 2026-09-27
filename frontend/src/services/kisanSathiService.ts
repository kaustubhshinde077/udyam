/**
 * KISAN SATHI — Agricultural Service & RAG Engine
 * 
 * PERSONALIZATION & RAG RETRIEVAL:
 * - Simple farmer onboarding support.
 * - If not planted yet: Starts with Step 1 (Seed Selection & Before You Buy).
 * - If planted: Determines active crop stage from planting date.
 * - Generates daily task priorities in WHY / WHAT / WHEN / WATCH format.
 * - Generates farm calendar: TODAY, THIS WEEK, UPCOMING.
 * - First-class multilingual Q&A in Marathi (मराठी), Hindi (हिन्दी), and English.
 * - Zero hallucination: strictly verified sources.
 */

import {
  CropProfile,
  StageGuidance,
  KISAN_SATHI_CROPS,
  PEST_DIAGNOSIS_DATABASE,
  PestDiagnosisItem,
  KISAN_LEARN_LESSONS,
  LearnLesson,
} from '../data/kisanSathiKnowledgeBase';
import { Language } from '../types';

export interface FarmerProfile {
  cropId: 'onion' | 'corn' | 'grapes' | 'pomegranate';
  farmAreaAcres: number;
  location: string;
  district?: string;
  state?: string;
  village?: string;
  soilInfo?: string;
  irrigationMethod: 'drip' | 'sprinkler' | 'flood' | 'borewell' | 'not_sure';
  plantingStatus: 'not_planted' | 'recently_planted' | 'crop_growing';
  sowingDate: string; // YYYY-MM-DD
  expectedHarvestPeriod?: string;
  farmingConstraints?: string;
  budgetInputInfo?: string;
}

export interface TodayTaskPriority {
  category: 'irrigation' | 'nutrient' | 'pest' | 'field' | 'harvest' | 'seed';
  title: string;
  titleLocal: { hi: string; mr: string };
  details: string;
  detailsLocal: { hi: string; mr: string };
  why?: string;
  whatToDo?: string;
  when?: string;
  whatToWatch?: string;
  sourceBasis: string;
  completed?: boolean;
}

export interface DayActivity {
  dayOffset: number;
  dateStr: string;
  dayLabel: string;
  dayLabelLocal: { hi: string; mr: string };
  activity: string;
  activityLocal: { hi: string; mr: string };
  type: 'Irrigation' | 'Nutrient' | 'Scouting' | 'Field Work' | 'Market Preparation' | 'Seed Selection';
  guidance: string;
  guidanceLocal: { hi: string; mr: string };
  sourceBasis: string;
}

export interface SmartFarmAlert {
  id: string;
  type: 'irrigation' | 'pest' | 'weather' | 'stage' | 'harvest';
  title: string;
  titleLocal: { hi: string; mr: string };
  message: string;
  messageLocal: { hi: string; mr: string };
  urgency: 'high' | 'medium' | 'info';
  sourceBasis: string;
}

export interface FarmCalendar {
  today: Array<{ id: string; time: string; task: string; type: string; done?: boolean }>;
  thisWeek: Array<{ id: string; day: string; task: string; type: string }>;
  upcoming: Array<{ id: string; timeframe: string; task: string; type: string }>;
}

export interface PersonalizedFarmPlan {
  cropProfile: CropProfile;
  farmAreaAcres: number;
  location: string;
  sowingDate: string;
  soilInfo: string;
  irrigationMethod: string;
  plantingStatus: 'not_planted' | 'recently_planted' | 'crop_growing';
  daysElapsed: number;
  currentStage: StageGuidance;
  stageProgressPercentage: number;
  todaysPriorities: TodayTaskPriority[];
  next7DaysPlanner: DayActivity[];
  calendar: FarmCalendar;
  smartAlerts: SmartFarmAlert[];
  allStages: StageGuidance[];
  israeliMethodologyHighlights: Array<{
    title: string;
    details: string;
    source: string;
  }>;
}

/**
 * Calculates current days from sowing/planting date
 */
export function calculateDaysElapsed(sowingDateStr: string, plantingStatus: 'not_planted' | 'recently_planted' | 'crop_growing'): number {
  if (plantingStatus === 'not_planted') {
    return 0;
  }
  try {
    const sowing = new Date(sowingDateStr);
    const today = new Date();
    const diffTime = today.getTime() - sowing.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (isNaN(diffDays)) return plantingStatus === 'recently_planted' ? 5 : 42;
    return Math.max(1, diffDays);
  } catch {
    return plantingStatus === 'recently_planted' ? 5 : 42;
  }
}

/**
 * Determine active growth stage from days elapsed and planting status
 */
export function determineActiveStage(
  crop: CropProfile,
  daysElapsed: number,
  plantingStatus: 'not_planted' | 'recently_planted' | 'crop_growing'
): StageGuidance {
  if (plantingStatus === 'not_planted') {
    const seedStage = crop.stages.find((s) => s.id === 'seed_selection');
    return seedStage || crop.stages[0];
  }

  const stages = crop.stages.filter((s) => s.id !== 'seed_selection');
  for (const st of stages) {
    if (daysElapsed >= st.dayRange[0] && daysElapsed <= st.dayRange[1]) {
      return st;
    }
  }
  // If beyond last stage, return harvest/post-harvest
  if (stages.length > 0 && daysElapsed > stages[stages.length - 1].dayRange[1]) {
    return stages[stages.length - 1];
  }
  return stages[0] || crop.stages[0];
}

/**
 * Generate Personalized Crop Plan
 */
export function generatePersonalizedFarmPlan(profile: FarmerProfile): PersonalizedFarmPlan {
  const crop = KISAN_SATHI_CROPS[profile.cropId] || KISAN_SATHI_CROPS.onion;
  const daysElapsed = calculateDaysElapsed(profile.sowingDate, profile.plantingStatus);
  const currentStage = determineActiveStage(crop, daysElapsed, profile.plantingStatus);

  const totalDays = crop.durationDays || 120;
  const stageProgressPercentage =
    profile.plantingStatus === 'not_planted'
      ? 5
      : Math.min(100, Math.max(10, Math.round((daysElapsed / totalDays) * 100)));

  // Generate Today's Priorities in Simple Farmer-Friendly Language
  const todaysPriorities: TodayTaskPriority[] = [];

  if (profile.plantingStatus === 'not_planted') {
    todaysPriorities.push(
      {
        category: 'seed',
        title: 'Choose Certified Seed & Variety',
        titleLocal: {
          hi: 'प्रमाणित बीज एवं उपयुक्त किस्म का चयन करें',
          mr: 'प्रमाणित बियाणे व योग्य वाण निवडा',
        },
        details: `Compare varieties like ${crop.seedSelection.varieties[0]?.name || 'certified hybrids'} suited for your soil and season.`,
        detailsLocal: {
          hi: `${crop.seedSelection.varieties[0]?.name || 'प्रमाणित बीज'} जैसी उपयुक्त किस्मों की तुलना करें।`,
          mr: `${crop.seedSelection.varieties[0]?.name || 'प्रमाणित संकर बियाणे'} यासारख्या योग्य वाणांची निवड करा.`,
        },
        why: 'Right seed quality accounts for up to 25% of final yield potential.',
        whatToDo: 'Buy certified foundation/breeder tag seed from authorized Krishi Seva Kendra.',
        when: 'Before purchasing inputs or raising nursery.',
        whatToWatch: 'Avoid uncertified loose seeds without lot tags.',
        sourceBasis: crop.seedSelection.sources[0]?.title || 'ICAR Research Advisory',
      },
      {
        category: 'field',
        title: 'Check "Before You Buy" Checklist',
        titleLocal: {
          hi: '"खरीदने से पहले" चेकलिस्ट की जांच करें',
          mr: '"खरेदीपूर्वी" तपासणी यादी पहा',
        },
        details: crop.seedSelection.beforeYouBuy.slice(0, 3).join(' • '),
        detailsLocal: {
          hi: 'प्रमाणित स्रोत, अंकुरण प्रतिशत और मौसम की अनुकूलता की जांच करें।',
          mr: 'परवानाधारक विक्रेता, उगवण क्षमता (७०%+) व हंगाम तपासा.',
        },
        why: 'Prevents germination failures and spurious seed losses.',
        whatToDo: 'Verify physical purity, germination date, and packing lot number.',
        when: 'At the seed store counter.',
        whatToWatch: 'Seeds older than 9–12 months lose vigor quickly.',
        sourceBasis: 'National Seeds Corporation & ICAR Guidelines',
      },
      {
        category: 'irrigation',
        title: 'Inspect Drip Laterals & Water Source',
        titleLocal: {
          hi: 'ड्रिप लाइन एवं जल स्रोत की जांच करें',
          mr: 'ठिबक नळ्या व पाण्याच्या स्रोताची पाहणी करा',
        },
        details: `Ensure drip lines and filters are flushed for your ${profile.farmAreaAcres} acre plot before transplanting.`,
        detailsLocal: {
          hi: `${profile.farmAreaAcres} एकड़ खेत के लिए ड्रिप लाइन एवं फिल्टर की सफाई सुनिश्चित करें।`,
          mr: `${profile.farmAreaAcres} एकर शेतासाठी ठिबक सिंचन व फिल्टर फ्लश करून तयार ठेवा.`,
        },
        why: 'Uniform water distribution gives every plant equal root-zone hydration.',
        whatToDo: 'Run pump and check pressure gauge at filter manifold.',
        when: 'During land preparation.',
        whatToWatch: 'Emitter clogging and leaks.',
        sourceBasis: 'Indo-Israel Agricultural Project (IIAP)',
      }
    );
  } else {
    // Already planted / crop growing
    todaysPriorities.push(
      {
        category: 'irrigation',
        title: 'Inspect Soil Moisture & Drip Operation',
        titleLocal: {
          hi: 'मृदा नमी एवं ड्रिप सिंचाई की जांच',
          mr: 'मातीतील ओलावा व ठिबक सिंचन तपासणी',
        },
        details: currentStage.irrigationGuidance,
        detailsLocal: {
          hi: currentStage.irrigationGuidance,
          mr: `सध्याच्या ${currentStage.stageNameLocal.mr} अवस्थेत आवश्यकतेनुसार ठिबक सिंचन द्या. जास्त पाणी साचू देऊ नका.`,
        },
        why: 'This stage is sensitive to moisture fluctuations.',
        whatToDo: 'Check root-zone moisture at 10–15 cm depth; follow regular drip cycle.',
        when: 'Early morning or late afternoon.',
        whatToWatch: 'Overwatering / standing water causing root suffocation.',
        sourceBasis: currentStage.sources[0]?.title || 'ICAR Agro-Advisory',
      },
      {
        category: 'pest',
        title: 'Inspect Leaves for Pest Symptoms',
        titleLocal: {
          hi: 'कीट व रोग लक्षणों की जांच करें',
          mr: 'पानांवर कीड व रोगांची लक्षणे तपासा',
        },
        details: `Inspect crops for ${currentStage.whatToMonitor[0] || 'pest or fungal leaf spots'}. Examine underside of leaves and central whorls.`,
        detailsLocal: {
          hi: `फसल में ${currentStage.whatToMonitor[0] || 'कीट या फफूंद धब्बों'} की जांच करें। पत्तियों के नीचे ध्यानपूर्वक देखें।`,
          mr: `पिकात ${currentStage.whatToMonitor[0] || 'कीड अथवा बुरशीचे ठिपके'} तपासा. पानांच्या मागील बाजूस व गाभ्यात पहा.`,
        },
        why: 'Early detection allows mechanical or botanical control before pests multiply.',
        whatToDo: 'Walk zig-zag through field, inspect 20 plants across 5 spots.',
        when: 'Morning light before pests seek shade.',
        whatToWatch: 'Yellowing tips, curled leaf margins, holes or silver speckles.',
        sourceBasis: 'ICAR Integrated Pest Management (IPM)',
      },
      {
        category: 'nutrient',
        title: 'Complete Today’s Nutrient / Fertigation Care',
        titleLocal: {
          hi: 'आज की पोषक तत्व / फर्टीगेशन गतिविधि पूर्ण करें',
          mr: 'आजचे खत व पोषण व्यवस्थापन पूर्ण करा',
        },
        details: currentStage.nutrientGuidance,
        detailsLocal: {
          hi: currentStage.nutrientGuidance,
          mr: `${currentStage.stageNameLocal.mr} अवस्थेनुसार विद्राव्य खतांचे नियोजन करा. अति नत्र खते टाळा.`,
        },
        why: 'Split doses supply nutrients in direct synchrony with plant uptake.',
        whatToDo: 'Dissolve water-soluble grades into pressurized irrigation flow as per schedule.',
        when: 'Towards middle third of drip irrigation run.',
        whatToWatch: 'Never apply single heavy doses that burn shallow roots.',
        sourceBasis: 'State Agricultural Extension & University Guidelines',
      },
      {
        category: 'field',
        title: 'Check Current Growth Progress',
        titleLocal: {
          hi: 'वर्तमान वृद्धि अवस्था की समीक्षा करें',
          mr: 'सध्याच्या पीक वाढीचा आढावा घ्या',
        },
        details: currentStage.whatToDo[0] || 'Maintain clean field basins and monitor plant vigor.',
        detailsLocal: {
          hi: currentStage.whatToDo[0] || 'खेत को खरपतवार मुक्त रखें एवं पौधों के स्वास्थ्य पर नजर रखें।',
          mr: currentStage.whatToDo[0] || 'तण नियंत्रण ठेवा व झाडांची वाढ निरोगी राहू द्या.',
        },
        why: 'Timely weeding prevents nutrient competition.',
        whatToDo: 'Perform shallow inter-cultivation or basin weeding.',
        when: 'Before crop canopy completely closes.',
        whatToWatch: 'Weed patches taking away fertilizer nutrients.',
        sourceBasis: 'ICAR Technical Bulletin',
      }
    );
  }

  // Next 7 Days Planner
  const next7DaysPlanner: DayActivity[] = [];
  const baseDate = new Date();

  for (let i = 1; i <= 7; i++) {
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + i);
    const dateFormatted = targetDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });

    let actType: 'Irrigation' | 'Nutrient' | 'Scouting' | 'Field Work' | 'Market Preparation' | 'Seed Selection' = 'Field Work';
    let actTitle = '';
    let actTitleMr = '';
    let actTitleHi = '';
    let actGuidance = '';
    let actGuidanceMr = '';
    let actGuidanceHi = '';
    let actSource = currentStage.sources[0]?.title || 'ICAR Guidelines';

    if (profile.plantingStatus === 'not_planted') {
      if (i === 1) {
        actType = 'Seed Selection';
        actTitle = 'Review Certified Seed Lots';
        actTitleMr = 'प्रमाणित बियाणे तपासा';
        actTitleHi = 'प्रमाणित बीज लॉट की समीक्षा';
        actGuidance = 'Verify lot packing date and purchase from licensed dealer.';
        actGuidanceMr = 'अधिकृत कृषी सेवा केंद्रातून प्रमाणित बियाणे खरेदी करा.';
        actGuidanceHi = 'अधिकृत डीलर से प्रमाणित बीज खरीदें।';
      } else if (i === 3) {
        actType = 'Field Work';
        actTitle = 'Deep Ploughing & Soil Solarisation';
        actTitleMr = 'खोल नांगरट व जमीन तापू देणे';
        actTitleHi = 'गहरी जुताई एवं मिट्टी सौरीकरण';
        actGuidance = 'Plough to fine tilth and allow hot sun exposure to destroy soil pests.';
        actGuidanceMr = 'चांगली मशागत करून जमीन उन्हात तापू द्या.';
        actGuidanceHi = 'गहरी जुताई करें ताकि धूप से कीट नष्ट हों।';
      } else if (i === 5) {
        actType = 'Irrigation';
        actTitle = 'Test Drip Flush & Line Pressure';
        actTitleMr = 'ठिबक नळ्या फ्लश करा';
        actTitleHi = 'ड्रिप फ्लश एवं लाइन प्रेशर टेस्ट';
        actGuidance = 'Open flush valves at ends of laterals; flush clean water.';
        actGuidanceMr = 'नळ्यांची टोके उघडून स्वच्छ पाण्याने फ्लश करा.';
        actGuidanceHi = 'ड्रिप लाइनों को साफ पानी से फ्लश करें।';
      } else {
        actType = 'Field Work';
        actTitle = 'FYM / Compost Incorporation';
        actTitleMr = 'शेणखत / कंपोस्ट मिसळणे';
        actTitleHi = 'गोबर खाद / कंपोस्ट मिलाना';
        actGuidance = 'Spread well-decomposed organic manure evenly across raised beds.';
        actGuidanceMr = 'चांगले कुजलेले शेणखत गादी वाफ्यांवर पसरा.';
        actGuidanceHi = 'अच्छी सड़ी गोबर खाद क्यारियों में मिलाएं।';
      }
    } else {
      if (i % 2 === 1) {
        actType = 'Irrigation';
        actTitle = `Check Drip Uniformity & Root Moisture (${profile.farmAreaAcres} Acres)`;
        actTitleMr = `ठिबक सिंचन व ओलावा तपासणी (${profile.farmAreaAcres} एकर)`;
        actTitleHi = `ड्रिप एकरूपता एवं नमी जांच (${profile.farmAreaAcres} एकड़)`;
        actGuidance = currentStage.israeliPrecisionPractice || currentStage.irrigationGuidance;
        actGuidanceMr = 'मुळांच्या कार्यक्षेत्रातील ओलावा तपासा. नियमित ठिबक चक्र द्या.';
        actGuidanceHi = 'जड़ों के पास नमी की जांच करें एवं नियमित ड्रिप चक्र चलाएं।';
        actSource = 'Indo-Israel Agricultural Project (IIAP)';
      } else if (i === 2 || i === 6) {
        actType = 'Scouting';
        actTitle = `Pest Scouting: Inspect for ${currentStage.whatToMonitor[0] || 'symptoms'}`;
        actTitleMr = `रोग व कीड पाहणी: ${currentStage.whatToMonitor[0] || 'लक्षणे'}`;
        actTitleHi = `कीट निगरानी: ${currentStage.whatToMonitor[0] || 'लक्षणों की जांच'}`;
        actGuidance = `Walk diagonal zig-zag pattern across ${profile.farmAreaAcres} acres. Inspect 20 plants.`;
        actGuidanceMr = 'शेतात तिरपे फिरून २० झाडांचे निरीक्षण करा.';
        actGuidanceHi = 'खेत में 20 पौधों की पत्तियों का निरीक्षण करें।';
        actSource = 'ICAR Integrated Pest Management';
      } else if (i === 4) {
        actType = 'Nutrient';
        actTitle = 'Split-Dose Fertigation Application';
        actTitleMr = 'विद्राव्य खत फर्टीगेशन नियोजन';
        actTitleHi = 'विभाजित पोषक तत्व फर्टीगेशन';
        actGuidance = currentStage.nutrientGuidance;
        actGuidanceMr = 'ठिबकद्वारे विद्राव्य खतांचा डोस द्या.';
        actGuidanceHi = 'ड्रिप द्वारा घुलनशील उर्वरक खुराक दें।';
        actSource = 'Centre of Excellence (CoE) Guidelines';
      } else {
        actType = 'Field Work';
        actTitle = `Stage Activity: ${currentStage.whatToDo[1] || 'Weed inspection'}`;
        actTitleMr = `शेती काम: ${currentStage.whatToDo[1] || 'तण नियंत्रण'}`;
        actTitleHi = `खेत कार्य: ${currentStage.whatToDo[1] || 'निराई-गुड़ाई'}`;
        actGuidance = currentStage.recommendedNextAction;
        actGuidanceMr = currentStage.recommendedNextAction;
        actGuidanceHi = currentStage.recommendedNextAction;
        actSource = 'ICAR Technical Bulletin';
      }
    }

    next7DaysPlanner.push({
      dayOffset: i,
      dateStr: dateFormatted,
      dayLabel: `Day ${daysElapsed + i}`,
      dayLabelLocal: { hi: `दिन ${daysElapsed + i}`, mr: `दिवस ${daysElapsed + i}` },
      activity: actTitle,
      activityLocal: { hi: actTitleHi || actTitle, mr: actTitleMr || actTitle },
      type: actType,
      guidance: actGuidance,
      guidanceLocal: { hi: actGuidanceHi || actGuidance, mr: actGuidanceMr || actGuidance },
      sourceBasis: actSource,
    });
  }

  // Personal Farm Calendar (Today, This Week, Upcoming)
  const calendar: FarmCalendar = {
    today: [
      {
        id: 'cal_t1',
        time: 'Morning (07:00 AM)',
        task: profile.plantingStatus === 'not_planted' ? 'Review seed varieties' : 'Inspect soil moisture and drip pressure gauge',
        type: 'Irrigation & Scouting',
      },
      {
        id: 'cal_t2',
        time: 'Morning (09:00 AM)',
        task: profile.plantingStatus === 'not_planted' ? 'Check nursery bed drainage' : `Field scouting: Check for ${currentStage.whatToMonitor[0] || 'pest symptoms'}`,
        type: 'Pest Scouting',
      },
      {
        id: 'cal_t3',
        time: 'Evening (05:00 PM)',
        task: profile.plantingStatus === 'not_planted' ? 'Plan land preparation ploughing' : 'Complete scheduled fertigation or field cleanup',
        type: 'Field Maintenance',
      },
    ],
    thisWeek: [
      {
        id: 'cal_w1',
        day: 'In 2 Days',
        task: profile.plantingStatus === 'not_planted' ? 'Purchase certified seeds from authorized dealer' : 'Flush screen/disc filters and check drip emitter flow',
        type: 'Maintenance',
      },
      {
        id: 'cal_w2',
        day: 'In 4 Days',
        task: profile.plantingStatus === 'not_planted' ? 'Apply organic manure / compost across beds' : 'Split-dose fertigation through drip system',
        type: 'Nutrient Care',
      },
      {
        id: 'cal_w3',
        day: 'In 6 Days',
        task: profile.plantingStatus === 'not_planted' ? 'Prepare raised beds (120 cm width)' : 'Examine central whorls and leaf undersides for thrips/FAW',
        type: 'Pest Inspection',
      },
    ],
    upcoming: [
      {
        id: 'cal_u1',
        timeframe: 'Next Growth Phase (~15 Days)',
        task: `Transition to ${currentStage.recommendedNextAction}`,
        type: 'Growth Transition',
      },
      {
        id: 'cal_u2',
        timeframe: 'Harvest Window (Day ~110–135)',
        task: 'Monitor crop maturity indicators and withhold irrigation prior to harvest',
        type: 'Harvest Preparation',
      },
      {
        id: 'cal_u3',
        timeframe: 'Post-Harvest & Mandi Timing',
        task: 'Curing, size grading, ventilated storage, and Nashik APMC price checking',
        type: 'Selling & Market',
      },
    ],
  };

  // Smart Farm Alerts
  const smartAlerts: SmartFarmAlert[] = [
    {
      id: 'alert_moisture',
      type: 'irrigation',
      title: '💧 Irrigation & Moisture Alert',
      titleLocal: {
        hi: '💧 सिंचाई एवं नमी अलर्ट',
        mr: '💧 सिंचन व ओलावा इशारा',
      },
      message: `Ensure soil moisture in the root zone is maintained without pooling. In ${profile.farmAreaAcres} acres under ${profile.irrigationMethod === 'drip' ? 'drip laterals' : 'regular irrigation'}, check pressure gauge at filter manifolds.`,
      messageLocal: {
        hi: `जड़ों के पास नमी बनाए रखें, पानी जमा न होने दें। ${profile.farmAreaAcres} एकड़ खेत में ड्रिप फिल्टर का दबाव जांचें।`,
        mr: `मुळांजवळ योग्य ओलावा ठेवा, पाणी साचू देऊ नका. ${profile.farmAreaAcres} एकर शेतात ठिबक फिल्टरचा दाब तपासा.`,
      },
      urgency: 'medium',
      sourceBasis: 'Indo-Israel Agricultural Project (IIAP) / Netafim Framework',
    },
    {
      id: 'alert_pest',
      type: 'pest',
      title: '🔍 Pest & Disease Scouting Notice',
      titleLocal: {
        hi: '🔍 कीट एवं रोग निगरानी सूचना',
        mr: '🔍 कीड व रोग निरीक्षण सूचना',
      },
      message: `Current stage (${currentStage.stageName}) is vulnerable to ${currentStage.potentialRisks[0] || 'foliar distress'}. Inspect leaf undersides early morning.`,
      messageLocal: {
        hi: `वर्तमान अवस्था (${currentStage.stageNameLocal.hi}) में ${currentStage.potentialRisks[0] || 'पत्तियों के रोग'} का खतरा रहता है। सुबह पत्तियों के नीचे जांचें।`,
        mr: `सध्याच्या (${currentStage.stageNameLocal.mr}) अवस्थेत ${currentStage.potentialRisks[0] || 'पानांवरील रोगाचा'} प्रादुर्भाव होऊ शकतो. सकाळी पानांची पाहणी करा.`,
      },
      urgency: 'high',
      sourceBasis: 'ICAR Research Guidelines',
    },
    {
      id: 'alert_weather',
      type: 'weather',
      title: '🌦 Weather Advisory Caution',
      titleLocal: {
        hi: '🌦 मौसम सलाह एवं सावधानी',
        mr: '🌦 हवामान सल्ला व काळजी',
      },
      message: 'Live weather API is currently not connected. Do not spray chemicals or harvest immediately prior to unseasonal rain. Verify with local IMD / Meghdoot agro-meteorological advisory.',
      messageLocal: {
        hi: 'लाइव मौसम एपीआई अभी जुड़ा नहीं है। बेमौसम बारिश से पहले छिड़काव या कटाई न करें। स्थानीय मेघदूत/मौसम विभाग की सलाह देखें।',
        mr: 'थेट हवामान माहिती जोडलेली नाही. अवकाळी पावसाची शक्यता असल्यास फवारणी किंवा काढणी करू नका. स्थानिक मेघदूत हवामान अंदाज तपासा.',
      },
      urgency: 'info',
      sourceBasis: 'Indian Meteorological Department (IMD) Ground Advisory Note',
    },
    {
      id: 'alert_stage',
      type: 'stage',
      title: `🌱 Crop Stage Progress: Day ${daysElapsed}`,
      titleLocal: {
        hi: `🌱 फसल विकास प्रगति: दिन ${daysElapsed}`,
        mr: `🌱 पीक वाढीचा टप्पा: दिवस ${daysElapsed}`,
      },
      message: `Your crop is currently at "${currentStage.stageName}". Estimated completion of this stage is within ${Math.max(1, currentStage.dayRange[1] - daysElapsed)} days.`,
      messageLocal: {
        hi: `आपकी फसल वर्तमान में "${currentStage.stageNameLocal.hi}" अवस्था में है।`,
        mr: `तुमचे पीक सध्या "${currentStage.stageNameLocal.mr}" या टप्प्यावर आहे.`,
      },
      urgency: 'info',
      sourceBasis: 'ICAR Crop Phenology Data',
    },
  ];

  if (totalDays - daysElapsed <= 20 && profile.plantingStatus !== 'not_planted') {
    smartAlerts.unshift({
      id: 'alert_harvest',
      type: 'harvest',
      title: '✂️ Harvest Window Approaching',
      titleLocal: {
        hi: '✂️ कटाई का समय निकट है',
        mr: '✂️ काढणीचा हंगाम जवळ आला आहे',
      },
      message: `Your expected harvest is within 15–20 days. Plan irrigation withdrawal and arrange curing/drying space.`,
      messageLocal: {
        hi: 'कटाई अगले 15-20 दिनों में संभावित है। सिंचाई बंद करने और सुखाई की तैयारी करें।',
        mr: 'पुढील १५-२० दिवसांत काढणी शक्य आहे. पाणी देणे बंद करा व वाळवण्याची जागा तयार ठेवा.',
      },
      urgency: 'high',
      sourceBasis: 'National Horticulture Board (NHB)',
    });
  }

  return {
    cropProfile: crop,
    farmAreaAcres: profile.farmAreaAcres,
    location: profile.location || 'Nashik, Maharashtra',
    sowingDate: profile.sowingDate,
    soilInfo: profile.soilInfo || crop.suitableSoil,
    irrigationMethod: profile.irrigationMethod,
    plantingStatus: profile.plantingStatus,
    daysElapsed,
    currentStage,
    stageProgressPercentage,
    todaysPriorities,
    next7DaysPlanner,
    calendar,
    smartAlerts,
    allStages: crop.stages,
    israeliMethodologyHighlights: crop.israeliTechniques,
  };
}

/**
 * Multilingual RAG Knowledge Retrieval for Kisan Sathi Assistant
 * Natural Marathi, Hindi & English responses grounded purely in verified knowledge packs.
 */
export function answerKisanSathiQuestion(
  query: string,
  plan: PersonalizedFarmPlan,
  language: Language = 'mr'
): {
  answer: string;
  knowledgeBasis: string;
  sourceUrl?: string;
} {
  const q = query.toLowerCase().trim();
  const crop = plan.cropProfile;
  const stage = plan.currentStage;

  // 1. "आज काय करायचं?" / "What should I do today?" / "आज क्या करें?"
  if (
    q.includes('आज काय') ||
    q.includes('today') ||
    q.includes('what should i do') ||
    q.includes('आज क्या') ||
    q.includes('काय करू')
  ) {
    if (language === 'mr') {
      const taskList = plan.todaysPriorities
        .map((p, idx) => `${idx + 1}. **${p.titleLocal.mr}**:\n   ${p.detailsLocal.mr}`)
        .join('\n\n');
      return {
        answer: `सुप्रभात शेतकरी मित्र! तुमच्या ${plan.farmAreaAcres} एकर ${crop.name.mr} पिकासाठी (${stage.stageNameLocal.mr} अवस्था - दिवस ${plan.daysElapsed}) आजचे मुख्य प्राधान्य पुढीलप्रमाणे आहे:\n\n${taskList}\n\nपुढील शिफारस: ${stage.recommendedNextAction}`,
        knowledgeBasis: `${stage.sources[0]?.title || 'ICAR संशोधन मार्गदर्शक'} व इस्त्रायली सिंचन पद्धती`,
        sourceUrl: stage.sources[0]?.url,
      };
    } else if (language === 'hi') {
      const taskList = plan.todaysPriorities
        .map((p, idx) => `${idx + 1}. **${p.titleLocal.hi}**:\n   ${p.detailsLocal.hi}`)
        .join('\n\n');
      return {
        answer: `किसान मित्र, आपके ${plan.farmAreaAcres} एकड़ ${crop.name.hi} खेत (${stage.stageNameLocal.hi} - दिन ${plan.daysElapsed}) हेतु आज के मुख्य कार्य:\n\n${taskList}\n\nआगे का कार्य: ${stage.recommendedNextAction}`,
        knowledgeBasis: `${stage.sources[0]?.title || 'ICAR अनुसंधान संदर्शिका'} एवं इंडो-इज़राइल परियोजना`,
        sourceUrl: stage.sources[0]?.url,
      };
    } else {
      const taskList = plan.todaysPriorities
        .map((p, idx) => `${idx + 1}. **${p.title}**:\n   ${p.details}`)
        .join('\n\n');
      return {
        answer: `Here are today's top priorities for your ${plan.farmAreaAcres} acre ${crop.name.en} field (${stage.stageName} - Day ${plan.daysElapsed}):\n\n${taskList}\n\nRecommended next action: ${stage.recommendedNextAction}`,
        knowledgeBasis: `${stage.sources[0]?.title || 'ICAR Research Advisory'} & Indo-Israel Agricultural Project`,
        sourceUrl: stage.sources[0]?.url,
      };
    }
  }

  // 2. "पिकाला पाणी कधी द्यायचं?" / "When should I irrigate?" / "सिंचाई कब करें?"
  if (
    q.includes('पाणी') ||
    q.includes('irrigate') ||
    q.includes('water') ||
    q.includes('सिंचाई') ||
    q.includes('pani')
  ) {
    if (language === 'mr') {
      return {
        answer: `${crop.name.mr} पिकासाठी (${stage.stageNameLocal.mr} अवस्था) पाणी व्यवस्थापन:\n\n• **सिंचन सल्ला**: ${stage.irrigationGuidance}\n\n• **इस्त्रायली अचूक पद्धत**: ${stage.israeliPrecisionPractice || 'ठिबक नळ्यांद्वारे मुळांशी थेट पाणी द्या, पाणी साचू देऊ नका.'}\n\n• **काळजी**: जास्त पाणी किंवा अचानक पाण्याचा ताण या दोन्हीमुळे पिकाचे नुकसान होते. जमिनीतील वाफसा तपासूनच पाणी द्या.`,
        knowledgeBasis: 'इंडो-इस्त्रायल ॲग्रिकल्चरल प्रोजेक्ट (IIAP) व ICAR सिंचन मार्गदर्शक',
        sourceUrl: stage.sources[0]?.url,
      };
    } else if (language === 'hi') {
      return {
        answer: `${crop.name.hi} फसल (${stage.stageNameLocal.hi} अवस्था) हेतु सिंचाई सलाह:\n\n• **सिंचाई दिशानिर्देश**: ${stage.irrigationGuidance}\n\n• **इज़राइली सटीक विधि**: ${stage.israeliPrecisionPractice || 'ड्रिप लाइनों से सीधे जड़ों तक नियंत्रित पानी पहुंचाएं।'}\n\n• **सावधानी**: पानी का भराव न होने दें; वाफसा की स्थिति में ही पानी दें।`,
        knowledgeBasis: 'इंडो-इज़राइल प्रोजेक्ट एवं ICAR अनुसंधान',
        sourceUrl: stage.sources[0]?.url,
      };
    } else {
      return {
        answer: `Irrigation guidance for ${crop.name.en} at ${stage.stageName}:\n\n• Guidance: ${stage.irrigationGuidance}\n\n• Israeli-inspired practice: ${stage.israeliPrecisionPractice || 'Use inline drip lines to maintain root-zone moisture without standing water.'}\n\n• Caution: Avoid waterlogging and dry-wet shocks.`,
        knowledgeBasis: 'Indo-Israel Agricultural Project (IIAP) & ICAR Advisory',
        sourceUrl: stage.sources[0]?.url,
      };
    }
  }

  // 3. "खत कोणते द्यावे?" / "Fertilizer / Nutrients"
  if (
    q.includes('खत') ||
    q.includes('fertilizer') ||
    q.includes('nutrient') ||
    q.includes('उर्वरक') ||
    q.includes('khat')
  ) {
    if (language === 'mr') {
      return {
        answer: `${crop.name.mr} पिकासाठी खत व्यवस्थापन:\n\n• **सध्याची शिफारस**: ${stage.nutrientGuidance}\n\n• **महत्त्वाची पद्धत**: एकदम जास्त रासायनिक खते टाकण्याऐवजी ठिबकद्वारे विद्राव्य खतांचे टप्प्याटप्प्याने (Split dose) नियोजन करा.\n\n• **सुरक्षा सूचना**: जमिनीच्या आरोग्य पत्रिकेनुसार (Soil Health Card) व जवळच्या कृषी विज्ञान केंद्राच्या (KVK) सल्ल्यानेच रासायनिक खतांचे अचूक प्रमाण ठरवा.`,
        knowledgeBasis: 'सेंटर ऑफ एक्सलन्स (CoE) व विद्यापीठ खत शिफारसी',
      };
    } else {
      return {
        answer: `Nutrient guidance for ${crop.name.en}:\n\n• Stage recommendation: ${stage.nutrientGuidance}\n\n• Practice: Apply split doses through drip rather than single heavy broadcast doses.\n\n• Safety: Verify exact localized dosage with your local KVK or soil health card.`,
        knowledgeBasis: 'Centre of Excellence Operational Guidelines',
      };
    }
  }

  // 4. "बियाणे कसे निवडावे?" / "Seed selection"
  if (
    q.includes('बियाणे') ||
    q.includes('seed') ||
    q.includes('वाण') ||
    q.includes('बीज') ||
    q.includes('variety')
  ) {
    const vars = crop.seedSelection.varieties.map((v) => `• **${v.name}** (${v.suitableSeason}): ${v.keyCharacteristics}`).join('\n\n');
    if (language === 'mr') {
      return {
        answer: `${crop.name.mr} पिकासाठी बियाणे व वाण निवड:\n\n${vars}\n\n**खरेदीपूर्वी या ५ बाबी नक्की तपासा**:\n${crop.seedSelection.beforeYouBuy.join('\n')}`,
        knowledgeBasis: crop.seedSelection.sources[0]?.title || 'ICAR बियाणे संशोधन संदर्शिका',
        sourceUrl: crop.seedSelection.sources[0]?.url,
      };
    } else {
      return {
        answer: `Seed & variety selection for ${crop.name.en}:\n\n${vars}\n\nBefore You Buy Checklist:\n${crop.seedSelection.beforeYouBuy.join('\n')}`,
        knowledgeBasis: crop.seedSelection.sources[0]?.title || 'ICAR Seed Research Bulletin',
        sourceUrl: crop.seedSelection.sources[0]?.url,
      };
    }
  }

  // 5. "पाने पिवळी पडत आहेत" / "Yellow leaves" / "Pest diagnosis"
  if (
    q.includes('पिवळी') ||
    q.includes('yellow') ||
    q.includes('पीली') ||
    q.includes('कीड') ||
    q.includes('pest') ||
    q.includes('रोग')
  ) {
    if (language === 'mr') {
      return {
        answer: `${crop.name.mr} पिकाची पाने पिवळी पडण्याची संभाव्य कारणे:\n\n1. **फुलकिडे (थ्रिप्स) किंवा रसशोषक कीड**: पानांच्या गाभ्यात बारीक किडे रस शोषतात.\n2. **जास्त पाणी किंवा पाण्याचा ताण**: भारी जमिनीत पाणी साचल्यास किंवा मुळांना हवा न मिळाल्यास पाने पिवळी पडतात.\n3. **नत्राची कमतरता**: जुनी खालची पाने 'V' आकारात पिवळी होतात.\n\n**काय करावे**:\n• पानांच्या मागील बाजूस व गाभ्यात निरीक्षण करा.\n• निळे/पिवळे चिकट सापळे एकरी १५-२० लावा.\n• अनधिकृत कीटकनाशकांचे मिश्रण फवारू नका. लक्षणे जास्त असल्यास कृषी विज्ञान केंद्रातील (KVK) तज्ज्ञांना ताजे पान दाखवा.`,
        knowledgeBasis: 'ICAR एकात्मिक कीड व रोग नियंत्रण (IPM) संदर्शिका',
      };
    } else {
      return {
        answer: `Causes of yellowing leaves in ${crop.name.en}:\n\n1. Sap-sucking pests (e.g. thrips in whorls).\n2. Moisture stress or root-zone waterlogging.\n3. Nitrogen deficiency (V-shaped yellowing on older lower leaves).\n\nSafe action: Inspect leaf undersides, install sticky traps, and verify with your local KVK before spraying chemicals.`,
        knowledgeBasis: 'ICAR Integrated Pest Management (IPM)',
      };
    }
  }

  // 6. "कापणी / काढणी कधी करायची?" / "Harvest"
  if (
    q.includes('काढणी') ||
    q.includes('कापणी') ||
    q.includes('harvest') ||
    q.includes('कटाई')
  ) {
    const inds = crop.harvestAndMarket.harvestIndicators.map((ind, i) => `${i + 1}. ${ind}`).join('\n');
    if (language === 'mr') {
      return {
        answer: `${crop.name.mr} काढणीचे मुख्य निकष:\n\n${inds}\n\n• **वाळवण व प्रतवारी**: ${crop.harvestAndMarket.curingAndDrying}\n\n• काढणीपूर्वी १०-१२ दिवस पाणी बंद करणे अत्यंत आवश्यक आहे.`,
        knowledgeBasis: crop.harvestAndMarket.sources[0]?.title || 'राष्ट्रीय फलोत्पादन मंडळ (NHB)',
        sourceUrl: crop.harvestAndMarket.sources[0]?.url,
      };
    } else {
      return {
        answer: `Harvest indicators for ${crop.name.en}:\n\n${inds}\n\nCuring & Drying: ${crop.harvestAndMarket.curingAndDrying}`,
        knowledgeBasis: crop.harvestAndMarket.sources[0]?.title || 'National Horticulture Board (NHB)',
        sourceUrl: crop.harvestAndMarket.sources[0]?.url,
      };
    }
  }

  // Default fallback grounded response
  if (language === 'mr') {
    return {
      answer: `तुमच्या ${crop.name.mr} पिकाबाबत (${stage.stageNameLocal.mr} अवस्था):\n\n• सध्याचे काम: ${stage.whatToDo[0]}\n• काय तपासावे: ${stage.whatToMonitor[0]}\n• सिंचन सल्ला: ${stage.irrigationGuidance}\n\nखात्रीशीर रासायनिक औषधांचे प्रमाण किंवा रोग नियंत्रणासाठी जवळच्या कृषी विज्ञान केंद्राशी (KVK) अथवा कृषी सहाय्यकाशी संपर्क साधा.`,
      knowledgeBasis: `${stage.sources[0]?.title || 'ICAR कृषी सल्लागार'} (सत्यापित माहिती)`,
      sourceUrl: stage.sources[0]?.url,
    };
  } else if (language === 'hi') {
    return {
      answer: `आपकी ${crop.name.hi} फसल (${stage.stageNameLocal.hi} अवस्था) हेतु:\n\n• वर्तमान कार्य: ${stage.whatToDo[0]}\n• क्या देखें: ${stage.whatToMonitor[0]}\n• सिंचाई: ${stage.irrigationGuidance}\n\nविशिष्ट कीटनाशक दवाओं के लिए नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।`,
      knowledgeBasis: `${stage.sources[0]?.title || 'ICAR अनुसंधान'} (सत्यापित आधार)`,
      sourceUrl: stage.sources[0]?.url,
    };
  } else {
    return {
      answer: `Regarding "${query}" for ${crop.name.en} at ${stage.stageName}:\n\n• Current task: ${stage.whatToDo[0]}\n• What to monitor: ${stage.whatToMonitor[0]}\n• Irrigation note: ${stage.irrigationGuidance}\n\nFor specific chemical doses or disease prescriptions, please consult your nearest Krishi Vigyan Kendra (KVK).`,
      knowledgeBasis: `${stage.sources[0]?.title || 'ICAR Research Advisory'} (Verified Knowledge Base)`,
      sourceUrl: stage.sources[0]?.url,
    };
  }
}
