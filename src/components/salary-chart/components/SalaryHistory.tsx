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
    <div className="space-y-6">
      <div className="bg-muted rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="bg-indigo/10 text-indigo p-1.5 rounded-md mr-2">📝</span>
            Istoricul Salariilor
          </h3>
          {salaryChanges.length > 0 && (
            <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded-md">
              {salaryChanges.length} {salaryChanges.length === 1 ? 'intrare' : 'intrări'}
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          {salaryChanges.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="text-muted-foreground mb-2 text-4xl">📊</div>
              <p className="text-muted-foreground">
                Nu ai adăugat încă niciun salariu. Hai să începem!
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Adaugă primul tău salariu folosind formularul de mai sus
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {salaryChanges.map((change, index) => {
                const prevSalary = index > 0 ? salaryChanges[index - 1].salary : null;
                const difference = prevSalary ? change.salary - prevSalary : 0;
                const percentageChange = prevSalary ? ((difference / prevSalary) * 100).toFixed(1) : null;
                
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                          {`${change.date.substring(5, 7)}-${change.date.substring(0, 4)}`}
                        </span>
                        <span className="text-base text-foreground font-bold">
                          {change.salary.toLocaleString()} RON
                        </span>
                        {percentageChange && (
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            difference > 0
                              ? 'bg-emerald/10 text-emerald'
                              : 'bg-red-background text-red-foreground'
                          }`}>
                            {difference > 0 ? '📈 +' : '📉 '}{percentageChange}%
                          </span>
                        )}
                      </div>
                      {difference !== 0 && (
                        <span className="text-xs text-muted-foreground block">
                          {difference > 0 ? '🔼' : '🔽'} {Math.abs(difference).toLocaleString()} RON față de intrarea anterioară
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeSalaryChange(index)}
                      className="text-muted-foreground hover:text-red-foreground p-2 rounded-full hover:bg-red-background/20 transition-colors"
                      aria-label="Șterge intrarea"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onCalculate}
          className="btn btn-success flex items-center justify-center py-3"
          disabled={salaryChanges.length === 0}
        >
          <span className="mr-2">🔍</span>
          <span>Analizează Salariul {taxExempt ? '(Scutit impozit)' : ''}</span>
        </button>
        <button
          onClick={onShareLink}
          className="btn btn-primary flex items-center justify-center py-3"
          disabled={salaryChanges.length === 0}
        >
          <span className="mr-2">🔗</span>
          <span>Creează Link pentru Istoric</span>
        </button>
      </div>
    </div>
  );
};