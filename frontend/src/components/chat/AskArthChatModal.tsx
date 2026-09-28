const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Maximize2,
  Minimize2,
  Sparkles,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  IndianRupee,
  RotateCcw,
  Trash2,
  Mic,
  MicOff,
  Paperclip,
  ArrowRight,
  Settings,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Store,
  Calendar,
  Layers,
  Coins,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BasicInfoData,
  BusinessSetupData,
  FinancialFeasibilityResult,
  HyperLocalAnalysis,
  Language,
  TwoGateDecision,
} from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';

interface AskArthChatProps {
  isOpen: boolean;
  onClose: () => void;
  isFullPage?: boolean;
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  feasibility: FinancialFeasibilityResult;
  hyperLocal?: HyperLocalAnalysis;
  twoGate?: TwoGateDecision;
  dailyLog?: {
    actualSales: number;
    actualExpenses: number;
    performanceStatus: 'ON TRACK' | 'WATCH' | 'NEEDS ATTENTION';
  };
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

interface MessageMetric {
  label: string;
  value: string;
  subtext?: string;
  variant?: 'neutral' | 'success' | 'warning' | 'primary';
}

interface MessageTable {
  headers: string[];
  rows: string[][];
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  metrics?: MessageMetric[];
  table?: MessageTable;
  suggestedFollowUps?: string[];
  actionButtons?: { label: string; actionQuery: string }[];
}

export const AskArthChatModal: React.FC<AskArthChatProps> = ({
  isOpen,
  onClose,
  isFullPage = false,
  basicInfo,
  businessSetup,
  feasibility,
  hyperLocal,
  twoGate,
  dailyLog,
  language,
  onLanguageChange,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const isFarmer = businessSetup?.entityType === 'farmer';
  const businessTitle = isFarmer
    ? `${businessSetup?.farmerData?.cropName || 'Crop'} Cultivation`
    : businessSetup?.subActivity || businessSetup?.businessCategory || 'Micro-Enterprise';

  const [isExpanded, setIsExpanded] = useState<boolean>(isFullPage);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Farmer specific derived metrics
  const farmerCrop = businessSetup?.farmerData?.cropName || 'Crop';
  const farmerAcres = businessSetup?.farmerData?.landAreaAcres || 0;
  const farmerCultivationCost =
    (businessSetup?.farmerData?.seedCost || 0) +
    (businessSetup?.farmerData?.fertilizerCost || 0) +
    (businessSetup?.farmerData?.pesticideCost || 0) +
    (businessSetup?.farmerData?.labourCost || 0) +
    (businessSetup?.farmerData?.irrigationCost || 0) +
    (businessSetup?.farmerData?.machineryCost || 0) +
    (businessSetup?.farmerData?.transportCost || 0) +
    (businessSetup?.farmerData?.otherCultivationCost || 0);
  const farmerOwnContribution = Number(businessSetup?.ownStartingMoney) || 0;
  const farmerFinancingGap = Math.max(0, farmerCultivationCost - farmerOwnContribution);
  const hasExistingLoan = businessSetup?.hasExistingLoan === 'Yes' || businessSetup?.hasInformalLoan === 'Yes';
  const existingLoan = businessSetup?.existingLoanDetails;

  // Farmer-Specific Quick Action Cards
  const farmerQuickActionCards = [
    {
      id: 'farmer_loan_help',
      icon: '🌾',
      title: language === 'mr' ? 'कर्ज समजून घ्यायला मदत हवी?' : language === 'hi' ? 'ऋण समझने में मदद चाहिए?' : 'Need help understanding your loan?',
      desc: language === 'mr' ? 'पीक कर्ज व मुदत कर्ज यातील फरक' : language === 'hi' ? 'फसल ऋण और मियादी ऋण में अंतर' : 'Crop loans (KCC) vs term loans',
      query: 'Need help understanding your loan?',
    },
    {
      id: 'outstanding_amount',
      icon: '📊',
      title: language === 'mr' ? 'थकबाकी (Outstanding) म्हणजे काय?' : language === 'hi' ? 'बकाया राशि (Outstanding) का क्या अर्थ है?' : 'What does outstanding amount mean?',
      desc: language === 'mr' ? 'मुद्दल, व्याज व शिल्लक कर्ज' : language === 'hi' ? 'मूलधन, ब्याज और वर्तमान बकाया' : 'Unpaid balance vs original loan',
      query: 'What does outstanding amount mean?',
    },
    {
      id: 'financing_req',
      icon: '💰',
      title: language === 'mr' ? 'ही रक्कम वित्तपुरवठा म्हणून का दिसते?' : language === 'hi' ? 'यह राशि आपकी वित्तीय आवश्यकता क्यों है?' : 'Why is this amount shown as your financing requirement?',
      desc: language === 'mr' ? 'हंगामी खर्च वजा स्वतःचा वाटा' : language === 'hi' ? 'खेती की लागत घटाव खुद का पैसा' : 'Estimated cultivation cost minus own contribution',
      query: 'Why is this amount shown as your financing requirement?',
    },
    {
      id: 'documents',
      icon: '📑',
      title: language === 'mr' ? 'कोणती कागदपत्रे तयार ठेवावीत?' : language === 'hi' ? 'कौन से दस्तावेज तैयार रखने चाहिए?' : 'Which documents should you keep ready?',
      desc: language === 'mr' ? '७/१२, ८-अ, ई-पीक पाहणी व आधार' : language === 'hi' ? '७/१२, ८-अ, ई-पीक व आधार पासबुक' : 'Land records, e-Pik Pahani & bank passbook',
      query: 'Which documents should you keep ready?',
    },
    {
      id: 'insurance',
      icon: '🛡️',
      title: language === 'mr' ? 'पीक विमा (PMFBY) कसा काम करतो?' : language === 'hi' ? 'फसल बीमा (PMFBY) कैसे काम करता है?' : 'How does crop insurance work?',
      desc: language === 'mr' ? 'हंगामाचे हप्ते व नुकसान भरपाई प्रक्रिया' : language === 'hi' ? 'प्रीमियम दर और आपदा क्लेम प्रक्रिया' : 'Seasonal premium rates & 72-hr notice window',
      query: 'How does crop insurance work for my crop?',
    },
    {
      id: 'crop_cycle',
      icon: '🌱',
      title: language === 'mr' ? 'हंगामी चक्र व कर्ज परतफेड' : language === 'hi' ? 'फसल चक्र और ऋण अदायगी' : 'How does crop cycle affect repayment?',
      desc: language === 'mr' ? 'दैनिक हप्त्यांऐवजी काढणीनंतर परतफेड' : language === 'hi' ? 'दैनिक ईएमआई की बजाय कटाई के बाद एकमुश्त अदायगी' : 'Harvest-aligned bullet repayment vs shop EMIs',
      query: 'How does crop cycle affect my loan repayment?',
    },
    {
      id: 'farmer_schemes',
      icon: '🏛️',
      title: language === 'mr' ? 'शेतकऱ्यांसाठी योग्य योजना (KCC इ.)' : language === 'hi' ? 'किसानों के लिए उपयुक्त योजनाएं (KCC आदि)' : 'Relevant farmer schemes (KCC, MISS, etc.)',
      desc: language === 'mr' ? 'व्याज सवलत आणि केसीसी मर्यादा' : language === 'hi' ? 'ब्याज अनुदान और केसीसी क्रेडिट' : 'Kisan Credit Card & 3% prompt repayment benefit',
      query: 'What farmer schemes and KCC benefits apply to my crop?',
    },
    {
      id: 'existing_debt_safety',
      icon: '⚠️',
      title: language === 'mr' ? 'माझ्या चालू कर्जाचा परिणाम तपासा' : language === 'hi' ? 'मेरे मौजूदा ऋण का प्रभाव जांचें' : 'Review my existing loan impact',
      desc: language === 'mr' ? 'नवीन कर्ज घेण्याआधी परतफेडीची क्षमता' : language === 'hi' ? 'नया कर्ज लेने से पहले कर्ज वहन क्षमता' : 'Debt sustainability & avoiding overborrowing',
      query: 'How does my existing loan affect taking another farm loan?',
    },
  ];

  // 8 Dedicated Quick Action Cards from User Specifications for Business Mode
  const businessQuickActionCards = [
    {
      id: 'finances',
      icon: '💰',
      title: t.qaCheckFinances || "Check today's finances",
      desc: language === 'mr' ? 'दैनिक विक्री, खर्च आणि नफा तपासा' : language === 'hi' ? 'दैनिक बिक्री, खर्च और लाभ जांचें' : 'Review revenue, expenses & cash in hand',
      query: language === 'mr' ? 'आजचा आर्थिक हिशोब आणि नफा तपासा' : language === 'hi' ? 'आज का आर्थिक हिसाब और मुनाफा दिखाएं' : "Check my today's finances and cash flow",
    },
    {
      id: 'expenses',
      icon: '📉',
      title: t.qaUnderstandExpenses || 'Understand my expenses',
      desc: language === 'mr' ? 'खर्चांचे विश्लेषण व बचत संधी' : language === 'hi' ? 'खर्च का विश्लेषण और बचत के तरीके' : 'Breakdown of raw materials, transport & utilities',
      query: language === 'mr' ? 'माझ्या व्यवसायाचे सर्व खर्च समजून सांगा' : language === 'hi' ? 'मेरे व्यवसाय के सभी खर्चों का विश्लेषण करें' : 'Understand my operating expenses and where to save',
    },
    {
      id: 'loans',
      icon: '🏦',
      title: t.qaFindLoans || 'Find suitable loans',
      desc: language === 'mr' ? 'मुद्रा, पीएमईजीपी आणि बँक योजना' : language === 'hi' ? 'मुद्रा, पीएमईजीपी व प्राथमिकता ऋण' : 'Mudra, PMEGP, KCC & bank credit safety',
      query: language === 'mr' ? 'माझ्या व्यवसायासाठी योग्य कर्ज आणि योजना कोणत्या आहेत?' : language === 'hi' ? 'मेरे व्यवसाय के लिए सबसे उपयुक्त ऋण और सरकारी योजनाएं बताएं' : 'Find suitable loans and safe repayment options for my business',
    },
    {
      id: 'schemes',
      icon: '📜',
      title: t.qaCheckSchemes || 'Check government schemes',
      desc: language === 'mr' ? 'अनुदान आणि व्याज सवलत' : language === 'hi' ? 'सब्सिडी व सरकारी सहायता योजनाएं' : 'Central & State subsidies & credit support',
      query: language === 'mr' ? 'माझ्या व्यवसायासाठी शासकीय योजना आणि अनुदान काय आहे?' : language === 'hi' ? 'मेरे व्यवसाय के लिए उपलब्ध सरकारी योजनाएं और सब्सिडी बताएं' : 'Check government schemes and subsidies applicable to my business',
    },
    {
      id: 'market',
      icon: '📍',
      title: t.qaLocalMarket || 'Understand my local market',
      desc: language === 'mr' ? `${basicInfo?.district || 'स्थानिक'} बाजारपेठ व मागणी` : language === 'hi' ? `${basicInfo?.district || 'स्थानीय'} बाजार मांग व मंडी भाव` : `Local demand & competition in ${basicInfo?.district || 'your area'}`,
      query: language === 'mr' ? `माझ्या भागातील (${basicInfo?.district || 'स्थानिक'}) बाजारपेठेची मागणी कशी आहे?` : language === 'hi' ? `मेरे क्षेत्र (${basicInfo?.district || 'स्थानीय'}) में ग्राहकों की मांग और बाजार कैसा है?` : `Tell me about local market demand and competition in ${basicInfo?.district || 'my area'}`,
    },
    {
      id: 'idea',
      icon: '💡',
      title: t.qaReviewIdea || 'Review my business idea',
      desc: language === 'mr' ? 'व्यवहार्यता आणि जोखीम तपासणी' : language === 'hi' ? 'व्यवहार्यता व जोखिम जांच' : 'Feasibility, margins & breakeven timeline',
      query: language === 'mr' ? 'माझ्या व्यवसाय कल्पनेची व्यवहार्यता व नफा तपासा' : language === 'hi' ? 'मेरे बिजनेस आइडिया की व्यवहार्यता और मुनाफा जांचें' : 'Review my business idea and tell me if it is viable',
    },
    {
      id: 'profit',
      icon: '📈',
      title: t.qaImproveProfit || 'Help me improve my profit',
      desc: language === 'mr' ? 'नफा वाढवण्याच्या ३ पद्धती' : language === 'hi' ? 'मुनाफा बढ़ाने के ३ व्यावहारिक तरीके' : 'Actionable ways to increase margin and volume',
      query: language === 'mr' ? 'माझा नफा वाढवण्यासाठी काय करावे?' : language === 'hi' ? 'मेरा मुनाफा बढ़ाने के लिए क्या उपाय करने चाहिए?' : 'How can I improve my profit margin and net income?',
    },
    {
      id: 'today',
      icon: '⏱️',
      title: t.qaWhatToDoToday || 'What should I do today?',
      desc: language === 'mr' ? 'आजचे ३ महत्त्वाचे निर्णय व उद्दिष्ट' : language === 'hi' ? 'आज के ३ मुख्य कार्य और दैनिक लक्ष्य' : '3 priority tasks to protect your cash and sales',
      query: language === 'mr' ? 'आजच्या दिवसासाठी ३ महत्त्वाच्या कृती सांगा' : language === 'hi' ? 'आज के दिन के लिए मुझे क्या ३ जरूरी काम करने चाहिए?' : 'What specific actions should I take today for my business?',
    },
  ];

  const quickActionCards = isFarmer ? farmerQuickActionCards : businessQuickActionCards;

  // Dynamic Suggestion Chips below response
  const farmerSuggestionChips = [
    'Need help understanding your loan?',
    'What does outstanding amount mean?',
    'Why is this amount shown as your financing requirement?',
    'Which documents should you keep ready?',
    'How does crop insurance work?',
    'How does crop cycle affect repayment?',
  ];

  const businessSuggestionChips = [
    t.ctxShowExpenses || "Show me today's expenses",
    t.ctxCalcProfit || 'Calculate my profit',
    t.ctxCheckLoans || 'Check loan options',
    t.ctxExplainReport || 'Explain this report',
    t.ctxReduceCosts || 'How can I reduce costs?',
    t.ctxDailyAdvice || "Give me today's business advice",
  ];

  const suggestionChips = isFarmer ? farmerSuggestionChips : businessSuggestionChips;

  const [messages, setMessages] = useState<Message[]>([]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Handle incoming initial prompt if opened with a specific topic
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [isOpen, initialPrompt]);

  // Financial Variables from Ground Model
  const cost = feasibility?.totalProjectCost || 0;
  const loan = feasibility?.potentialLoan || 0;
  const rev = feasibility?.monthlyRevenue || 0;
  const exp = feasibility?.monthlyCosts || 0;
  const emi = feasibility?.monthlyEMI || 0;
  const surplus = feasibility?.monthlySurplus || 0;
  const targetDailySales = Math.round(rev / 30);
  const targetDailyExp = Math.round((exp - emi) / 30);
  const dailyEmiReserve = Math.round(emi / 30);

  // Professional Business Advisor Contextual Knowledge Engine
  const generateAdvisorResponse = (userQuery: string): {
    reply: string;
    metrics?: MessageMetric[];
    table?: MessageTable;
    actionButtons?: { label: string; actionQuery: string }[];
    followUps?: string[];
  } => {
    const q = userQuery.toLowerCase();

    // ============================================
    // FARMER MODE CONTEXTUAL ADVISOR
    // ============================================
    if (isFarmer) {
      // 1. OUTSTANDING AMOUNT
      if (q.includes('outstanding') || q.includes('थकबाकी') || q.includes('बकाया')) {
        return {
          reply: language === 'mr'
            ? `**थकबाकी (Outstanding Amount) म्हणजे काय?**\n\nथकबाकी म्हणजे आजच्या तारखेला बँकेला परत करायची शिल्लक रक्कम. यात कर्जाची मूळ मुद्दल (Principal) आणि चालू महिन्यापर्यंतचे न भरलेले व्याज यांचा समावेश असतो.\n\n- ही मंजूर झालेली मूळ कर्जाची रक्कम नसते, तर अद्याप फेडायची शिल्लक रक्कम असते.\n- जर तुम्ही वेळेवर हप्ते भरले असतील, तर थकबाकी हळूहळू कमी होते.\n- नवीन हंगामासाठी कर्ज मागताना बँक सर्वप्रथम तुमची जुनी थकबाकी तपासते.`
            : language === 'hi'
            ? `**बकाया राशि (Outstanding Amount) का क्या अर्थ है?**\n\nबकाया राशि का अर्थ है वह कुल शेष राशि जो आज की तारीख में आपको बैंक को चुकानी है। इसमें ऋण का शेष मूलधन (Principal) और अब तक का बकाया ब्याज शामिल होता है।\n\n- यह बैंक द्वारा स्वीकृत मूल ऋण राशि नहीं, बल्कि वर्तमान में बची हुई देनदारी है।\n- नियमित भुगतान करने पर बकाया राशि कम होती जाती है।\n- नए सीजन के ऋण के लिए बैंक सबसे पहले पुरानी बकाया स्थिति की जांच करता है।`
            : `**What does Outstanding Amount mean?**\n\nThe outstanding amount is the total balance you currently owe to your lender as of today. It represents the unpaid principal balance plus any accrued interest that has not yet been cleared.\n\n- It is not your original sanctioned loan amount, but what currently remains unpaid.\n- Paying your dues on time steadily reduces this outstanding balance.\n- Banks always inspect your existing outstanding dues before sanctioning fresh crop credit.`,
          metrics: [
            { label: 'Existing Loan Status', value: hasExistingLoan ? 'Active Loan Reported' : 'No Active Loan', variant: hasExistingLoan ? 'warning' : 'success' },
            { label: 'Current Outstanding', value: existingLoan?.outstandingAmount ? `₹${Number(existingLoan.outstandingAmount).toLocaleString('en-IN')}` : 'Not provided', variant: 'neutral' },
          ],
          followUps: [
            'Why is this amount shown as your financing requirement?',
            'Which documents should you keep ready?',
          ],
        };
      }

      // 2. FINANCING REQUIREMENT FORMULA
      if (q.includes('financing requirement') || q.includes('requirement') || q.includes('आवश्यकता') || q.includes('हिशोब') || q.includes('why is this amount')) {
        return {
          reply: language === 'mr'
            ? `**तुमची वित्तपुरवठा आवश्यकता कशी काढली जाते?**\n\nशेतीमध्ये वित्तपुरवठा आवश्यकता ही दुकानासारखी दैनंदिन विक्रीवर न ठरवता संपूर्ण पीक हंगामाच्या खर्चावर मोजली जाते:\n\n**अंदाजे एकूण लागवड खर्च** (बियाणे, खते, मजुरी, मशागत इ.)\nवजा (−) **शेतकऱ्याचा स्वतःचा वाटा**\n= **अंदाजे वित्तपुरवठा अंतर (Financing Requirement)**\n\nतुमच्या बाबतीत:\n- एकूण लागवड खर्च: ₹${farmerCultivationCost.toLocaleString('en-IN')}\n- तुमचा स्वतःचा वाटा: ₹${farmerOwnContribution.toLocaleString('en-IN')}\n- वित्तपुरवठा आवश्यकता: **₹${farmerFinancingGap.toLocaleString('en-IN')}**\n\nयाचा उद्देश शेतकऱ्याला गरज नसताना जास्त कर्जाच्या विळख्यात न पाडता केवळ आवश्यक खेळत्या भांडवलाची व्यवस्था करणे हा आहे.`
            : language === 'hi'
            ? `**आपकी वित्तीय आवश्यकता की गणना कैसे की जाती है?**\n\nकृषि में वित्तीय आवश्यकता की गणना दुकान की तरह दैनिक बिक्री से नहीं, बल्कि पूरे फसल चक्र की कुल लागत पर की जाती है:\n\n**अनुमानित कुल खेती लागत** (बीज, उर्वरक, मजदूरी, जुताई आदि)\nघटाव (−) **किसान का स्वयं का अंशदान**\n= **अनुमानित वित्तीय आवश्यकता (Financing Gap)**\n\nआपके मामले में:\n- कुल खेती लागत: ₹${farmerCultivationCost.toLocaleString('en-IN')}\n- आपका स्वयं का अंशदान: ₹${farmerOwnContribution.toLocaleString('en-IN')}\n- अनुमानित आवश्यकता: **₹${farmerFinancingGap.toLocaleString('en-IN')}**\n\nयह केवल वास्तविक जरूरत के अनुसार कार्यशील पूंजी का आकलन करता है ताकि किसान पर अनावश्यक कर्ज का बोझ न पड़े।`
            : `**Why is this amount shown as your financing requirement?**\n\nIn ARTH AI, agricultural funding is calculated on your seasonal crop-cycle budget rather than commercial daily business cash flows:\n\n**Estimated Cultivation Cost** (seeds, fertilizer, labor, irrigation, harvest)\nMinus (−) **Farmer's Own Contribution**\nEquals (=) **Estimated Financing Requirement**\n\nFor your farm:\n- Total Cultivation Cost: ₹${farmerCultivationCost.toLocaleString('en-IN')}\n- Your Own Contribution: ₹${farmerOwnContribution.toLocaleString('en-IN')}\n- Estimated Financing Gap: **₹${farmerFinancingGap.toLocaleString('en-IN')}**\n\nThis reflects your actual working capital gap without assuming unnecessary additional debt.`,
          metrics: [
            { label: 'Cultivation Cost', value: `₹${farmerCultivationCost.toLocaleString('en-IN')}`, variant: 'neutral' },
            { label: 'Own Contribution', value: `₹${farmerOwnContribution.toLocaleString('en-IN')}`, variant: 'primary' },
            { label: 'Financing Gap', value: `₹${farmerFinancingGap.toLocaleString('en-IN')}`, variant: 'success' },
          ],
          followUps: [
            'Which documents should you keep ready?',
            'How does crop cycle affect repayment?',
          ],
        };
      }

      // 3. NEED HELP UNDERSTANDING YOUR LOAN / CROP LOAN VS TERM LOAN
      if (q.includes('understanding your loan') || q.includes('understand loan') || q.includes('कर्ज समजून') || q.includes('ऋण समझना') || q.includes('kcc')) {
        return {
          reply: language === 'mr'
            ? `**शेती कर्ज समजून घेण्यासाठी महत्त्वाच्या बाबी:**\n\n1. **पीक कर्ज (KCC / Crop Loan)**: हे अल्पमुदतीचे कर्ज बियाणे, खते व मजुरीसाठी दिले जाते. याची परतफेड दरमहा नसून पीक काढणीनंतर एकरकमी (Bullet Repayment) केली जाते.\n2. **मुदत कर्ज (Agri Term Loan)**: ट्रॅक्टर, ठिबक सिंचन, विहीर किंवा शेडसाठी हे कर्ज ५ ते ९ वर्षांच्या मुदतीसाठी दिले जाते आणि याचे हप्ते दर सहा महिन्यांनी किंवा दरमहा असतात.\n3. **व्याज सवलत (MISS)**: वेळेवर पीक कर्ज फेडल्यास ३% व्याज सवलत मिळून निव्वळ व्याजदर ४% पर्यंत कमी होतो.`
            : language === 'hi'
            ? `**कृषि ऋण को समझने के मुख्य बिंदु:**\n\n1. **फसल ऋण (KCC / Crop Loan)**: यह बीज, खाद व मजदूरी के लिए अल्पकालिक कार्यशील पूंजी है। इसकी अदायगी मासिक ईएमआई में नहीं, बल्कि फसल कटाई के बाद एकमुश्त की जाती है।\n2. **मियादी ऋण (Term Loan)**: ट्रैक्टर, ड्रिप सिंचाई, कुआं या बाड़े के लिए दिया जाता है, जिसकी अवधि ५ से ९ वर्ष होती है।\n3. **ब्याज उपदान (MISS)**: समय पर फसल ऋण चुकाने पर ३% अतिरिक्त ब्याज छूट मिलती है, जिससे शुद्ध ब्याज दर ४% तक आ जाती है।`
            : `**Key Points to Understand Your Agricultural Loan:**\n\n1. **Crop Loans (KCC)**: Short-term seasonal working capital for seeds, fertilizer, and labor. Repayable after harvest in a single lump sum (bullet repayment), not monthly shop EMIs.\n2. **Agri Term Loans**: Medium-to-long term loans (3–7 years) for physical assets like tractors, drip systems, or borewells with half-yearly or annual installments.\n3. **Interest Subvention**: Under the Modified Interest Subvention Scheme (MISS), timely repayment earns a 3% prompt repayment incentive, effectively reducing the net interest rate to ~4% per annum.`,
          followUps: [
            'What does outstanding amount mean?',
            'Which documents should you keep ready?',
          ],
        };
      }

      // 4. DOCUMENTS TO PREPARE
      if (q.includes('document') || q.includes('कागदपत्रे') || q.includes('दस्तावेज') || q.includes('paper')) {
        return {
          reply: language === 'mr'
            ? `**बँक किंवा शासकीय योजनांसाठी आवश्यक कागदपत्रे:**\n\n✓ **जमीन मालकी पुरावा**: डिजिटल स्वाक्षरी असलेला ७/१२ उतारा व ८-अ नोंद\n✓ **पीक नोंद**: महसूल पोर्टलवरील चालू हंगामाची ई-पीक पाहणी (e-Pik Pahani)\n✓ **ओळख व पत्ता**: आधार कार्ड आणि पॅन कार्ड\n✓ **बँक तपशील**: बँक पासबुकची प्रत व रद्द केलेला धनादेश\n✓ **ना-हरकत प्रमाणपत्र (NOC)**: इतर बँकांचे कर्ज नसल्याचा दाखला\n\n*टीप: अचूक कागदपत्रांची यादी संबंधित बँक शाखेशी संपर्क साधून तपासावी.*`
            : language === 'hi'
            ? `**बैंक या सरकारी योजनाओं के लिए आवश्यक दस्तावेज:**\n\n✓ **भूमि अभिलेख**: डिजिटल ७/१२ व ८-अ खतौनी नकल\n✓ **फसल बोआई प्रमाण**: राजस्व पोर्टल पर ई-पीक पाहणी (फसल गिरदावरी) प्रविष्टि\n✓ **पहचान व पता**: आधार कार्ड और पैन कार्ड\n✓ **बैंक विवरण**: बैंक पासबुक की प्रति\n✓ **नो-ड्यूज प्रमाणपत्र (NOC)**: अन्य किसी बैंक में बकाया न होने का प्रमाण\n\n*नोट: बैंक शाखा के अनुसार दस्तावेजों की सूची में हल्का अंतर हो सकता है।*`
            : `**Key Documents to Keep Ready for Bank Branch Visit:**\n\n✓ **Land Ownership Records**: Digital 7/12 & 8-A extracts (Satbara Utara) or registered tenancy deed\n✓ **Crop Sowing Proof**: e-Pik Pahani (ई-पीक पाहणी) digital crop registration on the state revenue portal\n✓ **Identity & KYC**: Aadhaar card and PAN card\n✓ **Bank Details**: Bank passbook copy with active IFSC code\n✓ **No Dues Certificate (NOC)**: Verification certificate from local PACS or commercial banks\n\n*Note: Exact verification requirements remain subject to your local lending branch.*`,
          followUps: [
            'Why is this amount shown as your financing requirement?',
            'How does crop insurance work for my crop?',
          ],
        };
      }

      // 5. CROP INSURANCE / PMFBY
      if (q.includes('insurance') || q.includes('pmfby') || q.includes('विमा') || q.includes('बीमा')) {
        return {
          reply: language === 'mr'
            ? `**पंतप्रधान पीक विमा योजना (PMFBY) कशी काम करते?**\n\n- **शेतकऱ्याचा हप्ता (Premium)**:\n  - खरीप अन्नधान्य व गळीत धान्य: विमा रकमेच्या २%\n  - रब्बी पिके: विमा रकमेच्या १.५%\n  - वार्षिक नगदी/फळबागा पिके: विमा रकमेच्या ५%\n- **नुकसान भरपाई दावा**: पूर, अवकाळी पाऊस किंवा गारपिटीमुळे स्थानिक नुकसान झाल्यास **७२ तासांच्या आत** Crop Insurance App किंवा टोल-फ्री क्रमांकावर नोंद करणे बंधनकारक आहे.\n- पीक विमा हे कर्ज नसून नैसर्गिक आपत्तीविरुद्धचे आर्थिक संरक्षण आहे.`
            : language === 'hi'
            ? `**प्रधानमंत्री फसल बीमा योजना (PMFBY) कैसे काम करती है?**\n\n- **किसान प्रीमियम दर**:\n  - खरीफ खाद्य व तिलहन फसलें: बीमा राशि का २%\n  - रबी फसलें: बीमा राशि का १.५%\n  - वार्षिक वाणिज्यिक/बागवानी फसलें: बीमा राशि का ५%\n- **आपदा क्लेम सूचना**: ओलावृष्टि, जलभराव या बेमौसम बारिश से नुकसान होने पर **७२ घंटे के भीतर** क्रॉप इंश्योरेंस ऐप पर सूचना देना अनिवार्य है।\n- फसल बीमा ऋण नहीं बल्कि प्राकृतिक जोखिम से सुरक्षा कवच है।`
            : `**How Pradhan Mantri Fasal Bima Yojana (PMFBY) Works:**\n\n- **Farmer Premium Contribution**:\n  - Kharif food crops & oilseeds: 2% of sum insured\n  - Rabi crops: 1.5% of sum insured\n  - Annual commercial & horticultural crops: 5% of sum insured\n- **72-Hour Intimation Window**: For localized natural calamities (hailstorm, unseasonal rain, inundation), you must notify within 72 hours via the national Crop Insurance App or bank.\n- PMFBY is risk protection, not a loan. Enrollment is seasonal and subject to notification cut-off dates.`,
          followUps: [
            'How does crop cycle affect repayment?',
            'Which documents should you keep ready?',
          ],
        };
      }

      // 6. CROP CYCLE & REPAYMENT
      if (q.includes('cycle') || q.includes('repay') || q.includes('हंगाम') || q.includes('चक्र') || q.includes('कटाई')) {
        return {
          reply: language === 'mr'
            ? `**हंगामी पीक चक्र आणि कर्ज परतफेड:**\n\n- शेतीचे उत्पन्न दुकानासारखे दररोज किंवा दरमहा येत नाही; ते पीक काढणीनंतर (४ ते ६ महिन्यांनी) एकदाच मिळते.\n- म्हणूनच शेती पीक कर्जाची परतफेड दरमहा हप्त्यांनी (Monthly EMI) न करता **काढणीनंतर एकरकमी (Bullet Repayment)** केली जाते.\n- बाजार समितीमध्ये (APMC Mandi) शेतमाल विकल्यानंतर तत्काळ बँकेचे कर्ज फेडल्यास व्याज सवलत मिळते आणि पुढच्या हंगामासाठी कर्ज मर्यादा वाढून मिळते.`
            : language === 'hi'
            ? `**फसल चक्र और ऋण अदायगी:**\n\n- कृषि आय दुकान की तरह दैनिक या मासिक नहीं होती; यह फसल कटाई के बाद (४ से ६ महीने में) प्राप्त होती है।\n- इसीलिए फसल ऋण की अदायगी मासिक ईएमआई में नहीं, बल्कि **फसल कटाई के बाद एकमुश्त (Bullet Repayment)** की जाती है।\n- मंडी में फसल बेचते ही बैंक का ऋण चुकाने पर ३% अतिरिक्त ब्याज छूट मिलती है और अगले सीजन के लिए लिमिट सुरक्षित रहती है।`
            : `**Crop Cycle & Agricultural Loan Repayment:**\n\n- Unlike retail shops with daily cash registers, farming income is realized in 1–2 seasonal harvest cycles per year.\n- Crop loans are therefore structured around **post-harvest bullet repayments**, not monthly business EMIs.\n- Clearing your seasonal KCC dues immediately after selling produce at the APMC Mandi protects your credit rating and unlocks the 3% prompt repayment incentive for the next season.`,
          followUps: [
            'Need help understanding your loan?',
            'Why is this amount shown as your financing requirement?',
          ],
        };
      }

      // 7. SCHEMES & KCC
      if (q.includes('scheme') || q.includes('kcc') || q.includes('योजना') || q.includes('miss') || q.includes('सब्सिडी')) {
        return {
          reply: language === 'mr'
            ? `**शेतकऱ्यांसाठी प्रमुख वित्तीय साहाय्य योजना:**\n\n1. **किसान क्रेडिट कार्ड (KCC)**: जिल्हा तांत्रिक समितीच्या (DLTC) वित्त प्रमाणावर आधारित अल्पमुदत पीक कर्ज.\n2. **सुधारित व्याज सवलत योजना (MISS)**: ₹३ लाखांपर्यंतच्या पीक कर्जावर वेळेवर परतफेड केल्यास केवळ ४% प्रभावी व्याजदर.\n3. **पीएम-किसान सन्मान निधी**: वर्षाला ₹६,००० थेट बँक खात्यात आधार-संलग्न साहाय्य.\n4. **कृषी पायाभूत सुविधा निधी (AIF)**: शेतमाल साठवणूक, गोदाम व प्राथमिक प्रक्रिया उपकरणांसाठी ३% व्याज सवलतीसह मुदत कर्ज.\n\n*सर्व योजनांची पात्रता महसूल नोंदी व बँक तपासणीवर अवलंबून असते.*`
            : language === 'hi'
            ? `**किसानों के लिए प्रमुख वित्तीय योजनाएं:**\n\n1. **किसान क्रेडिट कार्ड (KCC)**: जिला स्तरीय तकनीकी समिति (DLTC) वित्त पैमाने के अनुसार रियायती फसल ऋण।\n2. **संशोधित ब्याज उपदान योजना (MISS)**: ₹३ लाख तक के ऋण पर समय पर अदायगी करने पर मात्र ४% प्रभावी ब्याज दर।\n3. **पीएम-किसान सम्मान निधि**: प्रति वर्ष ₹६,००० की प्रत्यक्ष आय सहायता।\n4. **कृषि अवसंरचना कोष (AIF)**: कोल्ड स्टोरेज, ग्रेडिंग यूनिट व कृषि उपकरणों हेतु ३% ब्याज छूट पर मियादी ऋण।\n\n*सभी योजनाओं की स्वीकृति बैंक व राजस्व नियमों के अधीन है।*`
            : `**Key Agricultural Financial Schemes:**\n\n1. **Kisan Credit Card (KCC)**: Subsidized seasonal working capital based on district Scale of Finance.\n2. **Modified Interest Subvention Scheme (MISS)**: Up to ₹3 Lakh at effective 4% per annum upon prompt repayment.\n3. **PM-Kisan Samman Nidhi**: Direct income support of ₹6,000/year in 3 installments.\n4. **Agriculture Infrastructure Fund (AIF)**: Post-harvest infrastructure and farm mechanization with 3% interest subvention.\n\n*Note: Final sanction and eligibility are determined by lending banks and government verification.*`,
          followUps: [
            'Which documents should you keep ready?',
            'What does outstanding amount mean?',
          ],
        };
      }

      // 8. EXISTING DEBT IMPACT
      if (q.includes('debt') || q.includes('existing') || q.includes('चालू') || q.includes('मौजूदा') || q.includes('burden')) {
        return {
          reply: language === 'mr'
            ? `**चालू कर्जाचा नवीन पीक नियोजनावर काय परिणाम होतो?**\n\n- जर तुमच्याकडे चालू कर्ज असेल, तर नवीन अतिरिक्त कर्ज घेण्यापूर्वी तुमचे एकूण परतफेडीचे ओझे तपासणे आवश्यक आहे.\n- चालू कर्जाचे हप्ते चालू असताना आणखी कर्ज घेतल्यास पीक भाव कमी झाल्यास धोका वाढतो.\n- **शिफारस**: नवीन खासगी कर्ज घेण्याऐवजी अस्तित्वातील KCC कर्ज वेळेवर भरून त्याचेच नूतनीकरण (Renewal) करा किंवा व्याज सवलतीचा लाभ घ्या.`
            : language === 'hi'
            ? `**मौजूदा ऋण का नए फसल वित्त पर क्या प्रभाव पड़ता है?**\n\n- यदि आपके पास पहले से ऋण है, तो नया कर्ज लेने से पहले अपनी कुल अदायगी क्षमता की समीक्षा करें।\n- पहले से ईएमआई या ब्याज का बोझ होने पर अतिरिक्त कर्ज लेने से मंडी भाव गिरने पर जोखिम बढ़ जाता है।\n- **सुझाव**: किसी निजी या महंगे कर्ज के बजाय मौजूदा केसीसी का समय पर नवीनीकरण (Renewal) करवाएं।`
            : `**How Existing Debt Affects Your Farm Financing:**\n\n- If you already have an active loan, taking additional fresh credit increases your fixed repayment obligations.\n- In agriculture, harvest yields and mandi prices fluctuate each season; excessive debt compounds financial vulnerability.\n- **Recommendation**: Prioritize renewing your existing institutional KCC rather than taking unmanageable commercial or private high-interest loans.`,
          followUps: [
            'What does outstanding amount mean?',
            'Why is this amount shown as your financing requirement?',
          ],
        };
      }

      // Farmer General Fallback
      return {
        reply: language === 'mr'
          ? `मी तुमचा अर्थ एआय कृषी वित्त सल्लागार आहे. तुमच्या **${farmerCrop}** (क्षेत्र: ${farmerAcres} एकर, ${basicInfo?.district || 'तुमचा जिल्हा'}) साठी कृषी वित्तीय माहिती:\n\n- **अंदाजे लागवड खर्च**: ₹${farmerCultivationCost.toLocaleString('en-IN')}\n- **तुमचा स्वतःचा वाटा**: ₹${farmerOwnContribution.toLocaleString('en-IN')}\n- **अंदाजे वित्तपुरवठा अंतर**: ₹${farmerFinancingGap.toLocaleString('en-IN')}\n- **चालू कर्ज स्थिती**: ${hasExistingLoan ? 'चालू कर्ज नोंदवले आहे' : 'कोणतेही चालू कर्ज नाही'}\n\nखालीलपैकी कोणताही पर्याय निवडून सविस्तर माहिती विचारा.`
          : language === 'hi'
          ? `मैं आपका अर्थ एआई कृषि वित्त सलाहकार हूँ। आपकी **${farmerCrop}** (रकबा: ${farmerAcres} एकड़, ${basicInfo?.district || 'आपका जिला'}) के लिए कृषि वित्तीय सारांश:\n\n- **अनुमानित खेती लागत**: ₹${farmerCultivationCost.toLocaleString('en-IN')}\n- **आपका स्वयं का अंशदान**: ₹${farmerOwnContribution.toLocaleString('en-IN')}\n- **अनुमानित वित्तीय आवश्यकता**: ₹${farmerFinancingGap.toLocaleString('en-IN')}\n- **मौजूदा ऋण स्थिति**: ${hasExistingLoan ? 'मौजूदा ऋण दर्ज है' : 'कोई मौजूदा ऋण नहीं'}\n\nनीचे दिए गए विषयों में से किसी पर भी प्रश्न पूछें।`
          : `I am your ARTH AI Agricultural Financial Advisor for **${farmerCrop}** (${farmerAcres} Acres, ${basicInfo?.district || 'your locality'}):\n\n- **Estimated Cultivation Cost**: ₹${farmerCultivationCost.toLocaleString('en-IN')}\n- **Your Own Contribution**: ₹${farmerOwnContribution.toLocaleString('en-IN')}\n- **Estimated Financing Requirement**: ₹${farmerFinancingGap.toLocaleString('en-IN')}\n- **Existing Loan Status**: ${hasExistingLoan ? 'Active debt reported' : 'No active debt reported'}\n\nAsk me about your crop loan, documents needed, PMFBY insurance, or repayment terms.`,
        metrics: [
          { label: 'Cultivation Cost', value: `₹${farmerCultivationCost.toLocaleString('en-IN')}`, variant: 'neutral' },
          { label: 'Own Contribution', value: `₹${farmerOwnContribution.toLocaleString('en-IN')}`, variant: 'primary' },
          { label: 'Financing Gap', value: `₹${farmerFinancingGap.toLocaleString('en-IN')}`, variant: 'success' },
        ],
        actionButtons: [
          { label: 'Why is this amount shown as financing requirement?', actionQuery: 'Why is this amount shown as your financing requirement?' },
          { label: 'Which documents to keep ready?', actionQuery: 'Which documents should you keep ready?' },
        ],
        followUps: [
          'What does outstanding amount mean?',
          'How does crop insurance work for my crop?',
        ],
      };
    }

    // ============================================
    // BUSINESS MODE ADVISOR
    // ============================================
    // 1. TODAY'S FINANCES / REVENUE / BALANCE
    if (
      q.includes('finance') ||
      q.includes('हिशोब') ||
      q.includes('हिसाब') ||
      q.includes('today') ||
      q.includes('balance') ||
      q.includes('cash flow')
    ) {
      const todaySales = dailyLog?.actualSales || targetDailySales || 4250;
      const todayExp = dailyLog?.actualExpenses || targetDailyExp || 2780;
      const todaySurplus = todaySales - todayExp - dailyEmiReserve;

      if (language === 'mr') {
        return {
          reply: `आजच्या व्यवहारांचा संक्षिप्त आढावा:\n\nतुमच्या **${businessTitle}** साठी दैनंदिन हिशोब खालीलप्रमाणे आहे. दररोज बँक कर्जाचा वाटा आधीच बाजूला ठेवल्याने महिन्याअखेर परतफेडीचा कोणताही ताण येत नाही.`,
          metrics: [
            { label: 'आजची विक्री (Revenue)', value: `₹${todaySales.toLocaleString('en-IN')}`, subtext: `लक्ष्य: ₹${targetDailySales.toLocaleString('en-IN')}`, variant: 'primary' },
            { label: 'एकूण खर्च (Expenses)', value: `₹${todayExp.toLocaleString('en-IN')}`, subtext: 'कच्चा माल व वाहतूक', variant: 'warning' },
            { label: 'कर्ज हप्ता वाटा (EMI Share)', value: `₹${dailyEmiReserve.toLocaleString('en-IN')}`, subtext: 'दररोज बाजूला ठेवा', variant: 'neutral' },
            { label: 'हातात शिल्लक (Net Profit)', value: `₹${Math.max(0, todaySurplus).toLocaleString('en-IN')}`, subtext: 'सर्व खर्च वजा जाता', variant: 'success' },
          ],
          actionButtons: [
            { label: 'खर्च कसे कमी करावे?', actionQuery: 'माझे खर्च कमी करण्याचे उपाय सांगा' },
            { label: 'कर्ज सुरक्षितता तपासा', actionQuery: 'माझा व्यवसाय सहजपणे कर्ज फेडू शकतो का?' },
          ],
          followUps: [
            'मी विक्री कशी वाढवू शकतो?',
            'उद्याचे नियोजन काय असावे?',
          ],
        };
      } else if (language === 'hi') {
        return {
          reply: `आज का व्यावसायिक वित्तीय सारांश:\n\nआपके **${businessTitle}** के लिए दैनिक आंकड़े नीचे दिए गए हैं। प्रतिदिन ऋण का हिस्सा पहले ही अलग रखने से महीने के अंत में ईएमआई भरने में कोई तनाव नहीं होता।`,
          metrics: [
            { label: 'दैनिक आय (Revenue)', value: `₹${todaySales.toLocaleString('en-IN')}`, subtext: `दैनिक लक्ष्य: ₹${targetDailySales.toLocaleString('en-IN')}`, variant: 'primary' },
            { label: 'दैनिक खर्च (Expenses)', value: `₹${todayExp.toLocaleString('en-IN')}`, subtext: 'कच्चा माल, दुकान व मालभाड़ा', variant: 'warning' },
            { label: 'दैनिक ऋण हिस्सा (EMI)', value: `₹${dailyEmiReserve.toLocaleString('en-IN')}`, subtext: 'आज ही बैंक खाते में रखें', variant: 'neutral' },
            { label: 'खर्च के बाद बचा पैसा', value: `₹${Math.max(0, todaySurplus).toLocaleString('en-IN')}`, subtext: 'शुद्ध दैनिक बचत', variant: 'success' },
          ],
          actionButtons: [
            { label: 'खर्चों का विश्लेषण', actionQuery: 'मेरे खर्च का विश्लेषण करें' },
            { label: 'ऋण सुरक्षितता जांचें', actionQuery: 'क्या मेरा व्यवसाय आसानी से ऋण चुका सकता है?' },
          ],
          followUps: [
            'मैं आज की बिक्री कैसे बढ़ाऊं?',
            'कल के लिए क्या तैयारी करूं?',
          ],
        };
      }

      return {
        reply: `Here is your daily financial snapshot for **${businessTitle}**:\n\nSetting aside your daily bank loan allocation before closing the cash register ensures effortless monthly repayments with zero stress.`,
        metrics: [
          { label: 'Revenue (Sales)', value: `₹${todaySales.toLocaleString('en-IN')}`, subtext: `Target: ₹${targetDailySales.toLocaleString('en-IN')}`, variant: 'primary' },
          { label: 'Business Expenses', value: `₹${todayExp.toLocaleString('en-IN')}`, subtext: 'Materials, inventory & logistics', variant: 'warning' },
          { label: 'Loan Allocation (EMI)', value: `₹${dailyEmiReserve.toLocaleString('en-IN')}`, subtext: 'Escrow into bank daily', variant: 'neutral' },
          { label: 'Money Left Over', value: `₹${Math.max(0, todaySurplus).toLocaleString('en-IN')}`, subtext: 'Net pocket income today', variant: 'success' },
        ],
        actionButtons: [
          { label: 'How to reduce costs?', actionQuery: 'How can I reduce my business costs?' },
          { label: 'Can I comfortably repay loan?', actionQuery: 'Can my business comfortably repay the loan?' },
        ],
        followUps: [
          'How can I increase sales this week?',
          'What should I prioritize tomorrow morning?',
        ],
      };
    }

    // 2. EXPENSES & COST OPTIMIZATION
    if (
      q.includes('expense') ||
      q.includes('cost') ||
      q.includes('खर्च') ||
      q.includes('reduce')
    ) {
      if (language === 'mr') {
        return {
          reply: `खर्च नियंत्रण आणि बचतीचे व्यावहारिक उपाय:\n\nतुमच्या व्यवसायाचा अंदाजे मासिक खर्च **₹${exp.toLocaleString('en-IN')}** आहे (दररोज सुमारे **₹${targetDailyExp.toLocaleString('en-IN')}**).\n\n1. **कच्चा माल थेट खरेदी**: जवळच्या इतर २-३ व्यावसायिकांशी एकत्र येऊन थेट घाऊक बाजारातून खरेदी करा. यामुळे ५% ते ८% बचत होते.\n2. **वाहतूक खर्च नियंत्रण**: आठवड्यातून रोज माल आणण्याऐवजी आठवड्यातून फक्त दोनदा एकत्रित वाहतूक करा.\n3. **उधारी टाळा**: ग्राहकांना उधारीवर माल देणे थांबवा; उधारीमुळे खेळते भांडवल अडकते.`,
          table: {
            headers: ['खर्चाचा प्रकार', 'साधारण वाटा', 'बचतीची संधी'],
            rows: [
              ['कच्चा माल / स्टॉक', '५५% - ६५%', 'घाऊक एकत्रित ऑर्डर'],
              ['वाहतूक व वितरण', '१०% - १५%', 'साप्ताहिक मार्ग नियोजन'],
              ['जागा भाडे व वीज', '१०% - १२%', 'नियमित मीटर तपासणी'],
              ['इतर आकस्मिक खर्च', '५% - ८%', 'दैनिक नोंद वही'],
            ],
          },
          actionButtons: [
            { label: 'आजचा नफा तपासा', actionQuery: 'माझा नफा मोजा' },
            { label: 'कर्ज सुरक्षितता तपासा', actionQuery: 'कर्ज सुरक्षितता तपासा' },
          ],
        };
      } else if (language === 'hi') {
        return {
          reply: `व्यावसायिक खर्च विश्लेषण व बचत के उपाय:\n\nआपके **${businessTitle}** का अनुमानित मासिक खर्च **₹${exp.toLocaleString('en-IN')}** (दैनिक लगभग **₹${targetDailyExp.toLocaleString('en-IN')}**) है।\n\n1. **कच्चे माल की थोक खरीद**: आस-पास के दुकानदारों या किसानों के साथ मिलकर थोक ऑर्डर दें। इससे सीधे ५% से ७% की लागत बचती है।\n2. **परिवहन व मालभाड़ा नियंत्रण**: दैनिक फेरों की जगह सप्ताह में २-३ बार तय रूट पर माल मंगाएं।\n3. **उधारी पर नियंत्रण**: बिना अग्रिम पैसे दिए माल न दें। नकदी प्रवाह को मजबूत रखें।`,
          table: {
            headers: ['खर्च की श्रेणी', 'अनुपात (%)', 'लागत कम करने का तरीका'],
            rows: [
              ['कच्चा माल व स्टॉक', '६०%', 'साप्ताहिक थोक खरीदारी'],
              ['परिवहन व लॉजिस्टिक्स', '१२%', 'साझा वाहन व्यवस्था'],
              ['दुकान/शेड का खर्च व बिजली', '१०%', 'नियमित निगरानी'],
              ['विविध खर्च', '८%', 'दैनिक डायरी मेंटेन करना'],
            ],
          },
          actionButtons: [
            { label: 'मेरा मुनाफा निकालें', actionQuery: 'मेरा मुनाफा निकालें' },
            { label: 'ऋण विकल्प देखें', actionQuery: 'ऋण विकल्प देखें' },
          ],
        };
      }

      return {
        reply: `Operating Expense Breakdown & Optimization Plan:\n\nYour planned monthly business expenditure is **${formatIndianCurrency(exp)}** (approx. **${formatIndianCurrency(targetDailyExp)}/day**).\n\n1. **Bulk Input Procurement**: Pool orders with 2 neighbouring enterprises in ${basicInfo?.district || 'your town'} to negotiate a 5–7% wholesale rebate on raw stock.\n2. **Logistics Optimization**: Reduce daily supply trips to twice a week to eliminate unnecessary transport fuel costs.\n3. **Tight Working Capital Discipline**: Avoid loose credit terms that lock up your cash balance.`,
        table: {
          headers: ['Expense Category', 'Share of Total', 'Optimization Opportunity'],
          rows: [
            ['Raw Materials & Stock', '60%', 'Pool bulk supplier orders'],
            ['Transport & Delivery', '12%', 'Batch supply twice a week'],
            ['Premises & Utilities', '10%', 'Energy-efficient practices'],
            ['Miscellaneous Operating', '8%', 'Maintain daily expense log'],
          ],
        },
        actionButtons: [
          { label: 'Calculate my profit', actionQuery: 'Calculate my profit' },
          { label: 'Check loan repayment safety', actionQuery: 'Can your business comfortably repay the loan?' },
        ],
      };
    }

    // 3. LOANS, SCHEMES & REPAYMENT SAFETY
    if (
      q.includes('loan') ||
      q.includes('scheme') ||
      q.includes('कर्ज') ||
      q.includes('लोन') ||
      q.includes('योजना') ||
      q.includes('repay') ||
      q.includes('emi')
    ) {
      const isSafe = (feasibility?.dscr || 1.8) >= 1.25;

      if (language === 'mr') {
        return {
          reply: `कर्ज आणि सरकारी योजनांबद्दल मार्गदर्शन:\n\nतुमचा प्रकल्प खर्च **₹${cost.toLocaleString('en-IN')}** असून सुरक्षित कर्ज मर्यादा **₹${loan.toLocaleString('en-IN')}** आहे. मासिक हप्ता **₹${emi.toLocaleString('en-IN')}** (दररोज ₹${dailyEmiReserve}) येतो.\n\n**कर्ज सुरक्षितता**: ${isSafe ? 'तुमचा व्यवसाय सहजपणे हे कर्ज फेडू शकतो.' : 'कर्ज घेताना सावधगिरी बाळगा, स्वतःचे भांडवल वाढवा.'}\n\n**शिफारस केलेल्या योजना**:\n1. **मुद्रा योजना (PMMY - किशोर)**: ₹५०,००० ते ₹५ लाख विनातारण कर्ज.\n2. **पीएमईजीपी (PMEGP)**: १५% ते ३५% सरकारी अनुदान उपलब्ध.\n3. **प्राधान्य क्षेत्र कर्ज (Priority Sector)**: ग्रामीण बँकांकडून वाजवी व्याजदरावर अर्थसहाय्य.`,
          metrics: [
            { label: 'प्रकल्प खर्च', value: `₹${cost.toLocaleString('en-IN')}`, variant: 'neutral' },
            { label: 'कर्ज रक्कम', value: `₹${loan.toLocaleString('en-IN')}`, variant: 'primary' },
            { label: 'मासिक हप्ता (EMI)', value: `₹${emi.toLocaleString('en-IN')}`, variant: 'warning' },
            { label: 'कर्ज फेडण्याची क्षमता', value: isSafe ? 'उत्कृष्ट (सुरक्षित)' : 'मध्यम', variant: isSafe ? 'success' : 'warning' },
          ],
          actionButtons: [
            { label: 'दैनिक उद्दिष्ट पहा', actionQuery: 'आजचा आर्थिक हिशोब दाखवा' },
            { label: 'नफा कसा वाढवावा?', actionQuery: 'माझा नफा वाढवण्यासाठी काय करावे?' },
          ],
        };
      } else if (language === 'hi') {
        return {
          reply: `ऋण व सरकारी योजनाओं का संपूर्ण विवरण:\n\nआपके व्यवसाय के लिए परियोजना लागत **₹${cost.toLocaleString('en-IN')}** है। बैंक से सुरक्षित ऋण सीमा **₹${loan.toLocaleString('en-IN')}** है, जिसकी मासिक किस्त लगभग **₹${emi.toLocaleString('en-IN')}** (दैनिक ₹${dailyEmiReserve}) बनती है।\n\n**ऋण सुरक्षा जांच**: ${isSafe ? 'हाँ, आपका व्यवसाय आसानी से बैंक किस्त चुका सकता है।' : 'किस्त चुकाने के लिए आपको दैनिक बिक्री लक्ष्य पर कड़ी नजर रखनी होगी।'}\n\n**उपयुक्त सरकारी योजनाएं**:\n1. **प्रधानमंत्री मुद्रा योजना (PMMY)**: बिना गारंटी ₹५० हजार से ₹५ लाख तक ऋण।\n2. **पीएमईजीपी (PMEGP)**: ग्रामीण क्षेत्रों में २५% से ३५% तक सरकारी सब्सिडी।\n3. **प्राथमिकता प्राप्त क्षेत्र ऋण**: सरकारी व ग्रामीण बैंकों से सुलभ ब्याज दर पर।`,
          metrics: [
            { label: 'कुल परियोजना लागत', value: `₹${cost.toLocaleString('en-IN')}`, variant: 'neutral' },
            { label: 'ऋण राशि', value: `₹${loan.toLocaleString('en-IN')}`, variant: 'primary' },
            { label: 'मासिक किस्त (EMI)', value: `₹${emi.toLocaleString('en-IN')}`, variant: 'warning' },
            { label: 'ऋण चुकाने की सुरक्षा', value: isSafe ? 'सुरक्षित (पर्याप्त बचत)' : 'सावधानी जरूरी', variant: isSafe ? 'success' : 'warning' },
          ],
          actionButtons: [
            { label: 'आज का दैनिक हिसाब', actionQuery: 'आज का हिसाब देखें' },
            { label: 'मुनाफा बढ़ाने के तरीके', actionQuery: 'मुनाफा बढ़ाने में मदद करें' },
          ],
        };
      }

      return {
        reply: `Loan Feasibility & Recommended Schemes:\n\nTotal estimated project setup cost is **${formatIndianCurrency(cost)}**. The recommended safe borrowing limit is **${formatIndianCurrency(loan)}**, requiring an EMI of **${formatIndianCurrency(emi)}/month** (just **${formatIndianCurrency(dailyEmiReserve)}/day**).\n\n**Repayment Safety Assessment**: ${isSafe ? 'Can your business comfortably repay the loan? Yes, your projected cash flow covers the payment with a healthy buffer.' : 'Exercise caution: Increase your own capital to reduce monthly EMI burden.'}\n\n**Suitable Government Schemes**:\n1. **Pradhan Mantri Mudra Yojana (PMMY - Kishore)**: Collateral-free micro loans from ₹50,000 to ₹5,00,000.\n2. **PMEGP**: Up to 35% capital subsidy for rural micro-enterprises.\n3. **Priority Sector Lending (PSL)**: Regulated bank loans with transparent interest margins.`,
        metrics: [
          { label: 'Project Cost', value: `₹${cost.toLocaleString('en-IN')}`, variant: 'neutral' },
          { label: 'Safe Loan Amount', value: `₹${loan.toLocaleString('en-IN')}`, variant: 'primary' },
          { label: 'Monthly EMI', value: `₹${emi.toLocaleString('en-IN')}`, variant: 'warning' },
          { label: 'Repayment Safety', value: isSafe ? 'Comfortable Safe' : 'Needs Monitoring', variant: isSafe ? 'success' : 'warning' },
        ],
        actionButtons: [
          { label: 'Show me today\'s expenses', actionQuery: 'Show me today\'s expenses' },
          { label: 'Calculate my profit', actionQuery: 'Calculate my profit' },
        ],
      };
    }

    // 4. LOCAL MARKET DEMAND & COMPETITION
    if (
      q.includes('market') ||
      q.includes('demand') ||
      q.includes('बाजार') ||
      q.includes('ग्राहक') ||
      q.includes('स्पर्धा')
    ) {
      const loc = basicInfo?.district || 'your local region';
      if (language === 'mr') {
        return {
          reply: `स्थानिक बाजारपेठ आणि ग्राहक मागणी विश्लेषण (${loc}):\n\n- **मागणी संकेत**: ${hyperLocal?.demandSignal || 'स्थानिक पातळीवर स्थिर ग्राहक मागणी'}\n- **किमान ग्राहक संख्या**: दररोज सुमारे **${Math.round(targetDailySales / 250)} ते ${Math.round(targetDailySales / 180)} नियमित ग्राहक** आवश्यक आहेत.\n- **स्थानिक स्पर्धा**: नजीकच्या ३-४ दुकानांपेक्षा चांगला दर्जा आणि त्वरित सेवा देऊन ग्राहकांना जोडा.\n- **आठवडी बाजार**: स्थानिक आठवडी बाजाराच्या दिवशी २०% ते ३०% जास्तीचा स्टॉक ठेवा.`,
          actionButtons: [
            { label: 'माझा नफा मोजा', actionQuery: 'माझा नफा मोजा' },
            { label: 'आजच्या ३ कृती सांगा', actionQuery: 'आजच्या दिवसासाठी ३ महत्त्वाच्या कृती सांगा' },
          ],
        };
      } else if (language === 'hi') {
        return {
          reply: `स्थानीय बाजार मांग और ग्राहक विश्लेषण (${loc}):\n\n- **मांग की स्थिति**: ${hyperLocal?.demandSignal || 'स्थानीय स्तर पर निरंतर उपभोग मांग'}\n- **दैनिक ग्राहक लक्ष्य**: प्रतिदिन **${Math.round(targetDailySales / 250)} से ${Math.round(targetDailySales / 180)} नियमित ग्राहक** जरूरी हैं।\n- **प्रतिस्पर्धा रणनीति**: उधारी देने के बजाय ताजे उत्पाद व सम्मानजनक ग्राहक सेवा पर ध्यान दें।\n- **साप्ताहिक हाट**: स्थानीय साप्ताहिक बाजार के दिन बिक्री बढ़ाने की अग्रिम तैयारी रखें।`,
          actionButtons: [
            { label: 'मेरा मुनाफा निकालें', actionQuery: 'मेरा मुनाफा निकालें' },
            { label: 'आज मुझे क्या करना चाहिए?', actionQuery: 'आज मुझे क्या करना चाहिए?' },
          ],
        };
      }

      return {
        reply: `Local Market Demand & Competition Analysis in **${loc}**:\n\n- **Local Demand Signal**: ${hyperLocal?.demandSignal || 'Healthy recurring footfall with sustained local consumption'}.\n- **Customer Footfall Target**: You need approx. **${Math.round(targetDailySales / 250)} to ${Math.round(targetDailySales / 180)} transactions/day** at an average basket size of ₹200–₹250.\n- **Competitive Edge**: Compete on prompt local fulfillment, reliability, and quality rather than risky customer credit.\n- **Weekly Haat/Bazaar**: Plan 30% higher stock buffer for local weekly market days.`,
        actionButtons: [
          { label: 'Calculate my profit', actionQuery: 'Calculate my profit' },
          { label: 'What should I do today?', actionQuery: 'What should I do today?' },
        ],
      };
    }

    // 5. PROFIT IMPROVEMENT & 3 PRACTICAL ACTIONS TODAY
    if (
      q.includes('profit') ||
      q.includes('नफा') ||
      q.includes('मुनाफा') ||
      q.includes('improve') ||
      q.includes('today') ||
      q.includes('काय करावे') ||
      q.includes('क्या करना')
    ) {
      if (language === 'mr') {
        return {
          reply: `नफा वाढवण्यासाठी आणि सुरक्षित राहण्यासाठी आजच्या ३ कृती:\n\n1. **दैनिक बँक हप्ता बाजूला ठेवा**: आजच्या कमाईतून **₹${dailyEmiReserve}** लगेच बँकेत किंवा स्वतंत्र पेटीत ठेवा.\n2. **नियमित ३ ग्राहकांशी संपर्क**: उद्याच्या २०% ते ३०% ऑर्डर्स आज संध्याकाळीच निश्चित करा.\n3. **कच्चा माल थेट खरेदी**: ५% रोख सूट मिळवण्यासाठी पुरवठादाराशी बोलणी करा.\n\nया ३ नियमांमुळे तुमचा मासिक नफा **₹${surplus.toLocaleString('en-IN')}** च्या पुढे जाऊ शकतो.`,
          metrics: [
            { label: 'मासिक अपेक्षित नफा', value: `₹${surplus.toLocaleString('en-IN')}`, variant: 'success' },
            { label: 'दैनिक विक्री लक्ष्य', value: `₹${targetDailySales.toLocaleString('en-IN')}`, variant: 'primary' },
          ],
          actionButtons: [
            { label: 'आजचा हिशोब पहा', actionQuery: 'आजचा आर्थिक हिशोब दाखवा' },
            { label: 'खर्च कमी करा', actionQuery: 'माझे खर्च कमी करण्याचे उपाय सांगा' },
          ],
        };
      } else if (language === 'hi') {
        return {
          reply: `मुनाफा बढ़ाने और व्यवसाय सुरक्षित रखने के लिए आज के ३ मुख्य कार्य:\n\n1. **दैनिक ऋण हिस्सा सुरक्षित करें**: आज ही अपनी बिक्री में से **₹${dailyEmiReserve}** बैंक खाते में अलग रख लें।\n2. **३ प्रमुख ग्राहकों से बात करें**: कल की ३०% बिक्री के अग्रिम ऑर्डर आज शाम ही पक्के कर लें।\n3. **सामग्री की सीधी खरीद**: सप्लायर से नकद भुगतान पर ५% छूट की मांग करें।\n\nइन ३ सरल आदतों से आपका अनुमानित मासिक मुनाफा **₹${surplus.toLocaleString('en-IN')}** सुरक्षित रहेगा।`,
          metrics: [
            { label: 'अनुमानित मासिक लाभ', value: `₹${surplus.toLocaleString('en-IN')}`, variant: 'success' },
            { label: 'दैनिक बिक्री लक्ष्य', value: `₹${targetDailySales.toLocaleString('en-IN')}`, variant: 'primary' },
          ],
          actionButtons: [
            { label: 'आज का हिसाब दिखाएं', actionQuery: 'आज का हिसाब दिखाएं' },
            { label: 'खर्च कम करने के उपाय', actionQuery: 'मेरे खर्च का विश्लेषण करें' },
          ],
        };
      }

      return {
        reply: `3 Practical Actions to Maximize Profit Today:\n\n1. **Escrow Today's Debt Share**: Reserve **${formatIndianCurrency(dailyEmiReserve)}** for your bank loan payment before closing your register tonight.\n2. **Advance Customer Orders**: Connect with 3 key local buyers tonight to lock in 30% of tomorrow's target (**${formatIndianCurrency(targetDailySales)}**).\n3. **Input Cost Discount**: Negotiate a 5% prompt-cash rebate from your main raw material supplier.`,
        metrics: [
          { label: 'Projected Net Profit', value: `₹${surplus.toLocaleString('en-IN')}/mo`, variant: 'success' },
          { label: 'Daily Sales Target', value: `₹${targetDailySales.toLocaleString('en-IN')}/day`, variant: 'primary' },
        ],
        actionButtons: [
          { label: 'Check today\'s finances', actionQuery: 'Check my today\'s finances and cash flow' },
          { label: 'How can I reduce costs?', actionQuery: 'How can I reduce my business costs?' },
        ],
      };
    }

    // Default Fallback: Tailored Advisor Overview
    return {
      reply:
        language === 'mr'
          ? `तुमच्या **${businessTitle}** साठी अर्थ एआय सल्लागार सक्रिय आहे.\n\n- दैनिक विक्री उद्दिष्ट: **₹${targetDailySales.toLocaleString('en-IN')}**\n- दैनिक खर्च मर्यादा: **₹${targetDailyExp.toLocaleString('en-IN')}**\n- दैनिक कर्ज वाटा: **₹${dailyEmiReserve.toLocaleString('en-IN')}**\n- मासिक अंदाजे नफा: **₹${surplus.toLocaleString('en-IN')}**\n\nआपण आर्थिक हिशोब, सरकारी योजना किंवा स्थानिक बाजाराबद्दल कोणताही प्रश्न विचारू शकता.`
          : language === 'hi'
          ? `आपके **${businessTitle}** के लिए अर्थ एआई सलाहकार तैयार है।\n\n- दैनिक बिक्री लक्ष्य: **₹${targetDailySales.toLocaleString('en-IN')}**\n- दैनिक खर्च सीमा: **₹${targetDailyExp.toLocaleString('en-IN')}**\n- दैनिक ऋण हिस्सा: **₹${dailyEmiReserve.toLocaleString('en-IN')}**\n- मासिक शुद्ध बचत: **₹${surplus.toLocaleString('en-IN')}**\n\nआप अपने व्यवसाय से जुड़ा कोई भी प्रश्न पूछ सकते हैं।`
          : `I am your ARTH AI Business Advisor for **${businessTitle}** in ${basicInfo?.village || basicInfo?.district || 'your locality'}.\n\n- Planned Daily Sales: **${formatIndianCurrency(targetDailySales)}**\n- Daily Expense Ceiling: **${formatIndianCurrency(targetDailyExp)}**\n- Daily Loan Reserve: **${formatIndianCurrency(dailyEmiReserve)}**\n- Expected Monthly Pocket Surplus: **${formatIndianCurrency(surplus)}**\n\nAsk me any operational question or select a topic below.`,
      metrics: [
        { label: 'Daily Sales Target', value: `₹${targetDailySales.toLocaleString('en-IN')}`, variant: 'primary' },
        { label: 'Money Left After Expenses', value: `₹${surplus.toLocaleString('en-IN')}/mo`, variant: 'success' },
      ],
      actionButtons: [
        { label: 'Check today\'s finances', actionQuery: 'Check my today\'s finances and cash flow' },
        { label: 'Check loan options', actionQuery: 'Find suitable loans' },
      ],
    };
  };

  

  const handleSendMessage = async (customText?: string) => {
  const textToSend = customText || inputQuery;

  if (!textToSend.trim() && !attachedFile) return;

  const userMessageText = attachedFile
    ? `[Document Attached: ${attachedFile}]\n${textToSend}`
    : textToSend;

  const userMessage: Message = {
    id: `usr-${Date.now()}`,
    sender: 'user',
    text: userMessageText,
    timestamp: new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputQuery('');
  setAttachedFile(null);
  setIsTyping(true);

  try {
    const response = await fetch(`${API_URL}/rag/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: textToSend,
        top_k: 3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();

    const aiMessage: Message = {
  id: `ai-${Date.now()}`,
  sender: 'ai',
  text:
    data.answer?.answer ||
    data.response ||
    'I could not generate an answer right now.',
  timestamp: new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }),
};
    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.error('ARTH AI request failed:', error);

    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text:
        'Sorry, I could not connect to ARTH AI right now. Please try again.',
      timestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, aiMessage]);
  } finally {
    setIsTyping(false);
  }
};
// Clear Chat / New Conversation
  const handleNewConversation = () => {
    setMessages([]);
    setInputQuery('');
    setAttachedFile(null);
  };

  // Voice Input Toggle (Web Speech API with graceful fallback feedback)
  const handleToggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Simulate speech input in case browser permission is denied or unsupported in iframe
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputQuery(language === 'mr' ? 'आजचा नफा आणि हिशोब तपासा' : language === 'hi' ? 'आज का मुनाफा और हिसाब जांचें' : "Check today's finances and profit");
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="ask-arth-ai-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={`bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isExpanded
            ? 'w-full h-full max-w-6xl max-h-[96vh]'
            : 'w-full max-w-2xl h-[680px] max-h-[92vh]'
        }`}
      >
        {/* ================= HEADER BAR ================= */}
        <div className="bg-[#0b192c] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            {/* Emblem with active status dot */}
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-400/40 bg-slate-950 flex items-center justify-center shadow-md shrink-0">
                <img
                  src="/arth_emblem.jpg"
                  alt="ARTH AI"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <Bot className="w-5 h-5 text-amber-400 hidden" />
              </div>
              {/* Active green status indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0b192c] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white tracking-tight">ARTH AI</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {isFarmer
                      ? language === 'mr'
                        ? 'कृषी वित्त सल्लागार'
                        : language === 'hi'
                        ? 'कृषि वित्त सलाहकार'
                        : 'Agri Financial Advisor'
                      : t.arthAiAdvisorTitle || 'Business Advisor'}
                  </span>
                </span>
              </div>
              <span className="text-[11px] text-slate-300 block">
                {isFarmer
                  ? language === 'mr'
                    ? 'शेती व पीक कर्ज साहाय्यक'
                    : language === 'hi'
                    ? 'कृषि व फसल ऋण सहायक'
                    : 'Crop credit & farm financing assistant'
                  : t.arthAiAdvisorSubtitle || 'Your local business assistant'}
              </span>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Switcher Dropdown inside Chatbot */}
            {onLanguageChange && (
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  aria-label="Change Chat Language"
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 pr-6 appearance-none focus:outline-hidden focus:border-amber-400 cursor-pointer font-medium"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="mr">मराठी</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            )}

            {/* New Conversation Button */}
            <button
              type="button"
              onClick={handleNewConversation}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title={t.newChat || 'New Conversation'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Clear Chat Button */}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleNewConversation}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title={t.clearChat || 'Clear Chat'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Expand / Minimize */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:inline-flex p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= CHAT CONTENT AREA ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#FAFBFD] space-y-4">
          {/* WELCOME STATE: Displayed when no user message has been sent yet */}
          {messages.length === 0 ? (
            <div className="space-y-6 py-2">
              {/* Friendly Welcome Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 flex items-center justify-center text-xl shrink-0">
                    🙏
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {isFarmer
                        ? language === 'mr'
                          ? 'अर्थ एआय कृषी सल्लागार तुमची काय मदत करू शकतो?'
                          : language === 'hi'
                          ? 'अर्थ एआई कृषि सलाहकार आपकी क्या मदद कर सकता है?'
                          : 'How can ARTH AI help your farm financing today?'
                        : t.howCanArthHelp || 'How can ARTH AI help your business today?'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {isFarmer
                        ? language === 'mr'
                          ? `नमस्कार ${basicInfo?.name || 'शेतकरी मित्र'}! मी तुमचा अर्थ एआय कृषी सल्लागार आहे. तुमच्या ${farmerCrop} पिकाच्या लागवड खर्चाचा अंदाज, बँक कर्ज मर्यादा, कागदपत्रे किंवा पीक विम्याबद्दल काहीही विचारा.`
                          : language === 'hi'
                          ? `नमस्ते ${basicInfo?.name || 'किसान साथी'}! मैं आपका अर्थ एआई कृषि सलाहकार हूँ। अपनी ${farmerCrop} फसल की खेती की लागत, बैंक ऋण, कागजात या फसल बीमा के बारे में बेझिझक पूछें।`
                          : `Namaste ${basicInfo?.name || 'Friend'}! I am your ARTH AI Agricultural Financial Advisor for your ${farmerCrop} crop. Ask me anything about crop cultivation costs, KCC credit, documents required, or PMFBY crop insurance.`
                        : language === 'mr'
                        ? `नमस्कार ${basicInfo?.name || 'मित्र'}! मी तुमचा अर्थ एआय व्यावसायिक सल्लागार आहे. तुमचे दैनंदिन वित्त, ग्राहकांची मागणी, कर्ज पर्याय किंवा नफा वाढवण्याबाबत काहीही विचारा.`
                        : language === 'hi'
                        ? `नमस्ते ${basicInfo?.name || 'साथी'}! मैं आपका अर्थ एआई सलाहकार हूँ। अपने दैनिक खर्च, बिक्री, सरकारी योजनाओं व बैंक ऋण के बारे में निस्संकोच पूछें।`
                        : `Namaste ${basicInfo?.name || 'Friend'}! I am your ARTH AI Business Advisor for ${businessTitle}. Ask me anything about your daily finances, customer demand, loan options, or practical next steps.`}
                    </p>
                  </div>
                </div>

                {/* Quick enterprise/farmer snapshot pill */}
                {isFarmer ? (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 tabular-nums">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold">
                      🌾 {farmerCrop} ({farmerAcres} {language === 'mr' ? 'एकर' : language === 'hi' ? 'एकड़' : 'Acres'})
                    </span>
                    <span>•</span>
                    <span>{language === 'mr' ? 'लागवड खर्च' : language === 'hi' ? 'खेती लागत' : 'Cultivation Cost'}: ₹{farmerCultivationCost.toLocaleString('en-IN')}</span>
                    <span>•</span>
                    <span>{language === 'mr' ? 'वित्तपुरवठा अंतर' : language === 'hi' ? 'वित्तीय आवश्यकता' : 'Financing Gap'}: ₹{farmerFinancingGap.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 tabular-nums">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-semibold">
                      {businessTitle}
                    </span>
                    <span>•</span>
                    <span>Target Sales: ₹{targetDailySales.toLocaleString('en-IN')}/day</span>
                    <span>•</span>
                    <span>EMI: ₹{dailyEmiReserve.toLocaleString('en-IN')}/day</span>
                  </div>
                )}
              </div>

              {/* 8 Quick Action Cards */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
                  {isFarmer
                    ? language === 'mr'
                      ? 'शेतकऱ्यांसाठी महत्त्वाचे विषय'
                      : language === 'hi'
                      ? 'किसानों के लिए जरूरी विषय'
                      : 'Farmer Financing Help Topics'
                    : language === 'mr'
                    ? 'वारंवार विचारले जाणारे विषय'
                    : language === 'hi'
                    ? 'अक्सर पूछे जाने वाले विषय'
                    : 'Quick Actions for Your Business'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {quickActionCards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleSendMessage(card.query)}
                      className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all text-left shadow-xs cursor-pointer group flex items-start gap-3"
                    >
                      <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{card.icon}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-900 transition-colors">
                          {card.title}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5 line-clamp-1">
                          {card.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* CONVERSATION MESSAGE LOG */
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] p-4 rounded-2xl leading-relaxed text-xs sm:text-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#0b192c] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs space-y-3'
                    }`}
                  >
                    {/* Assistant Message Header Icon */}
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-400 text-[11px] font-medium">
                        <span className="font-bold text-amber-700">ARTH AI Advisor</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    )}

                    {/* Formatted Text Body */}
                    <div
                      className="space-y-2 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>'),
                      }}
                    />

