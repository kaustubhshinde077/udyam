export type RespondentType =
  | 'Farmer'
  | 'Customer'
  | 'Local resident'
  | 'Shopkeeper'
  | 'Trader'
  | 'Other';

export type AgeGroup = 'Under 18' | '18–25' | '26–40' | '41–60' | '60+';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type RelationshipType =
  | 'Potential customer'
  | 'Existing customer'
  | 'Farmer'
  | 'Supplier'
  | 'Local resident'
  | 'Other';

export type QuestionType = 'multiple_choice' | 'yes_no' | 'rating' | 'text';

export interface SurveyQuestion {
  id: string;
  questionText: string;
  type: QuestionType;
  options: string[];
  category?: string;
  helperText?: string;
}

export interface CommunitySurvey {
  id: string;
  title: string;
  activityTitle: string;
  businessCategory: string;
  isFarmer: boolean;
  cropName?: string;
  village: string;
  district: string;
  state: string;
  createdAt: string;
  questions: SurveyQuestion[];
  status: 'active' | 'closed';
}

export interface SurveyRespondentInfo {
  respondentType: RespondentType;
  village: string;
  ageGroup: AgeGroup;
  gender?: Gender;
  relationship: RelationshipType;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  submittedAt: string;
  respondent: SurveyRespondentInfo;
  answers: Record<string, string | number>;
  consentGiven: boolean;
}

export interface QuestionSummary {
  questionId: string;
  questionText: string;
  type: QuestionType;
  totalAnswers: number;
  optionCounts: Record<string, number>;
  averageRating?: number;
  topAnswer?: string;
  topPercentage?: number;
}

export interface SurveyAnalytics {
  totalResponses: number;
  respondentTypeBreakdown: Record<RespondentType, number>;
  relationshipBreakdown: Record<RelationshipType, number>;
  questionSummaries: QuestionSummary[];
  averageRatingOverall?: number;
  purchaseIntentPercentage?: number;
  recentResponses: SurveyResponse[];
}

const STORAGE_PREFIX = 'arth_survey_';
const RESPONSES_PREFIX = 'arth_survey_responses_';

/**
 * Generate contextual questions tailored to the specific business or crop
 */
