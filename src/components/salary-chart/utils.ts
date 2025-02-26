import { SalaryChange, ChartDataPoint, InflationData, TargetValues } from './types';

export const calculateChartData = (
  salaryChanges: SalaryChange[],
  inflationData: InflationData[]
): { chartData: ChartDataPoint[]; targetValues: TargetValues } => {
  if (salaryChanges.length === 0 || inflationData.length === 0) {
    return { chartData: [], targetValues: { maintainPowerTarget: 0, nominal: 0, initialBasketToday: 0, lifetimeEarnings: 0 } };
  }

  const data: ChartDataPoint[] = [];
  let cumulativeInflation = 1;
  
  // Sort and validate dates
  const sortedChanges = [...salaryChanges].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  // Track inflation since last salary change
  let lastChangeCumulativeInflation = 1;
  
  // Get start and end dates
  const [startYear, startMonth] = sortedChanges[0].date.split('-').map(Number);
  const startDate = new Date(startYear, startMonth - 1, 1);

  const [lastSalaryYear, lastSalaryMonth] = sortedChanges[sortedChanges.length - 1].date.split('-').map(Number);
  const [lastInflationYear, lastInflationMonth] = inflationData[inflationData.length - 1].date.split('-').map(Number);
  
  const lastSalaryDate = new Date(lastSalaryYear, lastSalaryMonth - 1, 1);
  const lastInflationDate = new Date(lastInflationYear, lastInflationMonth - 1, 1);
  const endDate = new Date(Math.max(lastSalaryDate.getTime(), lastInflationDate.getTime()));

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date parsing');
  }

  let lastChangeSalary = sortedChanges[0].salary;
  const currentDate = new Date(startDate);
  const loopEndDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1);

  while (currentDate < loopEndDate) {
    const monthRate = getInflationRate(currentDate, inflationData);
    
    if (monthRate !== null) {
      const inflationFactor = 1 + (monthRate / 100 / 12);
      cumulativeInflation *= inflationFactor;

      const currentNominal = getNominalSalary(currentDate, sortedChanges);
      
      if (currentNominal !== lastChangeSalary) {
        lastChangeSalary = currentNominal;
        lastChangeCumulativeInflation = cumulativeInflation;
      }

      const inflationSinceLastChange = cumulativeInflation / lastChangeCumulativeInflation;
      const inflationAdjustedSalary = currentNominal / cumulativeInflation;
      const maintainPowerTarget = currentNominal * inflationSinceLastChange;
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

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  if (data.length > 0) {
    const finalData = data[data.length - 1];
    const initialSalary = sortedChanges[0].salary;
    const initialBasketToday = Math.round(initialSalary * cumulativeInflation);
    
    const lifetimeEarnings = data.reduce((sum, point) => sum + point.nominal, 0);
    
    return {
      chartData: data,
      targetValues: {
        maintainPowerTarget: finalData.maintainPowerTarget,
        nominal: finalData.nominal,
        initialBasketToday,
        lifetimeEarnings
      }
    };
  }

  return { chartData: [], targetValues: { maintainPowerTarget: 0, nominal: 0, initialBasketToday: 0, lifetimeEarnings: 0 } };
};

export const getNominalSalary = (currentDate: Date, sortedChanges: SalaryChange[]): number => {
  const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const validChanges = sortedChanges.filter(change => change.date <= currentYearMonth);
  return validChanges.length > 0 ? validChanges[validChanges.length - 1].salary : 0;
};

export const getInflationRate = (date: Date, inflationData: InflationData[]): number | null => {
  if (isNaN(date.getTime())) {
    return null;
  }

  const searchYearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const monthData = inflationData.find(d => d.date.substring(0, 7) === searchYearMonth);
  return monthData ? monthData.rate : null;
};

export const calculateGovernmentContribution = (data: ChartDataPoint[], taxExempt: boolean): {
  totalContribution: number;
  stateMonths: number;
  totalMonths: number;
} => {
  let totalContribution = 0;
  let stateMonths = 0;
  let totalMonths = 0;

  data.forEach(monthData => {
    const [month, year] = monthData.date.split('-').map(Number);
    let taxPercentage;
    
    if (taxExempt) {
      if (year >= 2025) {
        taxPercentage = 0.415;
      } else if (year === 2023 && month >= 11 || year === 2024) {
        const baseGross = monthData.nominal * 1.35;
        if (baseGross <= 10000) {
          taxPercentage = 0.35;
        } else {
          const netFor10000 = 10000 / 1.35;
          const remainingNet = monthData.nominal - netFor10000;
          taxPercentage = ((netFor10000 * 0.35) + (remainingNet * 0.415)) / monthData.nominal;
        }
      } else if (year >= 2004) {
        taxPercentage = 0.35;
      } else {
        taxPercentage = 0.415;
      }
    } else {
      taxPercentage = 0.415;
    }

    const contribution = monthData.nominal * taxPercentage;
    totalContribution += contribution;
    stateMonths += taxPercentage;
    totalMonths++;
  });

  return { totalContribution, stateMonths, totalMonths };
};