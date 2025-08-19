export interface PeriodProps {
  periodStart?: string;
  periodEnd?: string;
}

export const DEFAULT_PERIOD: Required<PeriodProps> = {
  periodStart: '',
  periodEnd: '',
};
