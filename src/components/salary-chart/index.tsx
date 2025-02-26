'use client';
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading inflation data:', error);
        setIsLoading(false);
      });
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
      setIsLoading(true);
      const result = calculateChartData(salaryChanges, inflationData);
      setChartData(result.chartData);
      setTargetValues(result.targetValues);
      setIsLoading(false);

      // Scroll to graph section
      if (graphRef.current) {
        setTimeout(() => {
          graphRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (error) {
      console.error('Error calculating chart data:', error);
      alert('Eroare la procesarea datelor. Te rog încearcă din nou.');
      setIsLoading(false);
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
    <Card variant="elevated" className="w-full mx-auto overflow-hidden">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-indigo animate-spin border-t-transparent"></div>
              <p className="text-foreground font-medium">Se procesează datele...</p>
            </div>
          </div>
        )}
        
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <CardTitle icon="💰">
                Calculatorul de Salariu și Inflație
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Analizează cum inflația îți afectează puterea de cumpărare în timp
              </CardDescription>
            </div>
          </div>
          
          <div className="space-y-8">
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

        <CardContent className="pt-8">
          <div id="charts" ref={graphRef}>
            <SalaryCharts
              chartData={chartData}
              hoveredData={hoveredData}
              setHoveredData={setHoveredData}
              targetValues={targetValues}
              graphRef={graphRef}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default SalaryChart;