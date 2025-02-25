import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, BarChart, Bar, Tooltip, Legend } from 'recharts';
import { ChartDataPoint } from '../types';

interface SalaryChartsProps {
  chartData: ChartDataPoint[];
  hoveredData: ChartDataPoint | null;
  setHoveredData: (data: ChartDataPoint | null) => void;
  targetValues: {
    maintainPowerTarget: number;
  };
  graphRef: React.RefObject<HTMLDivElement | null>;
}

export const SalaryCharts: React.FC<SalaryChartsProps> = ({
  chartData,
  hoveredData,
  setHoveredData,
  targetValues,
  graphRef
}) => {
  if (chartData.length === 0) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-muted rounded-xl p-8 animate-pulse">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-center font-medium mb-2">Nicio dată de afișat</p>
        <p className="text-center text-sm max-w-md">
          Adaugă salariul tău și apasă pe &quot;Analizează Salariul&quot; pentru a vedea graficele și statisticile
        </p>
      </div>
    );
  }

  const currentData = hoveredData || chartData[chartData.length - 1];

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="bg-card border border-border rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold mb-6">
          Evoluția Salariului și Puterii de Cumpărare
        </h3>
        
        <div className="h-[450px]" ref={graphRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              onMouseMove={(data) => data.activePayload && setHoveredData(data.activePayload[0].payload)}
              onMouseLeave={() => setHoveredData(chartData[chartData.length - 1])}
            >
              <defs>
                <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--indigo-color)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--indigo-color)" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="adjustedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--emerald-color)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--emerald-color)" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                stroke="var(--border)"
                tickMargin={10}
              />
              <YAxis
                domain={[
                  Math.min(chartData[0].nominal, chartData[0].adjusted) * 0.9,
                  Math.ceil(targetValues.maintainPowerTarget/1000)*1000
                ]}
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                stroke="var(--border)"
                tickFormatter={(value) => `${Math.round(value).toLocaleString()}`}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString()} RON`, '']}
                labelFormatter={(label: string) => `Data: ${label}`}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  boxShadow: 'var(--shadow-md)'
                }}
                labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold', marginBottom: '8px' }}
                itemStyle={{ padding: '4px 0' }}
              />
              <Area
                type="monotone"
                dataKey="nominal"
                fill="url(#salaryGradient)"
                stroke="none"
                fillOpacity={1}
                activeDot={false}
              />
              <Line
                type="stepAfter"
                dataKey="nominal"
                stroke="var(--indigo-color)"
                name="Salariul Tău"
                strokeWidth={3}
                dot={{ fill: 'var(--indigo-color)', r: 2, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--indigo-color)' }}
              />
              <Line
                type="monotone"
                dataKey="adjusted"
                stroke="var(--emerald-color)"
                name="Salariul ajustat la inflație"
                strokeWidth={2}
                dot={{ fill: 'var(--emerald-color)', r: 2, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--emerald-color)' }}
              />
              <Line
                type="monotone"
                dataKey="maintainPowerTarget"
                stroke="var(--amber-color)"
                name="Salariu necesar"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--amber-color)', r: 2, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--amber-color)' }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  const labels = {
                    "Salariul Tău": "💰 Salariul Tău",
                    "Salariul ajustat la inflație": `📉 Salariul ajustat la inflația din ${chartData[0].date}`,
                    "Salariu necesar": "🎯 Salariu necesar pentru menținerea puterii de cumpărare"
                  };
                  return labels[value as keyof typeof labels] || value;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo/5 p-4 rounded-lg border border-indigo/20">
            <div className="flex items-center gap-2 text-indigo mb-1">
              <span className="w-3 h-3 rounded-full bg-indigo"></span>
              <span className="font-medium">Salariul Tău</span>
            </div>
            <span className="text-2xl font-bold block">
              {currentData.nominal.toLocaleString()} RON
            </span>
            <span className="text-xs text-muted-foreground block mt-1">
              {currentData.date}
            </span>
          </div>
          
          <div className="bg-emerald/5 p-4 rounded-lg border border-emerald/20">
            <div className="flex items-center gap-2 text-emerald mb-1">
              <span className="w-3 h-3 rounded-full bg-emerald"></span>
              <span className="font-medium">Salariul ajustat la inflație</span>
            </div>
            <span className="text-2xl font-bold block">
              {currentData.adjusted.toLocaleString()} RON
            </span>
            <span className="text-xs text-muted-foreground block mt-1">
              Valoarea reală a salariului tău
            </span>
          </div>
          
          <div className="bg-amber/5 p-4 rounded-lg border border-amber/20">
            <div className="flex items-center gap-2 text-amber mb-1">
              <span className="w-3 h-3 rounded-full bg-amber"></span>
              <span className="font-medium">Salariu necesar</span>
            </div>
            <span className="text-2xl font-bold block">
              {currentData.maintainPowerTarget.toLocaleString()} RON
            </span>
            <span className="text-xs text-muted-foreground block mt-1">
              Pentru a menține puterea de cumpărare
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold mb-6">
          Pierderea Puterii de Cumpărare în Timp
        </h3>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              onMouseMove={(data) => data.activePayload && setHoveredData(data.activePayload[0].payload)}
              onMouseLeave={() => setHoveredData(chartData[chartData.length - 1])}
            >
              <defs>
                <linearGradient id="purchasingPowerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--red-foreground)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--red-foreground)" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                stroke="var(--border)"
                tickMargin={10}
              />
              <YAxis
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                stroke="var(--border)"
                label={{
                  value: 'Pierdere (%)',
                  position: 'insideLeft',
                  angle: -90,
                  offset: -10,
                  fill: 'var(--muted-foreground)',
                  fontSize: 12
                }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Pierdere Putere de Cumpărare']}
                labelFormatter={(label: string) => `Data: ${label}`}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderRadius: '8px',
                  border: '1px solid var(--red-border)',
                  color: 'var(--foreground)',
                  boxShadow: 'var(--shadow-md)'
                }}
                labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold', marginBottom: '8px' }}
              />
              <Bar
                dataKey="purchasingPowerLoss"
                fill="url(#purchasingPowerGradient)"
                radius={[4, 4, 0, 0]}
                name="Pierdere Putere de Cumpărare"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-red-background/10 border border-red-border/30 rounded-lg">
          <p className="text-foreground">
            <span className="font-bold">Pierderea puterii de cumpărare</span> reprezintă procentul din valoarea salariului tău care a fost &quot;mâncat&quot; de inflație de-a lungul timpului.
            În {currentData.date}, această pierdere este de <span className="font-bold text-red-foreground">{currentData.purchasingPowerLoss.toFixed(1)}%</span>.
          </p>
        </div>
      </div>
    </div>
  );
};