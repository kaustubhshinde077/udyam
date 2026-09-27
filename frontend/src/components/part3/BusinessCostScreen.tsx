import React, { useState } from 'react';
import { BusinessCategory, Language, Phase2CostData } from '../../types';
import { formatIndianCurrency, calculateProjectCost } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';
import { ArrowRight, ArrowLeft, Plus, Trash2, IndianRupee, HelpCircle, Check } from 'lucide-react';

interface Props {
  category: BusinessCategory;
  subActivity: string;
  initialCostData: Phase2CostData;
  language: Language;
  onSaveAndNext: (data: Phase2CostData) => void;
  onBack: () => void;
}

export const BusinessCostScreen: React.FC<Props> = ({
  category,
  subActivity,
  initialCostData,
  language,
  onSaveAndNext,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [costData, setCostData] = useState<Phase2CostData>(initialCostData);

  const toggleCostItem = (index: number) => {
    setCostData((prev) => {
      const copy = [...prev.costItems];
      copy[index] = { ...copy[index], selected: !copy[index].selected };
      return { ...prev, costItems: copy };
    });
  };

  const updateCostAmount = (index: number, amount: number) => {
    setCostData((prev) => {
      const copy = [...prev.costItems];
      copy[index] = { ...copy[index], amount: Math.max(0, amount) };
      return { ...prev, costItems: copy };
    });
  };

  const totalCost = calculateProjectCost(costData);

  const handleNext = () => {
    onSaveAndNext(costData);
  };

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F284E] bg-blue-100 px-2.5 py-1 rounded">
              Part 3 • Screen 1: Simple Setup Costs
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F284E] mt-1">
              What will you need money for?
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              (व्यवसाय सुरू करण्यासाठी कशासाठी पैशांची गरज आहे?)
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
            Select items you need to purchase or arrange. Enter simple amounts in ₹. You do not have
            to calculate depreciation, working capital formulas, or complex taxes.
          </div>

          {/* Simple Selectable Categories with Integer ₹ amounts */}
          <div className="mt-6 space-y-3">
            {costData.costItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.selected
                    ? 'border-emerald-600 bg-emerald-50/40'
                    : 'border-slate-200 bg-white opacity-80'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCostItem(idx)}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold border shrink-0 mt-0.5 sm:mt-0 ${
                      item.selected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.selected && '✓'}
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.category}</h3>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </div>

                {item.selected ? (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs font-bold text-slate-600">Estimated Cost:</span>
                    <div className="relative w-36">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
                        ₹
                      </div>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={item.amount || ''}
                        onChange={(e) => updateCostAmount(idx, parseInt(e.target.value) || 0)}
                        placeholder="10000"
                        className="w-full pl-7 pr-2.5 py-1.5 text-sm font-mono font-bold rounded-lg border-2 border-emerald-500 bg-white text-slate-900"
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleCostItem(idx)}
                    className="text-xs font-semibold text-blue-700 hover:underline self-end sm:self-auto"
                  >
                    + Add this cost
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Running Total Project Cost */}
          <div className="mt-6 p-4 bg-[#0F284E] text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 uppercase tracking-wider block">
                Total Initial Project Setup Cost:
              </span>
              <span className="text-xs text-amber-300">
                (Based on selected items above)
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">
              {formatIndianCurrency(totalCost)}
            </div>
          </div>

          {/* Simple Operating Questions */}
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Simple Operational Questions (दैनिक / मासिक अंदाज):
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your realistic estimates. Examples are shown below to guide you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
                <label className="font-bold text-slate-900 block mb-1">
                  How much will you charge for your product/service?
                </label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-bold text-slate-500">
                    ₹
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={costData.expectedPricePerUnit && costData.expectedPricePerUnit > 0 ? costData.expectedPricePerUnit : ''}
                    placeholder="e.g. 50"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                      setCostData((prev) => ({
                        ...prev,
                        expectedPricePerUnit: val,
                      }));
                    }}
                    className="w-full pl-8 pr-3 py-2 text-base font-mono font-bold rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-800"
                  />
                </div>
                <p className="text-[11px] text-slate-600 mt-1.5 font-medium">
                  Average charge per unit / visit
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  <span className="font-bold">Example:</span> ₹50 per litre, packet, or visit
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
                <label className="font-bold text-slate-900 block mb-1">
                  How many customers or items do you expect per month?
                </label>
                <input
                  type="number"
                  min={1}
                  value={costData.expectedCustomersOrUnitsPerMonth && costData.expectedCustomersOrUnitsPerMonth > 0 ? costData.expectedCustomersOrUnitsPerMonth : ''}
                  placeholder="e.g. 1500"
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                    setCostData((prev) => ({
                      ...prev,
                      expectedCustomersOrUnitsPerMonth: val,
                    }));
                  }}
                  className="w-full px-3 py-2 text-base font-mono font-bold rounded-lg border border-slate-300 bg-white mt-2 focus:outline-none focus:border-slate-800"
                />
                <p className="text-[11px] text-slate-600 mt-1.5 font-medium">
                  Expected monthly buyers / units
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  <span className="font-bold">Example:</span> 1,000 to 2,000 units or buyers/month
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
                <label className="font-bold text-slate-900 block mb-1">
                  How much will the main material/product cost per month?
                </label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-bold text-slate-500">
                    ₹
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={costData.rawMaterialCostPerMonth && costData.rawMaterialCostPerMonth > 0 ? costData.rawMaterialCostPerMonth : ''}
                    placeholder="e.g. 35000"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                      setCostData((prev) => ({
                        ...prev,
                        rawMaterialCostPerMonth: val,
                      }));
                    }}
                    className="w-full pl-8 pr-3 py-2 text-base font-mono font-bold rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-800"
                  />
                </div>
                <p className="text-[11px] text-slate-600 mt-1.5 font-medium">
                  Total wholesale replenishment cost
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  <span className="font-bold">Example:</span> ₹35,000 monthly supply purchase
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3.5 text-slate-800 font-bold text-base rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-100 min-h-[48px] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <button
            id="cost-continue-btn"
            type="button"
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-lg shadow-sm min-h-[50px] flex items-center justify-center gap-3 transition-colors"
          >
            <span>See Financial Structure (Screen 2)</span>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
