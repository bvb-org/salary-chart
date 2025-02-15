'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

  // Salary changes with exact dates
  const salaryChanges = [
    { date: '2021-11-22', salary: 9123 },
    { date: '2022-11-22', salary: 10123 },
    { date: '2023-10-22', salary: 11123 },
    { date: '2024-05-22', salary: 12123 },
    { date: '2024-09-22', salary: 13123 }
  ];

  // Generate monthly data points
  const data = [];
  let currentSalaryIndex = 0;
  let cumulativeInflation = 1;
  const initialSalary = 10000;
  const initialSalaryPlus10 = 11000;

  const months = Object.entries(inflationRates).flatMap(([year, months]) => 
    Object.entries(months).map(([month, rate]) => ({
      date: `${year}-${month}`,
      rate: rate
    }))
  );

  months.forEach((month, index) => {
    // Update current salary based on date
    const currentDate = month.date;
    while (currentSalaryIndex < salaryChanges.length - 1 && 
           salaryChanges[currentSalaryIndex + 1].date <= currentDate) {
      currentSalaryIndex++;
    }
    const currentSalary = salaryChanges[currentSalaryIndex].salary;

    // Calculate cumulative inflation
    const monthlyInflationFactor = 1 + (month.rate / 100 / 12);
    cumulativeInflation *= monthlyInflationFactor;

    // Calculate inflation-adjusted salary
    const inflationAdjustedSalary = currentSalary / cumulativeInflation;

    // Calculate target salaries
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

  // Get final target values
  const finalData = data[data.length - 1];
  const targetForMaintaining = finalData.maintainPowerTarget;
  const targetForGrowth = finalData.growthTarget;

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Salary Evolution with Target Scenarios (RON)</CardTitle>
        <div className="text-sm space-y-2">
          <p>Target salary to maintain original purchasing power: {targetForMaintaining.toLocaleString()} RON</p>
          <p>Target salary for 10% real growth: {targetForGrowth.toLocaleString()} RON</p>
          <p>Current salary: {finalData.nominal.toLocaleString()} RON</p>
          <p>Needed increase to maintain power: {(targetForMaintaining - finalData.nominal).toLocaleString()} RON</p>
          <p>Needed increase for 10% growth: {(targetForGrowth - finalData.nominal).toLocaleString()} RON</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[8000, Math.ceil(targetForGrowth/1000)*1000]} />
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryChart;