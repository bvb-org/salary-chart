import React from 'react';
import { ChartDataPoint } from '../types';
import { calculateGovernmentContribution } from '../utils';

interface InflationImpactProps {
  chartData: ChartDataPoint[];
  initialSalary: number;
  initialBasketToday: number;
  lifetimeEarnings: number;
  taxExempt: boolean;
}

export const InflationImpact: React.FC<InflationImpactProps> = ({
  chartData,
  initialSalary,
  initialBasketToday,
  lifetimeEarnings,
  taxExempt
}) => {
  const { totalContribution, stateMonths, totalMonths } = calculateGovernmentContribution(chartData, taxExempt);
  const stateYears = Math.floor(stateMonths / 12);
  const stateMonthsRemainder = Math.round(stateMonths % 12);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="border-b border-gray-200 pb-3">
          <h3 className="text-base font-semibold text-gray-800 mb-2">💰 Câștiguri Totale din Muncă</h3>
          <p className="text-sm text-gray-600">
            Suma totală câștigată prin salarii de la prima până la ultima lună:
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {lifetimeEarnings.toLocaleString()} RON ({Math.round(lifetimeEarnings / 5).toLocaleString()} EUR)
          </p>
          <p className="text-xs text-gray-500 mt-1 italic">
            * Această sumă include doar salariile introduse aici, fără bonuri de masă, bonusuri sau alte beneficii.
            <br />* Valoarea în EUR este o aproximare folosind un curs de schimb de 5 RON = 1 EUR.
          </p>
        </div>
        <div className="border-b border-gray-200 pb-3">
          <h3 className="text-base font-semibold text-gray-800 mb-2">💸 Cât ai muncit pentru stat?</h3>
          <p className="text-sm text-gray-600">
            Contribuția ta la stat, calculată ca diferența între salariul brut și cel net:
          </p>
          <div className="mt-3 space-y-2">
            <p className="text-2xl font-bold text-red-600">
              {Math.round(totalContribution).toLocaleString()} RON ({Math.round(totalContribution / 5).toLocaleString()} EUR)
            </p>
            <p className="text-lg font-bold text-blue-700">
              ⏳ Din {years > 0 ? `${years} ${years === 1 ? 'an' : 'ani'}` : ''}{years > 0 && months > 0 ? ' și ' : ''}{months > 0 ? `${months} ${months === 1 ? 'lună' : 'luni'}` : ''} munciți,
            </p>
            <p className="text-xl font-bold text-red-600">
              ⚠️ {stateYears > 0 ? `${stateYears} ${stateYears === 1 ? 'an' : 'ani'}` : ''}{stateYears > 0 && stateMonthsRemainder > 0 ? ' și ' : ''}{stateMonthsRemainder > 0 ? `${stateMonthsRemainder} ${stateMonthsRemainder === 1 ? 'lună' : 'luni'}` : ''} au fost pentru stat!
            </p>
            <p className="text-xs text-gray-500 italic">
              * Calculat folosind {taxExempt ? 'următoarele procente' : 'un procent constant de 41.5%'} pentru salariul brut:
              {taxExempt ? (
                <React.Fragment>
                  <br />• 1996 - 2003: 41.5% din salariul net
                  <br />• 2004 - Oct.2023: 35% din salariul net
                  <br />• Noi.2023 - Dec.2024: 35% din primii 10.000 RON brut, 41.5% din 10.000 RON+
                  <br />• 2025+: 41.5% din salariul net
                </React.Fragment>
              ) : (
                <> </>
              )}
              <br />* Valoarea în EUR este o aproximare folosind un curs de schimb de 5 RON = 1 EUR.
            </p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 p-4 bg-red-50 border border-red-200 rounded-lg h-fit">
        <h3 className="text-lg font-semibold text-red-700 mb-2 text-center">
          ⚠️ Impactul Inflației
        </h3>
        <div className="space-y-6">
          <div>
            <p className="text-red-600">
              📉 Pierdere Putere de Cumpărare:{' '}
              <span className="font-bold text-xl">
                {chartData[chartData.length - 1].purchasingPowerLoss.toFixed(1)}%
              </span>
            </p>
            <p className="text-sm text-red-600 mt-1">
              💡 <span className="font-bold">Calculand inflația de la primul tău salariu,</span><br />
              Astăzi, din {chartData[chartData.length - 1].nominal.toLocaleString()} RON,{' '}
              poți cumpăra bunuri în valoare de doar <span className="font-medium"> {Math.round(chartData[chartData.length - 1].adjusted).toLocaleString()} RON</span> 📉
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-medium mb-2">
              <strong>Ai bătut inflația în ultimii ani?</strong>
            </p>
            {chartData.length > 24 ? (
              <div className="space-y-2">
                {[4, 3, 2, 1, 0].map(yearsAgo => {
                  const year = new Date().getFullYear() - yearsAgo;
                  
                  const yearData = chartData.filter(data => {
                    const dataYear = parseInt(data.date.split('-')[1]);
                    return dataYear === year && !isNaN(data.rate);
                  });
                  
                  if (yearData.length > 0) {
                    const startData = yearData[0];
                    const endData = yearData[yearData.length - 1];
                    
                    if (startData && endData && startData.nominal && endData.nominal) {
                      const yearInflation = yearData.reduce((sum, data) => sum + data.rate, 0) / yearData.length;
                      const firstSalaryOfYear = startData.nominal;
                      const lastSalaryOfYear = endData.nominal;
                      const salaryIncrease = ((lastSalaryOfYear / firstSalaryOfYear) - 1) * 100;
                      const beatInflation = salaryIncrease > yearInflation;
                      
                      return (
                        <div key={year} className="flex items-center gap-2">
                          <span className="text-xl">
                            {beatInflation ? '✅' : '❌'}
                          </span>
                          <span className="font-medium">
                            {year}:{' '}
                            <span className={`font-medium ${beatInflation ? 'text-green-600' : 'text-red-600'}`}>
                              {salaryIncrease > 0 ? '+' : ''}{salaryIncrease.toFixed(1)}% vs. inflație {yearInflation.toFixed(1)}%
                            </span>
                          </span>
                        </div>
                      );
                    }
                  }
                  return null;
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Adaugă date pentru cel puțin 3 ani pentru a vedea analiza completă
              </p>
            )}
          </div>
          <hr/>
          <div className="border-b border-gray-200 pb-3">
            <h3 className="text-base font-semibold text-gray-800 mb-2">⚖️ Puterea de Cumpărare: Atunci vs. Acum</h3>
            <p className="text-sm text-gray-600">
              🔍 <span className="font-medium">Comparație:</span> Ce puteai cumpăra cu primul tău salariu vs. astăzi
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center text-gray-700 bg-blue-50 p-2 rounded-md">
                <span className="w-48">🛍️ Coș cumpărături în <span className="font-medium">{chartData[0].date}</span>:</span>
                <span className="font-medium text-blue-700">{initialSalary.toLocaleString()} RON</span>
              </li>
              <li className="flex items-center text-gray-700 bg-amber-50 p-2 rounded-md">
                <span className="w-48">💸 Același coș astăzi:</span>
                <span className="font-medium text-amber-700">{initialBasketToday.toLocaleString()} RON</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};