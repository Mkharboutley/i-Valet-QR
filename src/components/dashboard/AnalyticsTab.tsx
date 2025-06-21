
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Ticket } from '../../types/Ticket';

interface AnalyticsTabProps {
  tickets: Ticket[];
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ tickets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-morphism-strong rounded-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white font-light">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-light">Average Response Time</span>
            <Badge variant="secondary" className="glass-morphism border border-white/20 text-gray-200 font-light">
              4.2 mins
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-light">Customer Satisfaction</span>
            <Badge variant="secondary" className="glass-morphism border border-white/20 text-gray-200 font-light">
              94%
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-light">Completion Rate</span>
            <Badge variant="secondary" className="glass-morphism border border-white/20 text-gray-200 font-light">
              98%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism-strong rounded-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white font-light">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tickets.slice(0, 5).map((ticket) => (
            <div key={ticket.id} className="flex items-center gap-4 p-4 glass-morphism rounded-xl hover:glass-morphism-strong transition-all duration-300">
              <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate font-light">
                  Ticket #{ticket.ticket_number}
                </p>
                <p className="text-xs text-gray-400 truncate font-light">
                  {ticket.car_model} - {ticket.plate_number}
                </p>
              </div>
              <Badge variant="outline" className="glass-morphism border-white/20 text-gray-200 flex-shrink-0 font-light">
                {ticket.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
