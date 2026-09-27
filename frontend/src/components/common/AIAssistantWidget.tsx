import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, Send, X, MessageSquare, ChevronDown, Check, HelpCircle } from 'lucide-react';
import { BasicInfoData, BusinessSetupData, Language } from '../../types';

interface Props {
  language: Language;
  basicInfo?: BasicInfoData;
  businessSetup?: BusinessSetupData;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const KNOWLEDGE_BASE: Array<{
  keywords: string[];
  reply: { en: string; hi: string; mr: string };
}> = [
  {
    keywords: ['gate', 'validation', 'two-gate', 'प्रमाणन', 'सत्यापन', 'गेट'],
    reply: {
      en: 'ARTH uses a Two-Gate validation system. Gate 1 verifies local market demand, competition density, and supply access. Gate 2 evaluates financial debt capacity, promoter equity (min 10%), and cash surplus under difficult conditions (-25% sales). Both gates must pass before proceeding with full financing.',
      hi: 'अर्थ (ARTH) टू-गेट (Two-Gate) सत्यापन प्रणाली का उपयोग करता है। गेट 1 स्थानीय बाजार मांग, प्रतिस्पर्धा और कच्चे माल की उपलब्धता जांचता है। गेट 2 ऋण चुकाने की क्षमता, उद्यमी का 10% अंशदान और मंदी (-25% बिक्री) में शुद्ध बचत की जांच करता है। दोनों गेट पास होने पर ही व्यवसाय शुरू करने की संस्तुति मिलती है।',
      mr: 'अर्थ (ARTH) द्वि-स्तरीय (Two-Gate) पडताळणी प्रणाली वापरते. गेट १ स्थानिक बाजारपेठेतील मागणी, स्पर्धा आणि कच्च्या मालाची उपलब्धता तपासते. गेट २ कर्ज फेडण्याची क्षमता, १०% स्वतःचे भांडवल आणि मंदीच्या काळात (-२५% विक्री) शिल्लक नफा तपासते. दोन्ही गेट उत्तीर्ण झाल्यावरच व्यवसाय सुरू करण्याची शिफारस दिली जाते.',
    },
  },
  {
    keywords: ['subsidy', 'scheme', 'loan', 'finance', 'कर्ज', 'योजना', 'व्याज'],
    reply: {
      en: 'Under the PS 26091 Priority Sector Prototype Framework: Projects up to ₹1.40 Lakh qualify for the Micro Finance Scheme at 6.5% interest with a 3-year term. Projects from ₹1.40 Lakh to ₹50 Lakh qualify for Term Loans at 8.0% interest with a 7-year term and 6-month repayment moratorium.',
      hi: 'PS 26091 प्राथमिकता क्षेत्र प्रोटोटाइप ढांचे के तहत: ₹1.40 लाख तक की परियोजनाओं के लिए सूक्ष्म वित्त योजना (6.5% ब्याज, 3 वर्ष अवधि) है। ₹1.40 लाख से ₹50 लाख तक की परियोजनाओं के लिए मियादी ऋण (8.0% ब्याज, 7 वर्ष अवधि, 6 माह मोरेटोरियम) उपलब्ध है।',
      mr: 'PS 26091 अग्रक्रम क्षेत्र प्रोटोटाइप आराखड्यानुसार: ₹१.४० लाखांपर्यंतच्या प्रकल्पांसाठी सूक्ष्म वित्त योजना (६.५% व्याज, ३ वर्षे मुदत) लागू होते. ₹१.४० लाख ते ₹५० लाखांपर्यंतच्या प्रकल्पांसाठी मुदत कर्ज (८.०% व्याज, ७ वर्षे मुदत, ६ महिने सवलत काळ) उपलब्ध आहे.',
    },
  },
  {
    keywords: ['break-even', 'breakeven', 'profit', 'नफा', 'लाभ', 'मार्जिन'],
    reply: {
      en: 'Break-even is the sales volume where your monthly revenue equals your total recurring costs (raw materials + utilities + loan EMI). Once you sell above this monthly threshold, every extra unit contributes pure operating surplus to your household.',
      hi: 'ब्रेक-ईवन (Break-even) वह बिक्री स्तर है जहां आपकी कुल मासिक आय आपके कुल मासिक खर्च (कच्चा माल + बिजली/भाड़ा + ऋण ईएमआई) के बराबर हो जाती है। इसके ऊपर की जाने वाली प्रत्येक बिक्री शुद्ध लाभ होती है।',
      mr: 'ब्रेक-ईव्हन (Break-even) म्हणजे असा विक्री टप्पा जिथे आपले मासिक उत्पन्न आणि एकूण व्यवसाय खर्च (कच्चा माल + वीज/भाडे + बँक हप्ता) समसमान होतात. या मर्यादेपलीकडील प्रत्येक विक्री शुद्ध नफा देते.',
    },
  },
  {
    keywords: ['documents', 'loan paper', 'कागदपत्रे', 'दस्तावेज', 'कागजात'],
    reply: {
      en: 'Standard documents required for rural priority enterprise credit: 1) Aadhaar Card & PAN Card, 2) Residence certificate or Ration Card, 3) Bank passbook (last 6 months), 4) Quotation for equipment / stock, 5) ARTH Project Feasibility Dossier.',
      hi: 'ग्रामीण प्राथमिकता उद्यम ऋण के लिए आवश्यक मुख्य दस्तावेज: 1) आधार व पैन कार्ड, 2) निवास प्रमाण पत्र/राशन कार्ड, 3) बैंक पासबुक (पिछले 6 माह), 4) मशीनरी या माल का कोटेशन, 5) अर्थ (ARTH) परियोजना व्यवहार्यता डॉसियर।',
      mr: 'ग्रामीण प्राधान्य व्यवसाय कर्जासाठी आवश्यक कागदपत्रे: १) आधार कार्ड व पॅन कार्ड, २) रहिवासी दाखला / रेशन कार्ड, ३) बँक पासबुक (मागील ६ महिने), ४) यंत्रसामग्री किंवा मालाचे कोटेशन, ५) अर्थ (ARTH) प्रकल्प व्यवहार्यता अहवाल.',
    },
  },
  {
    keywords: ['dairy', 'milk', 'दुग्ध', 'दूध', 'गाय', 'म्हैस'],
    reply: {
      en: 'For Dairy Business, securing guaranteed collection center agreements (e.g. cooperative or local private dairy) at transparent FAT/SNF rates provides predictable daily cash inflows to comfortably service monthly EMIs.',
      hi: 'डेयरी व्यवसाय में स्थानीय दुग्ध सहकारी समिति या संकलन केंद्र से स्पष्ट फैट/एसएनएफ दरों पर निश्चित खरीद अनुबंध करने से दैनिक नकद आमदनी सुनिश्चित होती है जिससे ईएमआई चुकाना आसान होता है।',
      mr: 'दुग्ध व्यवसायात स्थानिक सहकारी दूध संस्था किंवा संकलन केंद्राशी निश्चित खरेदी करार केल्याने नियमित दैनिक उत्पन्न मिळते आणि मासिक हप्ता भरणे सोपे होते.',
    },
  },
  {
    keywords: ['land', 'place', 'shop', 'जमीन', 'जागा', 'दुकान'],
    reply: {
      en: 'You do not strictly need owned commercial land. Operating from home shed, farm land, or a rented village market stall minimizes fixed overheads and protects early profitability.',
      hi: 'व्यवसाय के लिए खुद की व्यावसायिक जमीन होना अनिवार्य नहीं है। घर, खेत या किराये की दुकान से काम शुरू करने से तय खर्चे कम रहते हैं और शुरुआती मुनाफा सुरक्षित रहता है।',
      mr: 'स्वतःची व्यावसायिक जागा असणे सक्तीचे नाही. घरून, शेतातून किंवा भाड्याच्या जागेवरून सुरुवात केल्याने स्थिर खर्च कमी राहतो आणि सुरुवातीचा नफा सुरक्षित राहतो.',
    },
  },
];

export const AIAssistantWidget: React.FC<Props> = ({
  language,
  basicInfo,
  businessSetup,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text:
        language === 'mr'
          ? 'नमस्कार! मी अर्थ (Arth) AI सहाय्यक आहे. शासकीय योजना, व्यवसाय खर्च, बँक कर्ज किंवा सबसिडीबद्दल कोणताही प्रश्न विचारा.'
          : language === 'hi'
          ? 'नमस्ते! मैं अर्थ (Arth) AI सहायक हूँ। सरकारी योजनाओं, व्यावसायिक लागत, बैंक ऋण या सब्सिडी के बारे में कोई भी प्रश्न पूछें।'
          : 'Hello! I am your Arth AI Business Advisor. Ask me about Two-Gate validation, project costs, bank eligibility, or priority sector financing.',
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Generate intelligent response based on keywords and user context
    setTimeout(() => {
      const lower = query.toLowerCase();
      let matchedReply = '';

      for (const entry of KNOWLEDGE_BASE) {
        if (entry.keywords.some((kw) => lower.includes(kw))) {
          matchedReply = entry.reply[language] || entry.reply.en;
          break;
        }
      }

      if (!matchedReply) {
        const catName = businessSetup?.businessCategory || 'your enterprise';
        const loc = basicInfo?.district ? `${basicInfo.district}, ${basicInfo.state}` : 'your locality';
        if (language === 'hi') {
          matchedReply = `आपके प्रश्न के संबंध में: ${catName} के लिए ${loc} में जिला उद्योग केंद्र (DIC) और ग्रामीण स्वरोजगार प्रशिक्षण संस्थान (RSETI) निःशुल्क परामर्श व बैंक लिंकेज प्रदान करते हैं। आप अर्थ (Arth) के इस पोर्टल में चरणबद्ध जानकारी भरकर 7 दिनों में प्रारंभिक सत्यापन रिपोर्ट प्राप्त कर सकते हैं।`;
        } else if (language === 'mr') {
          matchedReply = `आपल्या प्रश्नाबाबत: ${catName} साठी ${loc} मध्ये जिल्हा उद्योग केंद्र (DIC) व बँक मित्र योजना मोफत प्रकल्प मार्गदर्शन पुरवतात. आपण अर्थ (ARTH) अहवालाच्या आधारे थेट प्राधान्य क्षेत्र कर्जासाठी अर्ज करू शकता.`;
        } else {
          matchedReply = `Regarding your inquiry: For ${catName} in ${loc}, the District Industries Centre (DIC) and Lead Bank Manager support micro-enterprise applications. You can complete the 12 steps in Arth to generate a bankable feasibility dossier for instant loan processing.`;
        }
      }

      const botMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: matchedReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const quickPrompts = [
    {
      en: 'How does the Two-Gate validation system work?',
      hi: 'टू-गेट (Two-Gate) सत्यापन प्रणाली कैसे काम करती है?',
      mr: 'द्वि-स्तरीय (Two-Gate) पडताळणी पद्धत कशी काम करते?',
    },
    {
      en: 'What documents are required for loan?',
      hi: 'बैंक लोन के लिए क्या कागजात चाहिए?',
      mr: 'कर्जासाठी कोणती कागदपत्रे लागतात?',
    },
    {
      en: 'How to calculate break-even sales?',
      hi: 'ब्रेक-ईवन बिक्री कैसे समझें?',
      mr: 'ब्रेक-ईव्हन नफा कसा काढायचा?',
    },
  ];

  return (
    <>
      {/* Floating AI Launcher Button */}
      <div className="fixed bottom-5 right-5 z-50 print:hidden">
        {!isOpen && (
          <button
            id="arth-ai-assistant-btn"
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-[#0F284E] hover:bg-blue-900 text-white rounded-full shadow-2xl border-2 border-amber-400 transition-all duration-200 transform hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            aria-label="Open Arth AI Assistant"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shrink-0 group-hover:bg-amber-400 transition-colors shadow-xs">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Arth AI Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[10px] text-amber-200">
                {language === 'mr' ? 'व्यवसाय सहाय्यक' : language === 'hi' ? 'व्यवसाय सलाहकार' : 'Scheme & Advisory'}
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Slide-Up AI Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border-2 border-slate-400 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 print:hidden">
          {/* Header */}
          <div className="bg-[#0F284E] text-white px-4 py-3.5 flex items-center justify-between border-b-2 border-amber-400 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                  Arth AI Business Advisor
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    Active
                  </span>
                </h3>
                <p className="text-[11px] text-amber-200">
                  {language === 'mr' ? '२४/७ व्यवसाय योजना व सल्ला' : language === 'hi' ? '24/7 योजना व ऋण परामर्श' : 'Instant Scheme & Loan Guidance'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-blue-900 flex items-center justify-center transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Context Banner */}
          {businessSetup?.businessCategory && (
            <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 text-[11px] text-slate-700 flex items-center justify-between">
              <span className="font-semibold truncate">
                Context: <strong>{businessSetup.businessCategory}</strong>
              </span>
              <span className="text-slate-500 shrink-0">
                {basicInfo?.state || 'India'}
              </span>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-2 bg-white border-t border-slate-200 shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Quick Questions:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(qp[language] || qp.en)}
                  className="text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-lg px-2.5 py-1 text-left transition-colors truncate max-w-full"
                >
                  {qp[language] || qp.en}
                </button>
              ))}
            </div>
          </div>

          {/* Query Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'आपला प्रश्न येथे लिहा...'
                  : language === 'hi'
                  ? 'अपना प्रश्न यहाँ लिखें...'
                  : 'Ask a question in English, Hindi, or Marathi...'
              }
              className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-800 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-3.5 py-2 bg-[#0F284E] hover:bg-blue-900 disabled:opacity-40 text-white rounded-lg transition-colors flex items-center justify-center shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
