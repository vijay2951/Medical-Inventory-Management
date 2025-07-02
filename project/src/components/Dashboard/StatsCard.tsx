import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', bgLight: 'bg-blue-50' },
    green: { bg: 'bg-green-500', text: 'text-green-600', bgLight: 'bg-green-50' },
    yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', bgLight: 'bg-yellow-50' },
    red: { bg: 'bg-red-500', text: 'text-red-600', bgLight: 'bg-red-50' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', bgLight: 'bg-purple-50' }
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bgLight}`}>
          <Icon className={`h-6 w-6 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;