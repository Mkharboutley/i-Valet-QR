import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { TestResult } from '../../types/TestResult';

interface TestResultsPanelProps {
  testResults: TestResult[];
}

const TestResultsPanel: React.FC<TestResultsPanelProps> = ({ testResults }) => {
  return (
    <ScrollArea className="h-96">
      {testResults.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No test results yet. Run some tests to see results here.
        </div>
      ) : (
        <div className="space-y-2">
          {testResults.map((result) => (
            <div 
              key={result.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {result.status === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : result.status === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-500" />
              )}
              
              <div className="flex-1">
                <div className="font-medium">{result.test}</div>
                <div className="text-sm text-gray-600">{result.message}</div>
              </div>
              
              <div className="text-xs text-gray-500">
                {new Date(result.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default TestResultsPanel;
