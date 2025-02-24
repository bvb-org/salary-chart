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
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        🎯 Introdu istoricul salariului tău. Începe cu primul salariu și adaugă fiecare modificare pe parcurs.
      </p>
      <div className="bg-[var(--blue-background)] p-3 rounded-md">
        <p className="text-sm text-[var(--blue-foreground)]">
          🔒 Datele tale sunt în siguranță! Toate calculele se fac direct în browser-ul tău, iar noi nu colectăm, nu stocăm și nu transmitem niciun fel de date personale. Poți verifica asta în codul sursă al aplicației, <a href="https://github.com/qSharpy/salary-chart">link</a>.
        </p>
      </div>
      <form onSubmit={addSalaryChange} className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              📅 Luna și Anul:
              <span className="text-[var(--muted-foreground)] text-xs ml-1">(adaugă toate salariile și măririle salariale)</span>
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
              className="w-full border border-[var(--input-border)] rounded-md px-3 py-2 bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo-color)] focus:border-[var(--indigo-color)]"
              required
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              💵 Salariul Net:
              <span className="text-[var(--muted-foreground)] text-xs ml-1">(banii primiți în mână, cu sau fără bonusuri; fii consistent)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={newSalary}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSalary(e.target.value)}
                className="w-full border border-[var(--input-border)] rounded-md px-3 py-2 pr-12 bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo-color)] focus:border-[var(--indigo-color)]"
                required
              />
              <span className="absolute right-3 top-2 text-[var(--muted-foreground)]">RON</span>
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-[var(--indigo-color)] text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--indigo-color)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
            >
              ➕ Adaugă
            </button>
          </div>
        </div>
      </form>
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="taxExempt"
            checked={taxExempt}
            onChange={(e) => setTaxExempt(e.target.checked)}
            className="w-4 h-4 text-[var(--indigo-color)] bg-[var(--input)] border-[var(--input-border)] rounded focus:ring-[var(--indigo-color)] focus:ring-2"
          />
          <label htmlFor="taxExempt" className="ml-2 text-sm font-medium text-[var(--foreground)]">
            Calcule cu scutire impozit
          </label>
        </div>
      </div>
    </div>
  );
};