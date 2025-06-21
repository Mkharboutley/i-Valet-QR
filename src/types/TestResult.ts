
export interface TestResult {
  id: string;
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  timestamp: number;
}
