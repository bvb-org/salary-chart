'use client';
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, BarChart, Bar } from 'recharts';
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

interface TargetValues {
  maintainPowerTarget: number;
  nominal: number;
  initialBasketToday: number;
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
    initialBasketToday: 0
  });

  const addSalaryChange = (e: FormEvent) => {
    e.preventDefault();
    if (newDate && newSalary) {
      setSalaryChanges([...salaryChanges, { 
        date: newDate, 
        salary: parseInt(newSalary, 10) 
      }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setNewDate('');
      setNewSalary('');
    }
  };

  const removeSalaryChange = (index: number) => {
    setSalaryChanges(salaryChanges.filter((_, i) => i !== index));
  };

  const calculateChart = () => {
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
    const sortedChanges = [...salaryChanges].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Track inflation since last salary change
    let lastChangeCumulativeInflation = 1;

    // Get start date from first salary entry and end date from last inflation data point
    const startDate = new Date(sortedChanges[0].date);
    const endDate = new Date(inflationData[inflationData.length - 1].date);

    // Function to get current nominal salary for a date
    const getNominalSalary = (currentDate: Date) => {
      const validChanges = sortedChanges.filter(change => 
        new Date(change.date) <= currentDate
      );
      return validChanges.length > 0 ? validChanges[validChanges.length - 1].salary : 0;
    };

    // Function to get inflation rate for a specific month
    const getInflationRate = (date: Date) => {
      // Format the search date as YYYY-MM
      const searchYearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // Find the matching data by comparing year and month only
      const monthData = inflationData.find(d => {
        const dataYearMonth = d.date.substring(0, 7); // Get YYYY-MM part
        return dataYearMonth === searchYearMonth;
      });
      
      return monthData ? monthData.rate : null;
    };

    // Process each month
    const currentDate = new Date(startDate);
    // Add one day to endDate to ensure we include the last month
    const loopEndDate = new Date(endDate);
    loopEndDate.setDate(loopEndDate.getDate() + 1);
    
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
      
      setTargetValues({
        maintainPowerTarget: finalData.maintainPowerTarget,
        nominal: finalData.nominal,
        initialBasketToday
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
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div className="lg:order-1">
          <CardHeader className="space-y-6">
            <CardTitle className="text-2xl font-bold text-gray-800">
              💰 Calculatorul Tău de Salariu și Inflație
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Hai să vedem cum îți merge salariul! 📊 Vom analiza împreună cum inflația îți afectează banii, chiar și atunci când primești măriri.
            </p>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  🎯 Introdu istoricul salariului tău pentru a vedea situația reală. Începe cu primul salariu și adaugă fiecare modificare pe parcurs.
                </p>
                <form onSubmit={addSalaryChange} className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📅 Luna și Anul:
                        <span className="text-gray-500 text-xs ml-1">(când ai primit primul salariu sau o mărire)</span>
                      </label>
                      <input
                        type="month"
                        value={newDate}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewDate(e.target.value)}
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
                <h3 className="text-sm font-medium text-gray-700">📝 Istoricul Salariului:</h3>
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

              <button
                onClick={calculateChart}
                className="w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={salaryChanges.length === 0}
              >
                🔍 Analizează Salariul
              </button>

              {chartData.length > 0 && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="border-b border-gray-200 pb-3">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">⚖️ Puterea de Cumpărare: Atunci vs. Acum</h3>
                    <p className="text-sm text-gray-600">
                      🔍 <span className="font-medium">Comparație:</span> Ce puteai cumpăra cu primul tău salariu vs. astăzi
                    </p>
                    <ul className="mt-3 space-y-2 text-sm">
                      <li className="flex items-center text-gray-700 bg-blue-50 p-2 rounded-md">
                        <span className="w-48">🛍️ Coș cumpărături în <span className="font-medium">{chartData[0].date}</span>:</span>
                        <span className="font-medium text-blue-700">{chartData[0].nominal.toLocaleString()} RON</span>
                      </li>
                      <li className="flex items-center text-gray-700 bg-amber-50 p-2 rounded-md">
                        <span className="w-48">💸 Același coș astăzi:</span>
                        <span className="font-medium text-amber-700">{targetValues.initialBasketToday.toLocaleString()} RON</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
        </div>

        <div className="lg:order-2">
          <CardContent className="h-full pt-6">
            {chartData.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  ⚠️ Impactul Inflației
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-red-600">
                      📉 Pierdere Putere de Cumpărare:{' '}
                      <span className="font-bold text-xl">
                        {chartData[chartData.length - 1].purchasingPowerLoss.toFixed(1)}%
                      </span>
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      💡 <span className="font-bold">Raportat la primul tău salariu:</span><br />
                      Din actualul salariu de {targetValues.nominal.toLocaleString()} RON,{' '}
                      poți cumpăra bunuri în valoare de <span className="font-medium">doar {Math.round(chartData[chartData.length - 1].adjusted).toLocaleString()} RON</span> 📉
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium mb-2">
                      Ai bătut inflația în ultimii 3 ani?
                    </p>
                    {chartData.length > 24 && (
                      <div className="space-y-2">
                        {[3, 2, 1, 0].map(yearsAgo => {
                          const year = new Date().getFullYear() - yearsAgo;
                          
                          // Find data points for this calendar year
                          // Filter data for this calendar year and ensure we have valid rates
                          const yearData = chartData.filter(data => {
                            const dataYear = parseInt(data.date.split('-')[1]);
                            return dataYear === year && !isNaN(data.rate);
                          });
                          
                          if (yearData.length > 0) {
                            const startData = yearData[0];
                            const endData = yearData[yearData.length - 1];
                            
                            if (startData && endData && startData.nominal && endData.nominal) {
                              // Calculate average inflation for the year
                              const yearInflation = yearData.reduce((sum, data) => sum + data.rate, 0) / yearData.length;
                              // Calculate salary change percentage for the year
                              const firstSalaryOfYear = startData.nominal;
                              const lastSalaryOfYear = endData.nominal;
                              const salaryIncrease = ((lastSalaryOfYear / firstSalaryOfYear) - 1) * 100;
                              const beatInflation = salaryIncrease > yearInflation;
                              const year = new Date().getFullYear() - yearsAgo;
                              
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
                </div>
              </div>
            )}
            <div className="space-y-6">
              {chartData.length > 0 && (
                <div className="h-[200px]">
                  <p className="text-sm text-gray-600 mb-2">📊 Pierderea Puterii de Cumpărare în Timp:</p>
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
                      <Bar dataKey="purchasingPowerLoss" fill="#ef4444" name="Pierdere Putere de Cumpărare" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="h-[300px] lg:h-[calc(100vh-38rem)] min-h-[300px]" ref={graphRef}>
                {chartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 30, right: 30, left: 20, bottom: 65 }}
                        onMouseMove={(data) => data.activePayload && setHoveredData(data.activePayload[0].payload)}
                        onMouseLeave={() => setHoveredData(chartData[chartData.length - 1])}
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
                    <div className="mt-4 space-y-2 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <span className="w-3 h-3 rounded-full bg-[#4f46e5]"></span>
                        <span className="font-medium">💰 Salariul Tău:</span>
                        <span className="font-bold">{(hoveredData || chartData[chartData.length - 1]).nominal.toLocaleString()} RON</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600">
                        <span className="w-3 h-3 rounded-full bg-[#059669]"></span>
                        <span className="font-medium">📉 Salariul tău ajustat la inflația începând din {chartData[0].date}:</span>
                        <span className="font-bold">{(hoveredData || chartData[chartData.length - 1]).adjusted.toLocaleString()} RON</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-600">
                        <span className="w-3 h-3 rounded-full bg-[#d97706]"></span>
                        <span className="font-medium">🎯 Salariul necesar pentru a-ți menține puterea de cumpărare:</span>
                        <span className="font-bold">{(hoveredData || chartData[chartData.length - 1]).maintainPowerTarget.toLocaleString()} RON</span>
                      </div>
                    </div>
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