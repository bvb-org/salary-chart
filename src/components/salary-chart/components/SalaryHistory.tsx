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
      <div className="space-y-3 bg-[var(--muted)] p-4 rounded-lg">
        <h3 className="text-sm font-medium text-[var(--foreground)]">📝 Istoricul Salariilor:</h3>
        <div className="space-y-2">
          {salaryChanges.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)] italic">
              Nu ai adăugat încă niciun salariu. Hai să începem! 🚀
            </p>
          ) : (
            salaryChanges.map((change, index) => {
              const prevSalary = index > 0 ? salaryChanges[index - 1].salary : null;
              const difference = prevSalary ? change.salary - prevSalary : 0;
              const percentageChange = prevSalary ? ((difference / prevSalary) * 100).toFixed(1) : null;
              
              return (
                <div key={index} className="flex justify-between items-center bg-[var(--card)] p-3 rounded-md shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {`${change.date.substring(5, 7)}-${change.date.substring(0, 4)}`}
                      </span>
                      <span className="text-sm text-[var(--foreground)] font-semibold">
                        {change.salary.toLocaleString()} RON
                      </span>
                      {percentageChange && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          difference > 0
                            ? 'bg-[var(--emerald-color)] text-white font-medium'
                            : 'bg-[var(--red-background)] text-[var(--red-foreground)]'
                        }`}>
                          {difference > 0 ? '📈 +' : '📉 '}{percentageChange}%
                        </span>
                      )}
                    </div>
                    {difference !== 0 && (
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {difference > 0 ? '🔼' : '🔽'} {Math.abs(difference).toLocaleString()} RON
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeSalaryChange(index)}
                    className="text-[var(--red-foreground)] hover:opacity-80 text-sm font-medium focus:outline-none"
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
          className="flex-1 bg-[var(--emerald-color)] text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--emerald-color)] focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={salaryChanges.length === 0}
        >
          🔍 Analizează Salariul {taxExempt ? '(Scutit impozit)' : ''}
        </button>
        <button
          onClick={onShareLink}
          className="flex-1 bg-[var(--indigo-color)] text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--indigo-color)] focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={salaryChanges.length === 0}
        >
          🔗 Creează Link pentru Istoric
        </button>
      </div>
    </div>
  );
};