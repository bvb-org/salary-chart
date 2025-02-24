import React from 'react';
import { SalaryChange } from '../types';

interface SalaryHistoryProps {
  salaryChanges: SalaryChange[];
  removeSalaryChange: (index: number) => void;
  onCalculate: () => void;
  onShareLink: () => void;
  taxExempt: boolean;
}

export const SalaryHistory: React.FC<SalaryHistoryProps> = ({
  salaryChanges,
  removeSalaryChange,
  onCalculate,
  onShareLink,
  taxExempt
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700">📝 Istoricul Salariilor:</h3>
        <div className="space-y-2">
          {salaryChanges.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Nu ai adăugat încă niciun salariu. Hai să începem! 🚀
            </p>
          ) : (
            salaryChanges.map((change, index) => {
              const prevSalary = index > 0 ? salaryChanges[index - 1].salary : null;
              const difference = prevSalary ? change.salary - prevSalary : 0;
              const percentageChange = prevSalary ? ((difference / prevSalary) * 100).toFixed(1) : null;
              
              return (
                <div key={index} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {`${change.date.substring(5, 7)}-${change.date.substring(0, 4)}`}
                      </span>
                      <span className="text-sm text-gray-900 font-semibold">
                        {change.salary.toLocaleString()} RON
                      </span>
                      {percentageChange && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          difference > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {difference > 0 ? '📈 +' : '📉 '}{percentageChange}%
                        </span>
                      )}
                    </div>
                    {difference !== 0 && (
                      <span className="text-xs text-gray-500">
                        {difference > 0 ? '🔼' : '🔽'} {Math.abs(difference).toLocaleString()} RON
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeSalaryChange(index)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium focus:outline-none"
                  >
                    🗑️ Șterge
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onCalculate}
          className="flex-1 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={salaryChanges.length === 0}
        >
          🔍 Analizează Salariul {taxExempt ? '(Scutit impozit)' : ''}
        </button>
        <button
          onClick={onShareLink}
          className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={salaryChanges.length === 0}
        >
          🔗 Creează Link pentru Istoric
        </button>
      </div>
    </div>
  );
};