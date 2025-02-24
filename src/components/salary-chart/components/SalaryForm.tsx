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
      <p className="text-sm text-gray-600 dark:text-gray-300">
        🎯 Introdu istoricul salariului tău. Începe cu primul salariu și adaugă fiecare modificare pe parcurs.
      </p>
      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md">
        <p className="text-sm text-blue-700 dark:text-blue-200">
          🔒 Datele tale sunt în siguranță! Toate calculele se fac direct în browser-ul tău, iar noi nu colectăm, nu stocăm și nu transmitem niciun fel de date personale. Poți verifica asta în codul sursă al aplicației, <a href="https://github.com/qSharpy/salary-chart">link</a>.
        </p>
      </div>
      <form onSubmit={addSalaryChange} className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              📅 Luna și Anul:
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">(adaugă toate salariile și măririle salariale)</span>
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              required
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              💵 Salariul Net:
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">(banii primiți în mână, cu sau fără bonusuri; fii consistent)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={newSalary}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSalary(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400">RON</span>
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
            className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2"
          />
          <label htmlFor="taxExempt" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Calcule cu scutire impozit
          </label>
        </div>
      </div>
    </div>
  );
};