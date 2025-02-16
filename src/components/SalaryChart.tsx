'use client';
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
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
}

interface TargetValues {
  maintainPowerTarget: number;
  nominal: number;
}

interface InflationData {
  date: string;
  rate: number;
}

const SalaryChart = () => {
  const graphRef = React.useRef<HTMLDivElement>(null);
  
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
    nominal: 0
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
    let lastChangeIndex = 0;
    let lastChangeCumulativeInflation = 1;

    // Get start date from first salary entry and end date from last inflation data point
    const startDate = new Date(sortedChanges[0].date);
    const endDate = new Date(inflationData[inflationData.length - 1].date);

    // Function to get current nominal salary for a date
    const getNominalSalary = (currentDate: Date) => {
      const validChanges = sortedChanges.filter(change => 
        new Date(change.date) <= currentDate
      );
      return validChanges.length > 0 ? validChanges[validChanges.length - 1].salary : initialSalary;
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
          purchasingPowerLoss: Math.round(purchasingPowerLoss * 10) / 10
        });
      }

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    if (data.length > 0) {
      setChartData(data);
      const finalData = data[data.length - 1];
      setTargetValues({
        maintainPowerTarget: finalData.maintainPowerTarget,
        nominal: finalData.nominal
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
              Calculează Impactul Real al Inflației Asupra Salariului Tău
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Vezi cum inflația îți afectează puterea de cumpărare, chiar și atunci când primești măriri de salariu.
            </p>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Adaugă istoricul salariului tău pentru a vedea impactul real al inflației. Începe cu primul salariu și adaugă fiecare modificare.
                </p>
                <form onSubmit={addSalaryChange} className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Luna și Anul Modificării:
                        <span className="text-gray-500 text-xs ml-1">(ex: prima lună sau luna măririi)</span>
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
                        Salariul Net:
                        <span className="text-gray-500 text-xs ml-1">(suma primită în mână)</span>
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
                        Adaugă Modificare
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700">Istoricul Modificărilor Salariale:</h3>
                <div className="space-y-2">
                  {salaryChanges.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      Nu ai adăugat încă nicio modificare salarială. Adaugă primul tău salariu pentru a începe analiza.
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
                                  {difference > 0 ? '+' : ''}{percentageChange}%
                                </span>
                              )}
                            </div>
                            {difference !== 0 && (
                              <span className="text-xs text-gray-500">
                                {difference > 0 ? 'Creștere' : 'Scădere'} de {Math.abs(difference).toLocaleString()} RON
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeSalaryChange(index)}
                            className="text-red-500 hover:text-red-600 text-sm font-medium focus:outline-none"
                          >
                            Șterge
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
                Calculează
              </button>

              {chartData.length > 0 && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="border-b border-gray-200 pb-3">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Exemplu Practic</h3>
                    <p className="text-sm text-gray-600">
                      Cu salariul tău din {chartData[0].date}, puteai cumpăra:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-center text-gray-700">
                        <span className="w-32">Coș cumpărături:</span>
                        <span className="font-medium">{chartData[0].nominal.toLocaleString()} RON</span>
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="w-32">Același coș azi:</span>
                        <span className="font-medium">{targetValues.maintainPowerTarget.toLocaleString()} RON</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Rezumat</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between text-gray-700">
                        <span>Salariul tău actual:</span>
                        <span className="font-medium">{targetValues.nominal.toLocaleString()} RON</span>
                      </li>
                      <li className="flex justify-between text-gray-700">
                        <span>Valoarea reală:</span>
                        <span className="font-medium">{Math.round(chartData[chartData.length - 1].adjusted).toLocaleString()} RON</span>
                      </li>
                      <li className="flex justify-between text-red-600 font-medium border-t border-gray-200 pt-2 mt-2">
                        <span>Pierdere lunară:</span>
                        <span>{(targetValues.nominal - Math.round(chartData[chartData.length - 1].adjusted)).toLocaleString()} RON</span>
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
                  Impactul Inflației
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-red-600">
                      Pierdere Putere de Cumpărare:{' '}
                      <span className="font-bold text-xl">
                        {chartData[chartData.length - 1].purchasingPowerLoss.toFixed(1)}%
                      </span>
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      Din salariul tău de {targetValues.nominal.toLocaleString()} RON,{' '}
                      poți cumpăra bunuri în valoare de doar {Math.round(chartData[chartData.length - 1].adjusted).toLocaleString()} RON
                    </p>
                  </div>
                  <div>
                    <p className="text-red-600">
                      Pentru a-ți menține puterea de cumpărare, ai avea nevoie de:{' '}
                      <span className="font-bold">
                        +{(targetValues.maintainPowerTarget - targetValues.nominal).toLocaleString()} RON
                      </span>
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      Salariu necesar: {targetValues.maintainPowerTarget.toLocaleString()} RON
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="h-[400px] lg:h-[calc(100vh-16rem)] min-h-[500px]" ref={graphRef}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 65 }}>
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
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'purchasingPowerLoss') {
                          return [`${value}%`, 'Pierdere Putere de Cumpărare'];
                        }
                        if (name === 'Ce Primești') {
                          return [`${value.toLocaleString()} RON`, 'Salariul Nominal'];
                        }
                        if (name === 'Ce Poți Cumpăra') {
                          return [`${value.toLocaleString()} RON`, 'Valoarea Reală'];
                        }
                        if (name === 'Ce Ai Avea Nevoie') {
                          return [`${value.toLocaleString()} RON`, 'Inflatia dupa marire salariu'];
                        }
                        return [`${value.toLocaleString()} RON`, name];
                      }}
                      labelFormatter={(label) => `Luna: ${label.substring(3, 5)}-${label.substring(0, 4)}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '8px 12px'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
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
                      name="Ce Primești"
                      strokeWidth={3}
                      dot={{ fill: '#4f46e5', r: 1 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="adjusted"
                      stroke="#059669"
                      name="Ce Poți Cumpăra"
                      strokeWidth={2}
                      dot={{ fill: '#059669', r: 1 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="maintainPowerTarget"
                      stroke="#d97706"
                      name="Ce Ai Avea Nevoie"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#d97706', r: 1 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                  Adaugă intrări salariale și apasă Calculează pentru a genera graficul
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default SalaryChart;