                    {/* Render Metric Cards if present */}
                    {msg.metrics && msg.metrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 pt-1">
                        {msg.metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className={`p-2.5 rounded-xl border ${
                              m.variant === 'primary'
                                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                                : m.variant === 'success'
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                : m.variant === 'warning'
                                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                                : 'bg-slate-50 border-slate-200 text-slate-900'
                            }`}
                          >
                            <span className="text-[10px] font-semibold block text-slate-500 uppercase">
                              {m.label}
                            </span>
                            <span className="text-sm sm:text-base font-bold tabular-nums block mt-0.5">
                              {m.value}
                            </span>
                            {m.subtext && (
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                {m.subtext}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Table if present */}
                    {msg.table && (
                      <div className="overflow-x-auto pt-1">
                        <table className="w-full text-left text-xs border-collapse rounded-xl overflow-hidden border border-slate-200">
                          <thead className="bg-slate-100 text-slate-700">
                            <tr>
                              {msg.table.headers.map((h, hIdx) => (
                                <th key={hIdx} className="py-2 px-3 font-semibold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {msg.table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="py-2 px-3 text-slate-700">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Context Action Buttons */}
                    {msg.actionButtons && msg.actionButtons.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-100">
                        {msg.actionButtons.map((btn, bIdx) => (
                          <button
                            key={bIdx}
                            type="button"
                            onClick={() => handleSendMessage(btn.actionQuery)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
                          >
                            <span>{btn.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Follow-up Question Chips */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.suggestedFollowUps.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleSendMessage(prompt)}
                          className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-900 hover:bg-amber-50 text-xs transition-all cursor-pointer shadow-2xs font-medium"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit text-slate-500 text-xs shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium ml-1">ARTH AI is analyzing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ================= DYNAMIC SUGGESTION CHIPS ================= */}
        {messages.length > 0 && (
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">
              Ask:
            </span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 shrink-0 cursor-pointer font-medium transition-colors text-xs whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Attachment preview banner if a file was selected */}
        {attachedFile && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2 truncate">
              <Paperclip className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate">Attached: {attachedFile}</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className="text-amber-700 hover:text-amber-950 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Voice listening active indicator banner */}
        {isListening && (
          <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-900 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span>Listening to your voice... Speak now.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsListening(false)}
              className="text-rose-700 font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* ================= MESSAGE COMPOSER ================= */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
          />

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer shrink-0"
            title="Attach receipt, bill or document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input Box */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'व्यवसाय, खर्च किंवा कर्जाबद्दल अर्थ एआयला विचारा...'
                : language === 'hi'
                ? 'व्यवसाय, खर्च या ऋण के बारे में अर्थ एआई से पूछें...'
                : 'Ask ARTH AI about your business, finances, or loans...'
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden bg-slate-50 focus:bg-white transition-colors"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() && !attachedFile}
            className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-100 disabled:text-slate-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <span className="hidden sm:inline">{t.send || 'Send'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
