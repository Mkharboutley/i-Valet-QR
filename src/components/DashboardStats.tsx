
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Car, Clock, Users, TrendingUp } from 'lucide-react';
import { Ticket } from '../types/Ticket';

interface DashboardStatsProps {
  tickets: Ticket[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ tickets }) => {
  const activeTickets = tickets.filter(t => ['running', 'requested', 'assigned'].includes(t.status));
  const completedToday = tickets.filter(t => 
    t.status === 'completed' && 
    t.completed_at && 
    new Date(t.completed_at.toDate()).toDateString() === new Date().toDateString()
  );
  const avgResponseTime = '4.2'; // Mock data - calculate from actual ticket data
  const customerSatisfaction = '94'; // Mock data

  const stats = [
    {
      title: 'Active Tickets',
      value: activeTickets.length.toString(),
      icon: Car,
      description: 'Currently in progress',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30',
      shadowColor: 'hover:shadow-blue-500/20'
    },
    {
      title: 'Completed Today',
      value: completedToday.length.toString(),
      icon: TrendingUp,
      description: 'Tickets resolved today',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/30',
      shadowColor: 'hover:shadow-green-500/20'
    },
    {
      title: 'Avg Response Time',
      value: `${avgResponseTime} min`,
      icon: Clock,
      description: 'Average time to assign',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30',
      shadowColor: 'hover:shadow-yellow-500/20'
    },
    {
      title: 'Satisfaction Rate',
      value: `${customerSatisfaction}%`,
      icon: Users,
      description: 'Customer satisfaction',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-400/30',
      shadowColor: 'hover:shadow-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className={`bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-2xl ${stat.shadowColor} transition-all duration-300 hover:scale-105 hover:bg-black/30`}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border backdrop-blur-md`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
