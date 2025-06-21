
import React, { useState } from 'react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, ClipboardCheck, Rocket } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  required: boolean;
  category: 'functionality' | 'performance' | 'security' | 'documentation';
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'ticket-display',
    label: 'Ticket display working correctly',
    description: 'Ensure all ticket information displays properly on all views',
    checked: false,
    required: true,
    category: 'functionality'
  },
  {
    id: 'voice-recording',
    label: 'Voice recording functionality working',
    description: 'Test voice recording on different browsers',
    checked: false,
    required: true,
    category: 'functionality'
  },
  {
    id: 'voice-playback',
    label: 'Voice playback working correctly',
    description: 'Test voice playback on different browsers and devices',
    checked: false,
    required: true,
    category: 'functionality'
  },
  {
    id: 'status-updates',
    label: 'Ticket status updates in realtime',
    description: 'Ensure status changes reflect immediately in UI',
    checked: false,
    required: true,
    category: 'functionality'
  },
  {
    id: 'notifications',
    label: 'Push notifications working',
    description: 'Test push notifications for new messages',
    checked: false,
    required: true,
    category: 'functionality'
  },
  {
    id: 'error-handling',
    label: 'Error handling implemented',
    description: 'Test error scenarios and ensure proper user feedback',
    checked: false,
    required: true,
    category: 'functionality'
  },
  {
    id: 'performance-testing',
    label: 'Performance testing completed',
    description: 'Ensure app performs well with many tickets/messages',
    checked: false,
    required: false,
    category: 'performance'
  },
  {
    id: 'security-review',
    label: 'Security review completed',
    description: 'Ensure Firebase security rules are properly configured',
    checked: false,
    required: true,
    category: 'security'
  },
  {
    id: 'firebase-rules',
    label: 'Firebase rules tested',
    description: 'Verify that security rules work as expected',
    checked: false,
    required: true,
    category: 'security'
  },
  {
    id: 'documentation',
    label: 'User documentation completed',
    description: 'Ensure user documentation is up-to-date',
    checked: false,
    required: false,
    category: 'documentation'
  },
  {
    id: 'code-cleanup',
    label: 'Code cleanup completed',
    description: 'Remove console logs and dead code',
    checked: false,
    required: false,
    category: 'documentation'
  }
];

const CodeFreezeChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(CHECKLIST_ITEMS);
  const [filter, setFilter] = useState<'all' | 'functionality' | 'performance' | 'security' | 'documentation'>('all');

  const handleCheckItem = (id: string, checked: boolean) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  const completedCount = items.filter(item => item.checked).length;
  const totalCount = items.length;
  const requiredCount = items.filter(item => item.required).length;
  const completedRequiredCount = items.filter(item => item.required && item.checked).length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const requiredProgress = Math.round((completedRequiredCount / requiredCount) * 100);
  
  const isReadyForFreeze = completedRequiredCount === requiredCount;

  const filteredItems = items.filter(item => filter === 'all' || item.category === filter);

  const resetChecklist = () => {
    setItems(CHECKLIST_ITEMS.map(item => ({ ...item, checked: false })));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 pb-4">
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          Code Freeze Readiness Checklist
        </CardTitle>
        <CardDescription>
          Complete all required items before proceeding to code freeze
        </CardDescription>
        
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{completedCount}/{totalCount} ({progress}%)</span>
            </div>
            <Progress value={progress} />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Required Items</span>
              <span>{completedRequiredCount}/{requiredCount} ({requiredProgress}%)</span>
            </div>
            <Progress 
              value={requiredProgress} 
              className={isReadyForFreeze ? "bg-green-200" : "bg-amber-200"}
            />
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            {isReadyForFreeze ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  Ready for code freeze!
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-amber-600">
                  Required items pending
                </span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'functionality' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('functionality')}
          >
            Functionality
          </Button>
          <Button 
            variant={filter === 'performance' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('performance')}
          >
            Performance
          </Button>
          <Button 
            variant={filter === 'security' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('security')}
          >
            Security
          </Button>
          <Button 
            variant={filter === 'documentation' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('documentation')}
          >
            Documentation
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`p-3 border rounded-lg ${
                item.checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox 
                  id={item.id} 
                  checked={item.checked}
                  onCheckedChange={(checked) => handleCheckItem(item.id, checked === true)}
                />
                <div>
                  <label 
                    htmlFor={item.id} 
                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                  >
                    {item.label}
                    {item.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </label>
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="bg-slate-50 flex flex-wrap gap-4">
        <Button 
          variant="outline" 
          onClick={resetChecklist}
        >
          Reset Checklist
        </Button>
        
        <Button 
          disabled={!isReadyForFreeze}
          className="gap-2"
        >
          <Rocket className="h-4 w-4" />
          Proceed to Code Freeze
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CodeFreezeChecklist;
