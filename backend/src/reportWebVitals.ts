export interface Metric {
  name: string;
  value: number;
  delta: number;
  id: string;
  entries: any[];
}

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    console.log('Web Vitals reporting enabled');
  }
};

export default reportWebVitals;
