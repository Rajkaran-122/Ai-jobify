import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const applicationData = [
  { name: 'Mon', applications: 24, views: 120 },
  { name: 'Tue', applications: 32, views: 150 },
  { name: 'Wed', applications: 28, views: 135 },
  { name: 'Thu', applications: 45, views: 200 },
  { name: 'Fri', applications: 38, views: 180 },
  { name: 'Sat', applications: 15, views: 80 },
  { name: 'Sun', applications: 12, views: 65 },
];

const jobPerformanceData = [
  { name: 'Senior Dev', applications: 45 },
  { name: 'Product Mgr', applications: 32 },
  { name: 'UX Designer', applications: 28 },
  { name: 'Data Analyst', applications: 24 },
  { name: 'DevOps', applications: 18 },
];

const sourceData = [
  { name: 'Direct', value: 35, color: 'hsl(262, 83%, 66%)' },
  { name: 'LinkedIn', value: 28, color: 'hsl(340, 92%, 66%)' },
  { name: 'Indeed', value: 20, color: 'hsl(160, 84%, 39%)' },
  { name: 'Referral', value: 12, color: 'hsl(43, 96%, 56%)' },
  { name: 'Other', value: 5, color: 'hsl(250, 15%, 40%)' },
];

export const AnalyticsCharts = () => {
  return (
    <div className="space-y-6">
      {/* Applications Over Time */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Applications & Views</h3>
            <p className="text-sm text-muted-foreground">Last 7 days performance</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Views</span>
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={applicationData}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(262, 83%, 66%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(262, 83%, 66%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(340, 92%, 66%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(340, 92%, 66%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(250, 10%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(250, 10%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(250, 15%, 9%)',
                  border: '1px solid hsl(250, 15%, 18%)',
                  borderRadius: '8px',
                  color: 'hsl(0, 0%, 98%)',
                }}
              />
              <Area
                type="monotone"
                dataKey="applications"
                stroke="hsl(262, 83%, 66%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorApplications)"
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="hsl(340, 92%, 66%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Job Performance */}
        <div className="glass rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Job Performance</h3>
            <p className="text-sm text-muted-foreground">Applications by job posting</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 18%)" horizontal={false} />
                <XAxis type="number" stroke="hsl(250, 10%, 55%)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(250, 10%, 55%)" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(250, 15%, 9%)',
                    border: '1px solid hsl(250, 15%, 18%)',
                    borderRadius: '8px',
                    color: 'hsl(0, 0%, 98%)',
                  }}
                />
                <Bar dataKey="applications" fill="url(#barGradient)" radius={[0, 4, 4, 0]}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(262, 83%, 66%)" />
                      <stop offset="100%" stopColor="hsl(340, 92%, 66%)" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution */}
        <div className="glass rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Application Sources</h3>
            <p className="text-sm text-muted-foreground">Where candidates find you</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(250, 15%, 9%)',
                      border: '1px solid hsl(250, 15%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(0, 0%, 98%)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {sourceData.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-sm text-muted-foreground">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Time to Hire', value: '18 days', change: '-3 days', positive: true },
          { label: 'Cost per Hire', value: '$2,450', change: '-12%', positive: true },
          { label: 'Offer Acceptance', value: '78%', change: '+5%', positive: true },
          { label: 'Quality of Hire', value: '4.2/5', change: '+0.3', positive: true },
        ].map((metric) => (
          <div key={metric.label} className="glass rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold text-foreground">{metric.value}</p>
              <div className={`flex items-center gap-1 text-xs ${metric.positive ? 'text-success' : 'text-destructive'}`}>
                {metric.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
