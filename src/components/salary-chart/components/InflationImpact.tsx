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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Earnings & Tax */}
      <div className="lg:col-span-2 space-y-6">
        {/* Total Earnings Card */}
        <div className="stat-card animate-slideUp">
          <div className="flex items-start">
            <div className="bg-indigo/10 text-indigo p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">💰 Câștiguri Totale din Muncă</h3>
              <p className="text-muted-foreground mb-3">
                Suma totală câștigată prin salarii de la prima până la ultima lună:
              </p>
              <div className="bg-card p-4 rounded-lg border border-border mb-3">
                <p className="text-3xl font-bold text-indigo">
                  {lifetimeEarnings.toLocaleString()} RON
                </p>
                <p className="text-lg text-muted-foreground">
                  ≈ {Math.round(lifetimeEarnings / 5).toLocaleString()} EUR
                </p>
              </div>
              <p className="text-xs text-muted-foreground italic">
                * Această sumă include doar salariile introduse aici, fără bonuri de masă, bonusuri sau alte beneficii.
                <br />* Valoarea în EUR este o aproximare folosind un curs de schimb de 5 RON = 1 EUR.
              </p>
            </div>
          </div>
        </div>

        {/* Government Contribution Card */}
        <div className="stat-card animate-slideUp delay-100">
          <div className="flex items-start">
            <div className="bg-red-background text-red-foreground p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">💸 Cât ai muncit pentru stat?</h3>
              <p className="text-muted-foreground mb-3">
                Contribuția ta la stat, calculată ca diferența între salariul brut și cel net:
              </p>
              
              <div className="bg-card p-4 rounded-lg border border-border mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold text-red-foreground">
                      {Math.round(totalContribution).toLocaleString()} RON
                    </p>
                    <p className="text-lg text-muted-foreground">
                      ≈ {Math.round(totalContribution / 5).toLocaleString()} EUR
                    </p>
                  </div>
                  <div className="bg-red-background/20 p-3 rounded-lg">
                    <p className="text-lg font-medium text-foreground">
                      ⏳ Din {years > 0 ? `${years} ${years === 1 ? 'an' : 'ani'}` : ''}{years > 0 && months > 0 ? ' și ' : ''}{months > 0 ? `${months} ${months === 1 ? 'lună' : 'luni'}` : ''} munciți,
                    </p>
                    <p className="text-xl font-bold text-red-foreground mt-1">
                      ⚠️ {stateYears > 0 ? `${stateYears} ${stateYears === 1 ? 'an' : 'ani'}` : ''}{stateYears > 0 && stateMonthsRemainder > 0 ? ' și ' : ''}{stateMonthsRemainder > 0 ? `${stateMonthsRemainder} ${stateMonthsRemainder === 1 ? 'lună' : 'luni'}` : ''} au fost pentru stat!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
                <p className="font-medium mb-1">Calculat folosind {taxExempt ? 'următoarele procente' : 'un procent constant de 41.5%'} pentru salariul brut:</p>
                {taxExempt ? (
                  <ul className="space-y-1 pl-4 list-disc">
                    <li>1996 - 2003: 41.5% din salariul net</li>
                    <li>2004 - Oct.2023: 35% din salariul net</li>
                    <li>Noi.2023 - Dec.2024: 35% din primii 10.000 RON brut, 41.5% din 10.000 RON+</li>
                    <li>2025+: 41.5% din salariul net</li>
                  </ul>
                ) : (
                  <p>41.5% din salariul net pentru toate perioadele</p>
                )}
                <p className="mt-1">* Valoarea în EUR este o aproximare folosind un curs de schimb de 5 RON = 1 EUR.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right column - Inflation Impact */}
      <div className="lg:col-span-1 space-y-6">
        {/* Inflation Impact Card */}
        <div className="stat-card animate-slideUp delay-200">
          <div className="flex items-start">
            <div className="bg-red-background text-red-foreground p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">⚠️ Impactul Inflației</h3>
              <p className="text-muted-foreground mb-3">
                Pierdere Putere de Cumpărare:
              </p>
              <div className="bg-card p-4 rounded-lg border border-border mb-3">
                <p className="text-3xl font-bold text-red-foreground">
                  {chartData[chartData.length - 1].purchasingPowerLoss.toFixed(1)}%
                </p>
              </div>
              <div className="bg-muted p-3 rounded-lg mb-3">
                <p className="text-sm">
                  <span className="font-medium">Calculând inflația de la primul tău salariu:</span><br />
                  Astăzi, din {chartData[chartData.length - 1].nominal.toLocaleString()} RON,{' '}
                  poți cumpăra bunuri în valoare de doar{' '}
                  <span className="font-bold">
                    {Math.round(chartData[chartData.length - 1].adjusted).toLocaleString()} RON
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Beat Inflation Card */}
        <div className="stat-card animate-slideUp delay-300">
          <div className="flex items-start">
            <div className="bg-amber/20 text-amber p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">📈 Ai bătut inflația în ultimii ani?</h3>
              <div className="bg-muted p-3 rounded-lg">
                {chartData.length > 24 ? (
                  <div className="space-y-3">
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
                            <div key={year} className="flex items-center p-2 rounded-lg bg-card border border-border">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                beatInflation ? 'bg-emerald/20 text-emerald' : 'bg-red-foreground/20 text-red-foreground'
                              }`}>
                                {beatInflation ? '✓' : '✗'}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {year}
                                </p>
                                <p className={`text-sm ${beatInflation ? 'text-emerald' : 'text-red-foreground'}`}>
                                  {salaryIncrease > 0 ? '+' : ''}{salaryIncrease.toFixed(1)}% vs. inflație {yearInflation.toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Adaugă date pentru cel puțin 3 ani pentru a vedea analiza completă
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Purchasing Power Comparison Card */}
        <div className="stat-card animate-slideUp delay-400">
          <div className="flex items-start">
            <div className="bg-blue-background/30 text-blue-foreground p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49"></path>
                <path d="M7.76 7.76a6 6 0 0 0 0 8.49"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">⚖️ Puterea de Cumpărare: Atunci vs. Acum</h3>
              <div className="space-y-3 mt-3">
                <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
                  <div className="flex items-center">
                    <span className="mr-2">🛍️</span>
                    <span className="text-muted-foreground">Coș cumpărături în <span className="font-medium">{chartData[0].date}</span>:</span>
                  </div>
                  <span className="font-bold text-blue-foreground">
                    {initialSalary.toLocaleString()} RON
                  </span>
                </div>
                <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
                  <div className="flex items-center">
                    <span className="mr-2">💸</span>
                    <span className="text-muted-foreground">Același coș astăzi:</span>
                  </div>
                  <span className="font-bold text-amber">
                    {initialBasketToday.toLocaleString()} RON
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};