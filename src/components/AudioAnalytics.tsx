
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, MessageCircle, User, TrendingUp } from 'lucide-react';
import { getVoiceMessages } from '../services/realtime';
import { VoiceMessage } from '../types/VoiceMessage';
import { getRelativeTime } from '../utils/time';

interface AudioAnalyticsProps {
  ticketId: string;
}

interface AnalyticsData {
  totalMessages: number;
  clientMessages: number;
  adminMessages: number;
  averageResponseTime: number;
  messageTimeline: Array<{
    hour: string;
    messages: number;
  }>;
  senderDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentActivity: VoiceMessage[];
}

const AudioAnalytics: React.FC<AudioAnalyticsProps> = ({ ticketId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [ticketId]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const messages = await getVoiceMessages(ticketId);
      
      const analyticsData = calculateAnalytics(messages);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = (messages: VoiceMessage[]): AnalyticsData => {
    const clientMessages = messages.filter(m => m.sender === 'client');
    const adminMessages = messages.filter(m => m.sender === 'admin');
    
    // Calculate average response time (in minutes)
    let totalResponseTime = 0;
    let responseCount = 0;
    
    for (let i = 1; i < messages.length; i++) {
      const current = messages[i];
      const previous = messages[i - 1];
      
      if (current.sender !== previous.sender) {
        const timeDiff = Math.abs(current.timestamp - previous.timestamp);
        totalResponseTime += timeDiff;
        responseCount++;
      }
    }
    
    const averageResponseTime = responseCount > 0 
      ? Math.round(totalResponseTime / responseCount / 60000) // Convert to minutes
      : 0;

    // Group messages by hour for timeline
    const messagesByHour: Record<string, number> = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const hour = `${date.getHours()}:00`;
      messagesByHour[hour] = (messagesByHour[hour] || 0) + 1;
    });

    const messageTimeline = Object.entries(messagesByHour)
      .map(([hour, count]) => ({ hour, messages: count }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    const senderDistribution = [
      {
        name: 'Client',
        value: clientMessages.length,
        color: '#3B82F6'
      },
      {
        name: 'Admin',
        value: adminMessages.length,
        color: '#10B981'
      }
    ];

    return {
      totalMessages: messages.length,
      clientMessages: clientMessages.length,
      adminMessages: adminMessages.length,
      averageResponseTime,
      messageTimeline,
      senderDistribution,
      recentActivity: messages.slice(0, 5) // Last 5 messages
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audio Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading analytics...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audio Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 p-8">
            No analytics data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">{analytics.totalMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Client Messages</p>
                <p className="text-2xl font-bold">{analytics.clientMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Admin Messages</p>
                <p className="text-2xl font-bold">{analytics.adminMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">{analytics.averageResponseTime}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Message Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.messageTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messages" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Message Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.senderDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {analytics.senderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            {analytics.recentActivity.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No recent activity
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.recentActivity.map((message) => (
                  <div key={message.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={message.sender === 'admin' ? 'default' : 'secondary'}>
                        {message.sender === 'admin' ? 'Admin' : 'Client'}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Voice message sent
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(new Date(message.timestamp))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioAnalytics;
