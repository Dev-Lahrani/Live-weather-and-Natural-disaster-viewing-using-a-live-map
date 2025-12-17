import React, { useMemo } from 'react';
import { 
  X, 
  TrendingUp, 
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  AlertTriangle,
  Activity
} from 'lucide-react';
import type { DisasterEvent, DisasterCategory } from '../types';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { CATEGORY_INFO } from '../utils/helpers';

interface DisasterTrendsProps {
  disasters: DisasterEvent[];
  isOpen: boolean;
  onClose: () => void;
}

export const DisasterTrends: React.FC<DisasterTrendsProps> = ({
  disasters,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Process data for charts
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    disasters.forEach(d => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({
      name: CATEGORY_INFO[category as DisasterCategory]?.label || category,
      value: count,
      color: CATEGORY_INFO[category as DisasterCategory]?.color || '#666',
    }));
  }, [disasters]);

  const severityData = useMemo(() => {
    const counts: Record<string, number> = {
      minor: 0,
      moderate: 0,
      severe: 0,
      extreme: 0,
      catastrophic: 0,
    };
    disasters.forEach(d => {
      if (d.severity) {
        counts[d.severity] = (counts[d.severity] || 0) + 1;
      }
    });
    return [
      { name: 'Minor', value: counts.minor, color: '#22c55e' },
      { name: 'Moderate', value: counts.moderate, color: '#eab308' },
      { name: 'Severe', value: counts.severe, color: '#f97316' },
      { name: 'Extreme', value: counts.extreme, color: '#ef4444' },
      { name: 'Catastrophic', value: counts.catastrophic, color: '#dc2626' },
    ].filter(d => d.value > 0);
  }, [disasters]);

  // Time-based data (last 24 hours)
  const timelineData = useMemo(() => {
    const now = new Date();
    const hours: { hour: string; count: number; earthquakes: number; storms: number; wildfires: number; floods: number }[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourEnd = new Date(now.getTime() - (i - 1) * 60 * 60 * 1000);
      
      const hourDisasters = disasters.filter(d => {
        const dDate = new Date(d.date);
        return dDate >= hourStart && dDate < hourEnd;
      });
      
      hours.push({
        hour: hourStart.toLocaleTimeString([], { hour: '2-digit' }),
        count: hourDisasters.length,
        earthquakes: hourDisasters.filter(d => d.category === 'earthquakes').length,
        storms: hourDisasters.filter(d => d.category === 'severeStorms').length,
        wildfires: hourDisasters.filter(d => d.category === 'wildfires').length,
        floods: hourDisasters.filter(d => d.category === 'floods').length,
      });
    }
    
    return hours;
  }, [disasters]);

  // Magnitude distribution (for earthquakes)
  const magnitudeData = useMemo(() => {
    const earthquakes = disasters.filter(d => d.category === 'earthquakes' && d.magnitude);
    const ranges = [
      { range: '0-2', min: 0, max: 2, count: 0 },
      { range: '2-3', min: 2, max: 3, count: 0 },
      { range: '3-4', min: 3, max: 4, count: 0 },
      { range: '4-5', min: 4, max: 5, count: 0 },
      { range: '5-6', min: 5, max: 6, count: 0 },
      { range: '6-7', min: 6, max: 7, count: 0 },
      { range: '7+', min: 7, max: 10, count: 0 },
    ];
    
    earthquakes.forEach(eq => {
      const mag = eq.magnitude || 0;
      const range = ranges.find(r => mag >= r.min && mag < r.max);
      if (range) range.count++;
    });
    
    return ranges;
  }, [disasters]);

  // Stats
  const totalEvents = disasters.length;
  const severeEvents = disasters.filter(d => 
    d.severity === 'severe' || d.severity === 'extreme' || d.severity === 'catastrophic'
  ).length;
  const avgMagnitude = useMemo(() => {
    const earthquakes = disasters.filter(d => d.magnitude);
    if (earthquakes.length === 0) return 0;
    return earthquakes.reduce((sum, eq) => sum + (eq.magnitude || 0), 0) / earthquakes.length;
  }, [disasters]);
  const totalAffected = disasters.reduce((sum, d) => sum + (d.estimatedAffected || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="glass-darker rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-neon-purple" />
            <h2 className="text-lg font-bold text-white">Disaster Trends & Analytics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-xs uppercase">Total Events</span>
              </div>
              <div className="text-3xl font-bold font-mono text-neon-cyan">{totalEvents}</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs uppercase">Severe+</span>
              </div>
              <div className="text-3xl font-bold font-mono text-orange-400">{severeEvents}</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs uppercase">Avg Magnitude</span>
              </div>
              <div className="text-3xl font-bold font-mono text-neon-purple">{avgMagnitude.toFixed(1)}</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase">Est. Affected</span>
              </div>
              <div className="text-3xl font-bold font-mono text-neon-red">
                {totalAffected >= 1000000 
                  ? `${(totalAffected / 1000000).toFixed(1)}M` 
                  : totalAffected >= 1000 
                    ? `${(totalAffected / 1000).toFixed(0)}K`
                    : totalAffected
                }
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-neon-cyan" />
                Events by Category
              </h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(10,10,20,0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </div>

            {/* Severity Distribution */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                Events by Severity
              </h3>
              {severityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={severityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#666" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="#666" fontSize={12} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(10,10,20,0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No severity data available
                </div>
              )}
            </div>

            {/* 24-Hour Timeline */}
            <div className="glass rounded-xl p-4 lg:col-span-2">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neon-green" />
                Events Over Last 24 Hours
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="hour" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10,10,20,0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="earthquakes" stackId="1" stroke="#ff0055" fill="#ff005550" name="Earthquakes" />
                  <Area type="monotone" dataKey="storms" stackId="1" stroke="#bf00ff" fill="#bf00ff50" name="Storms" />
                  <Area type="monotone" dataKey="wildfires" stackId="1" stroke="#ff6600" fill="#ff660050" name="Wildfires" />
                  <Area type="monotone" dataKey="floods" stackId="1" stroke="#00a8ff" fill="#00a8ff50" name="Floods" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Earthquake Magnitude Distribution */}
            <div className="glass rounded-xl p-4 lg:col-span-2">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-neon-red" />
                Earthquake Magnitude Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={magnitudeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="range" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10,10,20,0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value} earthquakes`, 'Count']}
                  />
                  <Bar dataKey="count" fill="#ff0055" radius={[4, 4, 0, 0]} name="Earthquakes">
                    {magnitudeData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`rgba(255, 0, 85, ${0.3 + (index * 0.1)})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
