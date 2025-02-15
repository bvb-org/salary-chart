'use client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
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
  growthTarget: number;
}

interface TargetValues {
  maintainPowerTarget: number;
  growthTarget: number;
  nominal: number;
}

const SalaryChart = () => {
  // Romanian inflation rates
  const inflationRates = {
    '2021': { Oct: 7.94, Nov: 7.88, Dec: 8.19 },
    '2022': { Jan: 8.35, Feb: 8.53, Mar: 10.15, Apr: 13.76, May: 14.49, Jun: 15.05, 
              Jul: 14.96, Aug: 15.32, Sep: 15.88, Oct: 15.32, Nov: 16.76, Dec: 16.37 },
    '2023': { Jan: 15.07, Feb: 15.52, Mar: 14.53, Apr: 11.23, May: 10.64, Jun: 10.25, 
              Jul: 9.44, Aug: 9.43, Sep: 8.83, Oct: 8.07, Nov: 6.72, Dec: 6.61 },
    '2024': { Jan: 7.41, Feb: 7.23, Mar: 7.08, Apr: 6.68, May: 6.58, Jun: 6.42, 
              Jul: 6.33, Aug: 6.21, Sep: 6.07, Oct: 5.9, Nov: 5.75, Dec: 5.66 }
  };

  const [salaryChanges, setSalaryChanges] = useState<SalaryChange[]>([
    { date: '2021-11-22', salary: 9123 }
  ]);
  const [newDate, setNewDate] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [initialSalary, setInitialSalary] = useState(10000);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [targetValues, setTargetValues] = useState<TargetValues>({
    maintainPowerTarget: 0,
    growthTarget: 0,
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
    const data: ChartDataPoint[] = [];
    let currentSalaryIndex = 0;
    let cumulativeInflation = 1;
    const initialSalaryPlus10 = initialSalary * 1.1;

    const months = Object.entries(inflationRates).flatMap(([year, months]) => 
      Object.entries(months).map(([month, rate]) => ({
        date: `${year}-${month}`,
        rate: rate
      }))
    );

    months.forEach((month) => {
      const currentDate = month.date;
      while (currentSalaryIndex < salaryChanges.length - 1 && 
             salaryChanges[currentSalaryIndex + 1].date <= currentDate) {
        currentSalaryIndex++;
      }
      const currentSalary = salaryChanges[currentSalaryIndex].salary;

      const monthlyInflationFactor = 1 + (month.rate / 100 / 12);
      cumulativeInflation *= monthlyInflationFactor;

      const inflationAdjustedSalary = currentSalary / cumulativeInflation;
      const maintainPowerTarget = initialSalary * cumulativeInflation;
      const growthTarget = initialSalaryPlus10 * cumulativeInflation;

      data.push({
        date: currentDate,
        nominal: currentSalary,
        adjusted: Math.round(inflationAdjustedSalary),
        maintainPowerTarget: Math.round(maintainPowerTarget),
        growthTarget: Math.round(growthTarget)
      });
    });

    setChartData(data);
    const finalData = data[data.length - 1];
    setTargetValues({
      maintainPowerTarget: finalData.maintainPowerTarget,
      growthTarget: finalData.growthTarget,
      nominal: finalData.nominal
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Salary Evolution with Target Scenarios (RON)</CardTitle>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Initial Salary (RON):</label>
            <input
              type="number"
              value={initialSalary}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInitialSalary(Number(e.target.value))}
              className="border rounded px-2 py-1 w-full max-w-xs"
            />
          </div>
          
          <form onSubmit={addSalaryChange} className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <div>
                <label className="block text-sm font-medium">Date:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewDate(e.target.value)}
                  className="border rounded px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Salary (RON):</label>
                <input
                  type="number"
                  value={newSalary}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSalary(e.target.value)}
                  className="border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Salary Changes:</h3>
            <div className="space-y-1">
              {salaryChanges.map((change, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-sm">
                    {change.date}: {change.salary.toLocaleString()} RON
                  </span>
                  <button
                    onClick={() => removeSalaryChange(index)}
                    className="text-red-500 text-sm hover:text-red-600"
                    disabled={index === 0}
                  >
                    {index === 0 ? '(initial)' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={calculateChart}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Calculate
          </button>

          {chartData.length > 0 && (
            <div className="text-sm space-y-2">
              <p>Target salary to maintain original purchasing power: {targetValues.maintainPowerTarget.toLocaleString()} RON</p>
              <p>Target salary for 10% real growth: {targetValues.growthTarget.toLocaleString()} RON</p>
              <p>Current salary: {targetValues.nominal.toLocaleString()} RON</p>
              <p>Needed increase to maintain power: {(targetValues.maintainPowerTarget - targetValues.nominal).toLocaleString()} RON</p>
              <p>Needed increase for 10% growth: {(targetValues.growthTarget - targetValues.nominal).toLocaleString()} RON</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                <YAxis domain={[
                  Math.min(chartData[0].nominal, chartData[0].adjusted) * 0.9,
                  Math.ceil(targetValues.growthTarget/1000)*1000
                ]} />
                <Tooltip 
                  formatter={(value) => `${value.toLocaleString()} RON`}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line 
                  type="stepAfter" 
                  dataKey="nominal" 
                  stroke="#8884d8" 
                  name="Actual Nominal Salary" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="adjusted" 
                  stroke="#82ca9d" 
                  name="Inflation-Adjusted Salary" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="maintainPowerTarget" 
                  stroke="#ff7300" 
                  name="Target (Maintain Power)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="growthTarget" 
                  stroke="#ff0000" 
                  name="Target (10% Growth)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Click Calculate to generate the chart
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryChart;