export interface SalaryChange {
  date: string;
  salary: number;
}

export interface ChartDataPoint {
  date: string;
  nominal: number;
  adjusted: number;
  maintainPowerTarget: number;
  purchasingPowerLoss: number;
  rate: number;
}

export interface InflationData {
  date: string;
  rate: number;
}

export interface TargetValues {
  maintainPowerTarget: number;
  nominal: number;
  initialBasketToday: number;
  lifetimeEarnings: number;
}