export function generateQuestionsForContext(
  businessCategory: string,
  activityTitle: string,
  isFarmer: boolean,
  cropName?: string
): SurveyQuestion[] {
  if (isFarmer) {
    const crop = cropName || 'Crop';
    return [
      {
        id: 'q1_yield',
        questionText: `What average yield (quintals/acre) do local farmers realistically harvest for ${crop}?`,
        type: 'multiple_choice',
        options: [
          'Below 8 qtl / acre (water/pest issues)',
          '8 – 14 qtl / acre (normal average)',
          '15 – 22 qtl / acre (good irrigation/inputs)',
          'Varies drastically year to year with monsoon',
        ],
      },
      {
        id: 'q2_mandi',
        questionText: 'Where do local farmers sell most of this harvested crop?',
        type: 'multiple_choice',
        options: [
          'Taluka APMC Mandi Yard (auction)',
          'Local village trader / Commission agent at farmgate',
          'Direct to food processing company / dal mill',
          'Weekly village haat or local consumers',
        ],
      },
      {
        id: 'q3_inputs',
        questionText: 'Do you face difficulty securing quality certified seeds & fertilizer on time?',
        type: 'yes_no',
        options: [
          'Yes, frequent shortage or price markup during peak sowing',
          'Occasionally during peak monsoon',
          'No, locally available at Krishi Seva Kendra',
        ],
      },
      {
        id: 'q4_satisfaction',
        questionText: 'How satisfied are you with current local mandi weighing transparency & fair payment?',
        type: 'rating',
        options: ['1 - Poor', '2 - Fair', '3 - Average', '4 - Good', '5 - Excellent'],
        helperText: 'Rate from 1 (very dissatisfied) to 5 (highly satisfied)',
      },
      {
        id: 'q5_storage',
        questionText: 'Would access to village storage or shared tempo transport help avoid distress selling?',
        type: 'multiple_choice',
        options: [
          'Definitely Yes, can hold crop for higher price',
          'Likely Yes, for at least 30–50% of harvest',
          'No, immediate cash needed to repay farm loans',
          'Not sure / already have on-farm storage',
        ],
      },
      {
        id: 'q6_biggest_challenge',
        questionText: 'What is your single biggest concern for this upcoming farming season?',
        type: 'multiple_choice',
        options: [
          'Monsoon rainfall & ground water table',
          'High input costs (seeds, fertilizer, diesel, labor)',
          'Price crash at harvest time',
          'Pest & crop disease attack',
        ],
      },
    ];
  }

  // Dairy Business
  if (businessCategory === 'Dairy Business' || activityTitle.toLowerCase().includes('milk') || activityTitle.toLowerCase().includes('dairy')) {
    return [
      {
        id: 'q1_freq',
        questionText: 'How often does your household purchase fresh milk or dairy products?',
        type: 'multiple_choice',
        options: [
          'Daily morning & evening',
          'Daily once (morning or evening)',
          '2–3 times a week',
          'Rarely / Have own dairy animals',
        ],
      },
      {
        id: 'q2_source',
        questionText: 'Where do you usually purchase milk currently?',
        type: 'multiple_choice',
        options: [
          'Local dairy collection booth / Cooperative',
          'Doorstep private milkman',
          'Packaged pouch milk from village grocery store',
          'Direct from neighboring farm / relative',
        ],
      },
      {
        id: 'q3_priority',
        questionText: 'What matters most to you when choosing a milk supplier?',
        type: 'multiple_choice',
        options: [
          'Purity & fat consistency (no water mixing)',
          'Punctual morning delivery time',
          'Fair price per litre',
          'Clean handling & hygiene',
        ],
      },
      {
        id: 'q4_price',
        questionText: 'What price range do you usually pay per litre for buffalo/cow milk?',
        type: 'multiple_choice',
        options: [
          '₹42 – ₹48 / litre',
          '₹50 – ₹56 / litre',
          '₹58 – ₹64 / litre',
          'Above ₹65 / litre',
        ],
      },
      {
        id: 'q5_satisfaction',
        questionText: 'How satisfied are you with current local milk quality and availability?',
        type: 'rating',
        options: ['1 - Very Low', '2 - Low', '3 - Moderate', '4 - Good', '5 - Highly Satisfied'],
        helperText: 'Rate from 1 (unreliable) to 5 (excellent)',
      },
      {
        id: 'q6_intent',
        questionText: `Would you buy from a reliable, hygienic new ${activityTitle} in this village?`,
        type: 'multiple_choice',
        options: [
          'Definitely Yes, if quality & fat test is verified',
          'Likely Yes, for daily household milk',
          'Only if cheaper than existing options',
          'No, satisfied with current source',
        ],
      },
      {
        id: 'q7_issue',
        questionText: 'What issues have you faced with existing milk supply in the area?',
        type: 'multiple_choice',
        options: [
          'Water mixing / low fat thickness',
          'Unpunctual delivery timings',
          'Evening milk runs out of stock early',
          'No major issues / satisfied',
        ],
      },
    ];
  }

  // Grocery / General Store
  if (businessCategory === 'Grocery / General Store') {
    return [
      {
        id: 'q1_freq',
        questionText: 'How often does your household shop for groceries and daily essentials?',
        type: 'multiple_choice',
        options: [
          'Daily small items',
          '2–3 times a week',
          'Weekly shopping once',
          'Monthly bulk trip to taluka town',
        ],
      },
      {
        id: 'q2_distance',
        questionText: 'Where do you travel when items are missing from current local shops?',
        type: 'multiple_choice',
        options: [
          'Wait for weekly village haat bazaar',
          'Travel 8–15 km to taluka town',
          'Go to neighboring larger village (3–5 km)',
          'Manage without the item',
        ],
      },
      {
        id: 'q3_missing_items',
        questionText: 'What items do you find most frequently out of stock locally?',
        type: 'multiple_choice',
        options: [
          'Fresh branded packaged foods & snacks',
          'Personal hygiene, baby care & cosmetics',
          'Student stationery, notebooks & photocopy',
          'Spices, pulses & quality cooking oils',
        ],
      },
      {
        id: 'q4_priority',
        questionText: 'What matters most to you in a neighborhood store?',
        type: 'multiple_choice',
        options: [
          'Fair pricing at standard MRP',
          'Wide variety & good stock availability',
          'Reliable opening hours (early morning & late evening)',
          'Friendly service & digital UPI payment option',
        ],
      },
      {
        id: 'q5_satisfaction',
        questionText: 'How satisfied are you with current local grocery availability?',
        type: 'rating',
        options: ['1 - Poor', '2 - Fair', '3 - Average', '4 - Good', '5 - Excellent'],
        helperText: 'Rate from 1 to 5',
      },
      {
        id: 'q6_intent',
        questionText: 'Would you support a new, well-stocked village store with fair prices?',
        type: 'multiple_choice',
        options: [
          'Definitely Yes, saves trips to town',
          'Likely Yes, for urgent daily needs',
          'Only if prices are equal to wholesale town rate',
          'No, happy with existing shops',
        ],
      },
    ];
  }

  // Default for other micro-enterprises (Food, Poultry, Tailoring, Repair, Transport, etc.)
  return [
    {
      id: 'q1_freq',
      questionText: `How often do you or your family require ${activityTitle} services or products?`,
      type: 'multiple_choice',
      options: [
        'Frequently (every week)',
        '2–3 times a month',
        'Seasonal or festival occasions',
        'Rarely / Only in emergencies',
      ],
    },
    {
      id: 'q2_current_source',
      questionText: `Where do you currently go to get ${activityTitle}?`,
      type: 'multiple_choice',
      options: [
        'Travel to taluka / district town center (far)',
        'Local village technician or shop',
        'Weekly market / Haat bazaar',
        'Wait for traveling vendor',
      ],
    },
    {
      id: 'q3_priority',
      questionText: 'What is most important to you when choosing this service or product?',
      type: 'multiple_choice',
      options: [
        'Fair and transparent pricing',
        'Reliable high quality and work guarantee',
        'Saving travel time & bus fare to town',
        'Prompt delivery / quick completion',
      ],
    },
    {
      id: 'q4_satisfaction',
      questionText: 'How satisfied are you with current local access and pricing?',
      type: 'rating',
      options: ['1 - Poor', '2 - Fair', '3 - Average', '4 - Good', '5 - Excellent'],
      helperText: 'Rate from 1 (difficult to get) to 5 (very satisfied)',
    },
    {
      id: 'q5_intent',
      questionText: `If a trusted local entrepreneur starts ${activityTitle} here, would you use it?`,
      type: 'multiple_choice',
      options: [
        'Definitely Yes, will support local business',
        'Likely Yes, if quality matches town standard',
        'Only if cheaper than traveling to town',
        'No, prefer existing arrangements',
      ],
    },
    {
      id: 'q6_recommend',
      questionText: 'Would you recommend this new local business to neighbors & relatives?',
      type: 'multiple_choice',
      options: [
        'Yes, gladly spread the word',
        'Yes, after testing service once',
        'Maybe later',
        'Not sure',
      ],
    },
  ];
}

