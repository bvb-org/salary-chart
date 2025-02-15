'use client';
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    const initialSalary = salaryChanges[0].salary;
    const sortedChanges = [...salaryChanges].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

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
    
    while (currentDate < loopEndDate) {
      // Get inflation rate for this month
      const monthRate = getInflationRate(currentDate);
      
      if (monthRate !== null) {
        // Calculate inflation factor for this month
        const inflationFactor = 1 + (monthRate / 100 / 12);
        cumulativeInflation *= inflationFactor;

        const currentNominal = getNominalSalary(currentDate);
        const inflationAdjustedSalary = currentNominal / cumulativeInflation;
        const maintainPowerTarget = initialSalary * cumulativeInflation;

        // Format date for display (YYYY-MM)
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

        data.push({
          date: formattedDate,
          nominal: currentNominal,
          adjusted: Math.round(inflationAdjustedSalary),
          maintainPowerTarget: Math.round(maintainPowerTarget)
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
            <CardTitle className="text-2xl font-bold text-gray-800">Evoluția Salariului cu Scenarii Țintă (RON)</CardTitle>
            <div className="space-y-6">
              <form onSubmit={addSalaryChange} className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data:</label>
                    <input
                      type="month"
                      value={newDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salariu (RON):</label>
                    <input
                      type="number"
                      value={newSalary}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSalary(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Adaugă Intrare
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700">Modificări Salariale:</h3>
                <div className="space-y-2">
                  {salaryChanges.map((change, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                      <span className="text-sm text-gray-600">
                        {change.date.substring(0, 7)}: {change.salary.toLocaleString()} RON
                      </span>
                      <button
                        onClick={() => removeSalaryChange(index)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium focus:outline-none"
                      >
                        Șterge
                      </button>
                    </div>
                  ))}
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
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg text-sm">
                  <p className="text-gray-700">Salariu țintă pentru menținerea puterii de cumpărare: <span className="font-medium">{targetValues.maintainPowerTarget.toLocaleString()} RON</span></p>
                  <p className="text-gray-700">Salariu actual: <span className="font-medium">{targetValues.nominal.toLocaleString()} RON</span></p>
                  <p className="text-gray-700">Creștere necesară pentru menținerea puterii de cumparare: <span className="font-medium">{(targetValues.maintainPowerTarget - targetValues.nominal).toLocaleString()} RON</span></p>
                </div>
              )}
            </div>
          </CardHeader>
        </div>

        <div className="lg:order-2">
          <CardContent className="h-full pt-6">
            <div className="h-[400px] lg:h-[calc(100vh-12rem)] min-h-[500px]" ref={graphRef}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 65 }}>
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
                      formatter={(value) => `${value.toLocaleString()} RON`}
                      labelFormatter={(label) => `Data: ${label.substring(0, 7)}`}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Line
                      type="stepAfter"
                      dataKey="nominal"
                      stroke="#4f46e5"
                      name="Salariu Nominal Actual"
                      strokeWidth={2}
                      dot={{ fill: '#4f46e5', r: 1 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="adjusted"
                      stroke="#059669"
                      name="Salariu Ajustat la Inflație"
                      strokeWidth={2}
                      dot={{ fill: '#059669', r: 1 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="maintainPowerTarget"
                      stroke="#d97706"
                      name="Țintă (Menținere Putere)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#d97706', r: 1 }}
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