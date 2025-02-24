'use client';
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SalaryForm } from './components/SalaryForm';
import { SalaryHistory } from './components/SalaryHistory';
import { InflationImpact } from './components/InflationImpact';
import { SalaryCharts } from './components/SalaryCharts';
import { SalaryChange, ChartDataPoint, InflationData, TargetValues } from './types';
import { calculateChartData } from './utils';

const SalaryChart = () => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [hoveredData, setHoveredData] = useState<ChartDataPoint | null>(null);
  const [inflationData, setInflationData] = useState<InflationData[]>([]);
  const [salaryChanges, setSalaryChanges] = useState<SalaryChange[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [taxExempt, setTaxExempt] = useState(true);
  const [targetValues, setTargetValues] = useState<TargetValues>({
    maintainPowerTarget: 0,
    nominal: 0,
    initialBasketToday: 0,
    lifetimeEarnings: 0
  });

  // Parse URL parameters on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entries = Array.from(params.entries());
    
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
        const data = lines.slice(1)
          .map(line => {
            const [date, , rate] = line.split(',').map(val => val.replace(/"/g, ''));
            return {
              date,
              rate: parseFloat(rate)
            };
          })
          .filter(item => !isNaN(item.rate));
        setInflationData(data);
      })
      .catch(error => console.error('Error loading inflation data:', error));
  }, []);

  const addSalaryChange = (e: FormEvent) => {
    e.preventDefault();
    
    if (newDate && newSalary) {
      const salaryValue = parseInt(newSalary, 10);
      if (salaryValue < 0) {
        window.location.href = 'https://www.youtube.com/watch?v=xvFZjo5PgG0';
        return;
      }

      const datePattern = /^\d{4}-\d{2}$/;
      if (!datePattern.test(newDate)) {
        alert('Format dată invalid. Te rog folosește formatul AAAA-LL');
        return;
      }

      const [year, month] = newDate.split('-').map(Number);
      const inputDate = new Date(year, month - 1);
      const currentDate = new Date();
      
      inputDate.setDate(1);
      currentDate.setDate(1);
      
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
    if (salaryChanges.length === 0) {
      alert('Te rog adaugă cel puțin o intrare salarială');
      return;
    }

    if (inflationData.length === 0) {
      alert('Se încarcă datele despre inflație...');
      return;
    }

    try {
      const result = calculateChartData(salaryChanges, inflationData, taxExempt);
      setChartData(result.chartData);
      setTargetValues(result.targetValues);

      // Scroll to graph section
      if (graphRef.current) {
        graphRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      console.error('Error calculating chart data:', error);
      alert('Eroare la procesarea datelor. Te rog încearcă din nou.');
    }
  };

  const shareLink = () => {
    const params = new URLSearchParams();
    salaryChanges.forEach((change, index) => {
      params.append(`date${index}`, change.date);
      params.append(`salary${index}`, change.salary.toString());
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('Link-ul a fost copiat în clipboard! Îl poți distribui pentru a împărtăși datele tale salariale.');
        })
        .catch(handleClipboardFallback);
    } else {
      handleClipboardFallback();
    }

    function handleClipboardFallback() {
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
  };

  return (
    <Card className="w-full max-w-[1400px] mx-auto shadow-lg">
      <div className="space-y-6">
        <div>
          <CardHeader className="space-y-6">
            <CardTitle className="text-2xl font-bold">
              💰 Calculatorul de Salariu și Inflație
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              📊 Salut! Vom analiza împreună cum inflația îți afectează banii, chiar și atunci când primești măriri.
            </p>
            <div className="space-y-6">
              <SalaryForm
                newDate={newDate}
                newSalary={newSalary}
                setNewDate={setNewDate}
                setNewSalary={setNewSalary}
                addSalaryChange={addSalaryChange}
                taxExempt={taxExempt}
                setTaxExempt={setTaxExempt}
              />

              <SalaryHistory
                salaryChanges={salaryChanges}
                removeSalaryChange={removeSalaryChange}
                onCalculate={calculateChart}
                onShareLink={shareLink}
                taxExempt={taxExempt}
              />

              {chartData.length > 0 && (
                <InflationImpact
                  chartData={chartData}
                  initialSalary={salaryChanges[0].salary}
                  initialBasketToday={targetValues.initialBasketToday}
                  lifetimeEarnings={targetValues.lifetimeEarnings}
                  taxExempt={taxExempt}
                />
              )}
            </div>
          </CardHeader>
        </div>

        <div>
          <CardContent className="pt-6">
            <SalaryCharts
              chartData={chartData}
              hoveredData={hoveredData}
              setHoveredData={setHoveredData}
              targetValues={targetValues}
              graphRef={graphRef}
            />
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default SalaryChart;