/**
 * Generate a clean unique survey ID
 */
export function generateSurveyId(village: string, activity: string): string {
  const cleanVillage = (village || 'local').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6);
  const cleanActivity = (activity || 'biz').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `srv-${cleanVillage}-${cleanActivity}-${randomSuffix}`;
}

/**
 * Get or create the active survey for the current context
 */
export function getOrCreateSurveyForContext(
  village: string,
  district: string,
  state: string,
  businessCategory: string,
  activityTitle: string,
  isFarmer: boolean,
  cropName?: string
): CommunitySurvey {
  const key = `${STORAGE_PREFIX}active_${(village || 'village').toLowerCase()}_${(activityTitle || 'biz').toLowerCase()}`;
  
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id && parsed.questions?.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read survey from storage:', e);
  }

  // Create initial survey
  const id = generateSurveyId(village, activityTitle);
  const title = isFarmer
    ? `Agricultural Community Survey for ${cropName || 'Crop'} Cultivation`
    : `Local Community Demand Survey for ${activityTitle}`;

  const newSurvey: CommunitySurvey = {
    id,
    title,
    activityTitle,
    businessCategory,
    isFarmer,
    cropName,
    village: village || 'Village',
    district: district || 'District',
    state: state || 'State',
    createdAt: new Date().toISOString(),
    questions: generateQuestionsForContext(businessCategory, activityTitle, isFarmer, cropName),
    status: 'active',
  };

  try {
    localStorage.setItem(key, JSON.stringify(newSurvey));
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(newSurvey));
  } catch (e) {
    console.warn('Failed to save initial survey to storage:', e);
  }

  return newSurvey;
}

/**
 * Load survey by exact ID
 */
export function getSurveyById(surveyId: string): CommunitySurvey | null {
  if (!surveyId) return null;
  try {
    const direct = localStorage.getItem(`${STORAGE_PREFIX}${surveyId}`);
    if (direct) return JSON.parse(direct);

    // Search across all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed && parsed.id === surveyId) return parsed;
          } catch {}
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load survey by ID:', e);
  }
  return null;
}

/**
 * Save or update survey
 */
