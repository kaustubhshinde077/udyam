import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Check,
  ShieldCheck,
  HelpCircle,
  QrCode,
  Share2,
} from 'lucide-react';
import {
  CommunitySurvey,
  SurveyQuestion,
  generateQuestionsForContext,
  saveSurvey,
} from '../../utils/surveyStorage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  survey: CommunitySurvey;
  onSurveyUpdated: (updated: CommunitySurvey) => void;
}

export const CreateSurveyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  survey,
  onSurveyUpdated,
}) => {
  const [title, setTitle] = useState(survey.title);
  const [questions, setQuestions] = useState<SurveyQuestion[]>(survey.questions);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionOptions, setNewQuestionOptions] = useState('Yes, definitely\nLikely yes\nNeutral / Maybe\nNo');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  if (!isOpen) return null;

  const handleResetToAuto = () => {
    const autoQuestions = generateQuestionsForContext(
      survey.businessCategory,
      survey.activityTitle,
      survey.isFarmer,
      survey.cropName
    );
    setQuestions(autoQuestions);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;

    const parsedOptions = newQuestionOptions
      .split('\n')
      .map((o) => o.trim())
      .filter((o) => o.length > 0);

    const newQ: SurveyQuestion = {
      id: `q_custom_${Date.now()}`,
      questionText: newQuestionText.trim(),
      type: parsedOptions.length > 0 ? 'multiple_choice' : 'text',
      options: parsedOptions.length > 0 ? parsedOptions : ['Yes', 'No'],
    };

    setQuestions((prev) => [...prev, newQ]);
    setNewQuestionText('');
    setIsAddingCustom(false);
  };

  const handleSave = () => {
    const updated: CommunitySurvey = {
      ...survey,
      title: title.trim() || survey.title,
      questions,
    };
    saveSurvey(updated);
    onSurveyUpdated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 dark:bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#0C192A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                Live Community Survey Setup
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
              Configure Ground Survey Questions
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Context Notice */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1">
            <span className="font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Tailored for {survey.isFarmer ? `${survey.cropName || 'Crop'} Cultivation` : survey.activityTitle} in {survey.village}
            </span>
            <p className="text-[11px] text-teal-900 dark:text-teal-300">
              ARTH AI automatically configures questions for your selected economic activity. Respondents will first complete 5 basic demographic questions (Role, Village, Age, Gender, Relationship) before answering these ground demand questions.
            </p>
          </div>

          {/* Survey Title Field */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 dark:text-slate-200 block font-mono uppercase text-[11px]">
              Survey Title Shown to Villagers:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Question List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono uppercase text-[11px]">
                Survey Questions ({questions.length})
              </span>
              <button
                type="button"
                onClick={handleResetToAuto}
                className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Reset to ARTH Recommended
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      <span className="text-teal-600 dark:text-teal-400 mr-1.5">{idx + 1}.</span>
                      {q.questionText}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {q.options.slice(0, 4).map((opt, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-[#0E1C2E] border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-[180px]"
                        >
                          {opt}
                        </span>
                      ))}
                      {q.options.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{q.options.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(q.id)}
                    title="Remove question"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Question Accordion */}
            {isAddingCustom ? (
              <div className="p-3.5 rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-700/60 bg-teal-50/40 dark:bg-teal-950/20 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Add Custom Local Question:
                </span>
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. Would you prefer morning or evening pickup?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs"
                />
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                    Answer Options (one per line):
                  </label>
                  <textarea
                    value={newQuestionOptions}
                    onChange={(e) => setNewQuestionOptions(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1626] text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs"
                  >
                    Add to Survey
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingCustom(true)}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 text-slate-600 dark:text-slate-400 hover:text-teal-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Local Question</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-[#091522]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save &amp; Generate Survey</span>
          </button>
        </div>
      </div>
    </div>
  );
};
