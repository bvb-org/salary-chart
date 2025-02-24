import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, BarChart, Bar, Tooltip } from 'recharts';
import { ChartDataPoint } from '../types';

interface SalaryChartsProps {
  chartData: ChartDataPoint[];
  hoveredData: ChartDataPoint | null;
  setHoveredData: (data: ChartDataPoint | null) => void;
  targetValues: {
    maintainPowerTarget: number;
  };
  graphRef: React.RefObject<HTMLDivElement | null>;  // Updated type to match the parent component
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
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
        📊 Adaugă salariul tău și apasă pe &quot;Analizează Salariul&quot; pentru a vedea graficele
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
      <div className="h-[500px]">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">📊 <strong>Pierderea Puterii de Cumpărare în Timp:</strong></p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
            onMouseMove={(data) => data.activePayload && setHoveredData(data.activePayload[0].payload)}
            onMouseLeave={() => setHoveredData(chartData[chartData.length - 1])}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" className="dark:opacity-20" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fill: '#4b5563', className: 'dark:fill-gray-400' }}
              stroke="#9ca3af"
              className="dark:stroke-gray-600"
            />
            <YAxis
              tick={{ fill: '#4b5563', className: 'dark:fill-gray-400' }}
              stroke="#9ca3af"
              className="dark:stroke-gray-600"
              label={{ value: '%', position: 'insideLeft', offset: 0, className: 'dark:fill-gray-400' }}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Pierdere Putere de Cumpărare']}
              labelFormatter={(label: string) => `Data: ${label}`}
              contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '6px', border: '1px solid #ef4444', color: 'var(--foreground)' }}
              labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
            />
            <Bar dataKey="purchasingPowerLoss" fill="#ef4444" name="Pierdere Putere de Cumpărare" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[400px] relative" ref={graphRef}>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" className="dark:opacity-20" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fill: '#4b5563', className: 'dark:fill-gray-400' }}
              stroke="#9ca3af"
              className="dark:stroke-gray-600"
            />
            <YAxis
              domain={[
                Math.min(chartData[0].nominal, chartData[0].adjusted) * 0.9,
                Math.ceil(targetValues.maintainPowerTarget/1000)*1000
              ]}
              tick={{ fill: '#4b5563', className: 'dark:fill-gray-400' }}
              stroke="#9ca3af"
              className="dark:stroke-gray-600"
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
              stroke="var(--indigo-color, #4f46e5)"
              name="Salariul Tău"
              strokeWidth={3}
              dot={{ fill: 'var(--indigo-color, #4f46e5)', r: 1 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="adjusted"
              stroke="var(--emerald-color, #059669)"
              name={`Salariul tău ajustat la inflația incepand din ${chartData[0].date}`}
              strokeWidth={2}
              dot={{ fill: 'var(--emerald-color, #059669)', r: 1 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="maintainPowerTarget"
              stroke="var(--amber-color, #d97706)"
              name="Salariu necesar pentru menținerea puterii de cumpărare"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'var(--amber-color, #d97706)', r: 1 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="font-bold text-gray-700 dark:text-gray-200 mb-2">
            {(hoveredData || chartData[chartData.length - 1]).date}
          </p>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <span className="w-3 h-3 rounded-full bg-[#4f46e5] dark:bg-[#6366f1]"></span>
            <span className="font-medium">💰 Salariul Tău:</span>
            <span className="font-bold">
              {(hoveredData || chartData[chartData.length - 1]).nominal.toLocaleString()} RON
            </span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <span className="w-3 h-3 rounded-full bg-[#059669] dark:bg-[#34d399]"></span>
            <span className="font-medium">📉 Salariul tău ajustat la inflația începând din {chartData[0].date}:</span>
            <span className="font-bold">
              {(hoveredData || chartData[chartData.length - 1]).adjusted.toLocaleString()} RON
            </span>
          </div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <span className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-[#fbbf24]"></span>
            <span className="font-medium">🎯 Salariul necesar pentru a-ți menține puterea de cumpărare:</span>
            <span className="font-bold">
              {(hoveredData || chartData[chartData.length - 1]).maintainPowerTarget.toLocaleString()} RON
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};