export function saveSurvey(survey: CommunitySurvey): void {
  try {
    const key = `${STORAGE_PREFIX}active_${survey.village.toLowerCase()}_${survey.activityTitle.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(survey));
    localStorage.setItem(`${STORAGE_PREFIX}${survey.id}`, JSON.stringify(survey));
  } catch (e) {
    console.warn('Failed to save survey:', e);
  }
}

/**
 * Retrieve verified responses for a survey
 */
export function getResponsesForSurvey(surveyId: string): SurveyResponse[] {
  if (!surveyId) return [];
  try {
    const key = `${RESPONSES_PREFIX}${surveyId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load responses:', e);
  }
  return [];
}

/**
 * Submit and persist a real response
 */
export function submitSurveyResponse(response: SurveyResponse): void {
  try {
    const key = `${RESPONSES_PREFIX}${response.surveyId}`;
    const existing = getResponsesForSurvey(response.surveyId);
    const updated = [response, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save response:', e);
  }
}

/**
 * Compute real statistics without fake data
 */
export function computeSurveyAnalytics(
  survey: CommunitySurvey,
  responses: SurveyResponse[]
): SurveyAnalytics {
  const totalResponses = responses.length;

  const respondentTypeBreakdown: Record<RespondentType, number> = {
    Farmer: 0,
    Customer: 0,
    'Local resident': 0,
    Shopkeeper: 0,
    Trader: 0,
    Other: 0,
  };

  const relationshipBreakdown: Record<RelationshipType, number> = {
    'Potential customer': 0,
    'Existing customer': 0,
    Farmer: 0,
    Supplier: 0,
    'Local resident': 0,
    Other: 0,
  };

  let totalRatingSum = 0;
  let totalRatingCount = 0;
  let purchaseIntentPositive = 0;
  let purchaseIntentTotal = 0;

  responses.forEach((resp) => {
    if (resp.respondent.respondentType && respondentTypeBreakdown[resp.respondent.respondentType] !== undefined) {
      respondentTypeBreakdown[resp.respondent.respondentType]++;
    }
    if (resp.respondent.relationship && relationshipBreakdown[resp.respondent.relationship] !== undefined) {
      relationshipBreakdown[resp.respondent.relationship]++;
    }

    // Check purchase intent
    Object.entries(resp.answers).forEach(([qId, val]) => {
      const strVal = String(val);
      if (qId.includes('intent') || qId === 'q6_intent' || qId === 'q5_intent') {
        purchaseIntentTotal++;
        if (strVal.toLowerCase().includes('yes') || strVal.toLowerCase().includes('definitely')) {
          purchaseIntentPositive++;
        }
      }
    });
  });

  // Build question-by-question breakdown
  const questionSummaries: QuestionSummary[] = survey.questions.map((q) => {
    const counts: Record<string, number> = {};
    let answerCount = 0;
    let ratingSum = 0;
    let ratingAnswers = 0;

    // initialize counts
    q.options.forEach((opt) => {
      counts[opt] = 0;
    });

    responses.forEach((resp) => {
      const ans = resp.answers[q.id];
      if (ans !== undefined && ans !== null && ans !== '') {
        const ansStr = String(ans);
        answerCount++;
        counts[ansStr] = (counts[ansStr] || 0) + 1;

        if (q.type === 'rating') {
          const num = Number(ansStr.charAt(0)) || Number(ans);
          if (!isNaN(num) && num > 0) {
            ratingSum += num;
            ratingAnswers++;
            totalRatingSum += num;
            totalRatingCount++;
          }
        }
      }
    });

    let topAnswer: string | undefined = undefined;
    let topCount = 0;
    Object.entries(counts).forEach(([opt, count]) => {
      if (count > topCount) {
        topCount = count;
        topAnswer = opt;
      }
    });

    return {
      questionId: q.id,
      questionText: q.questionText,
      type: q.type,
      totalAnswers: answerCount,
      optionCounts: counts,
      averageRating: ratingAnswers > 0 ? Math.round((ratingSum / ratingAnswers) * 10) / 10 : undefined,
      topAnswer,
      topPercentage: answerCount > 0 ? Math.round((topCount / answerCount) * 100) : 0,
    };
  });

  return {
    totalResponses,
    respondentTypeBreakdown,
    relationshipBreakdown,
    questionSummaries,
    averageRatingOverall: totalRatingCount > 0 ? Math.round((totalRatingSum / totalRatingCount) * 10) / 10 : undefined,
    purchaseIntentPercentage: purchaseIntentTotal > 0 ? Math.round((purchaseIntentPositive / purchaseIntentTotal) * 100) : undefined,
    recentResponses: responses.slice(0, 10),
  };
}
