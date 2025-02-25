import React, { FormEvent, ChangeEvent } from 'react';

interface SalaryFormProps {
  newDate: string;
  newSalary: string;
  setNewDate: (date: string) => void;
  setNewSalary: (salary: string) => void;
  addSalaryChange: (e: FormEvent) => void;
  taxExempt: boolean;
  setTaxExempt: (value: boolean) => void;
}

export const SalaryForm: React.FC<SalaryFormProps> = ({
  newDate,
  newSalary,
  setNewDate,
  setNewSalary,
  addSalaryChange,
  taxExempt,
  setTaxExempt
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="bg-indigo/10 text-indigo p-1.5 rounded-md mr-2">🎯</span>
            Introdu istoricul salariului tău
          </h3>
          <p className="text-muted-foreground">
            Începe cu primul salariu și adaugă fiecare modificare pe parcurs pentru a vedea impactul inflației în timp.
          </p>
        </div>
        <div className="flex-1">
          <div className="info-alert flex items-start">
            <span className="text-blue-foreground mr-2 mt-0.5">🔒</span>
            <div>
              <p className="text-sm">
                <span className="font-medium">Datele tale sunt în siguranță!</span> Toate calculele se fac direct în browser-ul tău, fără a stoca sau transmite date personale.
              </p>
              <a
                href="https://github.com/qSharpy/salary-chart"
                className="text-xs underline hover:text-indigo transition-colors mt-1 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vezi codul sursă
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={addSalaryChange} className="bg-card shadow-sm rounded-xl p-6 border border-border animate-slideUp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              <span className="flex items-center">
                <span className="mr-1.5">📅</span>
                Luna și Anul
              </span>
              <span className="text-muted-foreground text-xs block mt-1">Adaugă toate salariile și măririle salariale</span>
            </label>
            <input
              type="month"
              value={newDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                if (value && !/^\d{4}-\d{2}$/.test(value)) {
                  console.warn('Invalid date format:', value);
                  return;
                }
                setNewDate(value);
              }}
              pattern="\d{4}-\d{2}"
              placeholder="YYYY-MM"
              min="1996-01"
              max={new Date().toISOString().slice(0, 7)}
              className="w-full rounded-md border-input-border bg-input px-3 py-2.5 text-foreground shadow-sm focus:border-indigo focus:ring-2 focus:ring-indigo/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              <span className="flex items-center">
                <span className="mr-1.5">💵</span>
                Salariul Net
              </span>
              <span className="text-muted-foreground text-xs block mt-1">Banii primiți în mână, cu sau fără bonusuri</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={newSalary}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSalary(e.target.value)}
                className="w-full rounded-md border-input-border bg-input px-3 py-2.5 pr-16 text-foreground shadow-sm focus:border-indigo focus:ring-2 focus:ring-indigo/50"
                required
              />
              <div className="absolute right-0 inset-y-0 flex items-center pr-3 pointer-events-none">
                <span className="text-muted-foreground font-medium">RON</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="btn btn-primary w-full py-2.5"
            >
              <span className="mr-1">➕</span> Adaugă salariu
            </button>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center">
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                id="taxExempt"
                checked={taxExempt}
                onChange={(e) => setTaxExempt(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-indigo peer-focus:ring-2 peer-focus:ring-indigo/50 transition-colors"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
            <label htmlFor="taxExempt" className="ml-3 text-sm font-medium text-foreground cursor-pointer">
              Calcule cu scutire impozit
            </label>
            <div className="ml-2 group relative">
              <span className="text-muted-foreground cursor-help">ℹ️</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-card border border-border rounded-md shadow-md text-xs text-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                Activează această opțiune pentru a calcula contribuțiile la stat folosind ratele de impozitare specifice perioadelor istorice.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};