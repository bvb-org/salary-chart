'use client';
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, BarChart, Bar, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SalaryChange {
  date: string;
  salary: number;
}

interface ChartDataPoint {
  date: string;
  nominal: number;
  adjusted: number;
  maintainPowerTarget: number;
  purchasingPowerLoss: number;
  rate: number;
}

interface InflationData {
  date: string;
  rate: number;
}

const SalaryChart = () => {
  const graphRef = React.useRef<HTMLDivElement>(null);
  const [hoveredData, setHoveredData] = useState<ChartDataPoint | null>(null);
  
  // State for inflation data
  const [inflationData, setInflationData] = useState<InflationData[]>([]);
  
  // Fetch and parse CSV data
  // Parse URL parameters on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entries = Array.from(params.entries());
    
    // Group date and salary params
    const salaryData: SalaryChange[] = [];
    for (let i = 0; entries.some(([key]) => key === `date${i}`); i++) {
      const date = params.get(`date${i}`);
      const salary = params.get(`salary${i}`);
      if (date && salary) {
        salaryData.push({
          date,
          salary: parseInt(salary, 10)
        });
      }
    }
    
    // If we have salary data in URL, set it
    if (salaryData.length > 0) {
      setSalaryChanges(salaryData);
    }
  }, []);

  // Load inflation data
  useEffect(() => {
    fetch('/hicp-ro.csv')
      .then(response => response.text())
      .then(csvText => {
        const lines = csvText.split('\n');
        // Skip header row
        const data = lines.slice(1)
          .map(line => {
            const [date, , rate] = line.split(',').map(val => val.replace(/"/g, ''));
            console.log('Parsing CSV date:', date);
            return {
              date,
              rate: parseFloat(rate)
            };
          })
          .filter(item => !isNaN(item.rate));
        console.log('Parsed inflation data:', data);
        setInflationData(data);
      })
      .catch(error => console.error('Error loading inflation data:', error));
  }, []);

  const [salaryChanges, setSalaryChanges] = useState<SalaryChange[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [targetValues, setTargetValues] = useState<TargetValues>({
    maintainPowerTarget: 0,
    nominal: 0,
    initialBasketToday: 0,
    lifetimeEarnings: 0
  });

  interface TargetValues {
    maintainPowerTarget: number;
    nominal: number;
    initialBasketToday: number;
    lifetimeEarnings: number;
  }

  const addSalaryChange = (e: FormEvent) => {
    e.preventDefault();
    console.log('Adding salary change:', { newDate, newSalary });
    
    if (newDate && newSalary) {
      const salaryValue = parseInt(newSalary, 10);
      if (salaryValue < 0) {
        window.location.href = 'https://www.youtube.com/watch?v=xvFZjo5PgG0';
        return;
      }

      // Ensure date is properly formatted (YYYY-MM)
      const datePattern = /^\d{4}-\d{2}$/;
      if (!datePattern.test(newDate)) {
        console.error('Invalid date format:', newDate);
        alert('Format dată invalid. Te rog folosește formatul AAAA-LL');
        return;
      }

      // Check if date is in the future
      const [year, month] = newDate.split('-').map(Number);
      const inputDate = new Date(year, month - 1);
      const currentDate = new Date();
      
      // Set both dates to the first of the month for accurate month comparison
      inputDate.setDate(1);
      currentDate.setDate(1);
      
      console.log('Date validation:', {
        inputDate: inputDate.toISOString(),
        currentDate: currentDate.toISOString(),
        isFuture: inputDate > currentDate
      });
      
      if (inputDate > currentDate) {
        alert('Nu poți introduce date din viitor. Te rog alege o dată din prezent sau trecut.');
        return;
      }
      setSalaryChanges([...salaryChanges, {
        date: newDate,
        salary: salaryValue
      }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setNewDate('');
      setNewSalary('');
    }
  };

  const removeSalaryChange = (index: number) => {
    setSalaryChanges(salaryChanges.filter((_, i) => i !== index));
  };

  const calculateChart = () => {
    console.log('Starting chart calculation', {
      salaryChangesCount: salaryChanges.length,
      inflationDataCount: inflationData.length
    });

    if (salaryChanges.length === 0) {
      alert('Te rog adaugă cel puțin o intrare salarială');
      return;
    }

    if (inflationData.length === 0) {
      alert('Se încarcă datele despre inflație...');
      return;
    }

    const data: ChartDataPoint[] = [];
    let cumulativeInflation = 1;
    
    // Sort and validate dates
    const sortedChanges = [...salaryChanges].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      console.log('Sorting dates:', {
        dateA: dateA.toISOString(),
        dateB: dateB.toISOString(),
        isValidA: !isNaN(dateA.getTime()),
        isValidB: !isNaN(dateB.getTime())
      });
      return dateA.getTime() - dateB.getTime();
    });

    // Track inflation since last salary change
    let lastChangeCumulativeInflation = 1;

    // Get start date from first salary entry and end date from last inflation data point
    console.log('Parsing dates for chart calculation:', {
      firstSalaryDate: sortedChanges[0].date,
      lastInflationDate: inflationData[inflationData.length - 1].date,
      browser: navigator.userAgent
    });

    // Ensure proper date parsing for Safari
    const [startYear, startMonth] = sortedChanges[0].date.split('-').map(Number);
    const startDate = new Date(startYear, startMonth - 1, 1);

    // Get the latest date between last salary change and last inflation data
    const [lastSalaryYear, lastSalaryMonth] = sortedChanges[sortedChanges.length - 1].date.split('-').map(Number);
    const [lastInflationYear, lastInflationMonth] = inflationData[inflationData.length - 1].date.split('-').map(Number);
    
    const lastSalaryDate = new Date(lastSalaryYear, lastSalaryMonth - 1, 1);
    const lastInflationDate = new Date(lastInflationYear, lastInflationMonth - 1, 1);
    const endDate = new Date(Math.max(lastSalaryDate.getTime(), lastInflationDate.getTime()));

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid date parsing:', {
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        startValid: !isNaN(startDate.getTime()),
        endValid: !isNaN(endDate.getTime())
      });
      alert('Eroare la procesarea datelor. Te rog încearcă din nou.');
      return;
    }

    console.log('Parsed dates:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    // Function to get current nominal salary for a date
    const getNominalSalary = (currentDate: Date) => {
      // Convert current date to YYYY-MM format for comparison
      const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      // Find the last salary change that matches or is before this date
      const validChanges = sortedChanges.filter(change => {
        return change.date <= currentYearMonth;
      });
      
      return validChanges.length > 0 ? validChanges[validChanges.length - 1].salary : 0;
    };

    // Function to get inflation rate for a specific month
    const getInflationRate = (date: Date) => {
      if (isNaN(date.getTime())) {
        console.error('Invalid date passed to getInflationRate:', date);
        return null;
      }

      // Format the search date as YYYY-MM
      const searchYearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      console.log('Searching for inflation rate:', {
        inputDate: date.toISOString(),
        searchYearMonth,
        availableMonths: inflationData.slice(0, 3).map(d => d.date) // Log first 3 months for debugging
      });

      // Find the matching data by comparing year and month only
      const monthData = inflationData.find(d => {
        const dataYearMonth = d.date.substring(0, 7); // Get YYYY-MM part
        return dataYearMonth === searchYearMonth;
      });

      if (!monthData) {
        console.warn('No inflation data found for:', searchYearMonth);
      }
      
      return monthData ? monthData.rate : null;
    };

    // Process each month
    const currentDate = new Date(startDate);
    // Set endDate to include the month after the last change to ensure we capture everything
    const loopEndDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1);
    
    let lastChangeSalary = sortedChanges[0].salary;
    
    while (currentDate < loopEndDate) {
      // Get inflation rate for this month
      const monthRate = getInflationRate(currentDate);
      
      if (monthRate !== null) {
        // Calculate inflation factor for this month
        const inflationFactor = 1 + (monthRate / 100 / 12);
        cumulativeInflation *= inflationFactor;

        const currentNominal = getNominalSalary(currentDate);
        
        // If there's a salary change this month, update tracking variables
        if (currentNominal !== lastChangeSalary) {
          lastChangeSalary = currentNominal;
          lastChangeCumulativeInflation = cumulativeInflation;
        }

        // Calculate inflation since last salary change
        const inflationSinceLastChange = cumulativeInflation / lastChangeCumulativeInflation;
        
        const inflationAdjustedSalary = currentNominal / cumulativeInflation;
        const maintainPowerTarget = currentNominal * inflationSinceLastChange;

        // Format date for display (MM-YYYY)
        const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;

        const purchasingPowerLoss = ((currentNominal - inflationAdjustedSalary) / currentNominal) * 100;
        
        data.push({
          date: formattedDate,
          nominal: currentNominal,
          adjusted: Math.round(inflationAdjustedSalary),
          maintainPowerTarget: Math.round(maintainPowerTarget),
          purchasingPowerLoss: Math.round(purchasingPowerLoss * 10) / 10,
          rate: monthRate
        });
      }

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    if (data.length > 0) {
      setChartData(data);
      const finalData = data[data.length - 1];
      // Calculate how much the initial basket (first salary) would cost today
      const initialSalary = sortedChanges[0].salary;
      const initialBasketToday = Math.round(initialSalary * cumulativeInflation);
      
      // Calculate lifetime earnings by summing up monthly salaries
      let lifetimeEarnings = 0;
      for (let i = 0; i < data.length; i++) {
        lifetimeEarnings += data[i].nominal;
      }
      
      setTargetValues({
        maintainPowerTarget: finalData.maintainPowerTarget,
        nominal: finalData.nominal,
        initialBasketToday,
        lifetimeEarnings
      });
    } else {
      alert('Nu s-au găsit date valide pentru perioada selectată');
    }

    // Scroll to graph section
    if (graphRef.current) {
      graphRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Card className="w-full max-w-[1400px] mx-auto bg-white shadow-lg">
      <div className="space-y-6">
        <div>
          <CardHeader className="space-y-6">
            <CardTitle className="text-2xl font-bold text-gray-800">
              💰 Calculatorul de Salariu și Inflație
            </CardTitle>
            <p className="text-gray-600 mt-2">
              📊 Salut! Vom analiza împreună cum inflația îți afectează banii, chiar și atunci când primești măriri.
            </p>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  🎯 Introdu istoricul salariului tău. Începe cu primul salariu și adaugă fiecare modificare pe parcurs.
                </p>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-700">
                    🔒 Datele tale sunt în siguranță! Toate calculele se fac direct în browser-ul tău, iar noi nu colectăm, nu stocăm și nu transmitem niciun fel de date personale. Poți verifica asta în codul sursă al aplicației, <a href="https://github.com/qSharpy/salary-chart">link</a>.
                  </p>
                </div>
                <form onSubmit={addSalaryChange} className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📅 Luna și Anul:
                        <span className="text-gray-500 text-xs ml-1">(adaugă toate salariile și măririle salariale)</span>
                      </label>
                      <input
                        type="month"
                        value={newDate}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          console.log('Date input change:', {
                            rawValue: e.target.value,
                            inputType: e.target.type,
                            isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
                          });
                          
                          // Ensure the date is in YYYY-MM format
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
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        💵 Salariul Net:
                        <span className="text-gray-500 text-xs ml-1">(banii primiți în mână, cu sau fără bonusuri; fii consistent)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={newSalary}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSalary(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <span className="absolute right-3 top-2 text-gray-500">RON</span>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        ➕ Adaugă
                      </button>
                    </div>
                  </div>
                </form>
              </div>

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
                  onClick={calculateChart}
                  className="flex-1 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={salaryChanges.length === 0}
                >
                  🔍 Analizează Salariul
                </button>
                <button
                  onClick={() => {
                    const params = new URLSearchParams();
                    salaryChanges.forEach((change, index) => {
                      params.append(`date${index}`, change.date);
                      params.append(`salary${index}`, change.salary.toString());
                    });
                    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
                    
                    // Try using the clipboard API first
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(url)
                        .then(() => {
                          alert('Link-ul a fost copiat în clipboard! Îl poți distribui pentru a împărtăși datele tale salariale.');
                        })
                        .catch(() => {
                          // Fallback to manual copy method
                          const textarea = document.createElement('textarea');
                          textarea.value = url;
                          textarea.style.position = 'fixed';
                          textarea.style.opacity = '0';
                          document.body.appendChild(textarea);
                          textarea.select();
                          try {
                            document.execCommand('copy');
                            alert('Link-ul a fost copiat în clipboard! Îl poți distribui pentru a împărtăși datele tale salariale.');
                          } catch {
                            alert('Nu am putut copia link-ul automat. Te rog selectează și copiază manual:\n\n' + url);
                          }
                          document.body.removeChild(textarea);
                        });
                    } else {
                      // Fallback for browsers without clipboard API
                      const textarea = document.createElement('textarea');
                      textarea.value = url;
                      textarea.style.position = 'fixed';
                      textarea.style.opacity = '0';
                      document.body.appendChild(textarea);
                      textarea.select();
                      try {
                        document.execCommand('copy');
                        alert('Link-ul a fost copiat în clipboard! Îl poți distribui pentru a împărtăși datele tale salariale.');
                      } catch {
                        alert('Nu am putut copia link-ul automat. Te rog selectează și copiază manual:\n\n' + url);
                      }
                      document.body.removeChild(textarea);
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={salaryChanges.length === 0}
                >
                  🔗 Creează Link pentru Istoric
                </button>
              </div>

              {chartData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="border-b border-gray-200 pb-3">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">💰 Câștiguri Totale din Muncă</h3>
                    <p className="text-sm text-gray-600">
                      Suma totală câștigată prin salarii de la prima până la ultima lună:
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {targetValues.lifetimeEarnings.toLocaleString()} RON ({Math.round(targetValues.lifetimeEarnings / 5).toLocaleString()} EUR)
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
                    {(() => {
                      let totalGovContribution = 0;
                      let totalMonths = 0;
                      
                      // Process each month's contribution
                      chartData.forEach(data => {
                        const [, year] = data.date.split('-').map(Number);
                        
                        // Get multiplier based on time period
                        let multiplier;
                        if (year >= 2025) multiplier = 1.45;
                        else if (year >= 2004) multiplier = 1.35;
                        else multiplier = 1.45;
                        
                        const grossSalary = data.nominal * multiplier;
                        const govContribution = grossSalary - data.nominal;
                        
                        totalGovContribution += govContribution;
                        totalMonths++;
                      });
                      
                      const years = Math.floor(totalMonths / 12);
                      const months = totalMonths % 12;
                      
                      return (
                        <div className="mt-3 space-y-2">
                          <p className="text-2xl font-bold text-red-600">
                            {Math.round(totalGovContribution).toLocaleString()} RON ({Math.round(totalGovContribution / 5).toLocaleString()} EUR)
                          </p>
                          <p className="text-lg font-bold text-blue-700">
                            ⏳ Din {years > 0 ? `${years} ${years === 1 ? 'an' : 'ani'}` : ''} {months > 0 ? `${months} ${months === 1 ? 'lună' : 'luni'}` : ''} munciți,
                          </p>
                          <p className="text-xl font-bold text-red-600">
                            {(() => {
                              // Calculate hours worked for state based on tax percentages
                              let stateMonths = 0;
                              
                              chartData.forEach(data => {
                                const [, year] = data.date.split('-').map(Number);
                                // Get tax percentage based on year
                                const taxPercentage = year >= 2025 ? 0.45 :
                                                    year >= 2004 ? 0.35 : 0.45;
                                // Add fractional month based on tax percentage (assuming 8h workday)
                                stateMonths += taxPercentage;
                              });
                              
                              const stateYears = Math.floor(stateMonths / 12);
                              const stateMonthsRemainder = Math.round(stateMonths % 12);
                              
                              return `⚠️ ${stateYears > 0 ? `${stateYears} ${stateYears === 1 ? 'an' : 'ani'}` : ''} ${stateMonthsRemainder > 0 ? `${stateMonthsRemainder} ${stateMonthsRemainder === 1 ? 'lună' : 'luni'}` : ''} au fost pentru stat!`;
                            })()}
                          </p>
                          <p className="text-xs text-gray-500 italic">
                            * Calculat folosind următoarele rate pentru salariul brut:
                            <br />• 1996-2003: 45% din salariul net
                            <br />• 2004-2024: 35% din salariul net
                            <br />• 2025+: 45% din salariul net
                            <br />* Valoarea în EUR este o aproximare folosind un curs de schimb de 5 RON = 1 EUR.
                          </p>
                        </div>
                      );
                    })()}
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
                      {chartData.length > 24 && (
                        <div className="space-y-2">
                          {[3, 2, 1, 0].map(yearsAgo => {
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
                      )}
                      {chartData.length <= 24 && (
                        <p className="text-sm text-gray-500 italic">
                          Adaugă date pentru cel puțin 3 ani pentru a vedea analiza completă
                        </p>
                      )}
                    </div>
                  </div><hr/>
                  <br/><div className="border-b border-gray-200 pb-3">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">⚖️ Puterea de Cumpărare: Atunci vs. Acum</h3>
                    <p className="text-sm text-gray-600">
                      🔍 <span className="font-medium">Comparație:</span> Ce puteai cumpăra cu primul tău salariu vs. astăzi
                    </p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {salaryChanges.length > 0 && (
                        <li className="flex items-center text-gray-700 bg-blue-50 p-2 rounded-md">
                          <span className="w-48">🛍️ Coș cumpărături în <span className="font-medium">{chartData[0].date}</span>:</span>
                          <span className="font-medium text-blue-700">{salaryChanges[0].salary.toLocaleString()} RON</span>
                        </li>
                      )}
                      <li className="flex items-center text-gray-700 bg-amber-50 p-2 rounded-md">
                        <span className="w-48">💸 Același coș astăzi:</span>
                        <span className="font-medium text-amber-700">{targetValues.initialBasketToday.toLocaleString()} RON</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              )}
            </div>
          </CardHeader>
        </div>

        <div>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
              {chartData.length > 0 && (
                <div className="h-[500px]">
                  <p className="text-sm text-gray-600 mb-2">📊 <strong>Pierderea Puterii de Cumpărare în Timp:</strong></p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                      onMouseMove={(data) => data.activePayload && setHoveredData(data.activePayload[0].payload)}
                      onMouseLeave={() => setHoveredData(chartData[chartData.length - 1])}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fill: '#4b5563' }}
                        stroke="#9ca3af"
                      />
                      <YAxis
                        tick={{ fill: '#4b5563' }}
                        stroke="#9ca3af"
                        label={{ value: '%', position: 'insideLeft', offset: 0 }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Pierdere Putere de Cumpărare']}
                        labelFormatter={(label: string) => `Data: ${label}`}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: '1px solid #ef4444' }}
                        labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="purchasingPowerLoss" fill="#ef4444" name="Pierdere Putere de Cumpărare" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="h-[400px] relative" ref={graphRef}>
                {chartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 30, right: 30, left: 20, bottom: 65 }}
                        onMouseMove={(data) => data.activePayload && setHoveredData(data.activePayload[0].payload)}
                        onMouseLeave={() => chartData.length > 0 && setHoveredData(chartData[chartData.length - 1])}
                      >
                        <defs>
                          <linearGradient id="powerLossArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tick={{ fill: '#4b5563' }}
                          stroke="#9ca3af"
                        />
                        <YAxis
                          domain={[
                            Math.min(chartData[0].nominal, chartData[0].adjusted) * 0.9,
                            Math.ceil(targetValues.maintainPowerTarget/1000)*1000
                          ]}
                          tick={{ fill: '#4b5563' }}
                          stroke="#9ca3af"
                        />
                        <Area
                          type="monotone"
                          dataKey="nominal"
                          fill="url(#powerLossArea)"
                          stroke="none"
                          fillOpacity={1}
                          activeDot={false}
                        />
                        <Line
                          type="stepAfter"
                          dataKey="nominal"
                          stroke="#4f46e5"
                          name="Salariul Tău"
                          strokeWidth={3}
                          dot={{ fill: '#4f46e5', r: 1 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="adjusted"
                          stroke="#059669"
                          name={`Salariul tău ajustat la inflația incepand din ${chartData[0].date}`}
                          strokeWidth={2}
                          dot={{ fill: '#059669', r: 1 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="maintainPowerTarget"
                          stroke="#d97706"
                          name="Salariu necesar pentru menținerea puterii de cumpărare"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: '#d97706', r: 1 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    {chartData.length > 0 && (
                      <div className="mt-4 space-y-2 bg-gray-50 p-4 rounded-lg">
                        <p
                          key={`date-${(hoveredData || chartData[chartData.length - 1]).date}`}
                          className="font-bold text-gray-700 mb-2 transform"
                        >
                          {(hoveredData || chartData[chartData.length - 1]).date}
                        </p>
                        <div className="flex items-center gap-2 text-indigo-600">
                          <span className="w-3 h-3 rounded-full bg-[#4f46e5]"></span>
                          <span className="font-medium">💰 Salariul Tău:</span>
                          <span
                            key={`nominal-${(hoveredData || chartData[chartData.length - 1]).nominal}`}
                            className="font-bold animate-[pop_0.2s_ease-out] transform"
                          >
                            {(hoveredData || chartData[chartData.length - 1]).nominal.toLocaleString()} RON
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600">
                          <span className="w-3 h-3 rounded-full bg-[#059669]"></span>
                          <span className="font-medium">📉 Salariul tău ajustat la inflația începând din {chartData[0].date}:</span>
                          <span
                            key={`adjusted-${(hoveredData || chartData[chartData.length - 1]).adjusted}`}
                            className="font-bold animate-[pop_0.2s_ease-out] transform"
                          >
                            {(hoveredData || chartData[chartData.length - 1]).adjusted.toLocaleString()} RON
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-600">
                          <span className="w-3 h-3 rounded-full bg-[#d97706]"></span>
                          <span className="font-medium">🎯 Salariul necesar pentru a-ți menține puterea de cumpărare:</span>
                          <span
                            key={`target-${(hoveredData || chartData[chartData.length - 1]).maintainPowerTarget}`}
                            className="font-bold animate-[pop_0.2s_ease-out] transform"
                          >
                            {(hoveredData || chartData[chartData.length - 1]).maintainPowerTarget.toLocaleString()} RON
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                    📊 Adaugă salariul tău și apasă pe &quot;Analizează Salariul&quot; pentru a vedea graficele
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default SalaryChart;